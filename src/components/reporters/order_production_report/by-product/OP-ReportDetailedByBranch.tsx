import { Accordion, AccordionItem, Autocomplete, AutocompleteItem, Input, Select, SelectItem } from "@heroui/react";
import debounce from "debounce";
import { SearchIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";

import OPReportDetailedExportExcell from "./OP-ReportDetailedByBranchProductExcell";
import OPReportDetailedExportPDF from "./OpReportDetailedPDF";

import { ResponsiveFilterWrapper } from "@/components/global/ResposiveFilters";
import { get_user } from "@/storage/localStorage";
import { useBranchesStore } from "@/store/branches.store";
import { useProductsStore } from "@/store/products.store";
import { getElSalvadorDateTime } from "@/utils/dates";
import { limit_options } from "@/utils/constants";
import { TableComponent } from "@/themes/ui/table-ui";
import TdGlobal from "@/themes/ui/td-global";
import EmptyTable from "@/components/global/EmptyTable";
import { useOrderProductionReportStore } from "@/store/reports/order-production-report.store";
import { RenderIconStatus, Status } from "@/components/production-order/render-order-status";
import { formatCurrency } from "@/utils/dte";
import LoadingTable from "@/components/global/LoadingTable";
import { useTransmitterStore } from "@/store/transmitter.store";

export default function OPReportComponentDetailed() {
    const user = get_user();
    // const productionOrderStatus = ['Abierta', 'En Proceso', 'Completada', 'Cancelada'];
    const [branchName, setBranchName] = useState('');

    const { getBranchesList, branch_list } = useBranchesStore();
    const { productsFilteredList, getProductsFilteredList } = useProductsStore()
    const { po_report_detailed, getP_OrdersReportDetailed, loading_report } = useOrderProductionReportStore()
    const currentDate = new Date();
    const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const { transmitter, gettransmitter } = useTransmitterStore();

    const [search, setSearch] = useState({
        page: 1,
        limit: 20,
        productId: 0,
        branch: user?.branchId ?? 0,
        startDate: defaultStartDate.toISOString().split('T')[0],
        endDate: getElSalvadorDateTime().fecEmi,
        productName: '',
        status: ''
    });


    useEffect(() => {
        gettransmitter();
        getBranchesList();
        if (search.productName === '')
            getP_OrdersReportDetailed(
                search.page,
                search.limit,
                search.startDate,
                search.endDate,
                search.branch,
                search.productName,
                search.status,
                0)
    }, [search.productName]);

    const handleSearchProduct = useCallback(
        debounce((value: string) => {
            getProductsFilteredList({
                productName: value,
            });
        }, 300),
        []
    );

    const handleSearch = () => {
        getP_OrdersReportDetailed(
            search.page,
            search.limit,
            search.startDate,
            search.endDate,
            search.branch,
            search.productName,
            search.status,
            0,)
    }


    useEffect(() => {
        const branchName = branch_list.find((branch) => branch.id === search.branch)?.name ?? '';

        setBranchName(branchName);
    }, [branch_list])

    return (
        <>
            <ResponsiveFilterWrapper classButtonLg="col-start-5" classLg='w-full grid grid-cols-5 gap-4' onApply={handleSearch}>
                <Autocomplete
                    className="font-semibold dark:text-white w-full"
                    defaultSelectedKey={String(search.branch)}
                    label="Sucursal"
                    labelPlacement="outside"
                    placeholder="Selecciona la sucursal"
                    variant="bordered"
                    onSelectionChange={(key) => {
                        const newBranchId = Number(key);
                        const name = branch_list.find((branch) => branch.id === newBranchId)?.name ?? '';

                        setSearch({
                            ...search,
                            branch: newBranchId,
                        });

                        setBranchName(name);
                    }}
                >
                    {branch_list.map((branch) => (
                        <AutocompleteItem key={branch.id} className="dark:text-white">
                            {branch.name}
                        </AutocompleteItem>
                    ))}
                </Autocomplete>
                <Autocomplete
                    isClearable
                    className="font-semibold dark:text-white w-full"
                    label="Producto"
                    labelPlacement="outside"
                    placeholder="Selecciona un producto"
                    selectedKey={String(search.productId)}
                    startContent={<SearchIcon />}
                    variant="bordered"
                    onClear={() => setSearch({ ...search, productId: 0 })}
                    onInputChange={(value) => {
                        handleSearchProduct(value);
                    }}
                    onSelectionChange={(key) => {
                        const product = productsFilteredList.find((item) => item.id === Number(key))

                        setSearch({
                            ...search, productName: String(product?.name ?? ''),
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
                {/* <Select
                    className='dark:text-white'
                    classNames={{ label: 'font-semibold' }}
                    label="Estado de la orden"
                    labelPlacement="outside"
                    placeholder="Seleccione un estado"
                    selectedKeys={[search.status]}
                    variant="bordered"
                    onSelectionChange={(key) => {
                        const [status] = [...new Set(key)];
                        const safeStatus = status ?? '';

                        setSearch({ ...search, status: String(safeStatus) });
                    }}
                >
                    {productionOrderStatus.map((status) => (
                        <SelectItem key={status} className='dark:text-white'>{status}</SelectItem>
                    ))}
                </Select> */}
                <Select
                    disallowEmptySelection
                    aria-label="Cantidad a mostrar"
                    className=" dark:text-white w-full max-md:hidden"
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
            </ResponsiveFilterWrapper>
            <div className="flex gap-2">
                <OPReportDetailedExportExcell branch={branchName} comercialName={transmitter.nombreComercial} params={search} />
                <OPReportDetailedExportPDF branch={branchName} comercialName={transmitter.nombreComercial} params={search} />
            </div>
            {loading_report &&
                <LoadingTable />
            }
            {!loading_report && po_report_detailed.length === 0 && (
                <div className="w-full flex items-center justify-center pt-6">
                    <EmptyTable />
                </div>
            )}
            <div className="flex py-5 flex-col gap-3 max-h-[80vh] overflow-y-auto">
                {!loading_report && po_report_detailed.map((data) => (
                    <Fragment key={data.branchProductId}>
                        <Accordion
                        key={data.branchProductId}
                            itemClasses={{
                                base: `py-8 lg:py-4 dark:bg-gray-800/20 w-full shadow shadow-[#e49ca0] dark:shadow-gray-700`,
                                title: "h-full font-normal text-medium ",
                                trigger: "rounded-lg h-14 flex items-center",
                                indicator: `text-medium text-[#e49ca0] dark:text-gray-300`,
                                content: 'flex flex-col w-full'
                            }}
                            variant="splitted"
                        >
                            <AccordionItem
                                key={data.branchProductId}
                                title={
                                    <>
                                        <div className="w-full rounded-[12px] flex justify-between">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-semibold uppercase">
                                                    {data.productName}
                                                </p>
                                                <div className="flex flex-col gap-1 lg:flex-row lg:gap-5 text-gray-500">
                                                    <span className="text-sm font-semibold flex gap-1">
                                                        Producidos: <p className="text-green-600 font-semibold text-sm"> {data.totalProduced}</p>
                                                    </span>
                                                    <span className="text-sm font-semibold flex gap-1">
                                                        Dañados:
                                                        <p className="text-red-600 font-semibold text-sm">
                                                            {data.totalDamaged}
                                                        </p></span>
                                                    <span className="text-sm font-semibold flex gap-1">
                                                        Pendientes:
                                                        <p className="text-yellow-600 font-semibold text-sm">
                                                            {data.pendingQuantity}
                                                        </p></span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-semibold flex gap-1">
                                                    Cant. Ordenes: <p className=" font-semibold text-sm"> {data.totalOrders}</p>
                                                </span>
                                                <span className="text-sm font-semibold flex gap-1">
                                                    Costo Total: <p className="text-green-600 font-semibold text-sm">
                                                        {formatCurrency(data.totalCost)}
                                                    </p>
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                }>
                                <TableComponent
                                    className="text-[15px]"
                                    headers={["Nº", "Fecha/Hora de inicio", 'Fecha/Hora de fin', 'Cantidad', 'Producido', 'Dañado', 'Estado',]}
                                    renderHeader={(header) => (
                                        <div className="flex items-center">
                                            <span>{header}</span>
                                            {(header === 'Producido' || header === 'Dañado') && (
                                                <span className="ml-1 flex items-center">
                                                    {header === 'Producido' ?
                                                        <TrendingUp className="text-green-500" size={20} />
                                                        : header === 'Dañado' && <TrendingDown className="text-red-500" size={20} />}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                >
                                    {data.table.length > 0 && data.table.map((item, index) => (
                                        <tr key={item.branchProductId}>
                                            <TdGlobal className="p-2">{index + 1}</TdGlobal>
                                            <TdGlobal className="max-w-10 p-2">{item.date} - {item.time}</TdGlobal>
                                            <TdGlobal className="max-w-10  p-2">
                                                {item.endDate && item.endTime
                                                    ? `${item.endDate} - ${item.endTime}`
                                                    : 'No definido'}
                                            </TdGlobal>
                                            <TdGlobal >{item.quantity}</TdGlobal>
                                            <TdGlobal className=""><p className={`font-semibold ${item.producedQuantity > 0 ? 'text-green-500' : 'text-gray-300'}`}>{item.producedQuantity}</p></TdGlobal>
                                            <TdGlobal className=""><p className={`font-semibold ${item.damagedQuantity > 0 ? 'text-red-500' : 'text-gray-300'}`}>{item.damagedQuantity}</p></TdGlobal>
                                            <TdGlobal className="">
                                                {RenderIconStatus({ status: item.statusOrder as Status }) || item.statusOrder}
                                            </TdGlobal>
                                        </tr>
                                    ))}
                                </TableComponent>
                            </AccordionItem>
                        </Accordion>
                    </Fragment>
                ))}
            </div>
        </>
    )
}