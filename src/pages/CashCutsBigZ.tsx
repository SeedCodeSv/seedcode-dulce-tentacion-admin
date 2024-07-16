import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { global_styles } from '../styles/global.styles';
import { ZCashCutsResponse } from '../types/cashCuts.types';
import { useAuthStore } from '../store/auth.store';
import { get_cashCuts } from '../services/facturation/cashCuts.service';
import HeadlessModal from '../components/global/HeadlessModal';
import { useBranchesStore } from '../store/branches.store';
import { fechaActualString } from '../utils/dates';
import { formatCurrency } from '../utils/dte';
import { Correlatives } from '../types/correlatives.types';
import { get_correlatives } from '../services/correlatives.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { IoPrintSharp } from 'react-icons/io5';
import { toast } from 'sonner';

interface CashCutsProps {
  isOpen: boolean;
  onClose: () => void;
}
const CushCatsBigZ = (props: CashCutsProps) => {
  const [data, setData] = useState<ZCashCutsResponse | null>(null);
  const { user } = useAuthStore();

  const [dateInitial, setInitial] = useState(fechaActualString);
  const [dateEnd, setEnd] = useState(fechaActualString);
  const [branchId, setBranch] = useState(0);
  const [codeSale, setCodeSale] = useState<Correlatives[]>([]);
  const [codeSelected, setCodeSelected] = useState('');
  const [branchName, setBranchName] = useState('');

  useEffect(() => {
    const getIdBranch = async () => {
      try {
        const response = await get_cashCuts(branchId, dateInitial, dateEnd, codeSelected);
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
  const { getBranchesList, branch_list } = useBranchesStore();
  useEffect(() => {
    getBranchesList();
  }, []);

  const totalGeneral = useMemo(() => {
    const totalTicket = Number(data?.Ticket?.total ?? 0);
    const totalFactura = Number(data?.Factura?.total ?? 0);
    const totalCreditoFiscal = Number(data?.CreditoFiscal?.total ?? 0);
    const totalDevolucionNC = Number(data?.DevolucionNC?.total ?? 0);
    const totalDevolucionT = Number(data?.DevolucionT?.total ?? 0);

    return totalTicket + totalFactura + totalCreditoFiscal + totalDevolucionNC + totalDevolucionT;
  }, [data]);

  const printBigZ = () => {
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
      const otherParent = document.createElement('div');
      otherParent.style.display = 'flex';
      otherParent.style.justifyContent = 'center';
      otherParent.style.alignItems = 'center';
      otherParent.style.width = '200%';
      otherParent.style.height = '200%';
      otherParent.style.padding = '5px';

      body.appendChild(otherParent);
      body.style.fontFamily = 'Arial, sans-serif';

      const customContent = `
      <div>
        <span>------------------------------------</span><br />
        <span style="text-align: right:30px;">Reporte de Ventas</span><br />
        <span>------------------------------------</span><br />
        <span>MADNESS</span<br />
        <span>${branchName || user?.correlative.branch.name}</span><br />
        <span>${user?.correlative.branch.address}</span><br />
       
        <span>GIRO: VENTA AL POR MENOR DE ROPA</span><br />
        <span>
           FECHA: ${dateInitial} - ${dateEnd} 
        </span>
          <br />
          <br />
         <span>
           PUNTO DE VENTA: ${codeSelected ? codeSelected : 'GENERAL'}
        </span>
       
        <br />
        <span>------------------------------------</span><br />
        <span>------------------------------------</span<br />
        <div class="w-full">
          <span>VENTAS CON TICKET</span><br />
          <span>N. INICIAL: ${data?.Ticket?.inicio}</span><br />
          <span>N. FINAL: ${data?.Ticket?.fin}</span><br />
          <span>GRAVADAS: $0.00</span><br />
          <span>IVA: ${calculateIVA(data?.Ticket?.total || 0)}</span><br />
          <span>SUB_TOTAL: ${formatCurrency(Number(data?.Ticket?.total.toFixed(2)))}</span><br />
          <span>EXENTAS: $0.00</span><br />
          <span>NO SUJETAS: $0.00</span><br />
          <span>TOTAL: ${formatCurrency(Number(data?.Ticket?.total))}</span><br />
        </div>
        <br />
        <span>------------------------------------</span><br />
        <span>------------------------------------</span<br />
        <div class="w-full">
          <span>VENTAS CON FACTURA</span><br />
          <span>N. INICIAL: ${data?.Factura?.inicio}</span><br />
          <span>N. FINAL: ${data?.Factura?.fin}</span><br />
          <span>GRAVADAS: $0.00</span><br />
          <span>IVA: ${calculateIVA(data?.Factura?.total || 0)}</span><br />
          <span>SUB_TOTAL: ${formatCurrency(Number(data?.Factura?.total))}</span><br />
          <span>EXENTAS: $0.00</span><br />
          <span>NO SUJETAS: $0.00</span><br />
          <span>TOTAL: ${formatCurrency(Number(data?.Factura?.total))}</span><br />
        </div>
        <br />
        <span>------------------------------------</span><br />
        <span>------------------------------------</span<br />
        <div class="w-full">
          <span>VspanTAS CON CRÉDITO FISCAL</span><br />
          <span>N. INICIAL: ${data?.CreditoFiscal?.inicio}</span><br />
          <span>N. FINAL: ${data?.CreditoFiscal?.fin}</span><br />
          <span>GRAVADAS: $0.00</span><br />
          <span>IVA: ${calculateIVA(data?.CreditoFiscal?.total || 0)}</span><br />
          <span>SUB_TOTAL: ${formatCurrency(Number(data?.CreditoFiscal?.total))}</span><br />
          <span>EXENTAS: $0.00</span><br />
          <span>NO SUJETAS: $0.00</span><br />
          <span>TOTAL: ${formatCurrency(Number(data?.CreditoFiscal?.total))}</span><br />
        </div>
        <br />
        <span>------------------------------------</span><br />
        <span>------------------------------------</span<br />
        <div class="w-full">
          <span>DEVOLUCIONES CON NOTA DE CRÉDITO</span><br />
          <span>N. INICIAL: ${data?.DevolucionNC?.inicio}</span><br />
          <span>N. FINAL: ${data?.DevolucionNC?.fin}</span><br />
          <span>GRAVADAS: $0.00</span><br />
          <span>IVA: ${calculateIVA(data?.DevolucionNC?.total || 0)}</span><br />
          <span>SUB_TOTAL: ${formatCurrency(Number(data?.DevolucionNC?.total))}</span><br />
          <span>EXENTAS: $0.00</span><br />
          <span>NO SUJETAS: $0.00</span><br />
          <span>TOTAL: ${formatCurrency(Number(data?.DevolucionNC?.total))}</span><br />
        </div>
        <br />
        <span>------------------------------------</span><br />
        <span>------------------------------------</span<br />
        <div class="w-full">
          <span>DEVOLUCIONES CON TICKET</span><br />
          <span>N. INICIAL: ${data?.DevolucionT?.inicio}</span><br />
          <span>N. FINAL: ${data?.DevolucionT?.fin}</span><br />
          <span>GRAVADAS: $0.00</span><br />
          <span>IVA: ${calculateIVA(data?.DevolucionT?.total || 0)}</span><br />
          <span>SUB_TOTAL: ${formatCurrency(Number(data?.DevolucionT?.total))}</span><br />
          <span>EXENTAS: $0.00</span><br />
          <span>NO SUJETAS: $0.00</span><br />
          <span>TOTAL: ${formatCurrency(Number(data?.DevolucionT?.total))}</span><br />
        </div>
        <br span
        <br />
        <div class="w-full">
          <span>TOTAL GENERAL</span><br />
          <span>GRAVADAS: ${formatCurrency(totalGeneral - totalGeneral * 0.13)}</span><br />
          <span>IVA: ${formatCurrency(totalGeneral * 0.13)}</span><br />
          <span>SUB-TOTAL: ${formatCurrency(totalGeneral)}</span><br />
          <span>EXENTAS:</span><br />
          <span>NO SUJETAS:</span><br />
          <span>RETENCIONES:</span><br />
          <span>TOTAL: $${formatCurrency(totalGeneral)}</span><br />
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
        Tipo: 'Factura',
        Inicio: data?.Ticket.inicio,
        Final: data?.Ticket.fin,
        Corte: data?.Ticket.total,
      },
      {
        Tipo: 'Credito Fiscal',
        Inicio: data?.CreditoFiscal.inicio,
        Final: data?.CreditoFiscal.fin,
        Corte: data?.CreditoFiscal.total,
      },
      {
        Tipo: 'Devolucion NC',
        Inicio: data?.DevolucionNC.inicio,
        Final: data?.DevolucionNC.fin,
        Corte: data?.DevolucionNC.total,
      },
      {
        Tipo: 'Devolucion T',
        Inicio: data?.DevolucionT.inicio,
        Final: data?.DevolucionT.fin,
        Corte: data?.DevolucionT.total,
      },
      {
        Tipo: 'Total General',
        Corte: data?.totalGeneral,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data_convert);
    const currencyFormat = '"$"#,##0.00';

    Object.keys(worksheet).forEach((cell) => {
      if (cell.startsWith('D') && !isNaN(worksheet[cell].v)) {
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
    saveAs(blob, `Corte_gran _z_${branchName}_${Date.now()}.xlsx`);
  };

  return (
    <>
      <HeadlessModal
        size="h-screen"
        isFull={true}
        title=" Corte de Caja Gran Z"
        isOpen={props.isOpen}
        onClose={() => props.onClose()}
      >
        <div className="flex flex-col items-center p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            <Input
              defaultValue={fechaActualString}
              label="Fecha Inicio"
              variant="bordered"
              labelPlacement="outside"
              className="mt-4"
              type="date"
              onChange={(e) => setInitial(e.target.value)}
            />
            <Input
              label="Fecha Final"
              defaultValue={fechaActualString}
              className="mt-4"
              variant="bordered"
              labelPlacement="outside"
              type="date"
              onChange={(e) => setEnd(e.target.value)}
            />
            <Autocomplete
             
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
                    setBranch(item.id);
                    setBranchName(item.name);
                  }}
                >
                  {item.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Autocomplete
            
              labelPlacement="outside"
              placeholder="Selecciona el punto de venta"
              variant="bordered"
              label="Punto de Venta"
            >
              {codeSale
                .filter((item) => item.typeVoucher === 'T')
                .map((item) => (
                  <AutocompleteItem onClick={() => setCodeSelected(item.code)} key={item.id}>
                    {item.code}
                  </AutocompleteItem>
                ))}
            </Autocomplete>
          </div>

          <div className="flex flex-col items-center w-full h-full p-4 mt-4 bg-gray-600 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <Button
                color="success"
                startContent={<PiMicrosoftExcelLogoBold size={25} />}
                onClick={exportDataToExcel}
                className="w-full"
              >
                Exportar a excel
              </Button>
              <Button
                className="w-full"
                style={global_styles().secondaryStyle}
                onClick={() => printBigZ()}
                startContent={<IoPrintSharp size={25} />}
              >
                Imprimir y cerrar
              </Button>
              <Button
                className="w-full"
                style={global_styles().dangerStyles}
                onClick={() => props.onClose()}
              >
                Cancelar
              </Button>
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
                <h1 className="text-black dark:text-white">N. INICIAL: {data?.Ticket?.inicio}</h1>
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
                <h1 className="text-black dark:text-white">N. INICIAL: {data?.Factura?.inicio}</h1>
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
                <h1 className="text-black dark:text-white">N. FINAL: {data?.CreditoFiscal?.fin}</h1>
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
                <h1 className="text-black dark:text-white">N. FINAL: {data?.DevolucionNC?.fin}</h1>
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
                <h1 className="text-black dark:text-white">N. FINAL: {data?.DevolucionT?.fin}</h1>
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
      </HeadlessModal>
    </>
  );
};

export default CushCatsBigZ;
