import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { toast } from 'sonner';
import { global_styles } from '../styles/global.styles';
import { CloseZ, ZCashCutsResponse } from '../types/cashCuts.types';
import { useAuthStore } from '../store/auth.store';
import { close_x, get_cashCuts } from '../services/facturation/cashCuts.service';
import HeadlessModal from '../components/global/HeadlessModal';
import { useBranchesStore } from '../store/branches.store';
import { getInitialAndEndDate } from '../utils/dates';
import { formatCurrency } from '../utils/dte';
import { Correlatives } from '../types/correlatives.types';
import { get_correlatives } from '../services/correlatives.service';

interface CashCutsProps {
  isOpen: boolean;
  onClose: () => void;
}
const CushCatsBigZ = (props: CashCutsProps) => {
  const [data, setData] = useState<ZCashCutsResponse | null>(null);
  const { user } = useAuthStore();
  const { initial, end } = getInitialAndEndDate();
  const [dateInitial, setInitial] = useState(initial);
  const [dateEnd, setEnd] = useState(end);
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
        console.error('Error fetching cash cuts:', error);
      }
      if (branchId > 0) {
        const data = await get_correlatives(branchId);
        setCodeSale(data.data.correlatives);
      }
    };
    getIdBranch();
  }, [dateInitial, dateEnd, branchId]);

  const calculateIVA = (total: number) => total * 0.13;

  const print = async () => {
    const payload: CloseZ = {
      posId: user?.correlative.id || 0,
      numberCut: (user?.correlative.next ?? 0) + 1,
      inicioTkt: data?.Ticket?.inicio || 0,
      finTkt: data?.Ticket?.fin || 0,
      totalTkt: data?.Ticket?.total || 0,
      inicioF: data?.Factura?.inicio || 0,
      finF: data?.Factura?.fin || 0,
      totalF: data?.Factura?.total || 0,
      typeCut: 'BIGZ',
      inicioCF: data?.CreditoFiscal?.inicio || 0,
      finCF: data?.CreditoFiscal?.fin || 0,
      totalCF: data?.CreditoFiscal?.total || 0,
      inicioDevNC: data?.DevolucionNC?.inicio || 0,
      finDevNC: data?.DevolucionNC?.fin || 0,
      totalDevNC: data?.DevolucionNC?.total || 0,
      ivaDevTkt: calculateIVA(data?.DevolucionT?.total || 0),
      totalDevTkt: data?.DevolucionT?.total || 0,
      totalGeneral: data
        ? data.Ticket?.total ||
          0 + data.Factura?.total ||
          0 + data.CreditoFiscal?.total ||
          0 + data.DevolucionNC?.total ||
          0 + data.DevolucionT?.total ||
          0
        : 0,
    };
    try {
      await close_x(payload);
      toast.success('Reporte Generado');
      props.onClose();
    } catch (error) {
      toast.error('Error al generar el corte de caja');
    }
  };
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
  return (
    <>
      <HeadlessModal
        size="h-screen"
        isFull={true}
        title=" Corte de Caja Gran Z"
        isOpen={props.isOpen}
        onClose={() => props.onClose()}
      >
        <div className="grid grid-cols-4  gap-4">
          <Input
            value={initial}
            label="Fecha Inicio"
            className="mt-4"
            type="date"
            onChange={(e) => setInitial(e.target.value)}
          />
          <Input
            label="Fecha Final"
            value={end}
            className="mt-4"
            type="date"
            onChange={(e) => setEnd(e.target.value)}
          />
          <Autocomplete
            className="w-full  order-3 mt-4"
            labelPlacement="outside"
            label="Sucursal"
            placeholder="Selecciona la sucursal"
            variant="bordered"
          >
            {branch_list.map((item) => (
              <AutocompleteItem key={item.id} value={item.id} onClick={() => {
                setBranch(item.id);
                setBranchName(item.name);
              }}>
                {item.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Autocomplete
            className="w-full  order-3 mt-4"
            labelPlacement="outside"
            placeholder="Selecciona el punto de venta"
            variant="bordered"
            label="Punto de Venta"
          >
            {codeSale.map((item) => (
              <AutocompleteItem onClick={() => setCodeSelected(item.code)} key={item.id}>
                {item.code}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full p-5 mt-4 bg-gray-600">
          <div className="grid grid-cols-2 gap-4 w-[500px] mt-4">
            <Button
              className="w-full"
              style={global_styles().secondaryStyle}
              onClick={() => print()}
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
          <div className="mt-4 bg-white w-[500px] h-full overflow-y-auto flex items-center justify-center flex-col p-5 rounded-2xl">
            <h1>MADNESS</h1>
            <h1>{branchName || user?.correlative.branch.name}</h1>
            <h1>{user?.correlative.branch.address}</h1>
            <h1>Creado por: {user?.userName}</h1>
            <h1>GIRO: VENTA AL POR MENOR DE ROPA</h1>
            <h1>
              FECHA: {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
            </h1>
            <br />
            <h1>---------------------------------------------------------------------</h1>
            <h1>---------------------------------------------------------------------</h1>
            <div className="w-full">
              <h1>VENTAS CON TICKET</h1>
              <h1>N. INICIAL: {data?.Ticket?.inicio}</h1>
              <h1>N. FINAL: {data?.Ticket?.fin}</h1>
              <h1>GRAVADAS: $0.00</h1>
              <h1>IVA: {calculateIVA(data?.Ticket?.total || 0)}</h1>
              <h1>SUB_TOTAL: {formatCurrency(Number(data?.Ticket?.total))}</h1>
              <h1>EXENTAS: $0.00</h1>
              <h1>NO SUJETAS: $0.00</h1>
              <h1>TOTAL: {formatCurrency(Number(data?.Ticket?.total))}</h1>
            </div>
            <br />
            <h1>---------------------------------------------------------------------</h1>
            <h1>---------------------------------------------------------------------</h1>
            <div className="w-full">
              <h1>VENTAS CON FACTURA</h1>
              <h1>N. INICIAL: {data?.Factura?.inicio}</h1>
              <h1>N. FINAL: {data?.Factura?.fin}</h1>
              <h1>GRAVADAS: $0.00</h1>
              <h1>IVA: {calculateIVA(data?.Factura?.total || 0)}</h1>
              <h1>SUB_TOTAL: {formatCurrency(Number(data?.Factura?.total))}</h1>
              <h1>EXENTAS: $0.00</h1>
              <h1>NO SUJETAS: $0.00</h1>
              <h1>TOTAL: {formatCurrency(Number(data?.Factura?.total))}</h1>
            </div>
            <br />
            <h1>---------------------------------------------------------------------</h1>
            <h1>---------------------------------------------------------------------</h1>
            <div className="w-full">
              <h1>VENTAS CON CRÉDITO FISCAL</h1>
              <h1>N. INICIAL: {data?.CreditoFiscal?.inicio}</h1>
              <h1>N. FINAL: {data?.CreditoFiscal?.fin}</h1>
              <h1>GRAVADAS: $0.00</h1>
              <h1>IVA: {calculateIVA(data?.CreditoFiscal?.total || 0)}</h1>
              <h1>SUB_TOTAL: {formatCurrency(Number(data?.CreditoFiscal?.total))}</h1>
              <h1>EXENTAS: $0.00</h1>
              <h1>NO SUJETAS: $0.00</h1>
              <h1>TOTAL: {formatCurrency(Number(data?.CreditoFiscal?.total))}</h1>
            </div>
            <br />
            <h1>---------------------------------------------------------------------</h1>
            <h1>---------------------------------------------------------------------</h1>
            <div className="w-full">
              <h1>DEVOLUCIONES CON NOTA DE CRÉDITO</h1>
              <h1>N. INICIAL: {data?.DevolucionNC?.inicio}</h1>
              <h1>N. FINAL: {data?.DevolucionNC?.fin}</h1>
              <h1>GRAVADAS: $0.00</h1>
              <h1>IVA: {calculateIVA(data?.DevolucionNC?.total || 0)}</h1>
              <h1>SUB_TOTAL: {formatCurrency(Number(data?.DevolucionNC?.total))}</h1>
              <h1>EXENTAS: $0.00</h1>
              <h1>NO SUJETAS: $0.00</h1>
              <h1>TOTAL: {formatCurrency(Number(data?.DevolucionNC?.total))}</h1>
            </div>
            <br />
            <h1>---------------------------------------------------------------------</h1>
            <h1>---------------------------------------------------------------------</h1>
            <div className="w-full">
              <h1>DEVOLUCIONES CON TICKET</h1>
              <h1>N. INICIAL: {data?.DevolucionT?.inicio}</h1>
              <h1>N. FINAL: {data?.DevolucionT?.fin}</h1>
              <h1>GRAVADAS: $0.00</h1>
              <h1>IVA: {calculateIVA(data?.DevolucionT?.total || 0)}</h1>
              <h1>SUB_TOTAL: {formatCurrency(Number(data?.DevolucionT?.total))}</h1>
              <h1>EXENTAS: $0.00</h1>
              <h1>NO SUJETAS: $0.00</h1>
              <h1>TOTAL: {formatCurrency(Number(data?.DevolucionT?.total))}</h1>
            </div>
            <br />
            <br />
            <div className="w-full">
              <h1>TOTAL GENERAL</h1>
              <h1>GRAVADAS: {formatCurrency(totalGeneral - totalGeneral * 0.13)}</h1>
              <h1>IVA: {formatCurrency(totalGeneral * 0.13)}</h1>
              <h1>SUB-TOTAL: {formatCurrency(totalGeneral)}</h1>
              <h1>EXENTAS:</h1>
              <h1>NO SUJETAS:</h1>
              <h1>RETENCIONES:</h1>
              <h1>TOTAL: ${formatCurrency(totalGeneral)}</h1>
            </div>
          </div>
        </div>
      </HeadlessModal>
    </>
  );
};

export default CushCatsBigZ;
