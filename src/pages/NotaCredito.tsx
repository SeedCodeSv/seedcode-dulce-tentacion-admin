import { useNavigate, useParams } from 'react-router';
import Layout from '../layout/Layout';
import { useSalesStore } from '@/store/sales.store';
import { useAuthStore } from '@/store/auth.store';
import { useContext, useEffect, useState } from 'react';
import { global_styles } from '@/styles/global.styles';
import { ThemeContext } from '@/hooks/useTheme';
import { useCorrelativesDteStore } from '@/store/correlatives_dte.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { Button, Input, Spinner, useDisclosure } from '@nextui-org/react';
import { SVFE_NC_SEND } from '@/types/svf_dte/nc.types';
import { toast } from 'sonner';
import { ND_CuerpoDocumentoItems, ND_DocumentoRelacionadoItems } from '@/types/svf_dte/nd.types';
import { convertCurrencyFormat } from '@/utils/money';
import { check_dte, firmarDocumentoNotaDebito, send_to_mh } from '@/services/DTE.service';
import { PayloadMH } from '@/types/DTE/DTE.types';
import { get_token, return_mh_token } from '@/storage/localStorage';
import axios, { AxiosError } from 'axios';
import { formatDate } from '@/utils/dates';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { API_URL, sending_steps, SPACES_BUCKET } from '@/utils/constants';
import { s3Client } from '@/plugins/s3';
import { SendMHFailed } from '@/types/transmitter.types';
import { save_logs } from '@/services/logs.service';
import { generateNotaCredito } from '@/utils/DTE/nota-credito';
import { ArrowLeft, LoaderIcon, ShieldAlert } from 'lucide-react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatCurrency } from '@/utils/dte';
import HeadlessModal from '@/components/global/HeadlessModal';
import { ICheckResponse } from '@/types/DTE/check.types';

