import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import FullDialog from '../global/FullDialog';
import AddPurchaseOrders from './AddPurchaseOrders';
import AddButton from '../global/AddButton';
import { formatDate } from '../../utils/dates';
import { useEffect, useState } from 'react';
import { usePurchaseOrdersStore } from '../../store/purchase_orders.store';
import Pagination from '../global/Pagination';
import EditMode from './EditMode';
import { PurchaseOrder } from '../../types/purchase_orders.types';
import { ClipboardCheck } from 'lucide-react';
import { useSupplierStore } from '../../store/supplier.store';
import { ArrayAction } from '@/types/view.types';
import { useNavigate } from 'react-router';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import NO_DATA from '@/assets/svg/no_data.svg';
import ThGlobal from '@/themes/ui/th-global';

// import { Drawer } from "vaul";
function ListPurchasesOrders({ actions }: ArrayAction) {
  const modalAdd = useDisclosure();
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [limit] = useState(5);
  const [mode, setMode] = useState('show');
  const [supplier, setSupplier] = useState('');
  const [showState, setShowState] = useState('');
  const { getPurchaseOrders, purchase_orders, pagination_purchase_orders } =
    usePurchaseOrdersStore();
  const { getSupplierList, supplier_list } = useSupplierStore();
  useEffect(() => {
    getPurchaseOrders(startDate, endDate, 1, limit, supplier, showState);
  }, [startDate, endDate, limit, showState, supplier]);

  useEffect(() => {
    getSupplierList('');
  }, []);

  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder>();
  const handleSelectEdit = (purchase: PurchaseOrder) => {
    setSelectedOrder(purchase);
    setMode('edit');
  };

  const navigate = useNavigate();
  return (
    <>
      {mode === 'show' && (
        <div className=" w-full h-full bg-gray-50 dark:bg-gray-900">
          <div className="w-full h-full border border-white p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
            <div className="w-full flex justify-between">
              <p className="text-lg font-semibold dark:text-white">Listado de ordenes de compra</p>
              <div className="flex justify-end mt-3 ">
                <AddButton
                  onClick={() => {
                    navigate('/add-purchase-order');
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5 mt-5">
              <div>
                <Input
                  type="date"
                  variant="bordered"
                  label="Fecha inicial"
                  labelPlacement="outside"
                  className="dark:text-white"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                />
              </div>
              <div>
                <Input
                  type="date"
                  variant="bordered"
                  label="Fecha final"
                  labelPlacement="outside"
                  className="dark:text-white"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                />
              </div>
              <div>
                <Autocomplete
                  label="Proveedor"
                  onSelect={(e) => {
                    setSupplier(e.currentTarget.value);
                  }}
                  placeholder="Selecciona un proveedor"
                  labelPlacement="outside"
                  variant="bordered"
                >
                  {supplier_list.map((branch) => (
                    <AutocompleteItem className="dark:text-white" key={branch.id ?? 0}>
                      {branch.nombre}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            </div>
            <div className="flex flex-col mt-4 justify-between w-full gap-5 xl:flex-row xl:gap-0">
              <div className="flex w-full items-end justify-between gap-10 mt lg:justify-end">
                <Select
                  className="w-44"
                  label="Mostrar por estado"
                  placeholder="Selecciona un estado"
                  labelPlacement="outside"
                  variant="bordered"
                  value={limit}
                  onChange={(e) => setShowState(e.target.value ? e.target.value : '')}
                >
                  <SelectItem className="dark:text-white" key={''}>
                    Mostrar todos
                  </SelectItem>
                  <SelectItem className="dark:text-white" key={'false'}>
                    Pendientes
                  </SelectItem>
                  <SelectItem className="dark:text-white" key={'true'}>
                    Completados
                  </SelectItem>
                </Select>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
              <table className="w-full">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr>
                    <ThGlobal className="text-left p-3">No.</ThGlobal>
                    <ThGlobal className="text-left p-3">Fecha</ThGlobal>
                    <ThGlobal className="text-left p-3">Proveedor</ThGlobal>
                    <ThGlobal className="text-left p-3">Sucursal</ThGlobal>
                    <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                  </tr>
                </thead>
                <tbody className="max-h-[600px] w-full overflow-y-auto">
                  {purchase_orders.length > 0 ? (
                    <>
                      {purchase_orders.map((cat) => (
                        <tr className="border-b border-slate-200" key={cat.id}>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {cat.id}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                            {cat.date}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {cat.supplier.nombre}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {cat.branch.name}
                          </td>
                          <td>
                            {actions.includes('Editar') && (
                              <ButtonUi
                                onPress={() => handleSelectEdit(cat)}
                                isIconOnly
                                theme={Colors.Primary}
                              >
                                <ClipboardCheck />
                              </ButtonUi>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <div className="flex flex-col items-center justify-center w-full">
                          <img src={NO_DATA} alt="X" className="w-32 h-32" />
                          <p className="mt-3 text-xl">No se encontraron resultados</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Pagination
                nextPage={pagination_purchase_orders.nextPag}
                previousPage={pagination_purchase_orders.prevPag}
                currentPage={pagination_purchase_orders.currentPag}
                totalItems={pagination_purchase_orders.total}
                totalPages={pagination_purchase_orders.totalPag}
                onPageChange={(page) => {
                  getPurchaseOrders(startDate, endDate, page, limit);
                }}
              />
            </div>
          </div>
          <FullDialog
            isOpen={modalAdd.isOpen}
            onClose={modalAdd.onClose}
            title="Nueva orden de compra"
          >
            <AddPurchaseOrders />
          </FullDialog>
        </div>
      )}
      {mode === 'edit' && selectedOrder && (
        <EditMode
          reload={() => {
            getPurchaseOrders(startDate, endDate, 1, limit, supplier, showState);
          }}
          returnMode={() => {
            setMode('show');
          }}
          purchase_order={selectedOrder}
        />
      )}
    </>
  );
}

export default ListPurchasesOrders;
