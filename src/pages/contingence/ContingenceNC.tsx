import useGlobalStyles from '@/components/global/global.styles';
import { useAuthStore } from '@/store/auth.store';
import { useCorrelativesDteStore } from '@/store/correlatives_dte.store';
import { useEmployeeStore } from '@/store/employee.store';
import { useCreditNotes } from '@/store/notes_credits.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { IContingencia } from '@/types/DTE/contingencia.types';
import { formatDate } from '@/utils/dates';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useMemo, useState } from 'react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { toast } from 'sonner';
import { generate_contingencias } from './contingencia_facturacion.ts';
import {
  firmarDocumentoContingencia,
  firmarDocumentoNotaDebito,
  send_to_mh,
  send_to_mh_contingencia,
} from '@/services/DTE.service.ts';
import axios, { AxiosError } from 'axios';
import { return_mh_token } from '@/storage/localStorage.ts';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '@/plugins/s3.ts';
import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { ambiente, API_URL, contingence_steps, SPACES_BUCKET } from '@/utils/constants.ts';
import { SVFE_NC_Firmado, SVFE_NC_SEND } from '@/types/svf_dte/nc.types.ts';
import { PayloadMH } from '@/types/DTE/DTE.types.ts';
import { SendMHFailed } from '@/types/transmitter.types.ts';
import HeadlessModal from '@/components/global/HeadlessModal.tsx';
import { ShieldAlert } from 'lucide-react';
import { Employee } from '@/types/employees.types.ts';
import { useBranchesStore } from '@/store/branches.store.ts';

