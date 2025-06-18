import {
  Button,
  Input,
  Select,
  SelectItem,
} from '@heroui/react';
import { AlignJustify, ClipboardCheck, Shield, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import AddButton from '../global/AddButton';
import { usePurchaseOrdersStore } from '../../store/purchase_orders.store';
import Pagination from '../global/Pagination';
import TooltipGlobal from '../global/TooltipGlobal';
import LoadingTable from '../global/LoadingTable';
import EmptyTable from '../global/EmptyTable';
import useGlobalStyles from '../global/global.styles';
import { ResponsiveFilterWrapper } from '../global/ResposiveFilters';

import { limit_options } from '@/utils/constants';
import { formatDate } from '@/utils/dates';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';

interface Props {
  actions: string[];
}
function ListPurchasesOrders({ actions }: Props) {
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [limit, setLimit] = useState(5);

  const [showState, setShowState] = useState('');
  const {
    getPurchaseOrders,
    purchase_orders,
    pagination_purchase_orders,
    pagination_purchase_orders_loading,
  } = usePurchaseOrdersStore();

  const styles = useGlobalStyles();

  useEffect(() => {
    getPurchaseOrders(startDate, endDate, 1, limit, '', showState);
  }, [limit, showState]);

  const handleSearch = (searchParam: string | undefined) => {
    getPurchaseOrders(
      searchParam ?? startDate,
      searchParam ?? endDate,
      1,
      limit,
      '',
      showState
    );
  };

  const [isOpen, setIsOpen] = useState({
    isOpen: false,
    purchaseId: 0,
  });

  const openModal = (purchaseId: number) => {
    setIsOpen({
      isOpen: true,
      purchaseId: purchaseId,
    });
  };

  const navigate = useNavigate();

  return (
    <>
      <DivGlobal >
          <div className="flex flex-row justify-between w-full gap-5 lg:flex-col lg:gap-0">
            <ResponsiveFilterWrapper
              onApply={() => handleSearch(undefined)}
            >
              <div className="w-full">
                <Input
                  className="dark:text-white"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Fecha inicial"
                  labelPlacement="outside"
                  type="date"
                  value={startDate}
                  variant="bordered"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="w-full">
                <Input
                  className="dark:text-white"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Fecha final"
                  labelPlacement="outside"
                  type="date"
                  value={endDate}
                  variant="bordered"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
               <Select
                  className="font-semibold w-full"
                  label="Mostrar por estado"
                  labelPlacement="outside"
                  placeholder="Selecciona un estado"
                  variant="bordered"
                  onChange={(e) => setShowState(e.target.value ? e.target.value : '')}
                >
                  <SelectItem key={''} className="dark:text-white" >
                    Mostrar todos
                  </SelectItem>
                  <SelectItem key={'false'} className="dark:text-white" >
                    Pendientes
                  </SelectItem>
                  <SelectItem key={'true'} className="dark:text-white" >
                    Completados
                  </SelectItem>
                </Select>
                <div className="flex lg:hidden">
                <Select
                  className="w-full dark:text-white"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  defaultSelectedKeys={['5']}
                  label="Mostrar"
                  labelPlacement="outside"
                  variant="bordered"

                  onChange={(e) => {
                    setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                  }}
                >
                  {limit_options.map((limit) => (
                    <SelectItem key={limit} className="dark:text-white">
                      {limit}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </ResponsiveFilterWrapper>
            <div className="flex justify-between gap-4 mt-4">
              <div className="hidden lg:flex">
                <Select
                  className="w-44 dark:text-white"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  defaultSelectedKeys={['5']}
                  label="Mostrar"
                  labelPlacement="outside"
                  variant="bordered"

                  onChange={(e) => {
                    setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                  }}
                >
                  {limit_options.map((limit) => (
                    <SelectItem key={limit} className="dark:text-white">
                      {limit}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="flex justify-end gap-4">

                <div className="flex justify-end mt-6 ">
                  {actions.includes('Agregar') && (
                    <AddButton
                      onClick={() => {
                        navigate('/add-purchase-order');
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <>
             <TableComponent
              headers={["Nº", "Fecha", "Sucursal",'Estado','Acciones']}
            >
                  {pagination_purchase_orders_loading ? (
                    <tr>
                      <td className="p-3 text-sm text-center text-slate-500" colSpan={5}>
                        <LoadingTable />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {purchase_orders.length > 0 ? (
                        <>
                          {purchase_orders.map((product, index) => (
                            <tr key={index} className="border-b border-slate-200">
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {product.id}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                {product.date}
                              </td>
                              <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100">
                                {product.branch.name}
                              </td>
                              <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100">
                                {product && product.state ? (
                                  <span className="bg-green-500 text-white px-3 py-1 rounded-lg w-32 text-center">
                                    COMPLETADO
                                  </span>
                                ) : (
                                  <span className="bg-red-500 text-white px-5 py-1 rounded-lg w-32 text-center">
                                    PENDIENTE
                                  </span>
                                )}
                              </td>

                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                <div className="flex w-full gap-5">
                                  <>
                                    {product.state === false ? (
                                      <>
                                        {actions.includes('Completar Orden') && (
                                          <TooltipGlobal text="Completar orden">
                                            <Button
                                              isIconOnly
                                              style={styles.secondaryStyle}
                                              onPress={() =>
                                                navigate(`/update-purchase-detail/${product.id}`)
                                              }
                                            >
                                              <ClipboardCheck />
                                            </Button>
                                          </TooltipGlobal>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <TooltipGlobal text="Editar">
                                          <>
                                            {actions.includes('Editar') && (
                                              <Button
                                                isDisabled
                                                isIconOnly
                                                style={styles.secondaryStyle}
                                                onPress={() => openModal(product.id)}
                                              >
                                                <AlignJustify />
                                              </Button>
                                            )}
                                          </>
                                        </TooltipGlobal>
                                      </>
                                    )}
                                  </>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={6}>
                            <EmptyTable />
                          </td>
                        </tr>
                      )}
                    </>
                  )}
               </TableComponent>
          </>

          {pagination_purchase_orders.totalPag > 1 && (
            <>
              <div className="w-full mt-5">
                <Pagination
                  currentPage={pagination_purchase_orders.currentPag}
                  nextPage={pagination_purchase_orders.nextPag}
                  previousPage={pagination_purchase_orders.prevPag}
                  totalItems={pagination_purchase_orders.total}
                  totalPages={pagination_purchase_orders.totalPag}
                  onPageChange={(page) => {
                    getPurchaseOrders(startDate, endDate, page, limit);
                  }}
                />
              </div>
            </>
          )}
      </DivGlobal>

      <AnimatePresence>
        {isOpen.isOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black z-[999] bg-opacity-50 flex items-center justify-center p-4"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.div
              animate={{ x: 0, opacity: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
              exit={{ x: '100%', opacity: 0 }}
              initial={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center border-b p-4">
                <motion.h3
                  animate={{ x: 0, opacity: 1 }}
                  className="text-lg font-semibold text-gray-900"
                  initial={{ x: 20, opacity: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Seleccionar el tipo
                </motion.h3>
                <button
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                  onClick={() => setIsOpen({ ...isOpen, isOpen: false })}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex justify-center items-center">
                <Shield size={100} />
              </div>
              <div className="p-4 space-y-4 flex justify-center items-center ">
                <motion.div
                  animate={{ y: 0, opacity: 1 }}
                  className=" space-x-4"
                  initial={{ y: 20, opacity: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      color="danger"
                      onPress={() => navigate(`/reset-product-order/${isOpen.purchaseId}`)}
                    >
                      Perdida de Productos
                    </Button>
                    <Button
                      className="text-white"
                      color="success"
                      onPress={() => navigate(`/transform-products/${isOpen.purchaseId}`)}
                    >
                      Nuevo Producto
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ListPurchasesOrders;
