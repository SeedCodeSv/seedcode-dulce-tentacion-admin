import { Autocomplete, AutocompleteItem, Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";

import SummaryCutExportExcell from "./SummaryCutExportExecll";
import SummaryCutExportPdf from "./SummaryCutExportPdf";
import SummaryCutReportTable from "./SummaryCutReportTable";

import RenderViewButton from "@/components/global/render-view-button";
import { ResponsiveFilterWrapper } from "@/components/global/ResposiveFilters";
import useIsMobileOrTablet from "@/hooks/useIsMobileOrTablet";
import { useBranchesStore } from "@/store/branches.store";
import { useCutReportStore } from "@/store/reports/cashCuts.store";
import { useTransmitterStore } from "@/store/transmitter.store";
import { limit_options } from "@/utils/constants";
import Pagination from "@/components/global/Pagination";


export default function GeneralCashCutReportComponent() {
    const { onGetCashCutReportSummary, cashCutsSummary } = useCutReportStore()
    const { getBranchesList, branch_list } = useBranchesStore();
    const [branchName, setBranchName] = useState('');
    const { transmitter, gettransmitter } = useTransmitterStore();
    const isMovil = useIsMobileOrTablet()
    const [view, setView] = useState<'table' | 'grid' | 'list'>(isMovil ? 'grid' : 'table');

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
                    <RenderViewButton setView={setView} view={view} />
                </div>
                <div className="flex gap-2">
                    <SummaryCutExportExcell branch={branchName} comercialName={transmitter.nombreComercial} params={search} />
                    <SummaryCutExportPdf branch={branchName} comercialName={transmitter.nombreComercial} params={search} />
                </div>
            </div>
            <SummaryCutReportTable />
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
