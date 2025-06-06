import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { useEffect, useState } from "react";

import { ResponsiveFilterWrapper } from "@/components/global/ResposiveFilters";
import { TableComponent } from "@/themes/ui/table-ui";
import { getElSalvadorDateTime } from "@/utils/dates";
import { useBranchesStore } from "@/store/branches.store";
import { useProductsOrdersReportStore } from "@/store/reports/productsSelled_report.store";
import LoadingTable from "@/components/global/LoadingTable";
import EmptyTable from "@/components/global/EmptyTable";
import { formatCurrency } from "@/utils/dte";
import TdGlobal from "@/themes/ui/td-global";

export default function ProductsSelledSummaryComponent() {
    const { getBranchesList, branch_list } = useBranchesStore();
    const { getProductSelledSummary, summary_products_selled, loading_summary } = useProductsOrdersReportStore();
    // const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
    const [search, setSearch] = useState({
        page: 1,
        limit: 20,
        branchId: 0,
        starTdGlobalate: getElSalvadorDateTime().fecEmi,
        endDate: getElSalvadorDateTime().fecEmi,
        productName: ''
    });

    useEffect(() => {
        getBranchesList()
        getProductSelledSummary(search)
    }, [])

    const handleSearch = (page: number) => {
        getProductSelledSummary({ ...search, page })
    }



    const branchNames = Object.keys(summary_products_selled.totals || {}).filter(key => key !== 'totalGeneral');

    return (
        <div className="p-4">
            <ResponsiveFilterWrapper classButtonLg="col-start-5" classLg='w-full grid grid-cols-5 gap-4 items-end pb-4' onApply={() => handleSearch(1)}>
                <Autocomplete
                    className="font-semibold dark:text-white w-full"
                    defaultSelectedKey={String(search.branchId)}
                    label="Sucursal"
                    labelPlacement="outside"
                    placeholder="Selecciona la sucursal"
                    variant="bordered"
                    onSelectionChange={(key) => {
                        const newBranchId = Number(key);

                        setSearch({
                            ...search,
                            branchId: newBranchId,
                        });

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
                    value={search.starTdGlobalate}
                    variant="bordered"
                    onChange={(e) => {
                        setSearch({ ...search, starTdGlobalate: e.target.value });
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