function NotaCredito() {
  const { id } = useParams();
  const { getSaleDetails, json_sale, updateSaleDetails } = useSalesStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState<string>('');
  const styles = global_styles();
  const navigation = useNavigate();
  const [currentStep, setCurrenStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSaleDetails(Number(id));
  }, [id]);

  const { theme } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const updatePrice = (price: number, noItem: number) => {
    const items = json_sale?.cuerpoDocumento;
    const copy = JSON.parse(JSON.stringify(json_sale?.itemsCopy));
    if (items) {
      const item = items.find((i) => i.numItem === noItem);
      if (item) {
        const total = item.cantidad * price;
        item.precioUni = price;
        item.ventaGravada = total;

        if (!json_sale.indexEdited.includes(noItem)) {
          json_sale.indexEdited = [...json_sale.indexEdited, noItem];
        }

        const edited = items.map((i) => (i.numItem === noItem ? item : i));

        updateSaleDetails({
          ...json_sale,
          cuerpoDocumento: edited,
          indexEdited: json_sale.indexEdited,
          itemsCopy: copy,
        });
      }
    }
  };

  const updateQuantity = (quantity: number, noItem: number) => {
    const items = json_sale?.cuerpoDocumento;
    const copy = JSON.parse(JSON.stringify(json_sale?.itemsCopy));
    if (items) {
      const item = items.find((i) => i.numItem === noItem);
      if (item) {
        const total = quantity * item.precioUni;
        item.cantidad = quantity;
        item.ventaGravada = total;
        json_sale.indexEdited = [...json_sale.indexEdited, noItem];

        const edited = items.map((i) => (i.numItem === noItem ? item : i));

        updateSaleDetails({
          ...json_sale,
          cuerpoDocumento: edited,
          indexEdited: json_sale.indexEdited,
          itemsCopy: copy,
        });
      }
    }
  };
  const { getCorrelativesByDte } = useCorrelativesDteStore();
  const { gettransmitter, transmitter } = useTransmitterStore();
  useEffect(() => {
    gettransmitter();
  }, []);
  const modalError = useDisclosure();

  const [currentDTE, setCurrentDTE] = useState<SVFE_NC_SEND>();
  const proccessNotaCredito = async () => {
    if (json_sale) {
      if (json_sale.cuerpoDocumento.length > 0) {
        setLoading(true);
        const editedItems = json_sale.cuerpoDocumento.filter((item) =>
          json_sale.indexEdited.includes(item.numItem)
        );
        if (editedItems.length === 0) {
          toast.error('No se encontraron items editados o tienes errores sin resolver');
          return;
        }

        const correlatives = await getCorrelativesByDte(Number(user?.id), 'NCE');
        if (!correlatives) {
          toast.error('No se encontraron correlativos');
          return;
        }

        const documentoRelacionado: ND_DocumentoRelacionadoItems[] = [
          {
            tipoDocumento: '03',
            tipoGeneracion: 2,
            numeroDocumento: json_sale.identificacion.codigoGeneracion,
            fechaEmision: json_sale.identificacion.fecEmi,
          },
        ];

        const total = editedItems
          .map((item) => Number(item.ventaGravada))
          .reduce((a, b) => a + b, 0);

        const total_iva = editedItems
          .map((cp) => {
            const iva = Number(cp.ventaGravada) * 0.13;
            return iva;
          })
          .reduce((a, b) => a + b, 0);

        const resumen = {
          totalNoSuj: 0,
          totalExenta: 0,
          totalGravada: Number(total.toFixed(2)),
          subTotalVentas: Number(total.toFixed(2)),
          descuNoSuj: 0,
          descuExenta: 0,
          descuGravada: 0,
          totalDescu: 0,
          tributos: [
            {
              codigo: '20',
              descripcion: 'Impuesto al Valor Agregado 13%',
              valor: Number(total_iva.toFixed(2)),
            },
          ],
          subTotal: Number(total.toFixed(2)),
          ivaRete1: 0,
          reteRenta: 0,
          ivaPerci1: 0,
          montoTotalOperacion: Number((total + total_iva).toFixed(2)),
          totalLetras: convertCurrencyFormat(String((total + total_iva).toFixed(2))),
          condicionOperacion: 1,
        };

        const items: ND_CuerpoDocumentoItems[] = editedItems.map((item, index) => {
          return {
            numItem: index + 1,
            tipoItem: item.tipoItem,
            numeroDocumento: json_sale.identificacion.codigoGeneracion,
            codigo: item.codigo,
            codTributo: null,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            uniMedida: item.uniMedida,
            precioUni: item.precioUni,
            montoDescu: item.montoDescu,
            ventaNoSuj: item.ventaNoSuj,
            ventaExenta: item.ventaExenta,
            ventaGravada: Number(item.ventaGravada.toFixed(2)),

            tributos: ['20'],
          };
        });

        const nota_credito = generateNotaCredito(
          transmitter,
          json_sale.receptor,
          documentoRelacionado,
          items,
          correlatives,
          resumen,
          null,
          null,
          null
        );
        setCurrentDTE(nota_credito);
        firmarDocumentoNotaDebito(nota_credito)
          .then((firmador) => {
            setCurrenStep(1);
            const data_send: PayloadMH = {
              ambiente: '00',
              idEnvio: 1,
              version: 3,
              tipoDte: '05',
              documento: firmador.data.body,
            };
            const token_mh = return_mh_token();
            if (token_mh) {
              setIsLoading(true);
              const source = axios.CancelToken.source();
              const timeout = setTimeout(() => {
                source.cancel('El tiempo de espera ha expirado');
              }, 25000);
              send_to_mh(data_send, token_mh ?? '', source)
                .then(async (response) => {
                    setCurrenStep(2);
                  clearTimeout(timeout);
                  const DTE_FORMED = {
                    ...nota_credito.dteJson,
                    respuestaMH: response.data,
                    firma: firmador.data.body,
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
                  }/${new Date().getFullYear()}/VENTAS/NOTAS_DE_CREDITO/${formatDate()}/${
                    nota_credito.dteJson.identificacion.codigoGeneracion
                  }/${nota_credito.dteJson.identificacion.codigoGeneracion}.json`;

                  const json_blob = new Blob([JSON_DTE], {
                    type: 'application/json',
                  });

                  const uploadParams: PutObjectCommandInput = {
                    Bucket: SPACES_BUCKET,
                    Key: json_url,
                    Body: json_blob,
                  };

                  s3Client.send(new PutObjectCommand(uploadParams)).then((response) => {
                    if (response.$metadata) {
                      axios
                        .post(
                          `${API_URL}/nota-de-credito`,
                          {
                            dte: json_url,
                            sello: true,
                            saleId: id,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${get_token() ?? ''}`,
                            },
                          }
                        )
                        .then(() => {
                          setIsLoading(false);
                          setLoading(false);
                          setCurrenStep(0)
                          navigation(-1);
                          toast.success('Nota de credito enviada');
                        })
                        .catch(() => {
                          toast.error('Error al enviar el PDF');
                          setIsLoading(false);
                        });
                    }
                  });
                })
                .catch(async (error: AxiosError<SendMHFailed>) => {
                  clearTimeout(timeout);
                  if (axios.isCancel(error)) {
                    setLoading(false)
                    setCurrenStep(0)
                    setTitle('Tiempo de espera agotado');
                    setErrorMessage('El tiempo limite de espera ha expirado');
                    modalError.onOpen();
                    setIsLoading(false);
                  }
                  setLoading(false)
                  setCurrenStep(0)
                  modalError.onOpen();
                  setIsLoading(false);

                  if (error.response?.data) {
                    setErrorMessage(
                      error.response.data.observaciones &&
                        error.response.data.observaciones.length > 0
                        ? error.response?.data.observaciones.join('\n\n')
                        : ''
                    );
                    setTitle(error.response?.data.descripcionMsg ?? 'Error al procesar nota de credito');
                    setLoading(false)
                    setCurrenStep(0)
                    modalError.onOpen();
                    await save_logs({
                      title: error.response.data.descripcionMsg ?? 'Error al procesar venta',
                      message:
                        error.response.data.observaciones &&
                        error.response.data.observaciones.length > 0
                          ? error.response?.data.observaciones.join('\n\n')
                          : error.response.data.descripcionMsg,
                      generationCode: nota_credito.dteJson.identificacion.codigoGeneracion,
                      table: 'nota_de_creditos',
                    });
                  }
                });
            } else {
                setIsLoading(false)
                setCurrenStep(0)
                modalError.onOpen();
                setIsLoading(false);
                setErrorMessage('No se ha podido obtener el token de hacienda');
                return;
            }
          })
          .catch(() => {
            setLoading(false)
            setCurrenStep(0)
            modalError.onOpen();
            setIsLoading(false);
            setTitle('Error en el firmador');
            setErrorMessage('Error al firmar el documento');
          });
      }
    }
  };

  const handleVerify = () => {
    setIsLoading(true);

    const payload = {
      nitEmisor: transmitter.nit,
      tdte: currentDTE?.dteJson.identificacion.tipoDte ?? '05',
      codigoGeneracion: currentDTE?.dteJson.identificacion.codigoGeneracion ?? '',
    };

    const token_mh = return_mh_token();

    check_dte(payload, token_mh ?? '')
      .then((response) => {
        toast.success(response.data.estado, {
          description: `Sello recibido: ${response.data.selloRecibido}`,
        });
        setIsLoading(false);
      })
      .catch((error: AxiosError<ICheckResponse>) => {
        if (error.status === 500) {
          toast.error('NO ENCONTRADO', {
            description: 'DTE no encontrado en hacienda',
          });
          setIsLoading(false);
          return;
        }

        toast.error('ERROR', {
          description: `Error: ${
            error.response?.data.descripcionMsg ?? 'DTE no encontrado en hacienda'
          }`,
        });
        setIsLoading(false);
      });
  };

  console.log('CURRENT DTE', currentDTE);

  const sendToContingencia = () => {
    setIsLoading(true);
    toast.info('Enviando a contingencia...');
    modalError.onClose();
    if (currentDTE) {
      currentDTE.dteJson.identificacion.tipoModelo = 2;
      currentDTE.dteJson.identificacion.tipoOperacion = 2;

      const JSON_DTE = JSON.stringify(currentDTE.dteJson, null, 2);
      const json_blob = new Blob([JSON_DTE], {
        type: 'application/json',
      });

      const json_url = `CLIENTES/${
        transmitter.nombre
      }/${new Date().getFullYear()}/VENTAS/NOTAS_DE_CREDITO/${formatDate()}/${
        currentDTE.dteJson.identificacion.codigoGeneracion
      }/${currentDTE.dteJson.identificacion.codigoGeneracion}.json`;

      const updloadParams: PutObjectCommandInput = {
        Bucket: SPACES_BUCKET,
        Key: json_url,
        Body: json_blob,
      };

      s3Client
        .send(new PutObjectCommand(updloadParams))
        .then((response) => {
          if (response.$metadata) {
            axios
              .post(`${API_URL}/nota-de-credito`, {
                dte: json_url,
                sello: false,
                saleId: id,
              })
              .then(() => {
                toast.success('Nota de credito enviada a contingencia');
                navigation('/sales');
                setIsLoading(false);
              })
              .catch(() => {
                toast.error('Error al subir la nota de credito a contingencia');
                setIsLoading(false);
              });
          } else {
            toast.error('Error al subir la nota de credito a contingencia');
            setIsLoading(false);
          }
        })
        .catch(() => {
          toast.error('Error al subir la nota de credito a contingencia');
          setIsLoading(false);
        });
    }
  };

  return (
    <Layout title="Nota de Credito">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
            {loading && (
                <div className='absolute z-[100] left-0 bg-white/80  top-0 h-screen w-screen flex flex-col justify-center items-center'>
                    <Spinner className='w-24 h-24 animate-spin' />
                    <p className='text-lg font-semibold mt-4'>Cargando...</p>
                    <div className='flex flex-col'>
                        {sending_steps.map((step, index) => (
                            <div key={index} className='flex items-start py-2'>
                                <div 
                                    className={`flex items-center justify-center w-8 h-8 border-2 rounded-full transition duration-500 
                                    ${
                                        index <= currentStep
                                        ? 'bg-green-600 border-green-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-500'
                                    } `}
                                >
                                    {index + 1}
                                </div>
                                <div className='ml-4'>
                                    <div 
                                        className={`font-semibold ${
                                            index <= currentStep ? 'text-green-600' : 'text-gray-500'
                                        }`}
                                    >
                                        {step.label}
                                    </div>
                                    {step.description && (
                                        <div className='text-xs font-semibold text-gray-700'>
                                            {step.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          <div className="flex items-center gap-3 mb-2 dark:text-white">
            <Button onClick={() => navigation(-1)} style={styles.darkStyle}>
              <ArrowLeft />
              <p>Regresar</p>
            </Button>
          </div>
          <p className="mt-4 text-xl font-semibold dark:text-white">Detalles</p>
          <div className="grid grid-cols-2 gap-5 mt-4">
            <p className="font-semibold dark:text-white">
              Código Generación:{' '}
              <span className="font-normal">{json_sale?.identificacion.codigoGeneracion}</span>
            </p>
            <p className="font-semibold dark:text-white">
              Sello recepción:{' '}
              <span className="font-normal">{json_sale?.respuestaMH.selloRecibido}</span>
            </p>
            <p className="font-semibold dark:text-white">
              Numero control:{' '}
              <span className="font-normal">{json_sale?.identificacion.numeroControl}</span>
            </p>
            <p className="font-semibold dark:text-white">
              Fecha hora:{' '}
              <span className="font-normal">
                {json_sale?.identificacion?.fecEmi} - {json_sale?.identificacion.horEmi}
              </span>
            </p>
          </div>

          <p className="py-8 text-lg font-semibold dark:text-white">Productos</p>
          {json_sale?.cuerpoDocumento && (
            <DataTable
              className="shadow"
              emptyMessage="No se encontraron resultados"
              value={json_sale?.cuerpoDocumento}
              tableStyle={{ minWidth: '50rem' }}
            >
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
                field="numItem"
                header="No."
                className="dark:text-white"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                header="Nombre"
                className="dark:text-white"
                body={(rowData) => (
                  <Input
                    variant="bordered"
                    defaultValue={rowData.descripcion}
                    onChange={(e) => {
                      updateSaleDetails({
                        ...json_sale,
                        cuerpoDocumento: json_sale?.cuerpoDocumento.map((item) => {
                          if (item.numItem === rowData.numItem) {
                            return {
                              ...item,
                              descripcion: e.target.value,
                            };
                          }
                          return item;
                        }),
                      });
                    }}
                  />
                )}
              />
              <Column
                className="dark:text-white"
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="cantidadItem"
                header="Cantidad"
                body={(rowData, { rowIndex }) => (
                  <Input
                    variant="bordered"
                    className="w-32"
                    defaultValue={rowData.cantidad}
                    min={Number(json_sale.itemsCopy[rowIndex].cantidad)}
                    isInvalid={rowData.cantidad > json_sale.itemsCopy[rowIndex].cantidad}
                    errorMessage="La cantidad no puede ser mayor a la cantidad de venta"
                    type="number"
                    onChange={(e) => updateQuantity(Number(e.target.value), rowData.numItem)}
                  />
                )}
              />

              <Column
                className="dark:text-white"
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                header="Codigo"
                body={(row) => <p>{row.codigo ?? 'N/A'}</p>}
              />
              <Column
                className="dark:text-white"
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                header="Precio"
                body={(rowData, { rowIndex }) => (
                  <Input
                    variant="bordered"
                    className="w-52"
                    defaultValue={rowData.precioUni}
                    min={Number(json_sale.itemsCopy[rowIndex].precioUni)}
                    type="number"
                    startContent="$"
                    isInvalid={rowData.precioUni > json_sale.itemsCopy[rowIndex].precioUni}
                    errorMessage="El precio no puede ser mayor al precio de venta"
                    onChange={(e) => updatePrice(Number(e.target.value), rowData.numItem)}
                  />
                )}
              />
              <Column
                className="dark:text-white"
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="newTotalItem"
                header="Total"
                body={(rowData) => formatCurrency(Number(rowData.ventaGravada))}
              />
            </DataTable>
          )}
          <div className="w-full mt-8">
            <Button style={styles.thirdStyle} onClick={proccessNotaCredito} disabled={isLoading}>
              {isLoading ? <LoaderIcon className="animate-spin" /> : 'Procesar Nota de Credito'}
            </Button>
          </div>
        </div>

        <HeadlessModal
          isOpen={modalError.isOpen}
          onClose={modalError.onClose}
          title={title}
          size="w-[600px]"
        >
          <div>
            <div className="flex flex-col items-center justify-center">
              <ShieldAlert size={75} color="red" />
              <p className="text-lg font-semibold dark:text-white">{errorMessage}</p>
            </div>
            <div className="flex justify-center gap-5 mt-8">
              <Button
                onClick={() => {
                  modalError.onClose();
                  proccessNotaCredito();
                }}
                style={styles.secondaryStyle}
              >
                Re-intentar
              </Button>
              <Button onClick={handleVerify} style={styles.thirdStyle}>
                Verificar DTE
              </Button>
              <Button onClick={sendToContingencia} style={styles.dangerStyles}>
                Enviar a contingencia
              </Button>
              <Button onClick={() => modalError.onClose()} style={styles.dangerStyles}>
                Aceptar
              </Button>
            </div>
          </div>
        </HeadlessModal>
      </div>
    </Layout>
  );
}

export default NotaCredito;
