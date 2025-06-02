import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    useDisclosure,
    UseDisclosureProps
} from '@heroui/react'
import axios, { AxiosError } from 'axios'
import { Formik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh'
import { toast } from 'sonner'
import * as yup from 'yup'
import { ShieldAlert } from 'lucide-react'
import { FaSpinner } from 'react-icons/fa'

import HeadlessModal from '../global/HeadlessModal'
import useGlobalStyles from '../global/global.styles'

import { InvalidateNoteRemision, ReferalNote } from '@/types/referal-note.types'
import { useAuthStore } from '@/store/auth.store'
import { useTransmitterStore } from '@/store/transmitter.store'
import { usePointOfSales } from '@/store/point-of-sales.store'
import { useEmployeeStore } from '@/store/employee.store'
import { useReferalNote } from '@/store/referal-notes'
import { SVFE_InvalidacionNRE_SEND } from '@/types/svf_dte/Invalidation04.types'
import { ambiente, API_URL, sending_steps } from '@/utils/constants'
import { generate_uuid } from '@/utils/random/random'
import { formatEmployee, getElSalvadorDateTime, numbDocument, typeNumDoc } from '@/utils/dates'
import { NRE_Receptor } from '@/types/svf_dte/nre.types'
import { firmarDocumentoInvalidacionNRE, send_to_mh_invalidations } from '@/services/DTE.service'
import { return_mh_token } from '@/storage/localStorage'
import { ErrorMHInvalidation } from '@/types/svf_dte/InvalidationDebito'
import { Employee } from '@/types/employees.types'
import { get_employee_by_code } from '@/services/employess.service'
import { formatAnnulations } from '@/utils/DTE/innvalidations'
import { annulations } from '@/services/innvalidations.services'
import { useSocket } from '@/hooks/useSocket'
// import { useSocket } from '@/hooks/useSocket'

interface Props {
    modalInvalidate: UseDisclosureProps
    item: ReferalNote | undefined
    reload: () => void
}

function InvalidateNoteReferal({ modalInvalidate, item, reload }: Props) {
    const services = new SeedcodeCatalogosMhService()
    const [employeeCode, setEmployeeCode] = useState<Employee>()
    const { user } = useAuthStore()
    const { gettransmitter, transmitter } = useTransmitterStore()
    const { getPointOfSales, point_of_sales
    } = usePointOfSales()
    const { employee_list, getEmployeesList } = useEmployeeStore()
    const [selectedMotivo, setSelectedMotivo] = useState<1 | 2 | 3>(1)
    const [currentStep, setCurrentStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [codigoGeneracionR, setCodigoGeneracionR] = useState<string>('')
    const [firstPase, setFirstPase] = useState(false)
    const [code, setCode] = useState<string | null>(null)
    const modalInvalidation = useDisclosure()
    const styles = useGlobalStyles()
    const [employeeId, setEmployeeId] = useState<number>(0)
    const { secondaryStyle } = useGlobalStyles()
    const { socket } = useSocket()

    const { getJsonReferelNote, json_referal_note, getRecentReferal, recentReferalNote } =
        useReferalNote()
    const modalValidation = useDisclosure()

    useEffect(() => {
        getJsonReferelNote(item?.pathJson ?? '')
        getEmployeesList()
        gettransmitter()
        modalValidation.onOpen()
        getRecentReferal(item?.id ?? 0)
        getPointOfSales(user?.branchId ?? 0)
    }, [item?.pathJson, item?.id, user?.branchId])

    const nomEstable = useMemo(() => {
        if (json_referal_note) {
            return services
                .get009TipoDeEstablecimiento()
                .find((item) => item.codigo === json_referal_note.emisor.tipoEstablecimiento)
        }

        return undefined
    }, [json_referal_note])

    const motivo = useMemo(() => {
        if (selectedMotivo) {
            return services
                .get024TipoDeInvalidacion()
                .find((item) => item.codigo === selectedMotivo.toString())
        }

        return undefined
    }, [selectedMotivo])
    const validationSchema = yup.object().shape({
        nameResponsible: yup.string().required('**El nombre es requerido**'),
        nameApplicant: yup.string().required('**El nombre es requerido**'),
        docNumberResponsible: yup.string().required('**El documento es requerido**'),
        docNumberApplicant: yup.string().required('**El documento es requerido**'),
        typeDocResponsible: yup.string().required('**El tipo de documento es requerido**'),
        typeDocApplicant: yup.string().required('**El tipo de documento es requerido**')
    })
    const modalError = useDisclosure()
    const [title, setTitle] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleAnnulation = async (values: InvalidateNoteRemision) => {
        if (selectedMotivo !== 2 && codigoGeneracionR !== '') {
            toast.error('Debes seleccionar la venta a reemplazar')

            return
        }

        if (!motivo) {
            toast.error('Debes seleccionar el motivo de la anulación')

            return
        }

        const correlatives = point_of_sales.find((i) => i.typeVoucher === 'NRE')

        toast.success('Se completo la anulación: ' + correlatives?.typeVoucher + values.nameApplicant)


        const generate: SVFE_InvalidacionNRE_SEND = {
            nit: transmitter.nit,
            passwordPri: transmitter.clavePrivada,
            dteJson: {
                identificacion: {
                    version: 2,
                    ambiente: ambiente,
                    codigoGeneracion: generate_uuid().toUpperCase(),
                    fecAnula: getElSalvadorDateTime().fecEmi,
                    horAnula: getElSalvadorDateTime().horEmi
                },
                emisor: {
                    nit: transmitter.nit,
                    nombre: transmitter.nombre,
                    tipoEstablecimiento: nomEstable!.codigo,
                    telefono: transmitter.telefono,
                    correo: transmitter.correo,
                    codEstable: json_referal_note!.emisor.codEstable ?? null,
                    codPuntoVenta: correlatives?.codPuntoVenta ?? null,
                    nomEstablecimiento: nomEstable!.valores
                },
                documento: {
                    tipoDte: json_referal_note!.identificacion.tipoDte,
                    codigoGeneracion: json_referal_note!.identificacion.codigoGeneracion,
                    codigoGeneracionR: [1, 3].includes(selectedMotivo) ? codigoGeneracionR : null,
                    selloRecibido: json_referal_note!.respuestaMH.selloRecibido,
                    numeroControl: json_referal_note!.identificacion.numeroControl,
                    fecEmi: json_referal_note!.identificacion.fecEmi,
                    montoIva: Number(json_referal_note!.resumen.totalIva),
                    tipoDocumento: (json_referal_note!.receptor as unknown as NRE_Receptor).tipoDocumento,
                    numDocumento: json_referal_note!.receptor.numDocumento,
                    nombre: json_referal_note!.receptor.nombre
                },
                motivo: {
                    tipoAnulacion: Number(motivo.codigo),
                    motivoAnulacion: motivo.valores,
                    nombreResponsable: values.nameResponsible,
                    tipDocResponsable: values.typeDocResponsible,
                    numDocResponsable: values.docNumberApplicant,
                    nombreSolicita: values.nameApplicant,
                    tipDocSolicita: values.typeDocApplicant,
                    numDocSolicita: values.docNumberApplicant
                }
            }
        }

        setLoading(true)
        firmarDocumentoInvalidacionNRE(generate).then((firma) => {
            setCurrentStep(1)

            const token_mh = return_mh_token()

            if (token_mh) {
                const source = axios.CancelToken.source()
                const timeout = setTimeout(() => {
                    source.cancel('El tiempo de espera ha expirado')
                }, 25000)

                toast.promise(
                    send_to_mh_invalidations(
                        {
                            ambiente,
                            version: 2,
                            idEnvio: 1,
                            documento: firma.data.body
                        },
                        token_mh,
                        source
                    )
                        .then((res) => {
                            setCurrentStep(2)
                            clearTimeout(timeout)
                            toast.promise(
                                axios
                                    .patch(API_URL + `/referal-note/invalidate/${item?.id}`, {
                                        selloInvalidacion: res.data.selloRecibido?.toString(),
                                        EmployeeRequestCancelled: `${code}-${formatEmployee(employeeCode!)}-${numbDocument(employeeCode!)} -${getElSalvadorDateTime().fecEmi} -${getElSalvadorDateTime().horEmi}`
                                    })
                                    .then(async () => {
                                        const data_info: InvalidateNoteRemision = {
                                            nameResponsible: values.nameResponsible,
                                            nameApplicant: values.nameApplicant,
                                            docNumberResponsible: values.docNumberResponsible,
                                            docNumberApplicant: values.docNumberApplicant,
                                            typeDocResponsible: values.typeDocResponsible,
                                            typeDocApplicant: values.typeDocApplicant
                                        }
                                        const payload = formatAnnulations(item!, res.data.selloRecibido ?? 'N/A', employeeId, motivo.codigo, data_info)

                                        await annulations(payload).then(() => {
                                            toast.success('Se guardo con exito la invalidacion')
                                        }).catch(() => {
                                            toast.error('No se guardo la invalidacion')
                                        })
                                        const targetSucursalId = item?.branch?.id ?? 0

                                        toast.success('Invalidado  correctamente')
                                        socket.emit('new-invalidate-note-find-client', {
                                            targetSucursalId,
                                            note: {
                                                descripcion: `Se ah anulado la nota de remisión desde la sucursal ${user?.pointOfSale?.branch?.name ?? 'N/A'}`,
                                                fecha: new Date().toISOString(),
                                                data:item
                                            }
                                        })
                                        setLoading(false)
                                        setCurrentStep(0)
                                        modalInvalidate.onClose
                                        reload()
                                        window.location.href = '/note-referal'

                                        return
                                    }),
                                {
                                    loading: 'Actualizando nota de remision',
                                    success: 'Enviado correctamente',
                                    error: 'Fallo al enviar la anulación al Ministerio de Hacienda'
                                }
                            )
                        })
                        .catch((error: AxiosError<ErrorMHInvalidation>) => {
                            if (error.isAxiosError) {
                                setErrorMessage(
                                    error?.response?.data.observaciones &&
                                        error?.response?.data.observaciones.length > 0
                                        ? error.response?.data.observaciones.join('\n\n')
                                        : ''
                                )
                                setLoading(false)
                                setCurrentStep(0)
                                setTitle(
                                    error.response?.data.descripcionMsg ?? 'Error al procesar nota de remision'
                                )
                                modalError.onOpen()

                                return
                            }
                            setLoading(false)
                            setCurrentStep(0)
                            toast.error('Fallo al enviar la anulación al Ministerio de Hacienda')
                        }),
                    {
                        loading: 'Enviando anulación al Ministerio de Hacienda',
                        success: 'Enviado correctamente',
                        error: 'Fallo al enviar la anulación al Ministerio de Hacienda'
                    }
                )
            } else {
                setLoading(false)
                setCurrentStep(0)
                toast.error('Fallo al obtener las credenciales del Ministerio de Hacienda')
            }
        })
    }

    const handleProccesEmployee = async () => {
        try {
            if (code === null) {
                toast('Debes ingresar un codigo')

                return
            }
            await get_employee_by_code(code).then((i) => {
                if (i.data.employee.id) {
                    setEmployeeCode(i.data.employee as Employee)
                    setFirstPase(true)
                    modalInvalidation.onOpen()

                }
            }).catch(() => {
                toast('No se encontraron coincidencias')
            })

        } catch (error) {
            toast('No se proceso la solicitud')

        }

    }

    const handleClose = () => {
        modalInvalidate.onClose
        modalInvalidation.onClose()
        setCode(null)

    }

    return (
        <>
            {firstPase ? (
                <Modal
                    isDismissable={false}
                    isOpen={modalInvalidation.isOpen}
                    size="full"
                    onClose={handleClose}
                >
                    <ModalContent>
                        <ModalHeader className="text-xl font-bold dark:text-white">
                            ANULAR NOTA DE REMISIÓN
                        </ModalHeader>
                        <ModalBody className="bg-gray-100 dark:bg-gray-800">
                            <div className="max-h-[90vh] overflow-y-auto pr-2">
                                <>
                                    {loading && (
                                        <div className="absolute z-[100] left-0 bg-white/80 top-0 h-screen w-screen flex flex-col justify-center items-center">
                                            <FaSpinner className="w-24 h-24 animate-spin" />
                                            <p className="text-lg font-semibold mt-4">Cargando...</p>
                                            <div className="flex flex-col">
                                                {sending_steps.map((step, index) => (
                                                    <div key={index} className="flex items-start py-2">
                                                        <div
                                                            className={`flex items-center justify-center w-8 h-8 border-2 rounded-full transition duration-500 ${index <= currentStep
                                                                ? 'bg-green-600 border-green-600 text-white'
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
                                                                <div className="text-xs font-semibold text-gray-700">
                                                                    {step.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <HeadlessModal
                                        isOpen={modalError.isOpen}
                                        size="w-96 p-5"
                                        title={title}
                                        onClose={modalError.onClose}
                                    >
                                        <div className="w-full">
                                            <div className="flex flex-col justify-center items-center">
                                                <ShieldAlert color="red" size={75} />
                                                <p className="text-lg font-semibold">{errorMessage}</p>
                                            </div>
                                            <div className="flex justify-end items-end mt-5 w-full">
                                                <Button
                                                    className="w-full"
                                                    style={styles.dangerStyles}
                                                    onPress={modalError.onClose}
                                                >
                                                    Aceptar
                                                </Button>
                                            </div>
                                        </div>
                                    </HeadlessModal>
                                    {!loading && json_referal_note && (
                                        <div className="w-full h-full p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <p className="font-semibold dark:text-white">
                                                    Fecha de emisión:{' '}
                                                    <span className="font-normal dark:text-white">
                                                        {json_referal_note.identificacion.fecEmi}
                                                    </span>
                                                </p>
                                                <p className="font-semibold dark:text-white">
                                                    Hora de emisión:{' '}
                                                    <span className="font-normal">
                                                        {json_referal_note.identificacion.horEmi}
                                                    </span>
                                                </p>
                                                <p className="font-semibold dark:text-white">
                                                    Numero de control:{' '}
                                                    <span className="font-normal">
                                                        {json_referal_note.identificacion.numeroControl}
                                                    </span>
                                                </p>
                                                <p className="font-semibold dark:text-white">
                                                    Código de generación:{' '}
                                                    <span className="font-normal">
                                                        {json_referal_note.identificacion.codigoGeneracion}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-10">
                                                <Select
                                                    className="my-3"
                                                    classNames={{ label: 'text-sm font-semibold dark:text-white' }}
                                                    defaultSelectedKeys={[selectedMotivo.toString()]}
                                                    label="Motivo de invalidación"
                                                    labelPlacement="outside"
                                                    placeholder="Selecciona un motivo"
                                                    value={selectedMotivo}
                                                    variant="bordered"
                                                    onSelectionChange={(e) => {
                                                        if (e) {
                                                            const array = Array.from(new Set(e).values())

                                                            setSelectedMotivo(Number(array[0]) as 1 | 2 | 3)
                                                        } else {
                                                            setSelectedMotivo(1)
                                                        }
                                                    }}
                                                >
                                                    {services.get024TipoDeInvalidacion().map((item) => (
                                                        <SelectItem key={item.id} className='dark:text-white'
                                                            textValue={item.valores}
                                                        >
                                                            {item.valores}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                                {(selectedMotivo === 1 || selectedMotivo === 3) && (
                                                    <Select
                                                        className="my-3"
                                                        classNames={{ label: 'text-sm font-semibold dark:text-white' }}
                                                        defaultSelectedKeys={[selectedMotivo.toString()]}
                                                        label="Código de generación que reemplaza"
                                                        labelPlacement="outside"
                                                        placeholder="Venta que la reemplazará"
                                                        value={selectedMotivo}
                                                        variant="bordered"
                                                        onSelectionChange={(e) => {
                                                            if (e) {
                                                                setCodigoGeneracionR(new Set(e).values().next().value as string)
                                                            } else {
                                                                setCodigoGeneracionR('')
                                                            }
                                                        }}
                                                    >
                                                        {recentReferalNote.map((item) => (
                                                            <SelectItem
                                                                key={item.codigoGeneracion}
                                                                textValue={item.codigoGeneracion}
                                                            >
                                                                {item.numeroControl + ' - ' + item.codigoGeneracion}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            </div>
                                            <div className="mt-5">
                                                <Formik
                                                    initialValues={{
                                                        nameResponsible: '',
                                                        nameApplicant: '',
                                                        docNumberResponsible: '',
                                                        docNumberApplicant: '',
                                                        typeDocResponsible: '',
                                                        typeDocApplicant: ''
                                                    }}
                                                    validationSchema={validationSchema}
                                                    onSubmit={handleAnnulation}
                                                >
                                                    {({
                                                        values,
                                                        errors,
                                                        touched,
                                                        handleBlur,
                                                        handleChange,
                                                        handleSubmit,
                                                        isSubmitting,
                                                        setFieldValue
                                                    }) => (
                                                        <>
                                                            <div className="p-8 border shadow rounded">
                                                                <p className="text-xl font-semibold dark:text-white">Responsable</p>
                                                                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-5">
                                                                    <Autocomplete
                                                                        className="dark:text-white font-semibold text-sm"
                                                                        errorMessage={
                                                                            touched.nameResponsible ? errors.nameResponsible : undefined
                                                                        }
                                                                        label="Nombre"
                                                                        labelPlacement="outside"
                                                                        placeholder="Selecciona al responsable"
                                                                        variant="bordered"
                                                                        onBlur={handleBlur}
                                                                        onSelectionChange={(key) => {
                                                                            if (key) {
                                                                                const employee = JSON.parse(key as string) as Employee

                                                                                handleChange('nameResponsible')(formatEmployee(employee))

                                                                                handleChange('typeDocResponsible')(typeNumDoc(employee))

                                                                                setFieldValue('nameResponsible', formatEmployee(employee))
                                                                                setFieldValue(
                                                                                    'docNumberResponsible',
                                                                                    employee?.dui?.toString() ?? employee?.nit?.toString()
                                                                                )
                                                                                setEmployeeId(employee?.id ?? 0)
                                                                                setFieldValue('typeDocResponsible', typeNumDoc(employee))
                                                                            } else {
                                                                                setFieldValue('nameResponsible', '')
                                                                                setFieldValue('docNumberResponsible', '')
                                                                                setFieldValue('typeDocResponsible', '')
                                                                            }
                                                                        }}
                                                                    >
                                                                        {employee_list.map((item) => (
                                                                            <AutocompleteItem
                                                                                key={JSON.stringify(item)}
                                                                                className=" dark:text-white"
                                                                            >
                                                                                {formatEmployee(item)}
                                                                            </AutocompleteItem>
                                                                        ))}
                                                                    </Autocomplete>
                                                                    <Input
                                                                        isReadOnly
                                                                        className="w-full text-sm dark:text-white"
                                                                        classNames={{ label: 'text-xs font-semibold' }}
                                                                        id="docNumberResponsible"
                                                                        label="Tipo de documento"
                                                                        labelPlacement="outside"
                                                                        name="docNumberResponsible"
                                                                        placeholder="DUI"
                                                                        type="text"
                                                                        value={
                                                                            services
                                                                                .get022TipoDeDocumentoDeIde()
                                                                                .find((doc) => doc.codigo === values?.typeDocResponsible)
                                                                                ?.valores
                                                                        }
                                                                        variant="bordered"
                                                                    />
                                                                    <Input
                                                                        isReadOnly
                                                                        className="w-full text-sm dark:text-white"
                                                                        classNames={{ label: 'text-xs font-semibold' }}
                                                                        id="docNumberResponsible"
                                                                        label="Numero de documento"
                                                                        labelPlacement="outside"
                                                                        name="docNumberResponsible"
                                                                        placeholder="00000000-0"
                                                                        type="text"
                                                                        value={values?.docNumberResponsible}
                                                                        variant="bordered"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="p-8 border mt-5 shadow rounded">
                                                                <p className="text-xl font-semibold dark:text-white">Solicitante</p>
                                                                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-5">
                                                                    <div>
                                                                        <Input
                                                                            className="w-full text-sm dark:text-white"
                                                                            classNames={{ label: 'text-xs font-semibold' }}
                                                                            errorMessage={errors.nameApplicant}
                                                                            id="nameApplicant"
                                                                            isInvalid={touched.nameApplicant && !!errors.nameApplicant}
                                                                            label="Nombre de solicitante"
                                                                            labelPlacement="outside"
                                                                            name="nameApplicant"
                                                                            placeholder="Ingresa el nombre del solicitante"
                                                                            type="text"
                                                                            value={values.nameApplicant}
                                                                            variant="bordered"
                                                                            onBlur={handleBlur('nameApplicant')}
                                                                            onChange={handleChange('nameApplicant')}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Select
                                                                            className="dark:text-white"
                                                                            classNames={{
                                                                                label: 'font-semibold text-xs'
                                                                            }}
                                                                            errorMessage={errors.typeDocApplicant}
                                                                            isInvalid={
                                                                                touched.typeDocApplicant && !!errors.typeDocApplicant
                                                                            }
                                                                            label="Tipo de documento de identificación"
                                                                            labelPlacement="outside"
                                                                            placeholder="Selecciona el tipo de documento"
                                                                            size="md"
                                                                            value={values.typeDocApplicant}
                                                                            variant="bordered"
                                                                            onChange={handleChange('typeDocApplicant')}
                                                                        >
                                                                            {services.get022TipoDeDocumentoDeIde().map((doc) => (
                                                                                <SelectItem key={doc.codigo} className="dark:text-white">
                                                                                    {doc.valores}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </Select>
                                                                    </div>
                                                                    <Input
                                                                        className="w-full text-sm dark:text-white"
                                                                        classNames={{ label: 'text-xs font-semibold' }}
                                                                        errorMessage={errors.docNumberApplicant}
                                                                        id="`docNumberApplicant`"
                                                                        isInvalid={
                                                                            touched.docNumberApplicant && !!errors.docNumberApplicant
                                                                        }
                                                                        label="Numero de documento"
                                                                        labelPlacement="outside"
                                                                        name="docNumberApplicant"
                                                                        placeholder="Ingresa el numero de documento"
                                                                        type="text"
                                                                        value={values.docNumberApplicant}
                                                                        variant="bordered"
                                                                        onBlur={handleBlur('docNumberApplicant')}
                                                                        onChange={handleChange('docNumberApplicant')}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="w-full flex justify-end mt-10 pb-10">
                                                                <Button
                                                                    className="w-full md:w-auto px-20"
                                                                    disabled={isSubmitting}
                                                                    style={styles.thirdStyle}
                                                                    type="submit"
                                                                    onPress={() => handleSubmit()}
                                                                >
                                                                    Procesar anulación
                                                                </Button>
                                                            </div>
                                                        </>
                                                    )}
                                                </Formik>
                                            </div>
                                        </div>
                                    )}
                                    {!json_referal_note && (
                                        <div className="w-full h-full flex flex-col justify-center items-center">

                                            <p className="mt-3 text-xl font-normal">No se encontró la venta solicitada</p>
                                        </div>
                                    )}
                                </>
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            ) : (
                <Modal isDismissable={false} isOpen={modalInvalidate.isOpen} onClose={modalInvalidate.onClose}>
                    <ModalContent>
                        <ModalHeader className='dark:text-white'>Anular nota de remision</ModalHeader>
                        <ModalBody>
                            <Input
                                classNames={{
                                    label: 'font-semibold text-gray-500 text-sm',
                                    input: 'dark:text-white',
                                    base: 'font-semibold'
                                }}
                                label="Código de empleado"
                                labelPlacement="outside"
                                placeholder="Ingrese el código de empleado"
                                type="text"
                                value={code!}
                                variant="bordered"
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>

                            <Button
                                style={secondaryStyle}
                                onClick={() => handleProccesEmployee()}
                            >
                                Procesar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    )
}

export default InvalidateNoteReferal
