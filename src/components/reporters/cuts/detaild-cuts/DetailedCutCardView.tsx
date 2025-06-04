import { Card } from "@heroui/react";
import { ReactNode } from "react";
import { CircleDollarSign, Coins, CreditCardIcon, GitCompareArrows, Inbox, PackagePlus, ReceiptText } from "lucide-react";

import EmptyTable from "@/components/global/EmptyTable";
import LoadingTable from "@/components/global/LoadingTable";
import { useCutReportStore } from "@/store/reports/cashCuts.store";
import { formatCurrency } from "@/utils/dte";

export default function DetailedCutMovilView() {
    const { cashCutsDetailed, loadingDetailed } = useCutReportStore()

    const InfoLine = ({
        label,
        value,
        className = '',
        icon
    }: {
        label: string
        value: string
        className?: string
        icon?: ReactNode
    }) => (
        <div className='flex gap-2'>
            {icon}
            <div className={`flex gap-2 ${className}`}>
            <span className="text-slate-600">{label}:</span>
            <span className='font-semibold'>{value}</span>
            </div>
        </div>
    )


    return (
        <div >
            {loadingDetailed ? (
                <div className="py-6" >
                    <LoadingTable />
                </div>
            ) : cashCutsDetailed.cash_cuts_report.length === 0 ? (
                <div className="py-6">
                    <EmptyTable />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {cashCutsDetailed.cash_cuts_report.map((item, index) => (
                        <Card
                            key={index}
                            className="text-sm text-slate-700 dark:text-slate-100 p-5 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 space-y-5"
                        >
                            {/* Cajero e Info de Turno */}
                            <div className="flex flex-col gap-1">
                                <h2 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                                    {item.employee.firstName} {item.employee.secondName} {item.employee.firstLastName} {item.employee.secondLastName}
                                </h2>
                                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4">
                                    <span>Inicio: {item.startDate} - {item.statTime}</span>
                                    <span className="border-l border-slate-300 dark:border-slate-600 pl-4">Cierre: {item.endDate} - {item.endTime}</span>
                                </div>
                            </div>

                            {/* Total de Venta */}
                            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                                <span className="text-sm font-medium">Total Venta</span>
                                <span className="text-lg font-bold text-green-600">{formatCurrency(Number(item.totalSales ?? 0))}</span>
                            </div>

                            {/* Detalles de pagos */}
                            <div className="grid grid-cols-2 gap-4">
                                <InfoLine className="flex w-full justify-between" icon={<Coins className="text-yellow-500" size={18} />} label="Efectivo" value={formatCurrency(Number(item.totalCash ?? 0))} />
                                <InfoLine className="flex w-full justify-between" icon={<ReceiptText className="text-rose-500" size={18} />} label="Gastos" value={formatCurrency(Number(item.expenses ?? 0))} />
                                <InfoLine className="flex w-full justify-between" icon={<CreditCardIcon className="text-blue-500" size={18} />} label="Tarjeta" value={formatCurrency(Number(item.totalCard ?? 0))} />
                                <InfoLine className="flex w-full justify-between" icon={<Inbox className="text-orange-500" size={18} />} label="Caja Chica" value={formatCurrency(Number(item.pettyCash ?? 0))} />
                                <InfoLine className="flex w-full justify-between" icon={<CircleDollarSign className="text-teal-500" size={18} />} label="Otros" value={formatCurrency(Number(item.totalOthers ?? 0))} />
                                <InfoLine className="flex w-full justify-between" icon={<PackagePlus className="text-indigo-500" size={18} />} label="Entregado" value={formatCurrency(Number(item.cashDelivered ?? 0))} />
                            </div>

                            {/* Diferencia final */}
                            <div className="flex items-center justify-between text-sm font-semibold px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                                <div className="flex items-center gap-2">
                                    <GitCompareArrows className={Number(item.difference ?? 0) !== 0 ? "text-red-500" : "text-green-600"} size={18} />
                                    <span>Diferencia</span>
                                </div>
                                <span className={Number(item.difference ?? 0) !== 0 ? "text-red-500" : "text-green-600"}>
                                    {formatCurrency(Number(item.difference ?? 0))}
                                </span>
                            </div>
                        </Card>

                    ))}
                </div>
            )}

        </div>)
}