function ContingenceNC() {
  const { getBranchesList, branch_list } = useBranchesStore();
  const [branchId, setBranchId] = useState<string | undefined>('');
  const { onGetContingenceNotes, contingence_credits } = useCreditNotes();
  const { employee_list } = useEmployeeStore();
  const { user } = useAuthStore();
  const { getTransmitter, transmitter } = useTransmitterStore();
  const styles = useGlobalStyles();
  const [currentStep, setCurrentStep] = useState(0);
  const [motivo, setMotivo] = useState('2');
  const [observaciones, setObservaciones] = useState('');
  const [nombreRes, setNombreRes] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('Error de firma');
  const [loading, setLoading] = useState(false);
  const service = new SeedcodeCatalogosMhService();
  const { getCorrelativesByDte } = useCorrelativesDteStore();
  const modalError = useDisclosure();
  const [startDate, setStartDate] = useState(formatDate());
  const [startTime, setStartTime] = useState(
    new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  );
  const [endDate, setEndDate] = useState(formatDate());
  const [endTime, setEndTime] = useState(
    new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  );

  const timeStart = useMemo(() => {
    if (contingence_credits.length > 0) {
      setStartTime(contingence_credits[0]?.horEmi);
      return contingence_credits[0]?.horEmi;
    }
    return startTime;
  }, [contingence_credits]);

  const timeEnd = useMemo(() => {
    if (contingence_credits.length > 0) {
      setEndTime(contingence_credits[contingence_credits.length - 1]?.horEmi);
      return contingence_credits[contingence_credits.length - 1]?.horEmi;
    }
    return endTime;
  }, [contingence_credits]);

  const filteredEmployees = useMemo(() => {
    return branchId ? employee_list.filter((emp) => emp.branchId === Number(branchId)) : [];
  }, [branchId]);

  useEffect(() => {
    onGetContingenceNotes(Number(user?.pointOfSale?.branch.id));
    getTransmitter(Number(user?.pointOfSale?.branch.transmitterId));
    getBranchesList();
  }, []);

  const [error, setError] = useState({
    nombreRes: '',
    motivo: '',
    observaciones: '',
  });

  useEffect(() => {
    if (motivo !== '') {
      setError((prev) => ({ ...prev, motivo: '' }));
    }
    if (nombreRes !== '') {
      setError((prev) => ({ ...prev, nombreRes: '' }));
    }
    if (motivo !== '5') {
      setError((prev) => ({ ...prev, observaciones: '' }));
    }
  }, [motivo, nombreRes, observaciones]);

  const handleError = () => {
    if (motivo === '') {
      setError((prev) => ({ ...prev, motivo: 'Selecciona el motivo' }));
      return;
    } else if (nombreRes === '') {
      setError((prev) => ({ ...prev, nombreRes: 'Selecciona el responsable' }));
      return;
    } else if (motivo === '5' && observaciones === '') {
      setError((prev) => ({ ...prev, observaciones: 'Debes rellenar la información adicional' }));
      return;
    }
  };

  const handleProccessContingence = async () => {
    modalError.onClose();
    setTitle('');
    setErrorMessage('');

    const correlatives = contingence_credits.map((sale, index) => ({
      noItem: index + 1,
      codigoGeneracion: sale.codigoGeneracion,
      tipoDoc: sale.tipoDte,
    }));

    const correlativesDte = await getCorrelativesByDte(Number(user?.id), 'NCE')
      .then((correlatives) => {
        return correlatives;
      })
      .catch(() => {
        toast.error('No se encontraron correlativos');
        return undefined;
      });

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

    setLoading(true);
    setCurrentStep(0);
    firmarDocumentoContingencia(contingencia_send)
      .then((firma) => {
        const send = {
          nit: transmitter.nit,
          documento: firma.data.body,
        };
        setCurrentStep(1);
        const source = axios.CancelToken.source();

        const timeout = setTimeout(() => {
          source.cancel('El tiempo de espera ha expirado');
        }, 25000);

        const token_mh = return_mh_token();

        if (!token_mh) {
          setLoading(false);
          toast.error('Fallo al obtener las credenciales del Ministerio de Hacienda', {
            position: 'top-right',
          });
          return;
        }
        // $ ENVIAR A CONTINGENCIA
        send_to_mh_contingencia(send, token_mh ?? '', source)
          .then((response) => {
            if (response.data.estado === 'RECHAZADO') {
              toast.error('Contingencia rechazada', {
                description: response.data.observaciones.join(', '),
              });
              setLoading(false);
              setCurrentStep(0);
              clearTimeout(timeout);
              return;
            } else {
              toast.success('Contingencia enviada con éxito');
              // * RECORRER LISTA DE DÉBITOS
              setCurrentStep(2);
              const Promise_all = contingence_credits.map(async (sale) => {
                const url = await getSignedUrl(
                  s3Client,
                  new GetObjectCommand({
                    Bucket: SPACES_BUCKET,
                    Key: sale.pathJson,
                  })
                );

                const json = await axios
                  .get<SVFE_NC_Firmado>(url, {
                    responseType: 'json',
                  })
                  .then(({ data }) => {
                    return data;
                  })
                  .catch(() => {
                    return undefined;
                  });

                if (!json) {
                  toast.error('Error al cargar la nota de débito');
                  return false;
                }

                const send: SVFE_NC_SEND = {
                  nit: transmitter.nit,
                  activo: true,
                  passwordPri: transmitter.clavePrivada,
                  dteJson: {
                    identificacion: {
                      ...json.identificacion,
                      tipoOperacion: 2,
                      tipoContingencia: Number(motivo),
                    },
                    emisor: json.emisor,
                    receptor: json.receptor,
                    cuerpoDocumento: json.cuerpoDocumento,
                    resumen: json.resumen,
                    apendice: json.apendice,
                    documentoRelacionado: json.documentoRelacionado,
                    ventaTercero: json.ventaTercero,
                    extension: json.extension,
                  },
                };
                // * FIRMAR NOTA DE CREDITO
                firmarDocumentoNotaDebito(send)
                  .then((firma_doc) => {
                    const source_doc = axios.CancelToken.source();
                    const timeout_doc = setTimeout(() => {
                      source.cancel('El tiempo de espera ha expirado');
                    }, 25000);
                    const data_send: PayloadMH = {
                      ambiente: ambiente,
                      idEnvio: 1,
                      version: 3,
                      tipoDte: '05',
                      documento: firma_doc.data.body,
                    };
                    const token_mh = return_mh_token();

                    // * ENVIAR NOTA DE CREDITO A HACIENDA
                    const result = send_to_mh(data_send, token_mh ?? '', source_doc)
                      .then( (response_nd) => {
                        clearTimeout(timeout);
                        const DTE_FORMED = {
                          ...send.dteJson,
                          respuestaMH: response_nd.data,
                          firma: firma_doc.data.body,
                        };

                        const JSON_DTE = JSON.stringify(
                          {
                            ...DTE_FORMED,
                          },
                          null,
                          2
                        );

                        const json_url = `CLIENTES/${
                          transmitter.nombre
                        }/${new Date().getFullYear()}/VENTAS/NOTAS_DE_DEBITO/${formatDate()}/${
                          DTE_FORMED.identificacion.codigoGeneracion
                        }/${DTE_FORMED.identificacion.codigoGeneracion}.json`;

                        const json_blob = new Blob([JSON_DTE], {
                          type: 'application/json',
                        });

                        const uploadParams: PutObjectCommandInput = {
                          Bucket: SPACES_BUCKET,
                          Key: json_url,
                          Body: json_blob,
                        };

                        s3Client
                          .send(new PutObjectCommand(uploadParams))
                          .then((response) => {
                            if (response.$metadata) {
                              const data_send = {
                                dte: json_url,
                                sello: true,
                                saleId: sale.saleId,
                              };

                              return axios
                                .put(API_URL + `/nota-de-credito/update-transaction`, data_send)
                                .then(() => {
                                  toast.success('Se guardo correctamente la nota de débito');
                                  return true;
                                })
                                .catch(() => {
                                  toast.error('Error al guardar en la base de datos');
                                  return false;
                                });
                            } else {
                              toast.error('Error al subir el archivo JSON');
                              return false;
                            }
                          })
                          .catch(() => {
                            toast.error('Error al subir el archivo JSON');
                            return false;
                          });
                      })
                      // ! ERROR AL ENVIAR NOTA DE DÉBITO
                      .catch((error: AxiosError<SendMHFailed>) => {
                        if (axios.isCancel(error)) {
                          clearTimeout(timeout_doc);
                          toast.error('El tiempo de espera ha expirado');
                        }
                        if (error.response?.data) {
                          toast.error(
                            error.response.data.descripcionMsg ?? 'Error al procesar venta',
                            {
                              description:
                                error.response.data.observaciones &&
                                error.response.data.observaciones.length > 0
                                  ? error.response?.data.observaciones.join('\n\n')
                                  : '',
                            }
                          );
                        } else {
                          toast.error('Error al procesar venta', {
                            description: 'Al enviar la venta, no se obtuvo respuesta de hacienda',
                          });
                        }
                        return false;
                      });
                    return result;
                  })
                  // ! ERROR AL FIRMAR NOTA DE DÉBITO
                  .catch(() => {
                    toast.error('Error al firmar la nota de débito');
                    return false;
                  });
              });

              Promise.all(Promise_all)
                .then(() => {
                  setLoading(false);
                  onGetContingenceNotes(Number(user?.pointOfSale?.branch.transmitterId));
                })
                .catch(() => {
                  toast.error('Error al guardar en la base de datos');
                  return false;
                });
            }
          })
          // ! ERROR AL ENVIAR A CONTINGENCIA
          .catch((mhError: AxiosError<SendMHFailed>) => {
            clearTimeout(timeout);
            if (axios.isCancel(mhError)) {
              setTitle('Tiempo de espera agotado');
              setErrorMessage('El tiempo limite de espera ha expirado');
              modalError.onOpen();
              setLoading(false);
            }

            if (mhError.response?.data) {
              setErrorMessage(
                mhError.response.data.observaciones &&
                  mhError.response.data.observaciones.length > 0
                  ? mhError.response.data.codigoGeneracion +
                      mhError.response?.data.observaciones.join('\n\n')
                  : ''
              );
              setTitle(mhError.response.data.descripcionMsg ?? 'Error al procesar venta');
              modalError.onOpen();
              setLoading(false);
            } else {
              setTitle('No se obtuvo respuesta de hacienda');
              setErrorMessage('Al enviar la venta, no se obtuvo respuesta de hacienda');
              modalError.onOpen();
              setLoading(false);
              setCurrentStep(0);
            }
          });
      })
      // ! ERROR EN EL FIRMADOR
      .catch(() => {
        toast.error('No se pudo procesar la contingencia');
        setLoading(false);
        setCurrentStep(0);
      });
  };

  return (
    <div className="w-full shadow p-8">
      {loading && (
        <div className="absolute z-[100] left-0 bg-white/80 top-0 h-screen w-screen flex flex-col justify-center items-center">
          <Spinner className="w-24 h-24 animate-spin" />
          <p className="text-lg font-semibold mt-4">Enviando lote de contingencia</p>
          <div className="flex flex-col">
            {contingence_steps.map((step, index) => (
              <div key={index} className="flex items-start py-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 border-2 rounded-full transition duration-500 ${
                    index <= currentStep
                      ? 'bg-green-600  border-green-600 text-white'
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
        title={title}
        isOpen={modalError.isOpen}
        onClose={modalError.onClose}
        size={'w-96 p-5'}
      >
        <div className="w-full flex flex-col justify-center items-center">
          <ShieldAlert size={75} color="red" />
          <p className="text-lg font-semibold">{errorMessage}</p>
          <div className="grid grid-cols-2 gap-8 mt-2">
            <Button onClick={handleProccessContingence} style={styles.thirdStyle} className="px-6">
              Re-intentar
            </Button>
            <Button onClick={modalError.onClose} style={styles.dangerStyles} className="px-6">
              Aceptar
            </Button>
          </div>
        </div>
      </HeadlessModal>
      <div>
        <p className="font-semibold text-xl dark:text-white">Resumen</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-3 mt-5">
          <Input
            classNames={{ label: 'font-semibold text-sm' }}
            className="dark:text-white"
            labelPlacement="outside"
            variant="bordered"
            type="date"
            label="Fecha inicial"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            classNames={{ label: 'font-semibold text-sm' }}
            labelPlacement="outside"
            className="dark:text-white"
            variant="bordered"
            type="time"
            value={timeStart}
            // onChange={(e) => setStartTime(e.target.value)}
            label="Hora inicial"
          />
          <Input
            classNames={{ label: 'font-semibold text-sm' }}
            labelPlacement="outside"
            className="dark:text-white"
            variant="bordered"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            label="Fecha de fin"
          />
          <Input
            classNames={{ label: 'font-semibold text-sm' }}
            labelPlacement="outside"
            variant="bordered"
            className="dark:text-white"
            type="time"
            value={timeEnd}
            // onChange={(e) => setEndTime(e.target.value)}
            label="Hora de fin"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-2 gap-10 gap-y-3">
          <div className="flex flex-col gap-3">
            <Select
              classNames={{ label: 'font-semibold text-sm' }}
              labelPlacement="outside"
              placeholder="Selecciona el motivo"
              variant="bordered"
              label="Motivo"
              onChange={(e) => setMotivo(e.target.value)}
              defaultSelectedKeys={[motivo.toString()]}
              value={motivo}
              className="dark:text-white"
              isInvalid={!!error.motivo}
              errorMessage={error.motivo}
            >
              {service.get005TipoDeContingencum().map((item) => (
                <SelectItem key={item.codigo} value={item.codigo} className="dark:text-white">
                  {item.valores}
                </SelectItem>
              ))}
            </Select>

            <Textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              classNames={{ label: 'font-semibold text-sm' }}
              labelPlacement="outside"
              variant="bordered"
              label="Información adicional"
              className="dark:text-white"
              placeholder="Ingresa tus observaciones e información adicional"
              isInvalid={!!error.observaciones}
              errorMessage={error.observaciones}
            ></Textarea>
          </div>
          <div className="flex flex-col-2 gap-4">
            <Autocomplete
              value={branchId}
              label="Sucursal"
              labelPlacement="outside"
              variant="bordered"
              className="dark:text-white font-semibold"
              placeholder="Selecciona la sucursal"
              onSelectionChange={(value) => setBranchId((value as string) || '')}
              classNames={{
                base: 'font-semibold text-gray-500 text-sm',
              }}
            >
              {branch_list.map((bra) => (
                <AutocompleteItem
                  className="dark:text-white"
                  value={bra.id.toString()}
                  key={bra.id.toString()}
                >
                  {bra.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Autocomplete
              className="dark:text-white font-semibold text-sm"
              variant="bordered"
              label="Responsable"
              labelPlacement="outside"
              placeholder="Selecciona al responsable"
              isInvalid={!!error.nombreRes}
              errorMessage={error.nombreRes}
              onSelectionChange={(key) => {
                if (key) {
                  const employee = JSON.parse(key as string) as Employee;
                  setNombreRes(
                    `${employee.firstName} ${employee.secondName} ${employee.firstLastName} ${employee.secondLastName}`
                  );
                  setNumeroDocumento(employee.dui);
                  setTipoDocumento('13');
                }
              }}
            >
              {filteredEmployees.map((item) => (
                <AutocompleteItem
                  key={JSON.stringify(item)}
                  value={`${item.firstName} ${item.secondName} ${item.firstLastName} ${item.secondLastName}`}
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
              Listado de notas de crédito en contingencia
            </p>
            {loading ? (
              <>
                <Spinner className="animate-spin" />
              </>
            ) : (
              <>
                {motivo === '' || nombreRes === '' || contingence_credits.length === 0 ? (
                  <Button
                    style={styles.dangerStyles}
                    onClick={handleError}
                    className="px-10 font-semibold text-white	 bg-gray-700"
                  >
                    Procesar contingencia
                  </Button>
                ) : (
                  <Button
                    onClick={handleProccessContingence}
                    style={styles.thirdStyle}
                    className="px-10 font-semibold"
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
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    No.
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Fecha - Hora
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Correlativo
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Código de generación
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Monto total
                  </th>
                </tr>
              </thead>
              <tbody className="max-h-[600px] w-full overflow-y-auto">
                {contingence_credits.map((sale, index) => (
                  <tr className="border-b border-slate-200" key={index}>
                    <td className="p-3 text-sm text-slate-700 dark:text-slate-100">{index + 1}</td>
                    <td className="p-3 text-sm text-slate-700 dark:text-slate-100">
                      {sale.fecEmi + ' - ' + sale.horEmi}
                    </td>
                    <td className="p-3 text-sm text-slate-700 dark:text-slate-100">
                      {sale.numeroControl}
                    </td>
                    <td className="p-3 text-sm text-slate-700 dark:text-slate-100">
                      {sale.codigoGeneracion}
                    </td>
                    <td className="p-3 text-sm text-slate-700 dark:text-slate-100">
                      {sale.montoTotalOperacion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ContingenceNC;
