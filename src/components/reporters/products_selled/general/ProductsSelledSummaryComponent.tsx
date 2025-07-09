import { Autocomplete, AutocompleteItem, Card, CardBody, CardHeader, Input, Select, SelectItem } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import debounce from "debounce";

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
import { useProductsStore } from "@/store/products.store";
import useWindowSize from "@/hooks/useWindowSize";
import RenderViewButton from "@/components/global/render-view-button";

export default function ProductsSelledSummaryComponent() {
    const { getBranchesList, branch_list } = useBranchesStore();
    const { getProductSelledSummary, summary_products_selled, loading_summary } = useProductsOrdersReportStore();
    const { transmitter, gettransmitter } = useTransmitterStore();
    const { productsFilteredList, getProductsFilteredList } = useProductsStore()
    const { windowSize } = useWindowSize()
    const [view, setView] = useState<'grid' | 'list' | 'table'>(
        windowSize.width < 768 ? 'grid' : 'table'
    )
    const [search, setSearch] = useState({
        page: 1,
        limit: 20,
        startDate: getElSalvadorDateTime().fecEmi,
        endDate: getElSalvadorDateTime().fecEmi,
        branchIds: [] as number[],
        productName: '',
        productId: 0
    });

    useEffect(() => {
        getProductsFilteredList({
            productName: '',
            code: ''
        });
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

    const handleSearchProduct = useCallback(
        debounce((value: string) => {
            getProductsFilteredList({
                productName: value,
                code: ''
            });
        }, 300),
        [search]
    );


    return (
        <div className="p-4">
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
                <Autocomplete
                    isClearable
                    className="font-semibold dark:text-white w-full"
                    label="Producto"
                    labelPlacement="outside"
                    listboxProps={{
                        emptyContent: "Escribe para buscar",
                    }}
                    placeholder="Selecciona un producto"
                    selectedKey={String(search.productId)}
                    startContent={<SearchIcon />}
                    variant="bordered"
                    onClear={() => setSearch({ ...search, productId: 0, productName: '' })}
                    onInputChange={(value) => {
                        handleSearchProduct(value);
                    }}
                    onSelectionChange={(key) => {
                        const product = productsFilteredList.find((item) => item.id === Number(key))

                        setSearch({
                            ...search, productName: String(product?.name),
                            productId: Number(key)
                        })
                    }}
                >
                    {productsFilteredList.map((bp) => (
                        <AutocompleteItem key={bp.id} className="dark:text-white">
                            {bp.name}
                        </AutocompleteItem>
                    ))}
                </Autocomplete>
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
            <div className="flex gap-3 mt-2 lg:mt-0 justify-between">
                <div className="flex gap-2 ">

                    <ProductsExportPdf comercialName={transmitter.nombreComercial} headers={['Fecha', ...branchNames, 'Total General']} params={search} />
                    <ProductsExportExcell comercialName={transmitter.nombreComercial} headers={['Fecha', ...branchNames, 'Total General']} params={search} />
                </div>
                <RenderViewButton setView={setView} view={view} />
            </div>
            {loading_summary ? (
                <LoadingTable />
            ) : summary_products_selled.summary.length === 0 ? (
                <EmptyTable />
            ) : (
                <>
                    {view === 'table' && (
                        <TableComponent
                            className="overflow-auto"
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
                    {view === 'grid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-3 overflow-y-auto p-2">
                            {summary_products_selled.summary.map((row, i) => (
                                <Card key={i} className="border shadow-sm">
                                    <CardHeader>
                                        <h3 className="text-md font-bold text-gray-800">Fecha: {row.date}</h3>
                                    </CardHeader>
                                    <CardBody className="text-sm space-y-1">
                                        {branchNames.map(branch => (
                                            <p key={branch}>
                                                <span className="font-semibold">{branch}:</span>{' '}
                                                {formatCurrency(Number(row[branch] ?? 0))}
                                            </p>
                                        ))}
                                        <hr className="my-2" />
                                        <p className="font-semibold text-blue-700">
                                            Total general: {formatCurrency(Number(row.totalGeneral))}
                                        </p>
                                    </CardBody>
                                </Card>
                            ))}

                            <Card className="border shadow-sm bg-gray-100">
                                <CardHeader>
                                    <h3 className="text-md font-bold text-gray-700">Totales</h3>
                                </CardHeader>
                                <CardBody className="text-sm space-y-1">
                                    {branchNames.map(branch => (
                                        <p key={branch}>
                                            <span className="font-semibold">{branch}:</span>{' '}
                                            {formatCurrency(Number(summary_products_selled.totals[branch] ?? 0))}
                                        </p>
                                    ))}
                                    <hr className="my-2" />
                                    <p className="font-semibold text-blue-700">
                                        Total general: {formatCurrency(Number(summary_products_selled.totals.totalGeneral ?? 0))}
                                    </p>
                                </CardBody>
                            </Card>
                        </div>

                    )}
                </>


            )}
        </div>
    );

}