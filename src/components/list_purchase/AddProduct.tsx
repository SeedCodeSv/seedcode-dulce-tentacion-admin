import { useEffect, useState } from 'react';
import { Button, Input } from '@heroui/react';
import { Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { FaPencilAlt } from 'react-icons/fa';
import { CiBarcode, CiCirclePlus, CiMoneyBill } from 'react-icons/ci';
import { toast } from 'sonner';

import { useBranchProductStore } from '../../store/branch_product.store';
import { useSupplierStore } from '../../store/supplier.store';
import { useBranchesStore } from '../../store/branches.store';
import { global_styles } from '../../styles/global.styles';
import Pagination from '../global/Pagination';
import SmPagination from '../global/SmPagination';
import SlideInModalGlobal from '../global/SlideInModalGlobal';

import { usePurchaseOrdersStore } from '@/store/purchase_orders.store';

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

  useEffect(() => {
    getBranchesList();
    getSupplierList('');
  }, []);

  useEffect(() => {
    getBranchProductOrders(branchName, supplierName, productName, code, 1, 10);
  }, [branchName, supplierName, 10, productName, code]);

  const handeAddProduct = (itemId: number) => {
    OnAddProductOrder(purshaseId, { branchProductId: itemId, quantity: 1 }).then((res) => {
      if (res.ok) {
        toast.success('Producto agregado correctamente');
        reloadData();
      } else {
        toast.error('Error al agregar el producto');
      }
    });
  };

  return (
    <SlideInModalGlobal className='w-1/2' open={isOpen} setOpen={() => onClose()} title="Nueva orden de compra">
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
        <div className="space-y-4 overflow-y-auto scrollbar-hide flex-grow">
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
                  <FaPencilAlt className="mr-2" />
                  {b.product.name}
                </h3>
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

                <Button
                  color="success"
                  size="sm"
                  style={global_styles().thirdStyle}
                  onPress={() => handeAddProduct(b.id)}
                >
                  <Plus color="white" />
                  <p className="text-white">
                    {' '}
                    {details_order_purchase.find((p) => p.branchProduct.product.id === b.product.id)
                      ? 'Añadido'
                      : 'Añadir'}
                  </p>
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-transparent shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100" style={global_styles().darkStyle}>
                <tr>
                  <th className="px-4 py-2 text-left text-white">Nombre</th>
                  <th className="px-4 py-2 text-left text-white">Stock</th>
                  <th className="px-4 py-2 text-left text-white">Codigo</th>
                  <th className="px-4 py-2 text-left text-white">Precio</th>
                  <th className="px-4 py-2 text-left text-white">Costo Unitario</th>
                  <th className="px-4 py-2 text-left text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {branch_product_order_paginated.branchProducts.map((b, index) => (
                  <motion.tr
                    key={b.id}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="px-4 py-2 dark:text-white">{b.product.name}</td>
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
                        onClick={() => handeAddProduct(b.id)}
                      >
                        <Plus color="white" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <>
          {branch_product_order_paginated.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
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
              <div className="flex w-full mt-5 md:hidden">
                <SmPagination
                  currentPage={branch_product_order_paginated.currentPag}
                  handleNext={() => {
                    // serPag
                    getBranchProductOrders(branchName, supplierName, productName, code, 1, 10);
                  }}
                  handlePrev={() => {
                    getBranchProductOrders(branchName, supplierName, productName, code, 1, 10);
                  }}
                  totalPages={branch_product_order_paginated.totalPag}
                />
              </div>
            </>
          )}
        </>
      </div>
    </SlideInModalGlobal>
  );
}

export default AddProduct;
