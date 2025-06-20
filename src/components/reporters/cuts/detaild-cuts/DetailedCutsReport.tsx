import { useEffect, useState } from "react";
import { Autocomplete, AutocompleteItem, Input, Select, SelectItem } from "@heroui/react";
import { SearchIcon } from "lucide-react";

import DetailedCutTable from "./DetailedCutTable";
import DetailedCutMovilView from "./DetailedCutCardView";
import DetailedCutExportExcell from "./DetailedCutExportExecll";
import DetailedCutExportPdf from "./DetailedCutExportPdf";

import RenderViewButton from "@/components/global/render-view-button";
import useIsMobileOrTablet from "@/hooks/useIsMobileOrTablet";
import { useCutReportStore } from "@/store/reports/cashCuts.store";
import Pagination from "@/components/global/Pagination";
import { ResponsiveFilterWrapper } from "@/components/global/ResposiveFilters";
import { limit_options } from "@/utils/constants";
import { useBranchesStore } from "@/store/branches.store";
import { useTransmitterStore } from "@/store/transmitter.store";
import { getElSalvadorDateTime } from "@/utils/dates";

export default function DetailedCashCutReportComponent() {
    const { onGetCashCutReportDetailed, cashCutsDetailed } = useCutReportStore()
    const { getBranchesList, branch_list } = useBranchesStore();
    const [branchName, setBranchName] = useState('');
    const {transmitter, gettransmitter } = useTransmitterStore();

    const isMovil = useIsMobileOrTablet()
    const [view, setView] = useState<'table' | 'grid' | 'list'>(isMovil ? 'grid' : 'table');
    const [search, setSearch] = useState({
        page: 1,
        limit: 20,
        branchId: 0,
        dateFrom: getElSalvadorDateTime().fecEmi,
        dateTo: getElSalvadorDateTime().fecEmi,
        employee: '',
    });

    useEffect(() => {
        gettransmitter()
        getBranchesList()
        onGetCashCutReportDetailed(search)
    }, [])

    useEffect(() => {
        if (search.employee === '')
            onGetCashCutReportDetailed(search)
    }, [search.employee])

    useEffect(() => {
        onGetCashCutReportDetailed(search)
    }, [search.limit])

    const changePage = (page: number) => {
        onGetCashCutReportDetailed({ ...search, page });
    };

    const options_limit = [
        { label: 'Todos', value: cashCutsDetailed.total },
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
                    isClearable
                    className="w-full dark:text-white"
                    classNames={{
                        label: 'font-semibold text-gray-700',
                        inputWrapper: 'pr-0',
                    }}
                    label="Empleado"
                    labelPlacement="outside"
                    placeholder="Escribe para buscar..."
                    startContent={<SearchIcon />}
                    value={search.employee}
                    variant="bordered"
                    onChange={(e) => setSearch({ ...search, employee: e.target.value })}
                    onClear={() => {
                        setSearch({ ...search, employee: '' });
                    }}
                />
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
                    <DetailedCutExportExcell branch={branchName} comercialName={transmitter.nombreComercial} params={search} />
                    <DetailedCutExportPdf branch={branchName} comercialName={transmitter.nombreComercial} params={search} />
                </div>
            </div>

            {view === 'table' ?
                <DetailedCutTable/>
                :
                <DetailedCutMovilView />
            }
            {cashCutsDetailed.totalPag > 1 && (
                <Pagination
                    currentPage={cashCutsDetailed.currentPag}
                    nextPage={cashCutsDetailed.nextPag}
                    previousPage={cashCutsDetailed.prevPag}
                    totalPages={cashCutsDetailed.totalPag}
                    onPageChange={(page) => changePage(page)}
                />
            )}
        </>
    )
}
