import EmptyTable from "@/components/global/EmptyTable";
import LoadingTable from "@/components/global/LoadingTable";
import { useCutReportStore } from "@/store/reports/cashCuts.store";
import { TableComponent } from "@/themes/ui/table-ui";
import TdGlobal from "@/themes/ui/td-global";
import { formatCurrency } from "@/utils/dte";

export default function DetailedCutTable() {
    const { cashCutsDetailed, loadingDetailed } = useCutReportStore()

    return (
        <TableComponent
            headers={['Inicio', 'Cierre', 'Total Venta', 'Efectivo', 'Tarjeta', 'Otro Tipo de Pago', 'Gastos', 'Caja Chica', 'Total Entregado', 'Diferencia', 'Cajero', 'Sucursal']}
        >
            {loadingDetailed ? (
                <tr>
                    <TdGlobal className="p-3 text-sm text-center text-slate-500" colSpan={11}>
                        <LoadingTable />
                    </TdGlobal>
                </tr>
            ) : cashCutsDetailed.cash_cuts_report.length === 0 ? (
                <tr>
                    <TdGlobal className="p-3 text-sm text-center text-slate-500" colSpan={11}>
                        <EmptyTable />
                    </TdGlobal>
                </tr>
            ) : (
                cashCutsDetailed.cash_cuts_report.map((item, index) => (
                    <tr key={index} className="border-b dark:border-slate-600 border-slate-200">
                        <TdGlobal>
                            <div className="flex justify-center">{item.startDate} - {item.statTime}</div>
                        </TdGlobal>
                        <TdGlobal >
                            <div className="flex justify-center">{item.endDate} - {item.endTime}</div>
                        </TdGlobal>
                        <TdGlobal >
                            <div className="flex justify-center">{formatCurrency(Number(item.totalSales ?? 0))}</div>
                        </TdGlobal>
                        <TdGlobal >
                            <div className="flex justify-center">{formatCurrency(Number(item.totalCash ?? 0))}</div>
                        </TdGlobal>
                        <TdGlobal >
                            <div className="flex justify-center">{formatCurrency(Number(item.totalCard ?? 0))}</div>
                        </TdGlobal>
                        <TdGlobal >
                            <div className="flex justify-center">{formatCurrency(Number(item.totalOthers ?? 0))}</div>
                        </TdGlobal>
                        <TdGlobal >
                            <div className="flex justify-center">{formatCurrency(Number(item.expenses ?? 0))}</div>
                        </TdGlobal>
                        <TdGlobal >
                            <div className="flex justify-center">{formatCurrency(Number(item.pettyCash ?? 0))}</div>
                        </TdGlobal>
                        <TdGlobal >
                            <div className="flex justify-center">{formatCurrency(Number(item.cashDelivered ?? 0))}</div>
                        </TdGlobal>
                        <TdGlobal >
                            <div className="flex justify-center">{formatCurrency(Number(item.difference ?? 0))}</div>
                        </TdGlobal>
                        <TdGlobal >
                            <div className="flex flex-col p-2 uppercase">
                                <span className="">{item.employee.firstName} {item.employee.secondName}</span>
                                <span className="">{item.employee.firstLastName} {item.employee.secondLastName}</span>
                            </div>
                        </TdGlobal>
                        <TdGlobal >
                           {item.branchName}
                        </TdGlobal>
                    </tr>
                ))

            )}

        </TableComponent>
    )
}