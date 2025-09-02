import { Autocomplete, AutocompleteItem, Card, CardBody, CardHeader, Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";


import ProductsDetailedExportPdf from "./ProductsDetailedExportPdf";
import ProductsDetailedExportExcell from "./ProductsDetailedExportExcell";

import { ResponsiveFilterWrapper } from "@/components/global/ResposiveFilters";
import { TableComponent } from "@/themes/ui/table-ui";
import { getElSalvadorDateTime } from "@/utils/dates";
import { limit_options } from "@/utils/constants";
import { useBranchesStore } from "@/store/branches.store";
import { useProductsOrdersReportStore } from "@/store/reports/productsSelled_report.store";
import LoadingTable from "@/components/global/LoadingTable";
import TdGlobal from "@/themes/ui/td-global";
import EmptyTable from "@/components/global/EmptyTable";
import { formatCurrency } from "@/utils/dte";
import Pagination from "@/components/global/Pagination";
import { useTransmitterStore } from "@/store/transmitter.store";
import useWindowSize from "@/hooks/useWindowSize";
import RenderViewButton from "@/components/global/render-view-button";
import { ProductsSellled } from "@/types/reports/productsSelled.report.types";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ProductsSelledDetailComponent() {
    const { getBranchesList, branch_list } = useBranchesStore();
    const { products_selled, getProductsSelled, loading } = useProductsOrdersReportStore()
    const { transmitter, gettransmitter } = useTransmitterStore();
    const { windowSize } = useWindowSize()
    const [view, setView] = useState<'grid' | 'list' | 'table'>(
        windowSize.width < 768 ? 'grid' : "table"
    )

    const [search, setSearch] = useState({
        page: 1,
        limit: 20,
        branchId: 0,
        startDate: getElSalvadorDateTime().fecEmi,
        endDate: getElSalvadorDateTime().fecEmi,
        productName: ''
    });

    useEffect(() => {
        gettransmitter()
        getBranchesList()
        getProductsSelled(search)
    }, [])

    const handleSearch = (page: number) => {
        getProductsSelled({ ...search, page })
    }

    const [sortConfig, setSortConfig] = useState<{
        key: keyof ProductsSellled | null;
        direction: 'asc' | 'desc';
    }>({
        key: null,
        direction: 'asc',
    });

    const sortedProducts = useMemo(() => {
        return [...products_selled.products_sellled].sort((a, b) => {
            if (sortConfig.key) {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === "productName") {
                    return sortConfig.direction === "asc"
                        ? String(aValue).localeCompare(String(bValue))
                        : String(bValue).localeCompare(String(aValue));
                }

                if (aValue < bValue) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
            }

            return 0;
        });
    }, [products_selled.products_sellled, sortConfig]);


    const handleSort = (key: keyof ProductsSellled) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };


    return (
        <>
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
                        getProductsSelled({ ...search, productName: '' })
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
            <div className="flex gap-3 items-end justify-between">
                <Select
                    disallowEmptySelection
                    aria-label="Cantidad a mostrar"
                    className="w-1/6 dark:text-white max-md:hidden"
                    classNames={{
                        label: 'font-semibold',
                    }}
                    defaultSelectedKeys={['20']}
                    label='Mostrar'
                    labelPlacement="outside"
                    value={search.limit}
                    variant="bordered"
                    onChange={(e) => {
                        setSearch({ ...search, limit: Number(e.target.value) });
                    }}
                >
                    {limit_options.map((limit) => (
                        <SelectItem key={limit} className="dark:text-white">
                            {limit}
                        </SelectItem>
                    ))}
                </Select>
                <div className="flex gap-3 mt-2 lg:mt-0">
                    <div className="flex gap-2">
                        <ProductsDetailedExportPdf comercialName={transmitter.nombreComercial} params={search} />
                        <ProductsDetailedExportExcell comercialName={transmitter.nombreComercial} params={search} />

                    </div>

                    <RenderViewButton setView={setView} view={view} />

                </div>
            </div>
            <div>
                {view === 'table' && (
                    <TableComponent
                        className="overflow-auto"
                        headers={['Fecha', 'Sucursal', 'Código', 'Descripción', 'Unidad de Medida', 'Cantidad', 'Precio', 'Total', 'Categoría']}
                        renderHeader={(header) => (
                            <div className="flex items-center">
                                <span>{header}</span>
                                {(header === 'Descripción') && (
                                    <span className="ml-1 flex items-center">
                                        {sortConfig.key === (header === 'Descripción' ? 'productName' : 'unitCost') &&
                                            (sortConfig.direction === 'asc' ? (
                                                <ChevronUp size={20} />
                                            ) : (
                                                <ChevronDown size={20} />
                                            ))}
                                    </span>
                                )}
                            </div>
                        )}

                        onThClick={(header) => {
                            if (header === 'Descripción') {
                                handleSort('productName');
                            } else {
                                setSortConfig({ key: null, direction: 'asc' });
                            }
                        }}
                    >
                        {loading ? (
                            <tr>
                                <TdGlobal className="p-3 text-sm text-center text-slate-500" colSpan={11}>
                                    <LoadingTable />
                                </TdGlobal>
                            </tr>
                        ) : products_selled.products_sellled.length === 0 ? (
                            <tr>
                                <TdGlobal className="p-3 text-sm text-center text-slate-500" colSpan={11}>
                                    <EmptyTable />
                                </TdGlobal>
                            </tr>
                        ) : (
                            sortedProducts.map((item, index) => (
                                <tr key={index} className="border-b dark:border-slate-600 border-slate-200 p-3">
                                    <TdGlobal className="p-3">{item.date} </TdGlobal>
                                    <TdGlobal className="p-3">{item.branchName}</TdGlobal>
                                    <TdGlobal className="p-3">{item.code}</TdGlobal>
                                    <TdGlobal className="p-3">{item.productName}</TdGlobal>
                                    <TdGlobal className="p-3">{item.unitMessure}</TdGlobal>
                                    <TdGlobal className="p-3">{item.quantity}</TdGlobal>
                                    <TdGlobal className="p-3">{formatCurrency(Number(item.price ?? 0))}</TdGlobal>
                                    <TdGlobal className="p-3">{formatCurrency(Number(item.total ?? 0))}</TdGlobal>
                                    <TdGlobal className="p-3">{item.category}</TdGlobal>
                                </tr>
                            ))

                        )}
                    </TableComponent>
                )}
                {view === 'grid' && (
                    <CardProductSellesDetail />
                )}
            </div>
            {products_selled.totalPag > 1 &&
                <Pagination
                    currentPage={products_selled.currentPag}
                    nextPage={products_selled.nextPag}
                    previousPage={products_selled.prevPag}
                    totalPages={products_selled.totalPag}
                    onPageChange={(page) => {
                        handleSearch(page)
                    }}
                />
            }
        </>
    )
}


