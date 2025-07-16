import { Input, Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";

import ProductsExportPdfByBranches from "./ProductsExportPdfByBranches";
import ProductsExportExcellByBranches from "./ProductsExportExcellByBranches";
import CardDetailByBranchesProducts from "./CardDetailByBranchesProducts";

import EmptyTable from "@/components/global/EmptyTable";
import LoadingTable from "@/components/global/LoadingTable";
import { ResponsiveFilterWrapper } from "@/components/global/ResposiveFilters";
import { useBranchesStore } from "@/store/branches.store";
import { useProductsOrdersReportStore } from "@/store/reports/productsSelled_report.store";
import { useTransmitterStore } from "@/store/transmitter.store";
import { TableComponent } from "@/themes/ui/table-ui";
import { getElSalvadorDateTime } from "@/utils/dates";
import TdGlobal from "@/themes/ui/td-global";
import useWindowSize from "@/hooks/useWindowSize";
import RenderViewButton from "@/components/global/render-view-button";

export default function DetailedBranchesProducts() {
    const { getBranchesList, branch_list } = useBranchesStore();
    const { transmitter, gettransmitter } = useTransmitterStore();
    const { getProductSaledByBranches, products_selled_by_branches, loading_data } = useProductsOrdersReportStore();
    const { windowSize } = useWindowSize()
    const [view, setView] = useState<'grid' | 'list' | 'table'>(
        windowSize.width < 768 ? 'grid' : 'table'
    )
    const DetailTotal = useDisclosure()
    const currentDate = new Date();
    const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const [search, setSearch] = useState({
        page: 1,
        limit: 0,
        branchIds: [] as number[],
        startDate: defaultStartDate.toISOString().split('T')[0],
        endDate: getElSalvadorDateTime().fecEmi,
    });

    const handleSearch = () => {
        getProductSaledByBranches(search)
    }

    useEffect(() => {
        gettransmitter()
        getBranchesList()
        getProductSaledByBranches(search)
    }, [])

    const branchNames = Object.keys(products_selled_by_branches.branchTotals || {}).filter(key => key !== 'totalGeneral');


    const branchesOptions = [
        { label: 'Todos', value: 'all' },
        ...branch_list.map((option) => ({
            label: option.name,
            value: String(option.id),
        })),
    ];

    return (
        <>
            <ResponsiveFilterWrapper
                onApply={() => {
                    handleSearch();
                }}
            >
                <Input
                    className="dark:text-white"
                    classNames={{ label: 'font-semibold' }}
                    id='fecha-inicial'
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
            </ResponsiveFilterWrapper>
            <div className="flex gap-3 justify-between mt-4">
                <div className="flex gap-2">

                    <ProductsExportPdfByBranches comercialName={transmitter.nombreComercial} headers={['Producto', ...branchNames, 'Total General']} params={search} />
                    <ProductsExportExcellByBranches comercialName={transmitter.nombreComercial} headers={['Producto', ...branchNames, 'Total General']} params={search} />
                </div>
                <div className="flex gap-2">
                    {view.includes('grid') && (
                        <div className="content-center">
                            <button
                                className="flex px-5 py-1 bg-emerald-500 text-white rounded-md"
                                onClick={() => {
                                    DetailTotal.onOpen()
                                }}
                            >
                                {windowSize.width < 768 ? 'Totales' : 'Detalles totales'}
                            </button>
                        </div>
                    )}

                    <RenderViewButton setView={setView} view={view} />
                </div>

            </div>
            {loading_data ? (
                <LoadingTable />
            ) : products_selled_by_branches.data.length === 0 ? (
                <EmptyTable />
            ) : (
                <>
                    {view === 'table' && (
                        <TableComponent
                            className="overflow-auto"
                            headers={['Producto', ...branchNames, 'Total General']}
                        >
                            <>
                                {products_selled_by_branches.data.map((row, i) => (
                                    <tr key={i} className="border-t text-sm">
                                        <TdGlobal className="px-4 py-2">{row.productName}</TdGlobal>
                                        {branchNames.map(branch => (
                                            <TdGlobal key={branch} className="px-4 py-2">
                                                {Number(row[branch] ?? 0)}
                                            </TdGlobal>
                                        ))}
                                        <TdGlobal className="px-4 py-2 font-semibold text-blue-700">
                                            {Number(row.totalGeneral)}
                                        </TdGlobal>
                                    </tr>
                                ))}

                                {/* FOOTER */}
                                <tr className="bg-gray-100 font-bold border-t">
                                    <TdGlobal className="px-4 py-2">Totales</TdGlobal>
                                    {branchNames.map(branch => (
                                        <TdGlobal key={branch} className="px-4 py-2">
                                            {Number(products_selled_by_branches.branchTotals[branch] ?? 0)}
                                        </TdGlobal>
                                    ))}
                                    <TdGlobal className="px-4 py-2 text-blue-700">
                                        {Number(products_selled_by_branches.branchTotals.totalGeneral ?? 0)}
                                    </TdGlobal>
                                </tr>
                            </>
                        </TableComponent>
                    )}
                    {view === 'grid' && (
                        <CardDetailByBranchesProducts

                        />
                    )}
                </>
            )}
            <Modal isOpen={DetailTotal.isOpen} onClose={() => {
                DetailTotal.onClose()
            }}>

                <ModalContent>
                    <ModalHeader>
                        {/* Totales */}
                    </ModalHeader>
                    <ModalBody>
                        {/* <Card className="border shadow-md bg-gray-100">
                            <CardHeader> */}
                        <h3 className="text-lg font-bold text-gray-700">Totales</h3>
                        {/* </CardHeader>
                            <CardBody> */}
                        {branchNames.map(branch => (
                            <p key={branch} className="text-sm mb-1">
                                <span className="font-semibold">{branch}:</span> {Number(products_selled_by_branches.branchTotals[branch] ?? 0)}
                            </p>
                        ))}
                        <hr className="my-2" />
                        <p className="text-blue-700 font-semibold">
                            Total general: {Number(products_selled_by_branches.branchTotals.totalGeneral ?? 0)}
                        </p>
                        {/* </CardBody>
                        </Card> */}
                    </ModalBody>
                </ModalContent>

            </Modal>
        </>
    )
}