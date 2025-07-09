import { useEffect, useState } from "react";
import { Input, Select, SelectItem } from "@heroui/react";
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
    const [branchName, setBranchName] = useState<string[]>([]);
    const {transmitter, gettransmitter } = useTransmitterStore();

    const isMovil = useIsMobileOrTablet()
    const [view, setView] = useState<'table' | 'grid' | 'list'>(isMovil ? 'grid' : 'table');
    const [search, setSearch] = useState({
        page: 1,
        limit: 20,
        branchIds: [] as number[],
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

    const branchesOptions = [
        { label: 'Todos', value: 'all' },
        ...branch_list.map((option) => ({
            label: option.name,
            value: String(option.id),
        })),
    ];

    return (
        <>
            <ResponsiveFilterWrapper classButtonLg="w-1/2" onApply={() => changePage(1)}>
                <Select
                    className="w-full"
                    classNames={{
                        label: 'font-semibold',
                        innerWrapper: 'uppercase'
                    }}
                    label="Sucursales"
                    labelPlacement="outside"
                    placeholder="Selecciona una o más sucursales"
                    selectedKeys={new Set(search.branchIds.map(id => id.toString()))}
                    selectionMode="multiple"
                    variant="bordered"
                    onSelectionChange={(keys) => {
                        const selected = Array.from(keys);
                        const allIds = branch_list.map((b) => b.id);
                        const allSelected = search.branchIds.length === allIds.length;

                        if (selected.includes("all")) {
                            if (allSelected) {
                                setSearch({ ...search, branchIds: [] });
                                setBranchName([]);
                            } else {
                                setSearch({ ...search, branchIds: allIds });
                                const allNames = branch_list.map((b) => b.name);

                                setBranchName(allNames);
                            }
                        } else {
                            const ids = selected.map(Number).filter((id) => !isNaN(id));

                            setSearch({ ...search, branchIds: ids });

                            // Obtener los nombres de las sucursales seleccionadas
                            const selectedNames = branch_list
                                .filter((b) => ids.includes(b.id))
                                .map((b) => b.name);

                            setBranchName(selectedNames);
                        }
                    }}

                >
                    {branchesOptions.map(({ label, value }) => (
                        <SelectItem key={value.toString()} className="uppercase">
                            {label}
                        </SelectItem>
                    ))}
                </Select>
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