const CardProductSellesDetail = () => {
    const { products_selled, loading } = useProductsOrdersReportStore()

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-3 overflow-y-auto p-2">
                {loading ? (
                    <div className="col-span-full flex justify-center items-center">
                        <LoadingTable />
                    </div>
                ) : products_selled.products_sellled.length === 0 ? (
                    <div className="col-span-full flex justify-center items-center">
                        <EmptyTable />
                    </div>
                ) : (
                    products_selled.products_sellled.map((item, index) => (
                        <Card key={index} className="border shadow-sm">
                            <CardHeader>
                                <h3 className="text-md font-bold text-gray-800">{item.productName}</h3>
                                {/* <p className="text-xs text-gray-500">{item.date} • {item.branchName}</p> */}
                            </CardHeader>
                            <CardBody className="text-sm space-y-1 bottom-4">
                                <p><span className="font-semibold">Fecha:</span> {item?.date}</p>
                                <p><span className="font-semibold">Sucursal:</span> {item.branchName}</p>
                                <p><span className="font-semibold">Código:</span> {item.code}</p>
                                <p><span className="font-semibold">Unidad de Medida:</span> {item.unitMessure}</p>
                                <p><span className="font-semibold">Cantidad:</span> {item.quantity}</p>
                                <p><span className="font-semibold">Precio:</span> {formatCurrency(Number(item.price ?? 0))}</p>
                                <p><span className="font-semibold">Total:</span> {formatCurrency(Number(item.total ?? 0))}</p>
                                <p><span className="font-semibold">Categoría:</span> {item.category}</p>
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>

        </>
    )
}