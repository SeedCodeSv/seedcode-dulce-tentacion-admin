import { Socket } from "socket.io-client";
import { PutObjectCommandInput } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { generate_a_shipping_note } from "../service/generate_a_shipping_note.service";
import { notify_error_telegram } from "../service/dte_shipping_note.service";

import { Branches, BranchProduct } from "./shipping_branch_product.types";
import { generateJsonNoteRemision } from "./format_of_the_json_for_sending_a_referral";
import { DocumentoNoteOfRemission } from "./notes_of_remision.types";

import { Correlativo } from "@/types/correlatives_dte.types";
import { Employee } from "@/types/employees.types";
import { ITransmitter } from "@/types/transmitter.types";
import { generateFSEURL } from "@/pages/contingence/utils";
import { SPACES_BUCKET } from "@/utils/constants";
import { s3Client } from "@/plugins/s3";




export const singInvoiceContingence04 = async (
    employee: Employee,
    transmitter: ITransmitter,
    correlatives: Correlativo,
    product_selected: BranchProduct[],
    branch: Branches,
    observation: string,
    val: number,
    socket: Socket,
    pointOfSaleId: number,
    employeeId: number,
    receivingBranchId: number,
    branchIssuingId: number,
    handleRefresh: () => void,
    employeeReceptor: Employee
) => {
    try {
        const generatedJson = generateJsonNoteRemision(
            employee,
            { ...transmitter },
            correlatives!,
            product_selected,
            branch,
            observation,
            true,
            val,
            employeeReceptor
        );


        await uploadAndSaveDTE04(generatedJson,
            handleRefresh,
            pointOfSaleId,
            employeeId,
            receivingBranchId,
            branchIssuingId,
            socket,
            transmitter
        )
    } catch (error) {
    }
}

const uploadAndSaveDTE04 = async (
    json: DocumentoNoteOfRemission,
    handleRefresh: () => void,
    pointOfSaleId: number,
    employeeId: number,
    receivingBranchId: number,
    branchIssuingId: number,
    socket: Socket,
    transmitter: ITransmitter
) => {
    const generate_json_url = generateFSEURL(
        json.dteJson.emisor.nombre,
        json.dteJson.identificacion.codigoGeneracion,
        json.dteJson.identificacion.fecEmi
    )

    const JSON_DTE = JSON.stringify(json.dteJson, null, 2)
    const encoder = new TextEncoder()
    const uint8Array = encoder.encode(JSON_DTE)

    const uploadParams: PutObjectCommandInput = {
        Bucket: SPACES_BUCKET,
        Key: generate_json_url,
        Body: uint8Array
    }

    try {
        const upload = new Upload({ client: s3Client, params: uploadParams })

        await upload.done()

        await generate_a_shipping_note({
            pointOfSaleId: pointOfSaleId,
            employeeId: employeeId,
            sello: false,
            dte: uploadParams.Key!,
            receivingBranchId,
        }).then(async () => {

            toast.success('Se completo con éxito la nota')
            handleRefresh()
            const targetSucursalId = receivingBranchId ?? 0

            toast.success('Nota de envío creada con éxito', { position: 'top-right' });
            socket.emit('new-referal-note-find-client', {
                targetSucursalId,
                note: {
                    descripcion: "Enviado desde la sucursal" + " " + branchIssuingId,
                    fecha: new Date().toISOString(),
                }
            })

            setTimeout(() => {
                window.location.reload();

            }, 2000)
        })
            .catch((error: AxiosError) => {
                const errors = error.response?.data
                    ? [JSON.stringify(error.response.data), error.message]
                    : [error.message]

                notify_error_telegram(
                    transmitter.nombre,
                    'Error al guardar la nota de remision',
                    errors,
                    json.dteJson?.identificacion.numeroControl ?? '',
                    json.dteJson?.identificacion.codigoGeneracion ?? '',
                    json.dteJson?.identificacion.tipoDte ?? ''
                )

                toast.error('Error al guardar en la BD')
            })
            .catch(() => {
                toast.error('Error al guardar la venta')

            })

    } catch (error) {

    }
}
