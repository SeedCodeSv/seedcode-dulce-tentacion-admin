import EmptyTable from "@/components/global/EmptyTable";
import LoadingTable from "@/components/global/LoadingTable";
import { useCutReportStore } from "@/store/reports/cashCuts.store";
import { TableComponent } from "@/themes/ui/table-ui";
import TdGlobal from "@/themes/ui/td-global";
import { formatDateSimple } from "@/utils/dates";
import { formatCurrency } from "@/utils/dte";

export default function SummaryCutReportTable() {
    const { cashCutsSummary, loadindSummary } = useCutReportStore()

    return (
        <TableComponent
            className="overflow-auto"
            headers={['Dias', 'Sum.Total Venta', 'Sum.Total Efectivo', 'Sum.Total Tarjeta', 'Sum.Otro Tipo de Pago', 'Sum.Entregado Efectivo', 'Sum.Gastos']}
        >
            {loadindSummary ? (
                <tr>
                    <TdGlobal className="p-3 text-sm text-center text-slate-500" colSpan={11}>
                        <LoadingTable />
                    </TdGlobal>
                </tr>
            ) : cashCutsSummary.cash_cuts_summary.length === 0 ? (
                <tr>
                    <TdGlobal className="p-3 text-sm text-center text-slate-500" colSpan={11}>
                        <EmptyTable />
                    </TdGlobal>
                </tr>
            ) : (
                cashCutsSummary.cash_cuts_summary.map((item, index) => (
                    <tr key={index} className="border-b dark:border-slate-600 border-slate-200 p-3">
                        <TdGlobal className="p-3">{formatDateSimple(item.date)} </TdGlobal>
                        <TdGlobal className="p-3">{formatCurrency(Number(item.sumTotalSales))}</TdGlobal>
                        <TdGlobal className="p-3">{formatCurrency(Number(item.sumTotalCash ?? 0))}</TdGlobal>
                        <TdGlobal className="p-3">{formatCurrency(Number(item.sumTotalCard ?? 0))}</TdGlobal>
                        <TdGlobal className="p-3">{formatCurrency(Number(item.sumTotalOthers ?? 0))}</TdGlobal>
                        <TdGlobal
                            className="p-3"
                            title={
                                Number(item.sumCashDelivered) > Number(item.sumTotalSales)
                                    ? `La Sum.Entregado Efectivo ${formatCurrency(Number(item.sumCashDelivered))} es mayor porque los Totales Entregados individuales son: ${item.writtenTotals
                                        ?.map((i) => formatCurrency(i))
                                        .join(', ')
                                    }, sumando un total de ${formatCurrency(
                                        item.writtenTotals?.reduce((acc, val) => acc + val, 0) ?? 0
                                    )}.`
                                    : ''
                            }
                        >{formatCurrency(Number(item.sumCashDelivered ?? 0))}</TdGlobal>
                        <TdGlobal className="p-3">{formatCurrency(Number(item.sumExpenses ?? 0))}</TdGlobal>
                    </tr>
                ))

            )
            }

        </TableComponent >
    )
}