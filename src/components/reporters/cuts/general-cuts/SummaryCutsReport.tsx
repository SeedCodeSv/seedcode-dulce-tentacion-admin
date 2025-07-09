import { Autocomplete, AutocompleteItem, Card, CardBody, CardHeader, Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";

import SummaryCutExportExcell from "./SummaryCutExportExecll";
import SummaryCutExportPdf from "./SummaryCutExportPdf";
import SummaryCutReportTable from "./SummaryCutReportTable";

// import RenderViewButton from "@/components/global/render-view-button";
import { ResponsiveFilterWrapper } from "@/components/global/ResposiveFilters";
// import useIsMobileOrTablet from "@/hooks/useIsMobileOrTablet";
import { useBranchesStore } from "@/store/branches.store";
import { useCutReportStore } from "@/store/reports/cashCuts.store";
import { useTransmitterStore } from "@/store/transmitter.store";
import { limit_options } from "@/utils/constants";
import Pagination from "@/components/global/Pagination";
import useWindowSize from "@/hooks/useWindowSize";
import RenderViewButton from "@/components/global/render-view-button";
import LoadingTable from "@/components/global/LoadingTable";
import EmptyTable from "@/components/global/EmptyTable";
import { formatCurrency } from "@/utils/dte";
import { formatDateSimple } from "@/utils/dates";


export default function GeneralCashCutReportComponent() {
    const { onGetCashCutReportSummary, cashCutsSummary } = useCutReportStore()
    const { getBranchesList, branch_list } = useBranchesStore();
    const [branchName, setBranchName] = useState('');
    const { transmitter, gettransmitter } = useTransmitterStore();
    // const isMovil = useIsMobileOrTablet()
    // const [view, setView] = useState<'table' | 'grid' | 'list'>(isMovil ? 'grid' : 'table');
    const { windowSize } = useWindowSize()
    const [view, setView] = useState<'grid' | 'table' | 'list'>(
        windowSize.width < 768 ? 'grid' : 'table'
    )
    const currentDate = new Date();
    const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const [search, setSearch] = useState({
        page: 1,
        limit: 20,
        branchId: 0,
        dateFrom: defaultStartDate.toISOString().split('T')[0],
        dateTo: currentDate.toISOString().split('T')[0],
    });

    useEffect(() => {
        gettransmitter()
        getBranchesList()
        onGetCashCutReportSummary(search)
    }, [])

    useEffect(() => {
        onGetCashCutReportSummary(search)
    }, [search.limit])

    const changePage = (page: number) => {
        onGetCashCutReportSummary({ ...search, page });
    };

    const options_limit = [
        { label: 'Todos', value: cashCutsSummary.total },
        ...limit_options.map((option) => ({ label: option, value: option })),
    ];

    return (
        <>
            <ResponsiveFilterWrapper classButtonLg="w-1/2" onApply={() => changePage(1)}>
                <Autocomplete
                    className="font-semibold dark:text-white w-full"
                    defaultSelectedKey={String(search.branchId)}
                    label="Sucursal"
                    labelPlacement="outside"
                    placeholder="Selecciona la sucursal"
                    variant="bordered"
                    onSelectionChange={(key) => {
                        const newBranchId = Number(key);
                        const name = branch_list.find((branch) => branch.id === newBranchId)?.name ?? '';

                        setSearch({ ...search, branchId: newBranchId });
                        setBranchName(name);
                    }}
                >
                    {branch_list.map((branch) => (
                        <AutocompleteItem key={branch.id} className="dark:text-white">
                            {branch.name}
                        </AutocompleteItem>
                    ))}
                </Autocomplete>
                <Input
                    className="dark:text-white"
                    classNames={{ label: 'font-semibold' }}
                    label="Fecha inicial"
                    labelPlacement="outside"
                    type="date"
                    value={search.dateFrom}
                    variant="bordered"
                    onChange={(e) => {
                        setSearch({ ...search, dateFrom: e.target.value });
                    }}
                />
                <Input
                    className="dark:text-white"
                    classNames={{ label: 'font-semibold' }}
                    label="Fecha final"
                    labelPlacement="outside"
                    type="date"
                    value={search.dateTo}
                    variant="bordered"
                    onChange={(e) => {
                        setSearch({ ...search, dateTo: e.target.value });
                    }}
                />
            </ResponsiveFilterWrapper>
            <div className="w-full py-2 flex gap-5 justify-between items-end">
                <div className="flex w-full items-end gap-2">
                    <Select
                        disallowEmptySelection
                        className="max-w-[20vw] lg:max-w-[10vw] dark:text-white "
                        classNames={{
                            label: 'font-semibold',
                        }}
                        defaultSelectedKeys={[search.limit.toString()]}
                        label="Mostrar"
                        labelPlacement="outside"
                        size="md"
                        value={search.limit}
                        variant="bordered"
                        onChange={(e) => {
                            setSearch({ ...search, limit: Number(e.target.value) });
                        }}
                    >
                        {options_limit.map((limit) => (
                            <SelectItem key={limit.value} className="dark:text-white">
                                {limit.label}
                            </SelectItem>
                        ))}
                    </Select>
                    {/* <RenderViewButton setView={setView} view={view} /> */}
                </div>
                <div className="flex gap-2">
                    <div className="flex gap-1">
                        <SummaryCutExportExcell branch={branchName} comercialName={transmitter.nombreComercial} params={search} />
                        <SummaryCutExportPdf branch={branchName} comercialName={transmitter.nombreComercial} params={search} />

                    </div>

                    <RenderViewButton setView={setView} view={view} />
                </div>
            </div>

            {view === 'table' && (
                <SummaryCutReportTable />

            )}

            {view === 'grid' && (
                <SummaryCutReportCard />
            )}
            {cashCutsSummary.totalPag > 1 && (
                <Pagination
                    currentPage={cashCutsSummary.currentPag}
                    nextPage={cashCutsSummary.nextPag}
                    previousPage={cashCutsSummary.prevPag}
                    totalPages={cashCutsSummary.totalPag}
                    onPageChange={(page) => changePage(page)}
                />
            )}
        </>
    )
}

const SummaryCutReportCard = () => {
    const { cashCutsSummary, loadindSummary } = useCutReportStore()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-3 h-auto p-2">
            {loadindSummary ? (
                <div className="col-span-full flex justify-center items-center">
                    <LoadingTable />
                </div>
            ) : cashCutsSummary.cash_cuts_summary.length === 0 ? (
                <div className="col-span-full flex justify-center items-center">
                    <EmptyTable />
                </div>
            ) : (
                cashCutsSummary.cash_cuts_summary.map((item, index) => (
                    <Card key={index} className="border shadow-sm">
                        <CardHeader>
                            <h3 className="text-md font-bold text-gray-800">Día: {formatDateSimple(item.date)}</h3>
                        </CardHeader>
                        <CardBody className="text-sm space-y-1 bottom-4">
                            <p><span className="font-semibold">Total Venta:</span> {formatCurrency(Number(item.sumTotalSales))}</p>
                            <p><span className="font-semibold">Total Efectivo:</span> {formatCurrency(Number(item.sumTotalCash ?? 0))}</p>
                            <p><span className="font-semibold">Total Tarjeta:</span> {formatCurrency(Number(item.sumTotalCard ?? 0))}</p>
                            <p><span className="font-semibold">Otro Tipo de Pago:</span> {formatCurrency(Number(item.sumTotalOthers ?? 0))}</p>
                            <p><span className="font-semibold">Total Entregado:</span> {formatCurrency(Number(item.sumCashDelivered ?? 0))}</p>
                            <p><span className="font-semibold">Total Gastos:</span> {formatCurrency(Number(item.sumExpenses ?? 0))}</p>
                        </CardBody>
                    </Card>
                ))
            )}
        </div>

    )
}