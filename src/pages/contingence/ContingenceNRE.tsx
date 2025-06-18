import { Autocomplete, AutocompleteItem, Button, Input, Select, SelectItem, Spinner, Textarea, useDisclosure } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh";
import { toast } from "sonner";
import axios from "axios";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router";

import { generate_contingencias, processReferalNRE } from "./contingencia_facturacion.ts";

import useGlobalStyles from "@/components/global/global.styles";
import { useAuthStore } from "@/store/auth.store";
import { useCorrelativesDteStore } from "@/store/correlatives_dte.store";
import { useEmployeeStore } from "@/store/employee.store";
import { useTransmitterStore } from "@/store/transmitter.store";
import { IContingencia } from "@/types/DTE/contingencia.types";
import { formatDate } from "@/utils/dates";
import { firmarDocumentoContingencia, send_to_mh_contingencia } from "@/services/DTE.service.ts";
import { return_mh_token } from "@/storage/localStorage.ts";
import { contingence_steps } from "@/utils/constants.ts";
import HeadlessModal from "@/components/global/HeadlessModal.tsx";
import { Employee } from "@/types/employees.types.ts";
import { useBranchesStore } from "@/store/branches.store.ts";
import { useReferalNote } from "@/store/referal-notes.ts";
import TdGlobal from "@/themes/ui/td-global.tsx";
import ThGlobal from "@/themes/ui/th-global.tsx";
import { useSocket } from "@/hooks/useSocket.tsx";

