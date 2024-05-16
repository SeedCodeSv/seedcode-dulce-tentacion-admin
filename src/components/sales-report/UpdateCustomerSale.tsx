import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Input,
    useDisclosure,
} from "@nextui-org/react";
import { Customer, Sale } from "../../types/report_contigence";
import { useContext, useEffect, useState } from "react";
import { useLogsStore } from "../../store/logs.store";
import { useCustomerStore } from "../../store/customers.store";
import { PayloadCustomer } from "../../types/customers.types";
import { ThemeContext } from "../../hooks/useTheme";
import { Municipio } from "../../types/billing/cat-013-municipio.types";
import { useBillingStore } from "../../store/facturation/billing.store";
import { return_mh_token } from "../../storage/localStorage";
import { check_dte } from "../../services/DTE.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ICheckResponse } from "../../types/DTE/check.types";
import { useTransmitterStore } from "../../store/transmitter.store";
interface Props {
    onClose: () => void;
    codigoGeneracion: string;
    customer?: Customer;
}
const UpdateCustomerSales = (props: Props) => {
    const { theme } = useContext(ThemeContext);
    const { patchCustomer } = useCustomerStore();
    const { logs, getLogs } = useLogsStore();
    useEffect(() => {
        if (props.codigoGeneracion) {
            getLogs(props.codigoGeneracion);
        }
    }, [props.customer]);
    const [dataUpdateCustomer, setDataUpdateCustomer] =
        useState<PayloadCustomer>();
    const UpdateCustomer = () => {
        if (dataUpdateCustomer) {
            patchCustomer(dataUpdateCustomer, props.customer?.id || 0);
            props.onClose();
        }
    };
    const { getCat012Departamento, cat_012_departamento, getCat013Municipios } =
        useBillingStore();
    useEffect(() => {
        getCat012Departamento();
        getCat013Municipios();
    }, []);

    // const { gettransmitter, transmitter } = useTransmitterStore();
    // const [loading, setLoading] = useState(false);
    // const modalLoading = useDisclosure();

    // const handleVerify = (sale: Sale) => {
    //     setLoading(true);
    //     modalLoading.onOpen();
    //     const payload = {
    //         nitEmisor: transmitter.nit,
    //         tdte: sale.tipoDte,
    //         codigoGeneracion: sale.codigoGeneracion,
    //     };
    //     const token_mh = return_mh_token();
    //     check_dte(payload, token_mh ?? "")
    //         .then((response) => {
    //             toast.success(response.data.estado, {
    //                 description: `Sello recibido: ${response.data.selloRecibido}`,
    //             });
    //             setLoading(false);
    //             modalLoading.onClose();
    //         })
    //         .catch((error: AxiosError<ICheckResponse>) => {
    //             if (error.status === 500) {
    //                 toast.error("NO ENCONTRADO", {
    //                     description: "DTE no encontrado en hacienda",
    //                 });
    //                 setLoading(false);
    //                 modalLoading.onClose();
    //                 return;
    //             }

    //             toast.error("ERROR", {
    //                 description: `Error: ${error.response?.data.descripcionMsg ??
    //                     "DTE no encontrado en hacienda"
    //                     }`,
    //             });
    //             modalLoading.onClose();
    //             setLoading(false);
    //         });
    // };


    return (
        <>
            <div>
                {logs.map((log) => (
                    <p> {log.message}</p>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-3 p-3  ">

                <div className="mt-5">
                    <Input
                        label="Nombre de cliente"
                        labelPlacement="outside"
                        size="lg"
                        onChange={(e) =>
                            setDataUpdateCustomer({
                                ...dataUpdateCustomer,
                                nombre: e.target.value,
                            })
                        }
                        defaultValue={props.customer?.nombre}
                        placeholder="Ingresa el nombre de cliente"
                        classNames={{
                            label: "text-gray-500 text-base",
                        }}
                        variant="bordered"
                    />
                </div>
                <div className="mt-5">
                    <Input
                        label="Nombre Comercial"
                        labelPlacement="outside"
                        size="lg"
                        defaultValue={props.customer?.nombreComercial}
                        placeholder="Ingresa el nombre comercial"
                        type="text"
                        classNames={{
                            label: "text-gray-500 text-base",
                        }}
                        variant="bordered"
                    />
                </div>
                <div className="pt-2">
                    <Input
                        label="Correo"
                        labelPlacement="outside"
                        size="lg"
                        defaultValue={props.customer?.correo}
                        placeholder="Ingrese el correo"
                        type="text"
                        classNames={{
                            label: "text-gray-500 text-base",
                        }}
                        variant="bordered"
                    />
                </div>
                <div className="pt-2">
                    <Input
                        label="Telefono"
                        defaultValue={props.customer?.telefono}
                        labelPlacement="outside"
                        size="lg"
                        placeholder="Ingresa el telefono"
                        type="text"
                        classNames={{
                            label: "text-gray-500 text-base",
                        }}
                        variant="bordered"
                    />
                </div>
                <div className="pt-2">
                    <Input
                        label="Numero de documento"
                        defaultValue={props.customer?.numDocumento}
                        labelPlacement="outside"
                        size="lg"
                        placeholder="Ingresa el numero de documento"
                        type="text"
                        classNames={{
                            label: "text-gray-500 text-base",
                        }}
                        variant="bordered"
                    />
                </div>
                <div className="pt-2">
                    <div>
                        <Autocomplete
                            onSelectionChange={(key) => {
                                if (key) {
                                    JSON.parse(key as string) as Municipio;
                                }
                            }}
                            label="Departamento"
                            labelPlacement="outside"
                            placeholder={
                                props.customer?.direccion.nombreDepartamento
                                    ? props.customer?.direccion.nombreDepartamento
                                    : "Selecciona el departamento"
                            }
                            variant="bordered"
                            classNames={{
                                base: "font-semibold text-gray-500 text-sm",
                            }}
                            size="lg"
                        >
                            {cat_012_departamento.map((dep) => (
                                <AutocompleteItem value={dep.codigo} key={JSON.stringify(dep)}>
                                    {dep.valores}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                </div>
            </div>
            <div className="text-grey-500 font-semibold"> Resumen </div>
            <div className="grid grid-cols-2 gap-3 p-3  border  ">
                <div className="pt-2">
                    <Input
                        label="Telefono"
                        defaultValue={props.customer?.telefono}
                        labelPlacement="outside"
                        size="lg"
                        placeholder="Ingresa el telefono"
                        type="text"
                        classNames={{
                            label: "text-gray-500 text-base",
                        }}
                        variant="bordered"
                    />
                </div>
                {/* <div className="pt-2">
                    <Input
                        label="Telefono"
                        defaultValue={props.customer?.telefono}
                        labelPlacement="outside"
                        size="lg"
                        placeholder="Ingresa el telefono"
                        type="text"
                        classNames={{
                            label: "text-gray-500 text-base",
                        }}
                        variant="bordered"
                    />
                </div>
                <div className="pt-2">
                    <Input
                        label="Telefono"
                        defaultValue={props.customer?.telefono}
                        labelPlacement="outside"
                        size="lg"
                        placeholder="Ingresa el telefono"
                        type="text"
                        classNames={{
                            label: "text-gray-500 text-base",
                        }}
                        variant="bordered"
                    />
                </div>
                <div className="pt-2">
                    <Input
                        label="Telefono"
                        defaultValue={props.customer?.telefono}
                        labelPlacement="outside"
                        size="lg"
                        placeholder="Ingresa el telefono"
                        type="text"
                        classNames={{
                            label: "text-gray-500 text-base",
                        }}
                        variant="bordered"
                    />
                </div> */}
            </div>

            <Button
                size="lg"
                onClick={UpdateCustomer}
                className="w-full mt-4 text-sm font-semibold"
                style={{
                    backgroundColor: theme.colors.third,
                    color: theme.colors.primary,
                }}
            >
                Guardar
            </Button>
        </>
    );
};
export default UpdateCustomerSales;
