import { useEffect, useState } from "react";
import { Autocomplete, AutocompleteItem, Input, Select, SelectItem } from "@heroui/react";
import { SearchIcon } from "lucide-react";

import DetailedCutTable from "./DetailedCutTable";
import DetailedCutMovilView from "./DetailedCutCardView";

import RenderViewButton from "@/components/global/render-view-button";
import useIsMobileOrTablet from "@/hooks/useIsMobileOrTablet";
import { useCutReportStore } from "@/store/reports/cashCuts.store";
import Pagination from "@/components/global/Pagination";
import { ResponsiveFilterWrapper } from "@/components/global/ResposiveFilters";
import { limit_options } from "@/utils/constants";
import { useBranchesStore } from "@/store/branches.store";

export default function DetailedCashCutReportComponent() {
    const { onGetCashCutReportDetailed, cashCutsDetailed } = useCutReportStore()
    const { getBranchesList, branch_list } = useBranchesStore();

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
        employee: '',
    });

    useEffect(() => {
        getBranchesList()
        onGetCashCutReportDetailed(search)
    }, [])

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
                        if (!key) return;

                        setSearch({ ...search, branchId: Number(key) });
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
            {view === 'table' ?
                <DetailedCutTable />
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
