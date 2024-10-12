import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
import { Button, useDisclosure } from '@nextui-org/react';
import { EyeIcon, HandCoins } from 'lucide-react';
import { useAccountReceivableStore } from '../../store/accounts_receivable.store';
import ModalGlobal from '../global/ModalGlobal';
import { toast } from 'sonner';
import { useCorrelativesDteStore } from '../../store/correlatives_dte.store';
import { useTransmitterStore } from '../../store/transmitter.store';
import { SVFE_FC_SEND } from '../../types/svf_dte/fc.types';
import { generate_credit_factura } from '../../utils/DTE/factura';
import { firmarDocumentoFactura, send_to_mh } from '../../services/DTE.service';
import { get_token, return_mh_token } from '../../storage/localStorage';
import { PayloadMH } from '../../types/DTE/DTE.types';
import { ambiente, API_URL } from '../../utils/constants';
import axios, { AxiosError } from 'axios';
import { formatDate } from '../../utils/dates';
import Template1CFC from '../../pages/invoices/Template1CFC';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { s3Client } from '../../plugins/s3';
import { SendMHFailed } from '../../types/transmitter.types';
import { Customer } from '../../types/customers.types';
import { pdf } from '@react-pdf/renderer';

const ListCreditCustomers = () => {
  const { theme } = useContext(ThemeContext);
  const {
    accounts_receivable_paginated,
    getAccountsReceivablePaginated,
    getPaymentsByAccount,
    payments,
  } = useAccountReceivableStore();
  const { gettransmitter, transmitter } = useTransmitterStore();
  const { getCorrelativesByDte } = useCorrelativesDteStore();

  const [customer, setCustomer] = useState<Customer>();
  const [cantidad] = useState<number>(0);
  const [interes] = useState<number>(0);
  const [, setErrorMessage] = useState('');
  const [, setTitle] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<number>(0);
  const [, setCurrentDTE] = useState<SVFE_FC_SEND>();

  useEffect(() => {
    getAccountsReceivablePaginated(1, 10);
    gettransmitter();
  }, []);

  const paymentsHistory = useDisclosure();

  useEffect(() => {
    getPaymentsByAccount(selectedAccount);
  }, [selectedAccount]);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const [, setLoading] = useState(false);

  const generateFactura = async () => {
    const correlatives = await getCorrelativesByDte(transmitter.id, '01');

    if (!correlatives) {
      toast.error('No se encontraron correlativos');
      return;
    }
    if (!customer) {
      toast.info('Debes seleccionar el cliente');
      return;
    }

    const paymentType = [
      {
        codigo: '01',
        plazo: '02',
        periodo: 2,
        montoPago: 25,
        referencia: null,
      },
    ];

    const generate = generate_credit_factura(
      transmitter,
      Number(correlatives!.next),
      { id: 1, codigo: '01', valores: 'Factura', isActivated: true },
      cantidad,
      interes,
      customer as Customer,
      paymentType
    );

    setCurrentDTE(generate);
    setLoading(true);

    toast.info('Estamos firmado tu documento');

    firmarDocumentoFactura(generate)
      .then((firma) => {
        const token_mh = return_mh_token();
        if (firma.data.body) {
          const data_send: PayloadMH = {
            ambiente: ambiente,
            idEnvio: 1,
            version: 1,
            tipoDte: '01',
            documento: firma.data.body,
          };
          toast.info('Se ah enviado a hacienda, esperando respuesta');

          if (token_mh) {
            const source = axios.CancelToken.source();

            const timeout = setTimeout(() => {
              source.cancel('El tiempo de espera ha expirado');
            }, 20000);

            send_to_mh(data_send, token_mh, source)
              .then(async ({ data }) => {
                if (data.selloRecibido) {
                  clearTimeout(timeout);
                  toast.success('Hacienda respondió correctamente', {
                    description: 'Estamos guardando tus datos',
                  });

                  const json_url = `CLIENTES/${
                    transmitter.nombre
                  }/${new Date().getFullYear()}/CREDITOS/FACTURAS/${formatDate()}/${
                    generate.dteJson.identificacion.codigoGeneracion
                  }/${generate.dteJson.identificacion.codigoGeneracion}.json`;
                  const pdf_url = `CLIENTES/${
                    transmitter.nombre
                  }/${new Date().getFullYear()}/CREDITOS/FACTURAS/${formatDate()}/${
                    generate.dteJson.identificacion.codigoGeneracion
                  }/${generate.dteJson.identificacion.codigoGeneracion}.pdf`;

                  const JSON_DTE = JSON.stringify(
                    {
                      ...generate.dteJson,
                      respuestaMH: data,
                      firma: firma.data.body,
                    },
                    null,
                    2
                  );
                  const json_blob = new Blob([JSON_DTE], {
                    type: 'application/json',
                  });

                  const blob = await pdf(
                    <Template1CFC
                      dte={{
                        ...generate.dteJson,
                        respuestaMH: data,
                        firma: firma.data.body,
                      }}
                    />
                  ).toBlob();

                  if (json_blob && blob) {
                    const uploadParams: PutObjectCommandInput = {
                      Bucket: 'seedcode-facturacion',
                      Key: json_url,
                      Body: json_blob,
                    };
                    const uploadParamsPDF: PutObjectCommandInput = {
                      Bucket: 'seedcode-facturacion',
                      Key: pdf_url,
                      Body: blob,
                    };

                    s3Client.send(new PutObjectCommand(uploadParamsPDF)).then((response) => {
                      if (response.$metadata) {
                        s3Client.send(new PutObjectCommand(uploadParams)).then((response) => {
                          if (response.$metadata) {
                            const token = get_token() ?? '';

                            axios
                              .post(
                                API_URL + '/sales/credit-sale',
                                {
                                  pdf: pdf_url,
                                  dte: json_url,
                                  clienteId: customer?.id,
                                  cajaId: Number(localStorage.getItem('box')),
                                  codigoEmpleado: 1,
                                  sello: true,
                                },
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              )
                              .then(() => {
                                toast.success('Se completo con éxito la venta');
                                setLoading(false);
                              })
                              .catch(() => {
                                toast.error('Error al guardar la venta');
                                setLoading(false);
                              });
                          }
                        });
                      }
                    });
                  }
                }
              })
              .catch((error: AxiosError<SendMHFailed>) => {
                clearTimeout(timeout);

                if (axios.isCancel(error)) {
                  setTitle('Tiempo de espera agotado');
                  setErrorMessage('El tiempo limite de espera ha expirado');
                  // modalError.onOpen();
                  setLoading(false);
                }

                if (error.response?.data) {
                  setErrorMessage(
                    error.response.data.observaciones &&
                      error.response.data.observaciones.length > 0
                      ? error.response?.data.observaciones.join('\n\n')
                      : ''
                  );
                  setTitle(error.response.data.descripcionMsg ?? 'Error al procesar venta');
                  // modalError.onOpen();
                  setLoading(false);
                }
              });
          } else {
            setErrorMessage('No se ha podido obtener el token de hacienda');
            // modalError.onOpen();
            setLoading(false);
            return;
          }
        } else {
          setTitle('Error en el firmador');
          setErrorMessage('Error al firmar el documento');
          // modalError.onOpen();
          setLoading(false);
          return;
        }
      })
      .catch(() => {
        setTitle('Error en el firmador');
        setErrorMessage('Error al firmar el documento');
        // modalError.onOpen();
        setLoading(false);
      });
  };

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="flex flex-col w-full p-5 rounded">
          <DataTable
            className="shadow"
            emptyMessage="No se encontraron resultados"
            value={accounts_receivable_paginated.accounts}
            tableStyle={{ minWidth: '50rem' }}
          >
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
              field="id"
              header="No."
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="customer.nombre"
              header="Cliente"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="customer.numDocumento"
              header="Documento"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="customer.esContribuyente"
              body={(item) => (item.esContribuyente ? 'Si' : 'No')}
              header="Contribuyente"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="date"
              header="Fecha"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="debt"
              header="Deuda"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="paid"
              header="Pagado"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="remaining"
              header="Restante"
            />
            <Column
              headerStyle={{ ...style, borderTopRightRadius: '10px' }}
              header="Acciones"
              body={(item) => (
                <div className="flex w-full gap-5">
                  <Button
                    isIconOnly
                    onClick={() => {
                      setCustomer(item.customer);
                      generateFactura();
                    }}
                    style={{
                      backgroundColor: theme.colors.secondary,
                    }}
                  >
                    <HandCoins style={{ color: theme.colors.primary }} size={20} />
                  </Button>
                  <Button
                    isIconOnly
                    style={{
                      backgroundColor: theme.colors.dark,
                    }}
                    onClick={() => {
                      setSelectedAccount(item.id);
                      paymentsHistory.onOpen();
                    }}
                  >
                    <EyeIcon style={{ color: theme.colors.primary }} size={20} />
                  </Button>
                </div>
              )}
            />
          </DataTable>
        </div>
      </div>
      <ModalGlobal
        isOpen={paymentsHistory.isOpen}
        onClose={() => paymentsHistory.onClose()}
        title="Historial de pagos"
        size="lg"
      >
        <div className="w-full flex justify-center">
          <DataTable
            className="shadow"
            emptyMessage="No se encontraron resultados"
            value={payments}
            tableStyle={{ minWidth: '40rem' }}
          >
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
              header="No."
              body={(item) => payments.indexOf(item) + 1}
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="amount"
              header="Abono"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="remaining"
              header="Restante"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="date"
              header="Fecha"
            />
          </DataTable>
        </div>
      </ModalGlobal>
    </>
  );
};

export default ListCreditCustomers;
