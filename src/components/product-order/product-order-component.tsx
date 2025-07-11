import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Clock,
  Eye,
  Hash,
  Info,
  ReceiptText,
  ShoppingCart,
  StickyNote,
  Store,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { PiFilePdfDuotone, PiMicrosoftExcelLogo } from 'react-icons/pi';
import axios from 'axios';
import { toast } from 'sonner';

import EmptyTable from '../global/EmptyTable';
import { ResponsiveFilterWrapper } from '../global/ResposiveFilters';
import Pagination from '../global/Pagination';
import RenderViewButton from '../global/render-view-button';

import { RenderStatus, Status, StautsProductOrder } from './render-order-status';
import { exportToExcelOrderProduct } from './exportExcel';
import { exportToPDFOrderProduct, IOrderProduct } from './exportPdf';
import CardProductOrderComponent from './card-product-order-component';

import ButtonUi from '@/themes/ui/button-ui';
import DivGlobal from '@/themes/ui/div-global';
import TdGlobal from '@/themes/ui/td-global';
import useColors from '@/themes/use-colors';
import { Order } from '@/types/order-products.types';
import { useOrderProductStore } from '@/store/order-product.store';
import { Colors } from '@/types/themes.types';
import Pui from '@/themes/ui/p-ui';
import { TableComponent } from '@/themes/ui/table-ui';
import { getElSalvadorDateTime } from '@/utils/dates';
import { API_URL, limit_options } from '@/utils/constants';
import { useBranchesStore } from '@/store/branches.store';
import { useShippingBranchProductBranch } from '@/shopping-branch-product/store/shipping_branch_product.store';
import { useProductionOrderStore } from '@/store/production-order.store';
import useWindowSize from '@/hooks/useWindowSize';
import { useTransmitterStore } from '@/store/transmitter.store';

