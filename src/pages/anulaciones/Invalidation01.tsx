import { useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router';

import { AnnulationSalePayload } from '../../types/debit-notes.types';
import { useTransmitterStore } from '../../store/transmitter.store';
import { useCorrelativesDteStore } from '../../store/correlatives_dte.store';
import { useAuthStore } from '../../store/auth.store';
import { ambiente, API_URL, sending_steps } from '../../utils/constants';
import { generate_uuid } from '../../utils/random/random';
import { formatEmployee, getElSalvadorDateTime, typeNumDoc } from '../../utils/dates';
import {
  firmarDocumentoInvalidacionCredito,
  send_to_mh_invalidations,
} from '../../services/DTE.service';
import { ErrorMHInvalidation } from '../../types/svf_dte/InvalidationDebito';
import { return_mh_token } from '../../storage/localStorage';
import HeadlessModal from '../../components/global/HeadlessModal';
import { SVFE_InvalidacionCredito_SEND } from '../../types/svf_dte/InvalidationCredito';
import { useEmployeeStore } from '../../store/employee.store';
import { Employee } from '../../types/employees.types';
import { useSalesStore } from '../../store/sales.store';
import { FC_Receptor } from '../../types/svf_dte/fc.types';

import useGlobalStyles from '@/components/global/global.styles';
import { annulations } from '@/services/innvalidations.services';
import { formatAnnulations01 } from '@/utils/DTE/innvalidations';

interface Props {
  id: string;
}
interface MotiveAnulations {
  value: string,
  label: string
}
function Invalidation01({ id }: Props) {
  const { user } = useAuthStore()
  const { json_sale, getSaleDetails, loading_sale, recentSales } = useSalesStore()
  const { gettransmitter, transmitter } = useTransmitterStore()
  const { getCorrelativesByDte } = useCorrelativesDteStore()
  const { employee_list, getEmployeesList } = useEmployeeStore()
  const [selectedMotivo, setSelectedMotivo] = useState<1 | 2 | 3>(1)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [codigoGeneracionR, setCodigoGeneracionR] = useState<string>('')
  const [motiveAnulation, setMotiveAnulation] = useState({ value: "", label: "" })
  const modalValidation = useDisclosure()
  // const [code, setCode] = useState('')
  const [employeeCode, setEmployeeCode] = useState<Employee | null>(null)
  // const modalInvalidation = useDisclosure()
  // const navigate = useNavigate()
  const services = new SeedcodeCatalogosMhService()
  const styles = useGlobalStyles()
  // const [firstPase, setFirstPase] = useState(false)
  // const [modalInitializate, setModalInitialize] = useState(true)
  // const [employeeError, setEmployeeError] = useState('')
  const motives_anulations = [
    { value: "01", label: 'Perdidas' },
    { value: '02', label: 'Devoluciones' }
  ]

  useEffect(() => {

  }, [])

  useEffect(() => {
    gettransmitter();
    getEmployeesList();
    modalValidation.onOpen();
  }, []);

  useEffect(() => {
    getSaleDetails(+id);
  }, [+id]);

  const nomEstable = useMemo(() => {
    if (json_sale) {
      return services
        .get009TipoDeEstablecimiento()
        .find((item) => item.codigo === json_sale.emisor.tipoEstablecimiento);
    }

    return undefined;
  }, [json_sale]);

  const motivo = useMemo(() => {
    if (selectedMotivo) {
      return services
        .get024TipoDeInvalidacion()
        .find((item) => item.codigo === selectedMotivo.toString());
    }

    return undefined;
  }, [selectedMotivo]);

  const validationSchema = yup.object().shape({
    nameResponsible: yup.string().required('**El nombre es requerido**'),
    nameApplicant: yup.string().required('**El nombre es requerido**'),
    docNumberResponsible: yup.string().required('**El documento es requerido**'),
    docNumberApplicant: yup.string().required('**El documento es requerido**'),
    typeDocResponsible: yup.string().required('**El tipo de documento es requerido**'),
    typeDocApplicant: yup.string().required('**El tipo de documento es requerido**'),
  });

  const modalError = useDisclosure();
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const style = useGlobalStyles();
  const navigation = useNavigate();

  const handleAnnulation = async (values: AnnulationSalePayload) => {
    if (selectedMotivo !== 2 && codigoGeneracionR !== '') {
      toast.error('Debes seleccionar la venta a reemplazar');

      return;
    }

    if (motiveAnulation.value === '') {
      toast.warning('Debes seleccionar una razón de la invalidación');

      return;
    }


    if (!motivo) {
      toast.error('Debes seleccionar el motivo de la anulación');

      return;
    }

    const correlatives = await getCorrelativesByDte(Number(user?.id), 'FE')
      .then((res) => res)
      .catch(() => {
        toast.error('Error al obtener los correlativos');

        return;
      });

    toast.success('Se completo la anulación: ' + correlatives?.typeVoucher + values.nameApplicant);

    const tipoDte = json_sale?.identificacion.tipoDte;

    const generate: SVFE_InvalidacionCredito_SEND = {
      nit: transmitter.nit,
      passwordPri: transmitter.clavePrivada,
      dteJson: {
        identificacion: {
          version: 2,
          ambiente: ambiente,
          codigoGeneracion: generate_uuid().toUpperCase(),
          fecAnula: getElSalvadorDateTime().fecEmi,
          horAnula: getElSalvadorDateTime().horEmi,
        },
        emisor: {
          nit: transmitter.nit,
          nombre: transmitter.nombre,
          tipoEstablecimiento: nomEstable!.codigo,
          telefono: transmitter.telefono,
          correo: transmitter.correo,
          codEstable: correlatives?.codEstable ?? null,
          codPuntoVenta: correlatives?.codPuntoVenta ?? null,
          nomEstablecimiento: nomEstable!.valores,
        },
        documento: {
          tipoDte: json_sale!.identificacion.tipoDte,
          codigoGeneracion: json_sale!.identificacion.codigoGeneracion,
          codigoGeneracionR: [1, 3].includes(selectedMotivo) ? codigoGeneracionR : null,
          selloRecibido: json_sale!.respuestaMH.selloRecibido,
          numeroControl: json_sale!.identificacion.numeroControl,
          fecEmi: json_sale!.identificacion.fecEmi,
          montoIva: Number(json_sale!.resumen.ivaPerci1),
          tipoDocumento:
            tipoDte === '01' ? (json_sale!.receptor as unknown as FC_Receptor).tipoDocumento : '36',
          numDocumento:
            tipoDte === '01'
              ? (json_sale!.receptor as unknown as FC_Receptor).numDocumento
              : json_sale!.receptor.nit,
          nombre: json_sale!.receptor.nombre,
        },
        motivo: {
          tipoAnulacion: Number(motivo.codigo),
          motivoAnulacion: motivo.valores,
          nombreResponsable: values.nameResponsible,
          tipDocResponsable: values.typeDocResponsible,
          numDocResponsable: values.docNumberApplicant,
          nombreSolicita: values.nameApplicant,
          tipDocSolicita: values.typeDocApplicant,
          numDocSolicita: values.docNumberApplicant,
        },
      },
    };

    setLoading(true);
    firmarDocumentoInvalidacionCredito(generate).then((firma) => {
      setCurrentStep(1);

      const token_mh = return_mh_token();

      if (token_mh) {
        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
          source.cancel('El tiempo de espera ha expirado');
        }, 25000);

        toast.promise(
          send_to_mh_invalidations(
            {
              ambiente,
              version: 2,
              idEnvio: 1,
              documento: firma.data.body,
            },
            token_mh,
            source
          )
            .then((res) => {
              setCurrentStep(2);
              clearTimeout(timeout);
              toast.promise(
                axios
                  .patch(API_URL + `/sales/invalidate/${id}`, {
                    selloInvalidacion: res.data.selloRecibido,
                    reasonCancellation: motiveAnulation?.value ?? '0'
                  })
                  .then(async () => {
                    const payload = formatAnnulations01(
                      generate,
                      res.data.selloRecibido!,
                      employeeCode!.id ?? 0,
                      motivo.codigo.toString() ?? 'N/A'
                    );

                    await annulations(payload)
                      .then(() => {
                        toast.success('Se guardo con exito la invalidacion');
                      })
                      .catch(() => {
                        toast.error('No se guardo la invalidacion');
                      });

                    toast.success('Invalidado  correctamente');
                    // setModalInitialize(false)
                    setLoading(false);
                    setCurrentStep(0);
                    navigation(-1);

                    return;
                  }),
                {
                  loading: 'Actualizando nota de crédito',
                  success: 'Enviado correctamente',
                  error: 'Fallo al enviar la anulación al Ministerio de Hacienda',
                }
              );
            })
            .catch((error: AxiosError<ErrorMHInvalidation>) => {
              if (error.isAxiosError) {
                setErrorMessage(
                  error?.response?.data.observaciones &&
                    error?.response?.data.observaciones.length > 0
                    ? error.response?.data.observaciones.join('\n\n')
                    : ''
                );
                setLoading(false);
                setCurrentStep(0);
                setTitle(error.response?.data.descripcionMsg ?? 'Error al procesar venta');
                modalError.onOpen();

                return;
              }
              setLoading(false);
              setCurrentStep(0);
              toast.error('Fallo al enviar la anulación al Ministerio de Hacienda');
            }),
          {
            loading: 'Enviando anulación al Ministerio de Hacienda',
            success: 'Enviado correctamente',
            error: 'Fallo al enviar la anulación al Ministerio de Hacienda',
          }
        );
      } else {
        setLoading(false);
        setCurrentStep(0);
        toast.error('Fallo al obtener las credenciales del Ministerio de Hacienda');
      }
    });
  };

  return (
    <>
      <button className="flex items-center gap-3 cursor-pointer" onClick={() => navigation(-1)}>
        <ArrowLeft />
        <p className=" whitespace-nowrap">Volver a listado</p>
      </button>
      {loading_sale && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="loader" />
          <p className="mt-3 text-xl font-semibold">Cargando...</p>
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
            <Button className="w-full" style={style.dangerStyles} onPress={modalError.onClose}>
              Aceptar
            </Button>
          </div>
        </div>
      </HeadlessModal>
      {!loading_sale && json_sale && (
        <div className="w-full h-full p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <p className="font-semibold">
              Fecha de emisión:{' '}
              <span className="font-normal">{json_sale.identificacion.fecEmi}</span>
            </p>
            <p className="font-semibold">
              Hora de emisión:{' '}
              <span className="font-normal">{json_sale.identificacion.horEmi}</span>
            </p>
            <p className="font-semibold">
              Numero de control:{' '}
              <span className="font-normal">{json_sale.identificacion.numeroControl}</span>
            </p>
            <p className="font-semibold">
              Código de generación:{' '}
              <span className="font-normal">{json_sale.identificacion.codigoGeneracion}</span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-10">
            <Select
              className="my-3"
              classNames={{ label: 'text-sm font-semibold z-0' }}
              defaultSelectedKeys={[selectedMotivo.toString()]}
              label="Motivo de invalidación"
              labelPlacement="outside"
              placeholder="Selecciona un motivo"
              value={selectedMotivo}
              variant="bordered"
              onSelectionChange={(e) => {
                if (e) {
                  const array = Array.from(new Set(e).values());

                  setSelectedMotivo(Number(array[0]) as 1 | 2 | 3);
                } else {
                  setSelectedMotivo(1);
                }
              }}
            >
              {services.get024TipoDeInvalidacion().map((item) => (
                <SelectItem key={item.id} textValue={item.valores}>
                  {item.valores}
                </SelectItem>
              ))}
            </Select>
            {(selectedMotivo === 1 || selectedMotivo === 3) && (
              <Select
                className="my-3"
                classNames={{ label: 'text-sm font-semibold' }}
                defaultSelectedKeys={[selectedMotivo.toString()]}
                label="Código de generación que reemplaza"
                labelPlacement="outside"
                placeholder="Venta que la reemplazará"
                value={selectedMotivo}
                variant="bordered"
                onSelectionChange={(e) => {
                  if (e) {
                    setCodigoGeneracionR(new Set(e).values().next().value as string);
                  } else {
                    setCodigoGeneracionR('');
                  }
                }}
              >
                {recentSales.map((item) => (
                  <SelectItem key={item.codigoGeneracion} textValue={item.codigoGeneracion}>
                    {item.numeroControl + ' - ' + item.codigoGeneracion}
                  </SelectItem>
                ))}
              </Select>
            )}
            <div>
              <Autocomplete
                className="dark:text-white font-semibold text-sm z-0"
                label="Razon de invalidación"
                labelPlacement="outside"
                placeholder="Selecciona la razon"
                variant="bordered"
                // onBlur={handleBlur}
                onSelectionChange={(key) => {
                  if (key) {
                    const reasonForCancellation = JSON.parse(key as string) as MotiveAnulations;

                    setMotiveAnulation(reasonForCancellation)
                  } else {
                    setMotiveAnulation({} as MotiveAnulations)

                  }
                }}
              >
                {motives_anulations.map((item) => (
                  <AutocompleteItem key={JSON.stringify(item)} className=" dark:text-white">
                    {item.label}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>

          </div>
          <div className="mt-5">
            <Formik
              initialValues={{
                nameResponsible: '',
                nameApplicant: json_sale?.receptor?.nombre || '',
                docNumberResponsible: '',
                docNumberApplicant:
                  json_sale?.identificacion?.tipoDte === '01'
                    ? ((json_sale.receptor as unknown as FC_Receptor)?.numDocumento ?? '0')
                    : json_sale?.receptor?.nit || '',
                typeDocResponsible: '',
                typeDocApplicant: json_sale?.receptor?.tipoDocumento || '',
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
                setFieldValue,
                isSubmitting,
              }) => (
                <>
                  <div className="p-8 border shadow rounded">
                    <p className="text-xl font-semibold">Responsable</p>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-5">
                      <Autocomplete
                        className="dark:text-white font-semibold text-sm z-0"
                        errorMessage={touched.nameResponsible ? errors.nameResponsible : undefined}
                        label="Nombre"
                        labelPlacement="outside"
                        placeholder="Selecciona al responsable"
                        variant="bordered"
                        onBlur={handleBlur}
                        onSelectionChange={(key) => {
                          if (key) {
                            const employee = JSON.parse(key as string) as Employee;

                            handleChange('nameResponsible')(formatEmployee(employee));
                            setFieldValue(
                              'docNumberResponsible',
                              employee?.dui?.toString() ?? employee?.nit?.toString()
                            );
                            handleChange('typeDocResponsible')(typeNumDoc(employee));

                            setEmployeeCode(employee);
                          } else {
                          }
                        }}
                      >
                        {employee_list.map((item) => (
                          <AutocompleteItem key={JSON.stringify(item)} className=" dark:text-white">
                            {formatEmployee(item)}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
                      <Input
                        isReadOnly
                        className="w-full text-sm dark:text-white"
                        classNames={{ label: 'text-xs font-semibold z-0' }}
                        id="docNumberResponsible"
                        label="Tipo de documento"
                        labelPlacement="outside"
                        name="docNumberResponsible"
                        placeholder="DUI"
                        type="text"
                        value={
                          services
                            .get022TipoDeDocumentoDeIde()
                            .find((doc) => doc.codigo === values?.typeDocResponsible)?.valores
                        }
                        variant="bordered"
                      />
                      <Input
                        isReadOnly
                        className="w-full text-sm dark:text-white"
                        classNames={{ label: 'text-xs font-semibold z-0' }}
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
                    <p className="text-xl font-semibold">Solicitante</p>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-5">
                      <div>
                        <Input
                          className="w-full text-sm dark:text-white"
                          classNames={{ label: 'text-xs font-semibold z-0' }}
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
                            label: 'font-semibold text-xs z-0',
                          }}
                          errorMessage={errors.typeDocApplicant}
                          isInvalid={touched.typeDocApplicant && !!errors.typeDocApplicant}
                          label="Tipo de documento de identificación"
                          labelPlacement="outside"
                          placeholder="Selecciona el tipo de documento"
                          selectedKeys={[values.typeDocApplicant]}
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
                        classNames={{ label: 'text-xs font-semibold z-0' }}
                        errorMessage={errors.docNumberApplicant}
                        id="`docNumberApplicant`"
                        isInvalid={touched.docNumberApplicant && !!errors.docNumberApplicant}
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
      {!json_sale && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <p className="mt-3 text-xl font-normal">No se encontró la venta solicitada</p>
        </div>
      )}

      {loading && (
        <div className="absolute z-100 left-0 bg-white/80 top-0 h-screen w-screen flex flex-col justify-center items-center">
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
                    <div className="text-xs font-semibold text-gray-700">{step.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Invalidation01;
