
import { useContext, useEffect, useState } from "react"
import { AutocompleteItem, Button, Input } from "@nextui-org/react"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { toast } from "sonner"

import { global_styles } from "../styles/global.styles"
import { ThemeContext } from "../hooks/useTheme"
import { CloseZ, ZCashCutsResponse } from "../types/cashCuts.types"
import { useAuthStore } from "../store/auth.store"
import { close_x, get_cashCuts } from "../services/facturation/cashCuts.service"
import ModalGlobal from "../components/global/ModalGlobal"
import { useBranchesStore } from '../store/branches.store';
import { AutoComplete } from "primereact/autocomplete"
interface CashCutsProps {
  isOpen: boolean
  onClose: () => void
}
const CushCatsX = (props: CashCutsProps) => {
  const getFormattedDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getInitialAndEndDate = () => {
    const today = new Date()
    const initialDate = new Date(today.getFullYear(), today.getMonth(), 1)
    const endDate = today
    return {
      initial: getFormattedDate(initialDate),
      end: getFormattedDate(endDate)
    }
  }
  const { theme } = useContext(ThemeContext)
  const [data, setData] = useState<ZCashCutsResponse | null>(null)
  const { user } = useAuthStore()
  const { initial, end } = getInitialAndEndDate()
  const [dateInitial, setInitial] = useState(initial)
  const [dateEnd] = useState(end)
  const [branchId, setBranch] = useState(1)
  useEffect(() => {
   
    const getIdBranch = async () => {
      try {
        const response = await get_cashCuts(branchId, dateInitial, dateEnd)
        setData(response.data.data)
      } catch (error) {
        console.error("Error fetching cash cuts:", error)
      }
    }
    getIdBranch()
  }, [dateInitial, dateEnd, branchId])
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary
  }
  const calculateIVA = (total: number) => total * 0.13
  const calculateGravadas = (total: number) => total / 1.13

  const tableData = data
    ? [
      {
        type: "Ticket",
        inicio: data.Ticket?.inicio || 0,
        fin: data.Ticket?.fin || 0,
        total: data.Ticket?.total || 0,
        gravadas: calculateGravadas(data.Ticket?.total || 0),
        iva: calculateIVA(data.Ticket?.total || 0),
        subTotal: data.Ticket?.total || 0,
        exentas: 0,
        noSujetas: 0
      },
      {
        type: "Factura",
        inicio: data.Factura?.inicio || 0,
        fin: data.Factura?.fin || 0,
        total: data.Factura?.total || 0,
        gravadas: calculateGravadas(data.Factura?.total || 0),
        iva: calculateIVA(data.Factura?.total || 0),
        subTotal: data.Factura?.total || 0,
        exentas: 0,
        noSujetas: 0
      },
      {
        type: "Credito Fiscal",
        inicio: data.CreditoFiscal?.inicio || 0,
        fin: data.CreditoFiscal?.fin || 0,
        total: data.CreditoFiscal?.total || 0,
        gravadas: calculateGravadas(data.CreditoFiscal?.total || 0),
        iva: calculateIVA(data.CreditoFiscal?.total || 0),
        subTotal: data.CreditoFiscal?.total || 0,
        exentas: 0,
        noSujetas: 0
      },
      {
        type: "Devolucion NC",
        inicio: data.DevolucionNC?.inicio || 0,
        fin: data.DevolucionNC?.fin || 0,
        total: data.DevolucionNC?.total || 0,
        gravadas: calculateGravadas(data.DevolucionNC?.total || 0),
        iva: calculateIVA(data.DevolucionNC?.total || 0),
        subTotal: data.DevolucionNC?.total || 0,
        exentas: 0,
        noSujetas: 0
      },
      {
        type: "Devolucion T",
        inicio: data.DevolucionT?.inicio || 0,
        fin: data.DevolucionT?.fin || 0,
        total: data.DevolucionT?.total || 0,
        gravadas: calculateGravadas(data.DevolucionT?.total || 0),
        iva: calculateIVA(data.DevolucionT?.total || 0),
        subTotal: data.DevolucionT?.total || 0,
        exentas: 0,
        noSujetas: 0
      }
    ]
    : []

  // const totalGeneral = data ? data.totalGeneral : 0
  // const totalGravadas = tableData.reduce((acc, item) => acc + item.gravadas, 0)
  // const totalIVA = tableData.reduce((acc, item) => acc + item.iva, 0)
  // const totalSubTotal = tableData.reduce((acc, item) => acc + item.subTotal, 0)
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
      typeCut: "BIGZ",
      inicioCF: data?.CreditoFiscal?.inicio || 0,
      finCF: data?.CreditoFiscal?.fin || 0,
      totalCF: data?.CreditoFiscal?.total || 0,
      inicioDevNC: data?.DevolucionNC?.inicio || 0,
      finDevNC: data?.DevolucionNC?.fin || 0,
      totalDevNC: data?.DevolucionNC?.total || 0,
      ivaDevTkt: calculateIVA(data?.DevolucionT?.total || 0),
      totalDevTkt: data?.DevolucionT?.total || 0,
      totalGeneral: data
        ? data.Ticket?.total || 0 +
        data.Factura?.total || 0 +
        data.CreditoFiscal?.total || 0 +
        data.DevolucionNC?.total || 0 +
        data.DevolucionT?.total || 0
        : 0,
    };

    try {
      await close_x(payload);
      toast.success("Corte de Caja Generado");
      props.onClose()
      window.location.reload()
     
    } catch (error) {
      toast.error("Error al generar el corte de caja");
    }
  };
  const {getBranchesList,branch_list} = useBranchesStore()
  useEffect(() => {
    getBranchesList() 
  }, [])
  return (
    <>
      <ModalGlobal 
        size="w-full h-full p-5 bg-gray-200 dark:bg-gray-800"
        title=" Corte de Caja Gran Z"
        isOpen={props.isOpen}
        onClose={() => props.onClose()}
      >
        <div className="mt-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <Input className="mt-4" type="date" onChange={(e) => setInitial(e.target.value)} />
        </div>
        <div className="mt-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <Input className="mt-4" type="date" onChange={(e) => setInitial(e.target.value)} />
        </div>
        <div className="mt-4"></div>
        {branch_list.map((item) => (
            <AutoComplete value={item.id} onChange={(e) => setBranch(e.target.value)}>
            <AutocompleteItem key={item.id} value={item.id} onClick={() => setBranch(item.id)}>
              {item.name}
            </AutocompleteItem>
        </AutoComplete>
        ))}
        <DataTable
          value={tableData}
          className="shadow dark:text-white"
          emptyMessage="No se encontraron resultados"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="type"
            header="Tipo de Vale"
          />
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="inicio"
            header="Inicio"
          />
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="fin"
            header="Fin"
          />
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="total"
            header="Total"
          />
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="gravadas"
            header="Gravadas"
          />
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="iva"
            header="IVA"
          />
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="subTotal"
            header="Sub-Total"
          />
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="exentas"
            header="Exentas"
          />
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="noSujetas"
            header="No Sujetas"
          />
        </DataTable>
        <div className="flex justify-end mt-4">
          <Button style={global_styles().secondaryStyle} onClick={() => print()}>
            Imprimir
          </Button>
        </div>
      </ModalGlobal>
    </>
  )
}

export default CushCatsX
