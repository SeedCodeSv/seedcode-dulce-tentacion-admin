import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';
import { ZCashCutsResponse } from '../types/cashCuts.types';
import { useAuthStore } from '../store/auth.store';
import { fechaActualString } from '../utils/dates';
import { get_cashCuts_x } from '../services/facturation/cashCuts.service';

import { global_styles } from '../styles/global.styles';
import { useBranchesStore } from '../store/branches.store';
import { get_correlatives } from '../services/correlatives.service';
import { Correlatives } from '../types/correlatives.types';
import { formatCurrency } from '../utils/dte';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { IoPrintSharp } from 'react-icons/io5';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import Layout from '@/layout/Layout';
import { useViewsStore } from '@/store/views.store';

const CashCutsX = () => {
  const { actions } = useViewsStore();

  const x = actions.find((view) => view.view.name === 'Corte X');
  const actionsView = x?.actions?.name || [];
  const [data, setData] = useState<ZCashCutsResponse | null>(null);
  const { user } = useAuthStore();
  const [dateInitial] = useState(fechaActualString);
  const [dateEnd] = useState(fechaActualString);
  const [branchId, setBranchId] = useState(0);
  const [codeSale, setCodeSale] = useState<Correlatives[]>([]);
  const [codeSelected, setCodeSelected] = useState('');
  const [branchName, setBranchName] = useState('');
  const [branchAdress, setBranchAdress] = useState('');

  useEffect(() => {
    const getBranchId = () => {};
    getBranchId();
    const getIdBranch = async () => {
      try {
        const response = await get_cashCuts_x(branchId, codeSelected);
        setData(response.data.data);
      } catch (error) {
        toast.error('Error al cargar los cortes de caja');
      }
      if (branchId > 0) {
        const data = await get_correlatives(branchId);
        setCodeSale(data.data.correlatives);
      }
    };
    getIdBranch();
  }, [dateInitial, dateEnd, branchId, codeSelected]);

  const calculateIVA = (total: number) => total * 0.13;

  const totalGeneral = useMemo(() => {
    const totalTicket = Number(data?.Ticket?.total ?? 0);
    const totalFactura = Number(data?.Factura?.total ?? 0);
    const totalCreditoFiscal = Number(data?.CreditoFiscal?.total ?? 0);
    const totalDevolucionNC = Number(data?.DevolucionNC?.total ?? 0);
    const totalDevolucionT = Number(data?.DevolucionT?.total ?? 0);

    return totalTicket + totalFactura + totalCreditoFiscal + totalDevolucionNC + totalDevolucionT;
  }, [data]);

  const { getBranchesList, branch_list } = useBranchesStore();
  useEffect(() => {
    getBranchesList();
  }, []);

  const printCutX = () => {
    const iframe = document.createElement('iframe');
    iframe.style.height = '0';
    iframe.style.visibility = 'hidden';
    iframe.style.width = '0';
    iframe.setAttribute('srcdoc', '<html><body></body></html>');
    document.body.appendChild(iframe);
    iframe.contentWindow?.addEventListener('afterprint', () => {
      iframe.parentNode?.removeChild(iframe);
    });
    iframe.addEventListener('load', () => {
      const body = iframe.contentDocument?.body;
      if (!body) return;
      // Añadir estilos para ocultar encabezados y pies de página
      const style = document.createElement('style');
      style.innerHTML = `
          @page {
              margin: 0;
          }
          body {
              -webkit-print-color-adjust: exact;
              margin: 0;
          }
      `;
      iframe.contentDocument?.head.appendChild(style);
      body.style.textAlign = 'center';
      body.style.fontFamily = 'Arial, sans-serif';
      body.style.textAlign = 'center';
      const otherParent = document.createElement('div');
      otherParent.style.display = 'flex';
      otherParent.style.justifyContent = 'center';
      otherParent.style.alignItems = 'center';
      otherParent.style.width = '200%';
      otherParent.style.height = '200%';
      otherParent.style.padding = '5px';

      body.appendChild(otherParent);
      body.style.fontFamily = 'Arial, sans-serif';
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();
      const Am = now.getHours() < 12 ? 'AM' : 'PM';
      const customContent = `
        <div>
         <span>------------------------------------</span><br />
         <span style="text-align: right:30px;">Reporte de Ventas</span><br />
         <span>------------------------------------</span><br />
          <span>MADNESS</span><br />
          <span>${branchName || user?.correlative.branch.name}</span><br /><br />
          <span>${branchAdress || user?.correlative.branch.address}</span><br />
          <span>Creado por: ${user?.userName}</span><br />
          <span>GIRO: VENTA AL POR MENOR DE ROPA</span><br />
          <span>
            FECHA: ${date} - ${time} ${Am}
          </span>
          <br />
           <span>
           PUNTO DE VENTA: ${codeSelected ? codeSelected : 'GENERAL'}
        </span>
          <br />
          <span>------------------------------------</span><br />
          <span>------------------------------------</span<br />
          <div className="w-full">
            <span>VENTAS CON TICKET</span><br />
            <span>N. INICIAL: ${data?.Ticket?.inicio}</span><br />
            <span>N. FINAL: ${data?.Ticket?.fin}</span><br />
            <span>
              GRAVADAS: ${formatCurrency(
                Number(data?.Ticket.total ?? 0) - calculateIVA(data?.Ticket?.total || 0)
              )}
            </span><br />
            <span>IVA: ${formatCurrency(calculateIVA(data?.Ticket?.total || 0))}</span><br />
            <span>SUB_TOTAL: ${formatCurrency(Number(data?.Ticket?.total))}</span><br />
            <span>EXENTAS: $0.00</span><br />
            <span>NO SUJETAS: $0.00</span><br />
            <span>TOTAL: ${formatCurrency(Number(data?.Ticket?.total))}</span>
          </div>
          <br />
          <span>------------------------------------</span><br />
          <span>------------------------------------</span<br />
          <div className="w-full">
            <span>VENTAS CON FACTURA</span><br />
            <span>N. INICIAL: ${data?.Factura?.inicio}</span><br />
            <span>N. FINAL: ${data?.Factura?.fin}</span><br />
            <span>
              GRAVADAS: ${formatCurrency(
                Number(data?.Factura.total ?? 0) - calculateIVA(data?.Factura?.total || 0)
              )}
            </span><br />
            <span>IVA: ${formatCurrency(calculateIVA(data?.Factura?.total || 0))}</span><br />
            <span>SUB_TOTAL: ${formatCurrency(Number(data?.Factura?.total))}</span><br />
            <span>EXENTAS: $0.00</span><br />
            <span>NO SUJETAS: $0.00</span><br />
            <span>TOTAL: ${formatCurrency(Number(data?.Factura?.total))}</span><br />
          </div>
          <br />
          <span>------------------------------------</span><br />
          <span>------------------------------------</span<br />
          <div className="w-full">
            <span>VENTAS CON CRÉDITO FISCAL</span><br />
            <span>N. INICIAL: ${data?.CreditoFiscal?.inicio}</span><br />
            <span>N. FINAL: ${data?.CreditoFiscal?.fin}</span><br />
            <span>
              GRAVADAS: ${formatCurrency(
                Number(data?.CreditoFiscal.total ?? 0) -
                  calculateIVA(data?.CreditoFiscal?.total || 0)
              )}
            </span><br />
            <span>IVA: ${formatCurrency(calculateIVA(data?.CreditoFiscal?.total || 0))}</span><br />
            <span>SUB_TOTAL: ${formatCurrency(Number(data?.CreditoFiscal?.total))}</span><br />
            <span>EXENTAS: $0.00</span><br />
            <span>NO SUJETAS: $0.00</span><br />
            <span>TOTAL: ${formatCurrency(Number(data?.CreditoFiscal?.total))}</span><br />
          </div>
          <br />
          <span>------------------------------------</span><br />
          <span>------------------------------------</span<br />
          <div className="w-full">
            <span>DEVOLUCIONES CON NOTA DE CRÉDITO</span><br />
            <span>N. INICIAL: ${data?.DevolucionNC?.inicio}</span><br />
            <span>N. FINAL: ${data?.DevolucionNC?.fin}</span><br />
            <span>
              GRAVADAS: ${formatCurrency(
                Number(data?.DevolucionNC.total ?? 0) - calculateIVA(data?.DevolucionNC?.total || 0)
              )}
            </span><br />
            <span>IVA: ${formatCurrency(calculateIVA(data?.DevolucionNC?.total || 0))}</span><br />
            <span>SUB_TOTAL: ${formatCurrency(Number(data?.DevolucionNC?.total))}</span><br />
            <span>EXENTAS: $0.00</span><br />
            <span>NO SUJETAS: $0.00</span><br />
            <span>TOTAL: ${formatCurrency(Number(data?.DevolucionNC?.total))}</span><br />
          </div>
          <br />
          <span>------------------------------------</span><br />
          <span>------------------------------------</span<br />
          <div className="w-full">
            <span>DEVOLUCIONES CON TICKET</span><br />
            <span>N. INICIAL: ${data?.DevolucionT?.inicio}</span><br />
            <span>N. FINAL: ${data?.DevolucionT?.fin}</span><br />
            <span>
              GRAVADAS: ${formatCurrency(
                Number(data?.DevolucionT.total ?? 0) - calculateIVA(data?.DevolucionT?.total || 0)
              )}
            </span><br />
            <span>IVA: ${formatCurrency(calculateIVA(data?.DevolucionT?.total || 0))}</span><br />
            <span>SUB_TOTAL: ${formatCurrency(Number(data?.DevolucionT?.total))}</span><br />
            <span>EXENTAS: $0.00</span><br />
            <span>NO SUJETAS: $0.00</span><br />
            <span>TOTAL: ${formatCurrency(Number(data?.DevolucionT?.total))}</span><br />
          </div>
          <br />
          <br />
          <div>
            <span>TOTAL GENERAL</span><br />
            <span>GRAVADAS: ${formatCurrency(totalGeneral - totalGeneral * 0.13)}</span><br />
            <span>IVA: ${formatCurrency(totalGeneral * 0.13)}</span><br />
            <span>SUB-TOTAL: ${formatCurrency(totalGeneral)}</span><br />
            <span>EXENTAS:</span><br />
            <span>NO SUJETAS:</span><br />
            <span>RETENCIONES:</span><br />
            <span>TOTAL: ${formatCurrency(totalGeneral)}</span>
          </div>
        </div>
      `;
      const div = document.createElement('div');
      div.innerHTML = customContent;
      body.appendChild(div);

      iframe.contentWindow?.print();
    });
  };

  const exportDataToExcel = () => {
    const data_convert = [
      {
        descripcion: '',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: '==============================================',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: 'DETALLE VENTAS POR COMPROBANTE',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: '==============================================',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: 'VENTAS CON TICKET',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `No. INICIAL: ${data?.Ticket.inicio}`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `No. FINAL: ${data?.Ticket.fin}`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `GRAVADAS:`,
        cantidad: 0,
        total: Number(data?.Ticket.total) - Number(data?.Ticket.total) * 0.13,
      },
      {
        descripcion: `IVA:`,
        cantidad: 0,
        total: Number(data?.Ticket.total) * 0.13,
      },
      {
        descripcion: `SUB-TOTAL:`,
        cantidad: 0,
        total: Number(data?.Ticket.total),
      },
      {
        descripcion: `EXENTAS:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `NO-SUJETAS:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `TOTAL:`,
        cantidad: 0,
        total: data?.Ticket.total,
      },
      {
        descripcion: '',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: 'VENTAS CON FACTURA',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `No. INICIAL: ${data?.Factura.inicio}`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `No. FINAL: ${data?.Factura.fin}`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `GRAVADAS:`,
        cantidad: 0,
        total: Number(data?.Factura.total) - Number(data?.Factura.total) * 0.13,
      },
      {
        descripcion: `IVA:`,
        cantidad: 0,
        total: Number(data?.Factura.total) * 0.13,
      },
      {
        descripcion: `SUB-TOTAL:`,
        cantidad: 0,
        total: Number(data?.Factura.total),
      },
      {
        descripcion: `EXENTAS:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `NO-SUJETAS:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `TOTAL:`,
        cantidad: 0,
        total: data?.Factura.total,
      },
      {
        descripcion: '',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: 'VENTAS CON CRÉDITO FISCAL',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `No. INICIAL: ${data?.CreditoFiscal.inicio}`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `No. FINAL: ${data?.CreditoFiscal.fin}`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `GRAVADAS:`,
        cantidad: 0,
        total: Number(data?.CreditoFiscal.total) - Number(data?.CreditoFiscal.total) * 0.13,
      },
      {
        descripcion: `IVA:`,
        cantidad: 0,
        total: Number(data?.CreditoFiscal.total) * 0.13,
      },
      {
        descripcion: `SUB-TOTAL:`,
        cantidad: 0,
        total: Number(data?.CreditoFiscal.total),
      },
      {
        descripcion: `EXENTAS:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `NO-SUJETAS:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `TOTAL:`,
        cantidad: 0,
        total: data?.CreditoFiscal.total,
      },
      {
        descripcion: '',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: 'DEVOLUCIONES CON NOTA DE CRÉDITO',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `No. INICIAL: ${data?.DevolucionNC.inicio}`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `No. FINAL: ${data?.DevolucionNC.fin}`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `GRAVADAS:`,
        cantidad: 0,
        total: Number(data?.DevolucionNC.total) - Number(data?.DevolucionNC.total) * 0.13,
      },
      {
        descripcion: `IVA:`,
        cantidad: 0,
        total: Number(data?.DevolucionNC.total) * 0.13,
      },
      {
        descripcion: `SUB-TOTAL:`,
        cantidad: 0,
        total: Number(data?.DevolucionNC.total),
      },
      {
        descripcion: `EXENTAS:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `NO-SUJETAS:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `TOTAL:`,
        cantidad: 0,
        total: data?.DevolucionNC.total,
      },
      {
        descripcion: '',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: 'DEVOLUCIONES CON TICKET',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `No. INICIAL: ${data?.DevolucionT.inicio}`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `No. FINAL: ${data?.DevolucionT.fin}`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `GRAVADAS:`,
        cantidad: 0,
        total: Number(data?.DevolucionT.total) - Number(data?.DevolucionT.total) * 0.13,
      },
      {
        descripcion: `IVA:`,
        cantidad: 0,
        total: Number(data?.DevolucionT.total) * 0.13,
      },
      {
        descripcion: `SUB-TOTAL:`,
        cantidad: 0,
        total: Number(data?.DevolucionT.total),
      },
      {
        descripcion: `EXENTAS:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `NO-SUJETAS:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `TOTAL:`,
        cantidad: 0,
        total: data?.DevolucionT.total,
      },
      {
        descripcion: '',
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `TOTAL GENERAL:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `GRAVADAS:`,
        cantidad: 0,
        total: Number(data?.totalGeneral) - Number(data?.totalGeneral) * 0.13,
      },
      {
        descripcion: `IVA:`,
        cantidad: 0,
        total: Number(data?.totalGeneral) * 0.13,
      },
      {
        descripcion: `SUB-TOTAL:`,
        cantidad: 0,
        total: Number(data?.totalGeneral) - Number(data?.totalGeneral) * 0.13,
      },
      {
        descripcion: `EXENTAS:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `NO SUJETAS:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `RETENCIONES:`,
        cantidad: 0,
        total: 0,
      },
      {
        descripcion: `TOTAL:`,
        cantidad: 0,
        total: data?.totalGeneral,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data_convert);
    const currencyFormat = '"$"#,##0.00';

    Object.keys(worksheet).forEach((cell) => {
      if (cell.startsWith('C') && !isNaN(worksheet[cell].v)) {
        worksheet[cell].z = currencyFormat;
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Corte_x_${branchName}_${Date.now()}.xlsx`);
  };

  return (
    <Layout title="Corte de X">
      <div className=" w-full h-full p-10 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border-white border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex flex-col justify-between w-full gap-5 flex-row lg:gap-0">
            <div className="flex flex-col items-center p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                <Autocomplete
                  className="mt-4"
                  labelPlacement="outside"
                  label="Sucursal"
                  placeholder="Selecciona la sucursal"
                  variant="bordered"
                >
                  {branch_list.map((item) => (
                    <AutocompleteItem
                      key={item.id}
                      value={item.id}
                      onClick={() => {
                        setBranchId(item.id);
                        setBranchName(item.name);
                        setBranchAdress(item.address);
                      }}
                    >
                      {item.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <Autocomplete
                  className="mt-4"
                  labelPlacement="outside"
                  placeholder="Selecciona el punto de venta"
                  variant="bordered"
                  label="Punto de Venta"
                >
                  {codeSale
                    .filter((item) => item.typeVoucher === 'T')
                    .map((item) => (
                      <AutocompleteItem onClick={() => setCodeSelected(item.code)} key={item.code}>
                        {item.code}
                      </AutocompleteItem>
                    ))}
                </Autocomplete>
              </div>

              <div className="flex flex-col items-center w-full h-full p-4 mt-4  rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {actionsView.includes('Exportar Excel') && (
                    <Button
                      color="success"
                      startContent={<PiMicrosoftExcelLogoBold size={25} />}
                      onClick={exportDataToExcel}
                      className="w-full"
                    >
                      Exportar a excel
                    </Button>
                  )}
                  {actionsView.includes('Imprimir') && (
                    <Button
                      className="w-full"
                      style={global_styles().secondaryStyle}
                      onClick={() => printCutX()}
                      startContent={<IoPrintSharp size={25} />}
                    >
                      Imprimir y cerrar
                    </Button>
                  )}
                </div>
                <div className="mt-4 bg-white dark:bg-gray-800 w-full max-w-lg h-full overflow-y-auto flex flex-col items-center p-5 rounded-2xl">
                  <h1 className="text-black dark:text-white">MADNESS</h1>
                  <h1 className="text-black dark:text-white">
                    {branchName || user?.correlative.branch.name}
                  </h1>
                  <h1 className="text-black dark:text-white">{user?.correlative.branch.address}</h1>

                  <h1 className="text-black dark:text-white">GIRO: VENTA AL POR MENOR DE ROPA</h1>
                  <h1 className="text-black dark:text-white">
                    FECHA: {dateInitial} - {dateEnd}
                  </h1>
                  <h1 className="text-black dark:text-white">
                    PUNTO DE VENTA: {codeSelected ? codeSelected : 'GENERAL'}
                  </h1>
                  <br />
                  <h1 className="text-black dark:text-white">
                    ---------------------------------------------------------------------
                  </h1>
                  <h1 className="text-black dark:text-white">
                    ---------------------------------------------------------------------
                  </h1>
                  <div className="w-full">
                    <h1 className="text-black dark:text-white">VENTAS CON TICKET</h1>
                    <h1 className="text-black dark:text-white">
                      N. INICIAL: {data?.Ticket?.inicio}
                    </h1>
                    <h1 className="text-black dark:text-white">N. FINAL: {data?.Ticket?.fin}</h1>
                    <h1 className="text-black dark:text-white">GRAVADAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">
                      IVA: {calculateIVA(data?.Ticket?.total || 0).toFixed(2)}
                    </h1>
                    <h1 className="text-black dark:text-white">
                      SUB_TOTAL: {formatCurrency(Number(data?.Ticket?.total.toFixed(2)))}
                    </h1>
                    <h1 className="text-black dark:text-white">EXENTAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">NO SUJETAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">
                      TOTAL: {formatCurrency(Number(data?.Ticket?.total.toFixed(2)))}
                    </h1>
                  </div>
                  <br />
                  <h1 className="text-black dark:text-white">
                    ---------------------------------------------------------------------
                  </h1>
                  <h1 className="text-black dark:text-white">
                    ---------------------------------------------------------------------
                  </h1>
                  <div className="w-full">
                    <h1 className="text-black dark:text-white">VENTAS CON FACTURA</h1>
                    <h1 className="text-black dark:text-white">
                      N. INICIAL: {data?.Factura?.inicio}
                    </h1>
                    <h1 className="text-black dark:text-white">N. FINAL: {data?.Factura?.fin}</h1>
                    <h1 className="text-black dark:text-white">GRAVADAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">
                      IVA: {calculateIVA(data?.Factura?.total || 0).toFixed(2)}
                    </h1>
                    <h1 className="text-black dark:text-white">
                      SUB_TOTAL: {formatCurrency(Number(data?.Factura?.total))}
                    </h1>
                    <h1 className="text-black dark:text-white">EXENTAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">NO SUJETAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">
                      TOTAL: {formatCurrency(Number(data?.Factura?.total.toFixed(2)))}
                    </h1>
                  </div>
                  <br />
                  <h1 className="text-black dark:text-white">
                    ---------------------------------------------------------------------
                  </h1>
                  <h1 className="text-black dark:text-white">
                    ---------------------------------------------------------------------
                  </h1>
                  <div className="w-full">
                    <h1 className="text-black dark:text-white">VENTAS CON CRÉDITO FISCAL</h1>
                    <h1 className="text-black dark:text-white">
                      N. INICIAL: {data?.CreditoFiscal?.inicio}
                    </h1>
                    <h1 className="text-black dark:text-white">
                      N. FINAL: {data?.CreditoFiscal?.fin}
                    </h1>
                    <h1 className="text-black dark:text-white">GRAVADAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">
                      IVA: {calculateIVA(data?.CreditoFiscal?.total || 0).toFixed(2)}
                    </h1>
                    <h1 className="text-black dark:text-white">
                      SUB_TOTAL: {formatCurrency(Number(data?.CreditoFiscal?.total))}
                    </h1>
                    <h1 className="text-black dark:text-white">EXENTAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">NO SUJETAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">
                      TOTAL: {formatCurrency(Number(data?.CreditoFiscal?.total))}
                    </h1>
                  </div>
                  <br />
                  <h1 className="text-black dark:text-white">
                    ---------------------------------------------------------------------
                  </h1>
                  <h1 className="text-black dark:text-white">
                    ---------------------------------------------------------------------
                  </h1>
                  <div className="w-full">
                    <h1 className="text-black dark:text-white">DEVOLUCIONES CON NOTA DE CRÉDITO</h1>
                    <h1 className="text-black dark:text-white">
                      N. INICIAL: {data?.DevolucionNC?.inicio}
                    </h1>
                    <h1 className="text-black dark:text-white">
                      N. FINAL: {data?.DevolucionNC?.fin}
                    </h1>
                    <h1 className="text-black dark:text-white">GRAVADAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">
                      IVA: {calculateIVA(data?.DevolucionNC?.total || 0).toFixed(2)}
                    </h1>
                    <h1 className="text-black dark:text-white">
                      SUB_TOTAL: {formatCurrency(Number(data?.DevolucionNC?.total.toFixed(2)))}
                    </h1>
                    <h1 className="text-black dark:text-white">EXENTAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">NO SUJETAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">
                      TOTAL: {formatCurrency(Number(data?.DevolucionNC?.total.toFixed(2)))}
                    </h1>
                  </div>
                  <br />
                  <h1 className="text-black dark:text-white">
                    ---------------------------------------------------------------------
                  </h1>
                  <h1 className="text-black dark:text-white">
                    ---------------------------------------------------------------------
                  </h1>
                  <div className="w-full">
                    <h1 className="text-black dark:text-white">DEVOLUCIONES CON TICKET</h1>
                    <h1 className="text-black dark:text-white">
                      N. INICIAL: {data?.DevolucionT?.inicio}
                    </h1>
                    <h1 className="text-black dark:text-white">
                      N. FINAL: {data?.DevolucionT?.fin}
                    </h1>
                    <h1 className="text-black dark:text-white">GRAVADAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">
                      IVA: {calculateIVA(data?.DevolucionT?.total || 0)}
                    </h1>
                    <h1 className="text-black dark:text-white">
                      SUB_TOTAL: {formatCurrency(Number(data?.DevolucionT?.total.toFixed(2)))}
                    </h1>
                    <h1 className="text-black dark:text-white">EXENTAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">NO SUJETAS: $0.00</h1>
                    <h1 className="text-black dark:text-white">
                      TOTAL: {formatCurrency(Number(data?.DevolucionT?.total.toFixed(2)))}
                    </h1>
                  </div>
                  <br />
                  <br />
                  <div className="w-full">
                    <h1 className="text-black dark:text-white">TOTAL GENERAL</h1>
                    <h1 className="text-black dark:text-white">
                      GRAVADAS: {formatCurrency(totalGeneral - totalGeneral * 0.13)}
                    </h1>
                    <h1 className="text-black dark:text-white">
                      IVA: {formatCurrency(totalGeneral * 0.13)}
                    </h1>
                    <h1 className="text-black dark:text-white">
                      SUB-TOTAL: {formatCurrency(totalGeneral)}
                    </h1>
                    <h1 className="text-black dark:text-white">EXENTAS:</h1>
                    <h1 className="text-black dark:text-white">NO SUJETAS:</h1>
                    <h1 className="text-black dark:text-white">RETENCIONES:</h1>
                    <h1 className="text-black dark:text-white">
                      TOTAL: {formatCurrency(totalGeneral)}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CashCutsX;
