import { Autocomplete, AutocompleteItem, Card, CardBody, Input, Select, SelectItem } from "@heroui/react";
import debounce from "debounce";
import { CheckCircleIcon, ClipboardIcon, LoaderIcon, SearchIcon, XCircleIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ResponsiveFilterWrapper } from "@/components/global/ResposiveFilters";
import { get_user } from "@/storage/localStorage";
import { useBranchesStore } from "@/store/branches.store";
import { useProductsStore } from "@/store/products.store";
import DivGlobal from "@/themes/ui/div-global";
import { getElSalvadorDateTime } from "@/utils/dates";
import { limit_options } from "@/utils/constants";
import { TableComponent } from "@/themes/ui/table-ui";
import TdGlobal from "@/themes/ui/td-global";
import EmptyTable from "@/components/global/EmptyTable";
import { useOrderProductionReportStore } from "@/store/reports/order-production-report.store";
import Pagination from "@/components/global/Pagination";
import { RenderIconStatus, Status } from "@/components/production-order/render-order-status";

export default function OrdenProducionCOmponent() {
    const user = get_user();
    const productionOrderStatus = ['Abierta', 'En Proceso', 'Completada', 'Cancelada'];

    const { getBranchesList, branch_list } = useBranchesStore();
    const { productsFilteredList, getProductsFilteredList } = useProductsStore()
    const { production_orders_report, getProductionsOrdersReport, pagination_production_orders_report, statusTotals } = useOrderProductionReportStore()
    const currentDate = new Date();
    const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

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
        getBranchesList();
        if (search.productName === '')
            getProductionsOrdersReport(
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
        getProductionsOrdersReport(
            search.page,
            search.limit,
            search.startDate,
            search.endDate,
            search.branch,
            search.productName,
            search.status,
            0,)
    }

    const options_limit = [
        { label: 'Todos', value: 1 },
        ...limit_options.map((option) => ({ label: option, value: option })),
    ];

    const StatusCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) => (
  <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700">
    <div className="mb-2">{icon}</div>
    <span className="font-semibold text-gray-600 dark:text-gray-300">{label}</span>
    <span className={`text-xl font-bold ${color}`}>{value}</span>
  </div>
);

  
    return (
        <>
            <DivGlobal className="flex flex-col gap-5 p-5 lg:p-8 w-full">
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

                            setSearch({
                                ...search,
                                branch: newBranchId,
                            });
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
                    <Select
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
                    </Select>
                    <Select
                        disallowEmptySelection
                        aria-label="Cantidad a mostrar"
                        className=" dark:text-white max-w-64 max-md:hidden"
                        classNames={{
                            label: 'font-semibold',
                        }}
                        defaultSelectedKeys={['20']}
                        labelPlacement="outside"
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
                    </ResponsiveFilterWrapper>
                    <Card className="w-full h-fit shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl">
                        <CardBody className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6">
                            <StatusCard
                                color="text-yellow-500"
                                icon={<ClipboardIcon className="w-6 h-6 text-yellow-500" />}
                                label="Registradas"
                                value={statusTotals.open}
                            />
                            <StatusCard
                                color="text-blue-500"
                                icon={<LoaderIcon className="w-6 h-6 text-blue-500" />}
                                label="En progreso"
                                value={statusTotals.inProgress}
                            />
                            <StatusCard
                                color="text-green-500"
                                icon={<CheckCircleIcon className="w-6 h-6 text-green-500" />}
                                label="Completadas"
                                value={statusTotals.completed}
                            />
                            <StatusCard
                                color="text-red-500"
                                icon={<XCircleIcon className="w-6 h-6 text-red-500" />}
                                label="Canceladas"
                                value={statusTotals.canceled}
                            />
                        </CardBody>
                    </Card>


                    <TableComponent
                        headers={["Nº", 'Producto', "Fecha de inicio", "Hora de inicio", "Fecha de fin", 'Hora de fin', 'Estado',]}
                    >
                        {production_orders_report.length === 0 && (
                            <tr>
                                <td className="p-3" colSpan={7}>
                                    <EmptyTable />
                                </td>
                            </tr>
                        )}
                        {production_orders_report.map((porD, index) => (
                            <tr key={index}>
                                <TdGlobal className="p-3">{index + 1}</TdGlobal>
                                <TdGlobal className="p-3">{porD.branchProduct.product.name}</TdGlobal>
                                <TdGlobal className="p-3">{porD.date}</TdGlobal>
                                <TdGlobal className="p-3">{porD.time}</TdGlobal>
                                <TdGlobal className="p-3">{porD.endDate || 'No definido'}</TdGlobal>
                                <TdGlobal className="p-3">{porD.endTime || 'No definido'}</TdGlobal>
                                <TdGlobal className="p-3">
                                    {RenderIconStatus({ status: porD.statusOrder as Status }) || porD.statusOrder}
                                </TdGlobal>
                            </tr>
                        ))}
                    </TableComponent>
                    <Pagination
                        currentPage={pagination_production_orders_report.currentPag}
                        nextPage={pagination_production_orders_report.nextPag}
                        previousPage={pagination_production_orders_report.prevPag}
                        totalPages={pagination_production_orders_report.totalPag}
                        onPageChange={(page) => setSearch({ ...search, page })}
                    />
            </DivGlobal>
        </>
    )
}