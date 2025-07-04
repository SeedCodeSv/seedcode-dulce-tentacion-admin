import { Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";

import ProductsExportExcell from "./ProductsExportExcell";
import ProductsExportPdf from "./ProductsExportPdf";

import { ResponsiveFilterWrapper } from "@/components/global/ResposiveFilters";
import { TableComponent } from "@/themes/ui/table-ui";
import { getElSalvadorDateTime } from "@/utils/dates";
import { useBranchesStore } from "@/store/branches.store";
import { useProductsOrdersReportStore } from "@/store/reports/productsSelled_report.store";
import LoadingTable from "@/components/global/LoadingTable";
import EmptyTable from "@/components/global/EmptyTable";
import { formatCurrency } from "@/utils/dte";
import TdGlobal from "@/themes/ui/td-global";
import { useTransmitterStore } from "@/store/transmitter.store";

export default function ProductsSelledSummaryComponent() {
    const { getBranchesList, branch_list } = useBranchesStore();
    const { getProductSelledSummary, summary_products_selled, loading_summary } = useProductsOrdersReportStore();
    const { transmitter, gettransmitter } = useTransmitterStore();

    const [search, setSearch] = useState({
        page: 1,
        limit: 20,
        startDate: getElSalvadorDateTime().fecEmi,
        endDate: getElSalvadorDateTime().fecEmi,
        branchIds: [] as number[],
        productName: ''
    });

    useEffect(() => {
        gettransmitter()
        getBranchesList()
        getProductSelledSummary(search)
    }, [])

    const handleSearch = (page: number) => {
        getProductSelledSummary({ ...search, page })
    }

    const branchNames = Object.keys(summary_products_selled.totals || {}).filter(key => key !== 'totalGeneral');


    const branchesOptions = [
        { label: 'Todos', value: 'all' },
        ...branch_list.map((option) => ({
            label: option.name,
            value: String(option.id),
        })),
    ];



    return (
        <div className="p-4">
            {/* <div className="w-full flex items-end justify-end">
                <div className="w-full max-w-[20vw]">
            <MultiSelectProductAutocomplete
                    selectedProducts={selectedProducts}
                    onChange={setSelectedProducts}
                />
                </div>
                </div> */}
            <ResponsiveFilterWrapper classButtonLg="col-start-5" classLg='w-full grid grid-cols-5 gap-4 items-end pb-4' onApply={() => handleSearch(1)}>
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
                            } else {
                                setSearch({ ...search, branchIds: allIds });
                            }
                        } else {
                            const ids = selected.map(Number).filter((id) => !isNaN(id));

                            setSearch({ ...search, branchIds: ids });
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
                    className="dark:text-white"
                    classNames={{ label: 'font-semibold' }}
                    label="Producto"
                    labelPlacement="outside"
                    placeholder="Escriba el nombre"
                    type="text"
                    value={search.productName}
                    variant="bordered"
                    onChange={(e) => {
                        setSearch({ ...search, productName: e.target.value });
                    }}
                    onClear={() => {
                        setSearch({ ...search, productName: '' });
                        getProductSelledSummary({ ...search, productName: '' })
                    }}
                />
                <Input
                    className="dark:text-white"
                    classNames={{ label: 'font-semibold' }}
                    label="Fecha inicial"
                    labelPlacement="outside"
                    type="date"
                    value={search.startDate}
                    variant="bordered"
                    onChange={(e) => {
                        setSearch({ ...search, startDate: e.target.value });
                    }}
                />
                <Input
                    className="dark:text-white"
                    classNames={{ label: 'font-semibold' }}
                    label="Fecha final"
                    labelPlacement="outside"
                    type="date"
                    value={search.endDate}
                    variant="bordered"
                    onChange={(e) => {
                        setSearch({ ...search, endDate: e.target.value });
                    }}
                />
            </ResponsiveFilterWrapper>
            <div className="flex gap-3 mt-2 lg:mt-0">
            <ProductsExportPdf comercialName={transmitter.nombreComercial} headers={['Fecha', ...branchNames, 'Total General']} params={search} />
            <ProductsExportExcell comercialName={transmitter.nombreComercial} headers={['Fecha', ...branchNames, 'Total General']} params={search} />
           </div>
            {loading_summary ? (
                <LoadingTable />
            ) : summary_products_selled.summary.length === 0 ? (
                <EmptyTable />
            ) : (
                <TableComponent
                    headers={['Fecha', ...branchNames, 'Total General']}
                >
                    <>
                        {summary_products_selled.summary.map((row, i) => (
                            <tr key={i} className="border-t text-sm">
                                <TdGlobal className="px-4 py-2">{row.date}</TdGlobal>
                                {branchNames.map(branch => (
                                    <TdGlobal key={branch} className="px-4 py-2">
                                        {formatCurrency(Number(row[branch] ?? 0))}
                                    </TdGlobal>
                                ))}
                                <TdGlobal className="px-4 py-2 font-semibold text-blue-700">
                                    {formatCurrency(Number(row.totalGeneral))}
                                </TdGlobal>
                            </tr>
                        ))}

                        {/* FOOTER */}
                        <tr className="bg-gray-100 font-bold border-t">
                            <TdGlobal className="px-4 py-2">Totales</TdGlobal>
                            {branchNames.map(branch => (
                                <TdGlobal key={branch} className="px-4 py-2">
                                    {formatCurrency(Number(summary_products_selled.totals[branch] ?? 0))}
                                </TdGlobal>
                            ))}
                            <TdGlobal className="px-4 py-2 text-blue-700">
                                {formatCurrency(Number(summary_products_selled.totals.totalGeneral ?? 0))}
                            </TdGlobal>
                        </tr>
                    </>
                </TableComponent>

            )}
        </div>
    );

}