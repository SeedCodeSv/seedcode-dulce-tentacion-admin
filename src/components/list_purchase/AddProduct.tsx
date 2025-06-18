import { useEffect, useState } from 'react';
import { Button, Checkbox, Input, useDisclosure } from '@heroui/react';
import { Plus, Search, Tag, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { CiBarcode, CiCirclePlus, CiMoneyBill } from 'react-icons/ci';
import { toast } from 'sonner';
import classNames from 'classnames';

import { useBranchProductStore } from '../../store/branch_product.store';
import { useSupplierStore } from '../../store/supplier.store';
import { useBranchesStore } from '../../store/branches.store';
import { global_styles } from '../../styles/global.styles';
import Pagination from '../global/Pagination';
import SlideInModalGlobal from '../global/SlideInModalGlobal';
import ModalGlobal from '../global/ModalGlobal';

import { usePurchaseOrdersStore } from '@/store/purchase_orders.store';
import { Supplier } from '@/types/purchase_orders.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { IBranchProductOrder } from '@/types/branch_products.types';
import { TableComponent } from '@/themes/ui/table-ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  supplierName?: string;
  branchName: string;
  purshaseId: number;
  reloadData: () => void;
}
function AddProduct({ isOpen, onClose, supplierName, branchName, reloadData, purshaseId }: Props) {
  const [productName, setProductName] = useState('');
  const [code, setCode] = useState('');
  const { details_order_purchase } = usePurchaseOrdersStore();
  const { getBranchProductOrders, branch_product_order_paginated } = useBranchProductStore();
  const { OnAddProductOrder } = usePurchaseOrdersStore();
  const { getSupplierList } = useSupplierStore();
  const { getBranchesList } = useBranchesStore();
  const [supplierSelected, setSupplierSelected] = useState<Supplier>()
  const modalSelect = useDisclosure()
  const [branchProduct, setBranchProduct] = useState<IBranchProductOrder>()


  useEffect(() => {
    getBranchesList();
    getSupplierList('');
  }, []);

  useEffect(() => {
    getBranchProductOrders(branchName, supplierName, productName, code, 1, 10);
  }, [branchName, supplierName, 10, productName, code]);

  const handeAddProduct = (itemId: number, supplierId?: number) => {
    OnAddProductOrder(purshaseId, { branchProductId: itemId, quantity: 1, supplierId }).then((res) => {
      if (res.ok) {
        toast.success('Producto agregado correctamente');
        reloadData();
      } else {
        toast.error('Error al agregar el producto');
      }
    });
    setSupplierSelected(undefined)
  };

  return (
    <SlideInModalGlobal className='w-full lg:w-1/2' open={isOpen} setOpen={() => onClose()} title="Nueva orden de compra">
      <div className="bg-transparent border p-4 w-full sm:p-6 rounded-xl h-[calc(100vh-200px)] flex-grow overflow-hidden flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Input
              className="w-full dark:text-white font-semibold"
              label="Nombre"
              labelPlacement="outside"
              placeholder="Escribe el nombre del producto"
              startContent={<Search />}
              variant="bordered"
              onChange={(e) => setProductName(e.target.value)}
              onClear={() => setProductName('')}
            />
          </div>
          <div>
            <Input
              className="w-full dark:text-white font-semibold"
              label="Código"
              labelPlacement="outside"
              placeholder="Escribe el código del producto"
              startContent={<Search />}
              variant="bordered"
              onChange={(e) => setCode(e.target.value)}
              onClear={() => setCode('')}
            />
          </div>
        </div>
        <div className="space-y-4 overflow-y-auto scrollbar-hide flex-grow pt-3">
          <div className="md:hidden space-y-4 mt-3">
            {branch_product_order_paginated.branchProducts.map((b, index) => (
              <motion.div
                key={b.id}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg border shadow-md p-4"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold flex items-center mb-2 dark:text-white">
                  <Tag className="mr-2" size={20} />
                  {b.product.name}
                </h3>
                <p className="text-sm flex items-center dark:text-white mb-1">
                  <Truck className="mr-2" size={15} />
                  {b.suppliers.length}
                </p>
                <p
                  className={`${b.stock < 5 ? 'dark:text-red-500 text-red-600' : ''} text-sm  flex items-center dark:text-white mb-3}`}
                >
                  <CiCirclePlus className="mr-2" />
                  {b.stock}
                </p>
                <p className="text-sm  flex items-center dark:text-white mb-1">
                  <CiBarcode className="mr-2" />
                  {b.product.code}
                </p>
                <p className="text-sm  flex items-center text-green-400 mb-3">
                  <CiMoneyBill className="mr-2" />${b.price}
                </p>

                <ButtonUi
                  color="success"
                  size="sm"
                  theme={details_order_purchase.find((p) => p.branchProduct.product.id === b.product.id)
                    ? Colors.Success : Colors.Info}
                  onPress={() => {
                    if (b.suppliers.length > 1) {
                      setBranchProduct(b);
                      modalSelect.onOpen();
                    } else {
                      handeAddProduct(b.id, b.suppliers[0].id)
                    }
                  }
                  }
                >
                  <Plus color="white" />
                  <p className="text-white">
                    {' '}
                    {details_order_purchase.find((p) => p.branchProduct.product.id === b.product.id)
                      ? 'Añadido'
                      : 'Añadir'}
                  </p>
                </ButtonUi>
              </motion.div>
            ))}
          </div>
            <TableComponent className="hidden md:block overflow-x-auto pt-3" headers={['Nombre','Proveedores', 'Stock', 'Código', 'Precio', 'Costo Unitario', 'Acciones']}>
              {branch_product_order_paginated.branchProducts.map((b, index) => (
                <motion.tr
                  key={b.id}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="px-4 py-2 dark:text-white">{b.product.name}</td>
                  <td className="px-4 py-2 dark:text-white">{b.suppliers.length}</td>
                  <td className={`${b.stock < 5 ? 'text-red-600' : 'dark:text-white'} px-4 py-2`}>
                    {b.stock}
                  </td>

                  <td className="px-4 py-2 dark:text-white">{b.product.code}</td>
                  <td className="px-4 py-2 text-green-400">${b.price}</td>
                  <td className="px-4 py-2 text-green-400">${b.costoUnitario}</td>
                  <td className="px-4 py-2 text-center dark:text-white">
                    <Button
                      isIconOnly
                      size="sm"
                      style={global_styles().thirdStyle}
                      onPress={() => {
                        if (b.suppliers.length > 1) {
                          setBranchProduct(b);
                          modalSelect.onOpen();
                        } else {
                          handeAddProduct(b.id, b.suppliers[0].id)
                        }
                      }
                      }
                    >
                      <Plus color="white" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </TableComponent>
          </div>
          <>
            {branch_product_order_paginated.totalPag > 1 && (
              <>
                <div className="w-full mt-5">
                  <Pagination
                    currentPage={branch_product_order_paginated.currentPag}
                    nextPage={branch_product_order_paginated.nextPag}
                    previousPage={branch_product_order_paginated.prevPag}
                    totalPages={branch_product_order_paginated.totalPag}
                    onPageChange={(page) => {
                      getBranchProductOrders(
                        branchName,
                        supplierName,
                        productName,
                        code,
                        page,
                        10,
                      );
                    }}
                  />
                </div>
              </>
            )}
          </>
        </div>
        <ModalGlobal
          isBlurred={true}
          isOpen={modalSelect.isOpen}
          size='w-full lg:w-[30vw]'
          title='Seleccionar proveedor'
          onClose={() => {
            modalSelect.onClose()
            setSupplierSelected(undefined)
          }}
        >
          <div className="flex flex-col overflow-y-auto h-full w-full gap-3 pb-4">
            {branchProduct && branchProduct.suppliers?.map((sup) =>

              <div key={sup?.id} className={classNames(
                supplierSelected?.id === sup?.id
                  ? 'shadow-green-100 dark:shadow-gray-500 border-green-400 dark:border-gray-800 bg-green-50 dark:bg-gray-950'
                  : '',
                'shadow border dark:border-gray-600 w-full flex flex-col justify-start rounded-[12px] p-4'
              )}>
                <div className="flex justify-between gap-5 w-full">
                  {/* <Truck/> */}
                  <p className="text-sm font-semibold dark:text-white">{sup?.nombre}</p>
                  <Checkbox
                    checked={supplierSelected?.id === sup?.id}
                    isSelected={supplierSelected?.id === sup?.id}
                    onValueChange={() => {
                      setSupplierSelected(sup);
                    }}
                  />
                </div>
              </div>
            )}
            <ButtonUi
              theme={Colors.Info}
              onPress={() => {
                if (supplierSelected && branchProduct) {
                  handeAddProduct(branchProduct.id, supplierSelected.id);
                  modalSelect.onClose()
                }
              }}
            >Continuar</ButtonUi>
          </div>
        </ModalGlobal>
    </SlideInModalGlobal>
  );
}

export default AddProduct;
