import { Button, Input, Select, SelectItem, useDisclosure } from '@heroui/react';
import { motion } from 'framer-motion';
import { CloudUpload, Copy, LoaderIcon, Plus, Trash } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import TooltipGlobal from '../global/TooltipGlobal';

import AddProduct from './AddProduct';

import { DetailPurchaseOrder } from '@/types/purchase_orders.types';
import { global_styles } from '@/styles/global.styles';
import { usePurchaseOrdersStore } from '@/store/purchase_orders.store';
import HeadlessModal from '@/components/global/HeadlessModal';
import DivGlobal from '@/themes/ui/div-global';
function UpdatePurchaseDetail() {
  const { purchaseId } = useParams();
  const {
    getPurchaseOrderDetail,
    details_order_purchase,
    updateOrderProduct,
    removeProductsFromPrchaseProductAdd,
    updateCostOrder,
    updatePurchaseOrder,
    updateQuantityOrder,
    updatePriceOrder,
    loading_complete,
    deleteProductDetail,
    removeProductFromPrchaseProductAdd,
    onUpdateSupplier,
    duplicateProduct
  } = usePurchaseOrdersStore();
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (item: DetailPurchaseOrder, newQuantity: number) => {
    const quantity = newQuantity || 0;

    updateQuantityOrder(item.numItem!, quantity);
  };
  const handlePriceChange = (item: DetailPurchaseOrder, newPrice: number) => {
    const updatedPrices = { ...prices, [item.branchProductId]: newPrice };

    setPrices(updatedPrices);
    if (item.isNew) {
      updatePriceOrder(item.branchProductId, newPrice);
    } else {
      updateOrderProduct(item.purchaseOrderId, newPrice, '');
    }

  };
  const handleCostChange = (item: DetailPurchaseOrder, newCost: string) => {
    const cost = newCost;

    updateCostOrder(item.branchProductId, cost);
    if (!item.isNew) {
      updateOrderProduct(item.purchaseOrderId, newCost, '');
    }
  };
  const [totalGlobal, setTotalGlobal] = useState(0);

  useEffect(() => {
    if (purchaseId) {
      getPurchaseOrderDetail(Number(purchaseId));
    }
  }, [purchaseId]);
  const total = useMemo(() => {
    return details_order_purchase.reduce((acc, item) => {
      return acc + item.quantity * Number(item.branchProduct?.costoUnitario || 0);
    }, 0);
  }, [details_order_purchase]);

  useEffect(() => {
    setTotalGlobal(total);
  }, [total]);
  useEffect(() => {
    removeProductsFromPrchaseProductAdd();
  }, []);
  const modalAddProduct = useDisclosure();

  const navigate = useNavigate();
  const handleUpdate = async () => {
    try {
      if (details_order_purchase.length > 0) {
        const items = details_order_purchase.map((p) => ({
          branchProductId: p.branchProductId,
          quantity: p.quantity,
          unitPrice: prices[p.branchProductId!] || Number(p.branchProduct?.price),
          cost: Number(p.branchProduct?.costoUnitario),
          isNew: p.isNew || false,
          sellingPrice: p.branchProduct?.price,
          iva: true,
          supplierId: p.supplierId
        }));

        await updatePurchaseOrder(Number(purchaseId), items).then((res) => {
          if (res.ok) {
            toast.success('Orden de compra actualizada correctamente');
            navigate('/purchase-orders');
          }
        });
      }
    } catch (error) {
      toast.error('Ocurrió un error al guardar la información');
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DivGlobal >
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold dark:text-white mb-6">Detalle de Orden</h2>
        </div>
        <div className="grid w-full grid-cols-2 mt-4">
          <p className="text-lg font-semibold dark:text-white">
            Total:{' '}
            <span className="font-normal text-green-700 dark:text-green-400 ">
              ${totalGlobal.toFixed(2)}
            </span>
          </p>
          <p className="text-lg font-semibold dark:text-white">
            Fecha:{' '}
            <span className="font-normal">
              {(details_order_purchase[0] && details_order_purchase[0]?.purchaseOrder?.date) ??
                ''}
            </span>
          </p>
          <p className="text-lg font-semibold  dark:text-white">
            Hora:{' '}
            <span className="font-normal ">
              {(details_order_purchase[0] && details_order_purchase[0]?.purchaseOrder?.time) ??
                ''}
            </span>
          </p>
        </div>

        <div className="w-full h-full p-3 border rounded-xl shadow-lg mt-3">
          <div className="flex justify-end">
            <div>
              <Button
                isIconOnly
                className="rounded-xl p-2 m-0 mx-2"
                style={global_styles().thirdStyle}
                onPress={modalAddProduct.onOpen}
              >
                <Plus />
              </Button>
              <AddProduct
                branchName={
                  (details_order_purchase[0] &&
                    details_order_purchase[0].purchaseOrder?.branch?.name) ||
                  ''
                }
                isOpen={modalAddProduct.isOpen}
                purshaseId={Number(purchaseId)}
                reloadData={() => {
                  getPurchaseOrderDetail(Number(purchaseId));
                }}
                onClose={modalAddProduct.onClose}
              />
            </div>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <td className="py-3 px-4 flex items-center justify-center">N°</td>
                  <td>Producto</td>
                  <td>Proveedor</td>
                  <td>Precio</td>
                  <td>Cantidad</td>
                  <td>Stock</td>
                  <td>Costo</td>
                  <td>Subtotal</td>
                  <td>Acciones</td>
                </tr>
              </thead>
              <tbody>
                {details_order_purchase &&
                  details_order_purchase.map((item, index) => (
                    <motion.tr
                      key={index}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-gray-200 "
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <td className="py-3 pl-2 dark:text-white">{index + 1}</td>
                      <td className="py-3 dark:text-white">
                        {item.branchProduct?.product?.name || 'Producto no disponible'}
                      </td>
                      <td className="py-3 dark:text-white">
                        {item.isNew && item.branchProduct?.suppliers?.length > 0 ? (
                          <Select
                            className="w-72 dark:text-white"
                            classNames={{ label: 'font-semibold' }}
                            placeholder="Selecciona el proveedor"
                            selectedKeys={[Number(item.supplier?.id).toString()]}
                            variant="bordered"
                          >
                            {item.branchProduct.suppliers.map((sup) => (
                              <SelectItem
                                key={sup.id}
                                className="dark:text-white" onPress={() => onUpdateSupplier(String(item.numItem), sup)}>
                                {sup.nombre}
                              </SelectItem>
                            ))}
                          </Select>
                        ) : (
                          <p>
                            {item.supplier?.nombre || 'Proveedor no disponible'}
                          </p>
                        )}
                      </td>
                      <td className="py-3 text-green-700 dark:text-green-400 ">
                        <Input
                          className="w-28"
                          startContent={
                            <div className="flex items-center pointer-events-none">
                              <span className=" text-green-700 dark:text-green-400 text-small">
                                $
                              </span>
                            </div>
                          }
                          type="number"
                          value={
                            prices[item.branchProductId!]?.toString() ||
                            item.branchProduct?.price.toString() ||
                            ''
                          }
                          variant="bordered"
                          onChange={(e) => handlePriceChange(item, Number(e.target.value))}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Input
                          className="w-28 dark:text-white"
                          lang="es"
                          type="number"
                          value={item.quantity.toString()}
                          variant="bordered"
                          onChange={(e) => {
                            const newQuantity = Number(e.target.value);

                            handleQuantityChange(item, newQuantity);
                          }}
                        />
                      </td>
                      <td className="py-3 text-green-700 dark:text-green-400">
                        {item.branchProduct?.stock || 0}
                      </td>

                      <td className="py-3 text-green-700 dark:text-green-400">
                        {' '}
                        <Input
                          className="w-28"
                          defaultValue={item.branchProduct?.costoUnitario?.toString() || '0.00'}
                          startContent={
                            <div className="flex items-center pointer-events-none">
                              <span className=" text-green-700 dark:text-green-400 text-small">
                                $
                              </span>
                            </div>
                          }
                          step={0.01}
                          type="number"
                          value={item.branchProduct?.costoUnitario?.toString() || '0.00'}
                          variant="bordered"
                          onChange={(e) => handleCostChange(item, e.target.value)}
                        />
                      </td>

                      <td className="py-3 px-4 text-green-700 dark:text-green-400">
                        ${(Number(item?.branchProduct?.costoUnitario) * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-green-700 dark:text-green-400">
                        <div className="flex gap-5">
                          {item.isNew ? (
                            <Button
                              isIconOnly
                              style={global_styles().dangerStyles}
                              onPress={() =>
                                removeProductFromPrchaseProductAdd(String(item.numItem))
                              }
                            >
                              <Trash />
                            </Button>
                          ) : (
                            <>
                              <Button
                                isIconOnly
                                style={global_styles().dangerStyles}
                                onPress={() => deleteProductDetail(item)}
                              >
                                <Trash />
                              </Button>
                              <TooltipGlobal text='Duplicar fila'>
                                <Button
                                  isIconOnly
                                  style={global_styles().warningStyles}
                                  onPress={() => duplicateProduct(item)}
                                >
                                  <Copy size={18} />
                                </Button>
                              </TooltipGlobal>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="w-full flex justify-end mt-5">
            <Button
              className="px-16 mb-3"
              disabled={loading_complete}
              style={global_styles().thirdStyle}
              onPress={handleUpdate}
            >
              {loading_complete ? <LoaderIcon className=" animate-spin" /> : 'Guardar'}
            </Button>
          </div>
        </div>
        <HeadlessModal
          isOpen={isOpen}
          size={
            window.innerWidth < 700
              ? 'w-full md:w-[600px]   lg:w-[800px]  xl:w-[7000px] '
              : 'w-full md:w-[500px]  lg:w-[700px] xl:w-[500px]' + ' p-5'
          }
          title=""
          onClose={() => setIsOpen(false)}
        >
          <label
            className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
            htmlFor="uploadFile1"
          >
            <CloudUpload size={40} />
            Selecciona un archivo JSON
            {/* <input onChange={handleFileChange} type="file" id="uploadFile1" className="hidden" /> */}
          </label>
        </HeadlessModal>
      </DivGlobal>
    </>
  );
}

export default UpdatePurchaseDetail;
