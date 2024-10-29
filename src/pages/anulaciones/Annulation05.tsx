import HeadlessModal from '@/components/global/HeadlessModal';
import { firmarDocumentoInvalidacionCredito, send_to_mh_invalidations } from '@/services/DTE.service';
import { return_mh_token } from '@/storage/localStorage';
import { useAuthStore } from '@/store/auth.store';
import { useCorrelativesDteStore } from '@/store/correlatives_dte.store';
import { useEmployeeStore } from '@/store/employee.store';
import { useCreditNotes } from '@/store/notes_credits.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { global_styles } from '@/styles/global.styles';
import { AnnulationSalePayload } from '@/types/credit_notes.types';
import { Employee } from '@/types/employees.types';
import { SVFE_InvalidacionCredito_SEND } from '@/types/svf_dte/InvalidationCredito';
import { ErrorMHInvalidation } from '@/types/svf_dte/InvalidationDebito';
import { ambiente, API_URL, sending_steps } from '@/utils/constants';
import { getElSalvadorDateTime } from '@/utils/dates';
import { generate_uuid } from '@/utils/random/random';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import { Formik } from 'formik';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { toast } from 'sonner';
import * as yup from 'yup';

interface Props {
  id: string;
}

function Invalidation05({ id }: Props) {
  const services = new SeedcodeCatalogosMhService();
  const styles = global_styles();
  const { user } = useAuthStore();

  const { json_credit, onGetSaleAndCredit, loading_credit, recent_credit_notes } = useCreditNotes();
  const { gettransmitter, transmitter } = useTransmitterStore();
  const { getCorrelativesByDte } = useCorrelativesDteStore();
  const { employee_list, getEmployeesList } = useEmployeeStore();

  const [selectedMotivo, setSelectedMotivo] = useState<1 | 2 | 3>(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [codigoGeneracionR, setCodigoGeneracionR] = useState<string>('');
  const [docResponsible, setDocResponsible] = useState('00000000-0');
  const [typeDocResponsible, setTypeDocResponsible] = useState('13');

  useEffect(() => {
    onGetSaleAndCredit(+id);
    gettransmitter();
    getEmployeesList();
  }, [id]);

  const nomEstable = useMemo(() => {
    if (json_credit) {
      return services
        .get009TipoDeEstablecimiento()
        .find((item) => item.codigo === json_credit.emisor.tipoEstablecimiento);
    }
    return undefined;
  }, [json_credit]);

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

  const style = global_styles();
  const navigation = useNavigate();

  const handleAnnulation = async (values: AnnulationSalePayload) => {
    if (selectedMotivo !== 2 && codigoGeneracionR !== '') {
      toast.error('Debes seleccionar la venta a reemplazar');
      return;
    }

    if (!motivo) {
      toast.error('Debes seleccionar el motivo de la anulación');
      return;
    }

    const correlatives = await getCorrelativesByDte(Number(user?.id), 'NCE')
      .then((res) => res)
      .catch(() => {
        toast.error('Error al obtener los correlativos');
        return;
      });

    toast.success('Se completo la anulación: ' + correlatives?.typeVoucher + values.nameApplicant);

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
          tipoDte: '05',
          codigoGeneracion: json_credit!.identificacion.codigoGeneracion,
          codigoGeneracionR: [1, 3].includes(selectedMotivo) ? codigoGeneracionR : null,
          selloRecibido: json_credit!.respuestaMH.selloRecibido,
          numeroControl: json_credit!.identificacion.numeroControl,
          fecEmi: json_credit!.identificacion.fecEmi,
          montoIva: Number(json_credit!.resumen.ivaPerci1),
          tipoDocumento: '36',
          numDocumento: json_credit!.receptor.nit,
          nombre: json_credit!.receptor.nombre,
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
                  .patch(API_URL + `/nota-de-credito/invalidate/${id}`, {
                    selloInvalidacion: res.data.selloRecibido,
                  })
                  .then(() => {
                    toast.success('Invalidado  correctamente');
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
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigation(-1)}>
        <ArrowLeft />
        <p className=" whitespace-nowrap">Volver a listado</p>
      </div>
      {loading_credit && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="loader"></div>
          <p className="mt-3 text-xl font-semibold">Cargando...</p>
        </div>
      )}
      {loading && (
        <div className="absolute z-[100] left-0 bg-white/80 top-0 h-screen w-screen flex flex-col justify-center items-center">
          <Spinner className="w-24 h-24 animate-spin" />
          <p className="text-lg font-semibold mt-4">Cargando...</p>
          <div className="flex flex-col">
            {sending_steps.map((step, index) => (
              <div key={index} className="flex items-start py-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 border-2 rounded-full transition duration-500 ${
                    index <= currentStep
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-4">
                  <div
                    className={`font-semibold ${
                      index <= currentStep ? 'text-green-600' : 'text-gray-500'
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
        size="w-96 p-5"
        isOpen={modalError.isOpen}
        onClose={modalError.onClose}
        title={title}
      >
        <div className="w-full">
          <div className="flex flex-col justify-center items-center">
            <ShieldAlert size={75} color="red" />
            <p className="text-lg font-semibold dark:text-white">{errorMessage}</p>
          </div>
          <div className="flex justify-end items-end mt-5 w-full">
            <Button onClick={modalError.onClose} style={style.dangerStyles} className="w-full">
              Aceptar
            </Button>
          </div>
        </div>
      </HeadlessModal>
      {!loading_credit && json_credit && (
        <div className="w-full h-full p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 z-0">
            <p className="font-semibold">
              Fecha de emisión:{' '}
              <span className="font-normal">{json_credit.identificacion.fecEmi}</span>
            </p>
            <p className="font-semibold">
              Hora de emisión:{' '}
              <span className="font-normal">{json_credit.identificacion.horEmi}</span>
            </p>
            <p className="font-semibold">
              Numero de control:{' '}
              <span className="font-normal">{json_credit.identificacion.numeroControl}</span>
            </p>
            <p className="font-semibold">
              Código de generación:{' '}
              <span className="font-normal">{json_credit.identificacion.codigoGeneracion}</span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-10">
            <Select
              className="my-3 dark:text-white z-0"
              label="Motivo de invalidación"
              labelPlacement="outside"
              placeholder="Selecciona un motivo"
              variant="bordered"
              classNames={{ label: 'text-sm font-semibold' }}
              onSelectionChange={(e) => {
                if (e) {
                  const array = Array.from(new Set(e).values());
                  setSelectedMotivo(Number(array[0]) as 1 | 2 | 3);
                } else {
                  setSelectedMotivo(1);
                }
              }}
              value={selectedMotivo}
              defaultSelectedKeys={[selectedMotivo.toString()]}
            >
              {services.get024TipoDeInvalidacion().map((item) => (
                <SelectItem
                  className="dark:text-white"
                  key={item.id}
                  value={item.id}
                  textValue={item.valores}
                >
                  {item.valores}
                </SelectItem>
              ))}
            </Select>
            {(selectedMotivo === 1 || selectedMotivo === 3) && (
              <Select
                className="my-3"
                label="Código de generación que reemplaza"
                labelPlacement="outside"
                placeholder="Nota de débito que reemplaza"
                variant="bordered"
                classNames={{ label: 'text-sm font-semibold' }}
                onSelectionChange={(e) => {
                  if (e) {
                    setCodigoGeneracionR(new Set(e).values().next().value as string);
                  } else {
                    setCodigoGeneracionR('');
                  }
                }}
                value={selectedMotivo}
                defaultSelectedKeys={[selectedMotivo.toString()]}
              >
                {recent_credit_notes.map((item) => (
                  <SelectItem
                    key={item.codigoGeneracion}
                    value={item.codigoGeneracion}
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
              validationSchema={validationSchema}
              initialValues={{
                nameResponsible: '',
                nameApplicant: '',
                docNumberResponsible: '',
                docNumberApplicant: '',
                typeDocResponsible: '',
                typeDocApplicant: '',
              }}
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
              }) => (
                <>
                  <div className="p-8 border shadow rounded">
                    <p className="text-xl font-semibold">Responsable</p>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-5">
                      <Autocomplete
                        className="dark:text-white font-semibold text-sm z-0"
                        variant="bordered"
                        label="Nombre"
                        labelPlacement="outside"
                        placeholder="Selecciona al responsable"
                        errorMessage={touched.nameResponsible ? errors.nameResponsible : undefined}
                        onBlur={handleBlur}
                        onSelectionChange={(key) => {
                          if (key) {
                            const employee = JSON.parse(key as string) as Employee;
                            handleChange('nameResponsible')(
                              `${employee.firstName + ' ' + employee.secondName} ${employee.firstLastName} ${employee.secondLastName}`
                            );
                            handleChange('docNumberResponsible')(employee.dui);
                            handleChange('typeDocResponsible')('13');
                            setDocResponsible(employee.dui);
                            setTypeDocResponsible('13');
                          } else {
                            setDocResponsible('');
                            setTypeDocResponsible('');
                          }
                        }}
                      >
                        {employee_list.map((item) => (
                          <AutocompleteItem
                            key={JSON.stringify(item)}
                            value={item.dui}
                            className=" dark:text-white"
                          >
                            {`${item.id} - ${item.firstName + ' ' + item.secondName} ${item.firstLastName} ${item.secondLastName}`}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
                      <Input
                        variant="bordered"
                        label="Tipo de documento"
                        labelPlacement="outside"
                        className="w-full text-sm dark:text-white"
                        classNames={{ label: 'text-xs font-semibold' }}
                        placeholder="DUI"
                        isReadOnly
                        type="text"
                        id="docNumberResponsible"
                        name="docNumberResponsible"
                        value={
                          services
                            .get022TipoDeDocumentoDeIde()
                            .find((doc) => doc.codigo === typeDocResponsible)?.valores
                        }
                      />
                      <Input
                        variant="bordered"
                        label="Numero de documento"
                        labelPlacement="outside"
                        className="w-full text-sm dark:text-white"
                        classNames={{ label: 'text-xs font-semibold' }}
                        placeholder="00000000-0"
                        type="text"
                        isReadOnly
                        id="docNumberResponsible"
                        name="docNumberResponsible"
                        value={docResponsible}
                      />
                    </div>
                  </div>
                  <div className="p-8 border mt-5 shadow rounded">
                    <p className="text-xl font-semibold">Solicitante</p>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-5">
                      <div>
                        <Input
                          className="w-full text-sm dark:text-white z-0"
                          classNames={{ label: 'text-xs font-semibold' }}
                          type="text"
                          id="nameApplicant"
                          name="nameApplicant"
                          labelPlacement="outside"
                          label="Nombre de solicitante"
                          placeholder="Ingresa el nombre del solicitante"
                          variant="bordered"
                          value={values.nameApplicant}
                          onChange={handleChange('nameApplicant')}
                          onBlur={handleBlur('nameApplicant')}
                          isInvalid={touched.nameApplicant && !!errors.nameApplicant}
                          errorMessage={errors.nameApplicant}
                        />
                      </div>
                      <div>
                        <Select
                          className="dark:text-white"
                          variant="bordered"
                          size="md"
                          label="Tipo de documento de identificación"
                          placeholder="Selecciona el tipo de documento"
                          labelPlacement="outside"
                          classNames={{
                            label: 'font-semibold text-xs',
                          }}
                          value={values.typeDocApplicant}
                          onChange={handleChange('typeDocApplicant')}
                          isInvalid={touched.typeDocApplicant && !!errors.typeDocApplicant}
                          errorMessage={errors.typeDocApplicant}
                        >
                          {services.get022TipoDeDocumentoDeIde().map((doc) => (
                            <SelectItem
                              className="dark:text-white"
                              key={doc.codigo}
                              value={doc.codigo}
                            >
                              {doc.valores}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <Input
                        variant="bordered"
                        label="Numero de documento"
                        labelPlacement="outside"
                        className="w-full text-sm dark:text-white"
                        classNames={{ label: 'text-xs font-semibold' }}
                        placeholder="Ingresa el numero de documento"
                        type="text"
                        id="`docNumberApplicant`"
                        name="docNumberApplicant"
                        value={values.docNumberApplicant}
                        onChange={handleChange('docNumberApplicant')}
                        onBlur={handleBlur('docNumberApplicant')}
                        isInvalid={touched.docNumberApplicant && !!errors.docNumberApplicant}
                        errorMessage={errors.docNumberApplicant}
                      ></Input>
                    </div>
                  </div>
                  <div className="w-full flex justify-end mt-10 pb-10">
                    <Button
                      style={styles.thirdStyle}
                      onClick={() => handleSubmit()}
                      type="submit"
                      className="w-full md:w-auto px-20"
                      disabled={isSubmitting}
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
      {!json_credit && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          {/* <Lottie
            width={300}
            height={300}
            options={{
              animationData: EMPTY_BOX,
            }}
          /> */}
          <p className="mt-3 text-xl font-normal">No se encontró la nota de débito solicitada</p>
        </div>
      )}
    </>
  );
}

export default Invalidation05;