function ContingenceNRE() {
    const { getBranchesList, branch_list } = useBranchesStore();
    const [branchId, setBranchId] = useState<string | undefined>("")
    const { getReferalNoteContingence, contingence_referal_note } = useReferalNote()
    const { employee_list } = useEmployeeStore();
    const { user } = useAuthStore();
    const { getTransmitter, transmitter } = useTransmitterStore();
    const styles = useGlobalStyles()
    const [currentStep, setCurrentStep] = useState(0);
    const [motivo, setMotivo] = useState('2');
    const [observaciones, setObservaciones] = useState('');
    const [nombreRes, setNombreRes] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState('');
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [title, ] = useState('');
    const [errorMessage, ] = useState('Error de firma');
    const [loading, setLoading] = useState(false);
    const service = new SeedcodeCatalogosMhService();
    const { getCorrelativesByDte } = useCorrelativesDteStore();
    const modalError = useDisclosure();
    const [startDate, setStartDate] = useState(formatDate());
    const [startTime, setStartTime] = useState(
        contingence_referal_note[0]?.horEmi
    );
    const { socket } = useSocket()
    // const box = 
    const [endDate, setEndDate] = useState(formatDate());
    const [endTime, setEndTime] = useState(
        contingence_referal_note[contingence_referal_note.length - 1]?.horEmi
    );

    const navigation = useNavigate()

    useEffect(() => {
        getReferalNoteContingence(Number(user?.pointOfSale?.branch.id));
        getTransmitter(Number(user?.pointOfSale?.branch.transmitterId))
        getBranchesList()
    }, []);

    useEffect(() => {
        getReferalNoteContingence(Number(branchId));

    }, [branchId])

    const filteredEmployees = useMemo(() => {
        return branchId ? employee_list.filter((emp) => emp.branchId === Number(branchId)) : [];
    }, [branchId]);

    const [error, setError] = useState({
        nombreRes: '',
        motivo: '',
        observaciones: ''
    });

    useEffect(() => {
        if (motivo !== '') {
            setError(prev => ({ ...prev, motivo: '' }));
        }
        if (nombreRes !== '') {
            setError(prev => ({ ...prev, nombreRes: '' }));
        }
        if (motivo !== '5') {
            setError(prev => ({ ...prev, observaciones: '' }));
        }
    }, [motivo, nombreRes, observaciones]);

    const handleError = () => {
        if (motivo === '') {
            setError(prev => ({ ...prev, motivo: 'Selecciona el motivo' }));

            return
        }
        else if (nombreRes === '') {
            setError(prev => ({ ...prev, nombreRes: 'Selecciona el responsable' }));

            return
        }
        else if (motivo === '5' && observaciones === '') {
            setError(prev => ({ ...prev, observaciones: 'Debes rellenar la información adicional' }));

            return
        }
    }

    useEffect(() => {
        getReferalNoteContingence(Number(branchId));
    }, [branchId])
    const timeStart = useMemo(() => {
        if (contingence_referal_note.length > 0) {
            setStartTime(contingence_referal_note[0]?.horEmi);

            return contingence_referal_note[0]?.horEmi;
        }

        return '';
    }, [contingence_referal_note]);

    const timeEnd = useMemo(() => {
        if (contingence_referal_note.length > 0) {
            setEndTime(contingence_referal_note[contingence_referal_note.length - 1]?.horEmi);

            return contingence_referal_note[contingence_referal_note.length - 1]?.horEmi;
        }

        return '';
    }, [contingence_referal_note]);

    //     modalError.onClose();
    //     setTitle('');
    //     setErrorMessage('');

    //     const correlatives = contingence_referal_note.map((sale, index) => ({
    //         noItem: index + 1,
    //         codigoGeneracion: sale.codigoGeneracion,
    //         tipoDoc: sale.tipoDte,
    //     }));

    //     const correlativesDte = await getCorrelativesByDte(Number(user?.id), 'FSE')
    //         .then((correlatives) => {
    //             return correlatives;
    //         })
    //         .catch(() => {
    //             toast.error('No se encontraron correlativos');

    //             return undefined;
    //         });

    //     const contingencia_send: IContingencia = generate_contingencias(
    //         transmitter,
    //         correlatives,
    //         motivo,
    //         observaciones,
    //         nombreRes,
    //         numeroDocumento,
    //         tipoDocumento,
    //         startDate,
    //         endDate,
    //         startTime,
    //         endTime,
    //         correlativesDte!.codPuntoVenta,
    //         correlativesDte!.tipoEstablecimiento
    //     );

    //     setLoading(true);
    //     setCurrentStep(0);
    //     firmarDocumentoContingencia(contingencia_send)
    //         .then((firma) => {
    //             const send = {
    //                 nit: transmitter.nit,
    //                 documento: firma.data.body,
    //             };

    //             setCurrentStep(1);
    //             const source = axios.CancelToken.source();

    //             const timeout = setTimeout(() => {
    //                 source.cancel('El tiempo de espera ha expirado');
    //             }, 25000);
    //             const token_mh = return_mh_token();

    //             if (!token_mh) {
    //                 setLoading(false);
    //                 toast.error('Fallo al obtener las credenciales del Ministerio de Hacienda', {
    //                     position: 'top-right',
    //                 });

    //                 return;
    //             }
    //             // $ ENVIAR A CONTINGENCIA
    //             send_to_mh_contingencia(send, token_mh ?? '', source)
    //                 .then((response) => {
    //                     if (response.data.estado === 'RECHAZADO') {
    //                         toast.error('Contingencia rechazada', {
    //                             description: response.data.observaciones.join(', '),
    //                         });
    //                         setLoading(false);
    //                         setCurrentStep(0);
    //                         clearTimeout(timeout);

    //                         return;
    //                     } else {
    //                         toast.success('Contingencia enviada con éxito');
    //                         // * RECORRER LISTA DE DÉBITOS
    //                         setCurrentStep(2);
    //                         const Promise_all = contingence_referal_note.map(async (sale) => {
    //                             const url = await getSignedUrl(
    //                                 s3Client,
    //                                 new GetObjectCommand({
    //                                     Bucket: SPACES_BUCKET,
    //                                     Key: sale.pathJson,
    //                                 })
    //                             );

    //                             const json = await axios
    //                                 .get<SVFE_FSE_Firmado>(url, {
    //                                     responseType: 'json',
    //                                 })

    //                             const send: SVFE_FSE_SEND = {
    //                                 nit: transmitter.nit,
    //                                 activo: true,
    //                                 passwordPri: transmitter.clavePrivada,
    //                                 dteJson: {
    //                                     identificacion: { ...json.data.identificacion, tipoModelo: 2, tipoOperacion: 2, tipoContingencia: Number(motivo) },
    //                                     emisor: json.data.emisor,
    //                                     sujetoExcluido: json.data.sujetoExcluido,
    //                                     cuerpoDocumento: json.data.cuerpoDocumento,
    //                                     resumen: json.data.resumen,
    //                                     apendice: json.data.apendice,
    //                                 },
    //                             };

    //                             // * FIRMAR NOTA DE DÉBITO
    //                             firmarDocumentoSujetoExcluido(send)
    //                                 .then((firma_doc) => {
    //                                     const source_doc = axios.CancelToken.source();
    //                                     const timeout_doc = setTimeout(() => {
    //                                         source.cancel('El tiempo de espera ha expirado');
    //                                     }, 25000);
    //                                     const data_send: PayloadMH = {
    //                                         ambiente: ambiente,
    //                                         idEnvio: 1,
    //                                         version: 1,
    //                                         tipoDte: '14',
    //                                         documento: firma_doc.data.body,
    //                                     };
    //                                     const token_mh = return_mh_token();

    //                                     // * ENVIAR NOTA SUJETO EXCLUIDO A HACIENDA
    //                                     const result = send_to_mh(data_send, token_mh ?? '', source_doc)
    //                                         .then((response_nd) => {
    //                                             clearTimeout(timeout);
    //                                             const DTE_FORMED = {
    //                                                 ...send.dteJson,
    //                                                 respuestaMH: response_nd.data,
    //                                                 firma: firma_doc.data.body,
    //                                             };

    //                                             const JSON_DTE = JSON.stringify(
    //                                                 {
    //                                                     ...DTE_FORMED,
    //                                                 },
    //                                                 null,
    //                                                 2
    //                                             );

    //                                             const json_url = generateFSEURL(
    //                                                 json.data.emisor.nombre,
    //                                                 json.data.identificacion.codigoGeneracion,
    //                                                 send.dteJson.identificacion.fecEmi
    //                                             )

    //                                             const encoder = new TextEncoder()
    //                                             const uint8Array = encoder.encode(JSON_DTE)

    //                                             const uploadParams: PutObjectCommandInput = {
    //                                                 Bucket: SPACES_BUCKET,
    //                                                 Key: json_url,
    //                                                 Body: uint8Array,
    //                                             };


    //                                             s3Client
    //                                                 .send(new PutObjectCommand(uploadParams))
    //                                                 .then(async (response) => {
    //                                                     if (response.$metadata) {
    //                                                         const data_send = {
    //                                                             dte: json_url,
    //                                                             sello: true,
    //                                                             boxId: sale.boxId,
    //                                                             employeeId: sale.employeeId,
    //                                                             supplierId: sale.subjectId
    //                                                         };

    //                                                         await axios
    //                                                             .put(
    //                                                                 API_URL + `/referal-note/update-referal-note-contingence`,
    //                                                                 data_send
    //                                                             )
    //                                                             .then(() => {
    //                                                                 toast.success('Se guardo correctamente el sujeto excluido');

    //                                                                 return true;
    //                                                             })
    //                                                             .catch(() => {
    //                                                                 toast.error('Error al guardar en la base de datos');

    //                                                                 return false;
    //                                                             });
    //                                                     } else {
    //                                                         toast.error('Error al subir el archivo JSON');

    //                                                         return false;
    //                                                     }
    //                                                 })
    //                                                 .catch(() => {
    //                                                     toast.error('Error al subir el archivo JSON');

    //                                                     return false;
    //                                                 });
    //                                         })
    //                                         .catch((error: AxiosError<SendMHFailed>) => {
    //                                             if (axios.isCancel(error)) {
    //                                                 clearTimeout(timeout_doc);
    //                                                 toast.error('El tiempo de espera ha expirado');
    //                                             }
    //                                             if (error.response?.data) {
    //                                                 toast.error(
    //                                                     error.response.data.descripcionMsg ?? 'Error al procesar venta',
    //                                                     {
    //                                                         description:
    //                                                             error.response.data.observaciones &&
    //                                                                 error.response.data.observaciones.length > 0
    //                                                                 ? error.response?.data.observaciones.join('\n\n')
    //                                                                 : '',
    //                                                     }
    //                                                 );
    //                                             } else {
    //                                                 toast.error('Error al procesar venta', {
    //                                                     description: 'Al enviar la venta, no se obtuvo respuesta de hacienda',
    //                                                 });
    //                                             }

    //                                             return false;
    //                                         });

    //                                     return result;
    //                                 })
    //                                 // ! ERROR AL FIRMAR SUJETO EXCLUIDO
    //                                 .catch(() => {
    //                                     toast.error('Error al firmar el sujeto excluido');

    //                                     return false;
    //                                 });
    //                         });

    //                         Promise.all(Promise_all)
    //                             .then(() => {
    //                                 setLoading(false);
    //                                 getReferalNoteContingence(Number(user?.pointOfSale?.branch.transmitterId));
    //                             })
    //                             .catch(() => {
    //                                 toast.error('Error al guardar en la base de datos');

    //                                 return false;
    //                             });
    //                     }
    //                 })
    //                 // ! ERROR AL ENVIAR A CONTINGENCIA
    //                 .catch((mhError: AxiosError<SendMHFailed>) => {
    //                     clearTimeout(timeout);
    //                     if (axios.isCancel(mhError)) {
    //                         setTitle('Tiempo de espera agotado');
    //                         setErrorMessage('El tiempo limite de espera ha expirado');
    //                         modalError.onOpen();
    //                         setLoading(false);
    //                     }

    //                     if (mhError.response?.data) {
    //                         setErrorMessage(
    //                             mhError.response.data.observaciones &&
    //                                 mhError.response.data.observaciones.length > 0
    //                                 ? mhError.response.data.codigoGeneracion +
    //                                 mhError.response?.data.observaciones.join('\n\n')
    //                                 : ''
    //                         );
    //                         setTitle(mhError.response.data.descripcionMsg ?? 'Error al procesar venta');
    //                         modalError.onOpen();
    //                         setLoading(false);
    //                     } else {
    //                         setTitle('No se obtuvo respuesta de hacienda');
    //                         setErrorMessage('Al enviar la venta, no se obtuvo respuesta de hacienda');
    //                         modalError.onOpen();
    //                         setLoading(false);
    //                         setCurrentStep(0);
    //                     }
    //                 });
    //         })
    //         // ! ERROR EN EL FIRMADOR
    //         .catch(() => {
    //             toast.error('No se pudo procesar la contingencia');
    //             setLoading(false);
    //             setCurrentStep(0);
    //         });
    // };

    const handleProccessContingence = async () => {
        try {
            setLoading(true)
            setCurrentStep(0)

            const correlatives = contingence_referal_note.map((sale, index) => ({
                noItem: index + 1,
                codigoGeneracion: sale.codigoGeneracion,
                tipoDoc: sale.tipoDte
            }))

            const correlativesDte = await getCorrelativesByDte(Number(user?.id), 'NRE')

            if (!correlativesDte) {
                toast.error('Error al obtener correlativos')
                setLoading(false)

                return
            }
            const token_mh = return_mh_token()

            if (!token_mh) {
                toast.error('Error al obtener token de Hacienda')
                setLoading(false)

                return
            }

            const contingencia_send: IContingencia = generate_contingencias(
                transmitter,
                correlatives,
                motivo,
                observaciones,
                nombreRes,
                numeroDocumento,
                tipoDocumento,
                startDate,
                endDate,
                startTime,
                endTime,
                correlativesDte!.codPuntoVenta,
                correlativesDte!.tipoEstablecimiento
            );

            const firma = await firmarDocumentoContingencia(contingencia_send)
            const send = { nit: transmitter.nit, documento: firma.data.body }

            setCurrentStep(1)
            const source = axios.CancelToken.source()
            const respuesta = await send_to_mh_contingencia(send, token_mh, source)

            if (respuesta.data.estado === 'RECHAZADO') {
                toast.error('Contingencia rechazada', {
                    description: respuesta.data.observaciones.join(', ')
                })
                setLoading(false)
                setCurrentStep(0)

                return
            } else {
                toast.success('Contingencia enviada con éxito')
                const referalsByBranch = new Map<number, string[]>();
                const promises = contingence_referal_note?.map(async (sale, saleIndex) => {
                    if (sale.tipoDte !== '04') return null;

                    const result = await processReferalNRE(
                        sale,
                        saleIndex,
                        token_mh,
                        Number(motivo),
                        transmitter.nit,
                        transmitter.clavePrivada
                    );

                    const branchId = sale.receivingBranchId ?? 0;
                    const codigo = sale.codigoGeneracion;

                    if (codigo) {
                        if (!referalsByBranch.has(branchId)) {
                            referalsByBranch.set(branchId, []);
                        }
                        referalsByBranch.get(branchId)?.push(codigo);
                    }

                    return result;
                });

                await Promise.all(promises)
                    .then(async () => {
                        for (const [branchId, codigos] of referalsByBranch.entries()) {
                            socket.emit('processed-contingency', {
                                targetSucursalId: branchId,
                                note: {
                                    descripcion: `Se procesaron las notas en contingencia desde la sucursal ${user?.branchId} con los códigos de generación: ${codigos.join(', ')}`,
                                    fecha: new Date().toISOString()
                                }
                            });
                        }

                        toast.success('Contingencia procesada');
                        setLoading(false);
                        setCurrentStep(0);
                        navigation(0);

                    })
                    .catch(() => {
                        toast.error('Error al procesar la contingencia')
                        setLoading(false)
                        setCurrentStep(0)
                    })
            }
        } catch (error) {
            toast.error('Error al procesar la contingencia')
            setLoading(false)
            setCurrentStep(0)
        }
    }

    return (
        <div className="w-full shadow p-4">
            {loading && (
                <div className="absolute z-[100] left-0 bg-white/80 top-0 h-screen w-screen flex flex-col justify-center items-center">
                    <Spinner className="w-24 h-24 animate-spin" />
                    <p className="text-lg font-semibold mt-4">Enviando lote de contingencia</p>
                    <div className="flex flex-col">
                        {contingence_steps.map((step, index) => (
                            <div key={index} className="flex items-start py-2">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 border-2 rounded-full transition duration-500 ${index <= currentStep
                                        ? 'bg-green-600  border-green-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-500'
                                        }`}
                                >
                                    {index + 1}
                                </div>
                                <div className="ml-4">
                                    <div
                                        className={`font-semibold ${index <= currentStep ? 'text-green-600' : 'text-gray-500'
                                            }`}
                                    >
                                        {step.label}
                                    </div>
                                    {step.description && (
                                        <div className="text-xs font-semibold text-gray-700">{step.description}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <HeadlessModal
                isOpen={modalError.isOpen}
                size={'w-96 p-5'}
                title={title}
                onClose={modalError.onClose}
            >
                <div className="w-full flex flex-col justify-center items-center">
                    <ShieldAlert color="red" size={75} />
                    <p className="text-lg font-semibold">{errorMessage}</p>
                    <div className="grid grid-cols-2 gap-8 mt-2">
                        <Button className="px-6" style={styles.thirdStyle} onClick={handleProccessContingence}>
                            Re-intentar
                        </Button>
                        <Button className="px-6" style={styles.dangerStyles} onClick={modalError.onClose}>
                            Aceptar
                        </Button>
                    </div>
                </div>
            </HeadlessModal>
            <div>
                <p className="font-semibold text-xl dark:text-white">Resumen</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-3 mt-5">
                    <Input
                        className="dark:text-white"
                        classNames={{ label: 'font-semibold text-sm' }}
                        label="Fecha inicial"
                        labelPlacement="outside"
                        type="date"
                        value={startDate}
                        variant="bordered"
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input
                        className="dark:text-white"
                        classNames={{ label: 'font-semibold text-sm' }}
                        label="Hora inicial"
                        labelPlacement="outside"
                        type="time"
                        value={timeStart}
                        variant="bordered"
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                    <Input
                        className="dark:text-white"
                        classNames={{ label: 'font-semibold text-sm' }}
                        label="Fecha de fin"
                        labelPlacement="outside"
                        type="date"
                        value={endDate}
                        variant="bordered"
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <Input
                        className="dark:text-white"
                        classNames={{ label: 'font-semibold text-sm' }}
                        label="Hora de fin"
                        labelPlacement="outside"
                        type="time"
                        value={timeEnd}
                        variant="bordered"
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 mt-2 gap-10 gap-y-3">
                    <div className="flex flex-col gap-3">
                        <Select
                            className="dark:text-white"
                            classNames={{ label: 'font-semibold text-sm' }}
                            defaultSelectedKeys={[motivo.toString()]}
                            errorMessage={error.motivo}
                            isInvalid={!!error.motivo}
                            label="Motivo"
                            labelPlacement="outside"
                            placeholder="Selecciona el motivo"
                            value={motivo}
                            variant="bordered"
                            onChange={(e) => setMotivo(e.target.value)}
                        >
                            {service.get005TipoDeContingencum().map((item) => (
                                <SelectItem key={item.codigo} className="dark:text-white">
                                    {item.valores}
                                </SelectItem>
                            ))}
                        </Select>

                        <Textarea
                            className="dark:text-white"
                            classNames={{ label: 'font-semibold text-sm' }}
                            errorMessage={error.observaciones}
                            isInvalid={!!error.observaciones}
                            label="Información adicional"
                            labelPlacement="outside"
                            placeholder="Ingresa tus observaciones e información adicional"
                            value={observaciones}
                            variant="bordered"
                            onChange={(e) => setObservaciones(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col-2 gap-4">
                        <Autocomplete
                            className="dark:text-white font-semibold"
                            classNames={{
                                base: 'font-semibold text-gray-500 text-sm',
                            }}
                            label="Sucursal"
                            labelPlacement="outside"
                            placeholder='Selecciona la sucursal'
                            value={branchId}
                            variant="bordered"
                            onSelectionChange={(value) => setBranchId((value as string) || '')}
                        >
                            {branch_list.map((bra) => (
                                <AutocompleteItem
                                    key={bra.id.toString()}
                                    className="dark:text-white"
                                >
                                    {bra.name}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>

                        <Autocomplete
                            className="dark:text-white font-semibold text-sm"
                            errorMessage={error.nombreRes}
                            isInvalid={!!error.nombreRes}
                            label="Responsable"
                            labelPlacement="outside"
                            placeholder="Selecciona al responsable"
                            variant="bordered"
                            onSelectionChange={(key) => {
                                if (key) {
                                    const employee = JSON.parse(key as string) as Employee;

                                    setNombreRes(`${employee.firstName} ${employee.secondName} ${employee.firstLastName} ${employee.secondLastName}`);
                                    setNumeroDocumento(employee.dui);
                                    setTipoDocumento("13")
                                }
                            }}
                        >
                            {filteredEmployees.map((item) => (
                                <AutocompleteItem
                                    key={JSON.stringify(item)}
                                    className=" dark:text-white"
                                >
                                    {`${item.firstName} ${item.secondName} ${item.firstLastName} ${item.secondLastName}`}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between">
                        <p className="font-semibold text-lg dark:text-white">
                            Listado de notas de sujetos excluidos en contingencia
                        </p>
                        {loading ? (
                            <>
                                <Spinner className="animate-spin" />
                            </>
                        ) : (
                            <>
                                {motivo === '' || nombreRes === '' || contingence_referal_note.length === 0 ? (
                                    <Button
                                        className="px-10 font-semibold text-white	 bg-gray-700"
                                        style={styles.dangerStyles}
                                        onClick={handleError}
                                    >
                                        Procesar contingencia
                                    </Button>
                                ) : (
                                    <Button
                                        className="px-10 font-semibold"
                                        style={styles.thirdStyle}
                                        onClick={handleProccessContingence}
                                    >
                                        Procesar contingencia
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                    <div className="overflow-x-auto overflow-y-auto custom-scrollbar mt-4">
                        <table className="w-full">
                            <thead className="sticky top-0 z-20 bg-white">
                                <tr>
                                    <ThGlobal className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                        No.
                                    </ThGlobal>
                                    <ThGlobal className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                        Fecha - Hora
                                    </ThGlobal>
                                    <ThGlobal className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                        Correlativo
                                    </ThGlobal>
                                    <ThGlobal className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                        Código de generación
                                    </ThGlobal>
                                    <ThGlobal className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                        Monto total
                                    </ThGlobal>
                                </tr>
                            </thead>
                            <tbody className="max-h-[600px] w-full overflow-y-auto">
                                {contingence_referal_note.map((sale, index) => (
                                    <tr key={index} className="border-b border-slate-200">
                                        <td className="p-3 text-sm text-slate-700 dark:text-slate-100">{index + 1}</td>
                                        <TdGlobal className="p-3 text-sm text-slate-700 dark:text-slate-100">
                                            {sale.fecEmi + ' - ' + sale.horEmi}
                                        </TdGlobal>
                                        <TdGlobal className="p-3 text-sm text-slate-700 dark:text-slate-100">
                                            {sale.numeroControl}
                                        </TdGlobal>
                                        <TdGlobal className="p-3 text-sm text-slate-700 dark:text-slate-100">
                                            {sale.codigoGeneracion}
                                        </TdGlobal>
                                        <TdGlobal className="p-3 text-sm text-slate-700 dark:text-slate-100">
                                            {sale.totalPagar}
                                        </TdGlobal>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ContingenceNRE