export default function ProductOrderComponent() {
  const { backgroundColor, textColor } = useColors();
  const { getBranchesList, branch_list } = useBranchesStore();
  const { onAddBydetail, onAddBranchDestiny, onAddOrderId } = useShippingBranchProductBranch();
  const { addSelectedProducts } = useProductionOrderStore();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order>();
const {transmitter, gettransmitter} = useTransmitterStore()
  const { getOrdersByDates, ordersProducts } = useOrderProductStore();
  const currentDate = new Date();
  const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const modalDetails = useDisclosure();
  const { windowSize } = useWindowSize()
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : "table"
  )
  const [search, setSearch] = useState({
    page: 1,
    limit: 20,
    branchId: 0,
    startDate: defaultStartDate.toISOString().split('T')[0],
    endDate: getElSalvadorDateTime().fecEmi,
    status: '',
  });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  useEffect(() => {
    gettransmitter()
    getBranchesList();
    getOrdersByDates(search);
  }, []);
  const handleDetails = (order: Order) => {
    setSelectedOrder(order);
    modalDetails.onOpen();
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'abierta':
        return 'bg-blue-100 text-blue-800';
      case 'cerrada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'en proceso':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSearch = (page: number) => {
    getOrdersByDates({ ...search, page });
  };

  const getOrderProductReport = async (): Promise<IOrderProduct[]> => {
    try {
      const response = await axios.post(API_URL + '/order-product/order-report', {
        startDate: search.startDate,
        endDate: search.endDate,
        ids: selectedIds,
      });

      const responseData =
        typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      return responseData.data;
    } catch (error) {
      toast.error('Errr al obtener los datos');
      throw error;
    }
  };

  const exportExcel = async () => {
    try {
      const reportData = await getOrderProductReport();

      if (reportData && reportData.length > 0) {
        await exportToExcelOrderProduct(reportData, search.startDate, search.endDate, transmitter);
        toast.success('Exportado con éxito');
      } else {
        toast.error('No hay datos para exportar');
      }
    } catch (error) {
      toast.error('Error al exportar: ' + (error as Error).message);
    }
  };

  const exportPdf = async () => {
    try {
      const reportData = await getOrderProductReport();

      if (reportData && reportData.length > 0) {
        await exportToPDFOrderProduct(reportData, search.startDate, search.endDate, transmitter);
        toast.success('Exportado con éxito');
      } else {
        toast.error('No hay datos para exportar');
      }
    } catch (error) {
      toast.error('Error al exportar: ' + (error as Error).message);
    }
  };

  return (
    <DivGlobal>
      <ResponsiveFilterWrapper
        classButtonLg="col-start-5"
        classLg="w-full grid grid-cols-5 gap-4 items-end"
        onApply={() => handleSearch(1)}
      >
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
          className="dark:text-white"
          classNames={{ label: 'font-semibold' }}
          id="fecha-inicial"
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
          aria-label="Estado"
          className=" dark:text-white w-full max-md:hidden"
          classNames={{
            label: 'font-semibold',
          }}
          label="Estado"
          labelPlacement="outside"
          placeholder="selecciona para buscar"
          value={search.status}
          variant="bordered"
          onChange={(e) => {
            setSearch({ ...search, status: e.target.value });
          }}
        >
          {StautsProductOrder.map((item) => (
            <SelectItem key={item} className="dark:text-white">
              {item}
            </SelectItem>
          ))}
        </Select>
        <Select
          disallowEmptySelection
          aria-label="Cantidad a mostrar"
          className=" dark:text-white w-full max-md:hidden"
          classNames={{
            label: 'font-semibold',
          }}
          defaultSelectedKeys={['20']}
          label="Mostrar"
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
      <div className="flex gap-4 mt-1">

        <ButtonUi
          startContent={<PiMicrosoftExcelLogo className="" size={25} />}
          theme={Colors.Success}
          onPress={() => {
            exportExcel();
          }}
        >
          Exportar a excel
        </ButtonUi>
        <ButtonUi
          startContent={<PiFilePdfDuotone className="" size={25} />}
          theme={Colors.Error}
          onPress={() => {
            exportPdf();
          }}
        >
          Exportar a pdf
        </ButtonUi>
        <RenderViewButton setView={setView} view={view} />
      </div>
      {view === 'table' && (
        <TableComponent
          headers={[
            '',
            'Nº',
            'Fecha/Hora',
            'Sucursal que solicita',
            'Encargado',
            'Estado',
            'Acciones',
          ]}
        >
          {ordersProducts.order_products.length === 0 && (
            <tr className="border-b border-slate-200">
              <td
                className="p-2 text-sm text-slate-500 w-full font-medium dark:text-slate-100"
                colSpan={7}
              >
                <EmptyTable />
              </td>
            </tr>
          )}
          {ordersProducts.order_products.map((order, index) => (
            <tr key={index} className=" cursor-pointer">
              <TdGlobal className="p-2 text-sm">
                <Checkbox
                  key={order.id}
                  checked={selectedIds.includes(order.id)}
                  onValueChange={() => handleCheckboxChange(order.id)}
                />
              </TdGlobal>
              <TdGlobal className="p-2 text-sm">{order.id}</TdGlobal>
              <TdGlobal className="p-2 text-sm">
                {order.date} - {order.time}
              </TdGlobal>
              <TdGlobal className="p-2 text-sm">{order.branch.name}</TdGlobal>
              <TdGlobal className="p-2 text-sm">
                {order.employee.firstName} {order.employee.secondName} {order.employee.firstLastName}{' '}
                {order.employee.secondLastName}
              </TdGlobal>
              <TdGlobal className="p-2 text-sm">
                {RenderStatus({ status: order.status as Status }) || order.status}
              </TdGlobal>
              <TdGlobal className="p-2 text-sm flex gap-2">
                <ButtonUi
                  isIconOnly
                  showTooltip
                  theme={Colors.Info}
                  tooltipText="Detalles"
                  onPress={() => handleDetails(order)}
                >
                  <Eye />
                </ButtonUi>
                <ButtonUi
                  isIconOnly
                  showTooltip
                  isDisabled={order.status === 'Completada'}
                  theme={Colors.Primary}
                  tooltipText="Nota de Remisión"
                  onPress={() => {
                    navigate('/order-products-nota');
                    onAddBydetail(order.orderProductDetails);
                    onAddBranchDestiny(order.branch);
                    onAddOrderId(order.id);
                  }}
                >
                  <StickyNote />
                </ButtonUi>
                <ButtonUi
                  isIconOnly
                  showTooltip
                  isDisabled={order.status === 'Completada'}
                  theme={Colors.Error}
                  tooltipText="Orden de Producción"
                  onPress={() => {
                    navigate('/order-products-production');
                    addSelectedProducts(order.orderProductDetails);
                    onAddBranchDestiny(order.branch);
                    onAddOrderId(order.id);
                  }}
                >
                  <ReceiptText />
                </ButtonUi>
              </TdGlobal>
            </tr>
          ))}
        </TableComponent>
      )}

      {view === 'grid' && (
        <CardProductOrderComponent
          addSelectedProducts={addSelectedProducts}
          handleCheckboxChange={handleCheckboxChange}
          handleDetails={handleDetails}
          selectedIds={selectedIds}
          onAddBranchDestiny={onAddBranchDestiny}
          onAddBydetail={onAddBydetail}
          onAddOrderId={onAddOrderId}
        />
      )}

      {ordersProducts.totalPag > 1 && (
        <Pagination
          currentPage={ordersProducts.currentPag}
          nextPage={ordersProducts.nextPag}
          previousPage={ordersProducts.prevPag}
          totalPages={ordersProducts.totalPag}
          onPageChange={(page) => {
            handleSearch(page);
          }}
        />
      )}
      <Drawer
        isOpen={modalDetails.isOpen}
        placement="right"
        size="full"
        onClose={() => modalDetails.onClose()}
      >
        <DrawerContent style={{ ...backgroundColor, ...textColor }}>
          <DrawerHeader>Detalles de la orden </DrawerHeader>
          <DrawerBody>
            {selectedOrder && (
              <>
                <div className="w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold flex items-center">
                      <Hash className="w-6 h-6 mr-2 text-blue-600" />
                      Orden #{selectedOrder.id}
                      <span
                        className={`ml-4 text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}
                      >
                        {selectedOrder.status}
                      </span>
                    </h1>
                  </div>
                  <section className="bg-[rgba(255,255,255,0.1)] rounded-[12px] shadow-md p-6 mt-5 grid grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <Pui className="flex gap-2 font-semibold text-lg">
                        <CalendarDays /> Fecha
                      </Pui>
                      <Pui>{selectedOrder.date}</Pui>
                    </div>
                    <div className="flex flex-col">
                      <Pui className="flex gap-2 font-semibold text-lg">
                        <Clock /> Hora
                      </Pui>
                      <Pui>{selectedOrder.time}</Pui>
                    </div>
                    <div className="flex flex-col">
                      <Pui className="flex gap-2 font-semibold text-lg">
                        <User /> Encargado
                      </Pui>
                      <Pui>
                        {selectedOrder.employee.firstName} {selectedOrder.employee.secondName}{' '}
                        {selectedOrder.employee.firstLastName}{' '}
                        {selectedOrder.employee.secondLastName}
                      </Pui>
                    </div>
                    <div className="">
                      <Pui className="flex gap-2 font-semibold text-lg">
                        <Info /> Observaciones
                      </Pui>
                      <Pui>{selectedOrder.details}</Pui>
                    </div>
                    <div className="md:ml-0 ml-20">
                      <Pui className="flex gap-2 font-semibold text-lg">
                        <Store /> Sucursal de recepción
                      </Pui>
                      <Pui>{selectedOrder.branch.name}</Pui>
                    </div>
                  </section>
                  {/* <section className="bg-[rgba(255,255,255,0.1)] rounded-[12px] shadow-md p-6 mt-5">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                      Productos ({selectedOrder.orderProductDetails.length})
                    </h2>
                    <TableComponent
                    className='flex w-full'
                      headers={[
                        'Nº',
                        'Producto',
                        'Cantidad solicitada',
                        'Cantidad entregada',
                        'Cantidad Pendiente',
                        'Stock actual',
                        'Stock Anterior',
                      ]}
                    >
                      {ordersProducts.order_products.length === 0 && (
                        <tr className="border-b border-slate-200">
                          <td
                            className="p-2 text-sm text-slate-500 w-full font-medium dark:text-slate-100"
                            colSpan={7}
                          >
                            <EmptyTable />
                          </td>
                        </tr>
                      )}
                      {selectedOrder.orderProductDetails.map((order, index) => (
                        <tr key={index} className=" cursor-pointer">
                          <TdGlobal className="p-2 py-4">{order.id}</TdGlobal>
                          <TdGlobal className="p-2 py-4">
                            {order.branchProduct.product.name}
                          </TdGlobal>
                          <TdGlobal className="p-2 py-4">{order.quantity}</TdGlobal>
                          <TdGlobal className="p-2 py-4">{order.finalQuantitySend}</TdGlobal>
                          <TdGlobal>{order.pendingQuantity}</TdGlobal>
                          <TdGlobal className="p-2 py-4">{order.branchProduct.stock}</TdGlobal>
                          <TdGlobal className="p-2 py-4">{order.stockWhenSend}</TdGlobal>
                        </tr>
                      ))}
                    </TableComponent>
                  </section> */}
                  <section className="bg-[rgba(255,255,255,0.1)] rounded-[12px] shadow-md p-6 mt-5">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                      Productos ({selectedOrder.orderProductDetails.length})
                    </h2>

                    <div className="overflow-x-auto">
                      <TableComponent
                        headers={[
                          'Nº',
                          'Producto',
                          'Cantidad solicitada',
                          'Cantidad entregada',
                          'Cantidad Pendiente',
                          'Stock actual',
                          'Stock Anterior',
                        ]}
                      >
                        {ordersProducts.order_products.length === 0 && (
                          <tr className="border-b border-slate-200">
                            <td
                              className="p-2 text-sm text-slate-500 w-full font-medium dark:text-slate-100"
                              colSpan={7}
                            >
                              <EmptyTable />
                            </td>
                          </tr>
                        )}
                        {selectedOrder.orderProductDetails.map((order, index) => (
                          <tr key={index} className="cursor-pointer">
                            <TdGlobal className="p-2 py-4">{order.id}</TdGlobal>
                            <TdGlobal className="p-2 py-4">
                              {order.branchProduct.product.name}
                            </TdGlobal>
                            <TdGlobal className="p-2 py-4">{order.quantity}</TdGlobal>
                            <TdGlobal className="p-2 py-4">{order.finalQuantitySend}</TdGlobal>
                            <TdGlobal>{order.pendingQuantity}</TdGlobal>
                            <TdGlobal className="p-2 py-4">{order.branchProduct.stock}</TdGlobal>
                            <TdGlobal className="p-2 py-4">{order.stockWhenSend}</TdGlobal>
                          </tr>
                        ))}
                      </TableComponent>
                    </div>
                  </section>

                </div>
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </DivGlobal>
  );
}
