import { useEffect } from 'react';
import HeadlessModal from '../global/HeadlessModal';
import { Button, Input } from '@nextui-org/react';
import { useBranchProductStore } from '../../store/branch_product.store';
import { useSupplierStore } from '../../store/supplier.store';
import { useBranchesStore } from '../../store/branches.store';
import { global_styles } from '../../styles/global.styles';
import { DollarSign, ScrollText, Search, Truck } from 'lucide-react';
// import { usePurchaseOrdersStore } from "../../store/purchase_orders.store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  supplierName: string;
  branchName: string;
}

function AddProduct({ isOpen, onClose, supplierName, branchName }: Props) {
  const { getBranchProductOrders, branch_product_order } = useBranchProductStore();

  // const {
  //   addProductToOrder
  // } = usePurchaseOrdersStore();

  const { getSupplierList } = useSupplierStore();

  const { getBranchesList } = useBranchesStore();

  useEffect(() => {
    getBranchesList();
    getSupplierList();
  }, []);

  useEffect(() => {
    getBranchProductOrders(branchName, supplierName, '', '');
  }, [branchName, supplierName]);

  return (
    <HeadlessModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva orden de compra"
      size="w-screen h-screen pb-20 md:pb-0 p-5 overflow-y-auto xl:w-[80vw]"
    >
      <div className="w-full bg-white dark:bg-gray-900">
        <div className="grid grid-cols-1">
          <div>
            <Input
              label="Nombre"
              placeholder="Escribe el nombre del producto"
              labelPlacement="outside"
              variant="bordered"
              startContent={<Search />}
              className="w-full dark:text-white"
            />
          </div>
        </div>
        <div className="w-full flex justify-end py-5">
          <Button onClick={onClose} style={global_styles().secondaryStyle} className="px-10">
            Aceptar
          </Button>
        </div>
        <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {branch_product_order.map((branch_product) => (
            <div
              key={branch_product.id}
              className="shadow border p-4 rounded-lg dark:border-gray-500"
            >
              <p className="font-semibold dark:text-white">{branch_product.product.name}</p>
              <p className="dark:text-white">Stock: {branch_product.stock}</p>
              <p className="mt-2 flex gap-3 dark:text-white">
                <Truck /> {branch_product.supplier.nombre}
              </p>
              <p className="mt-2 flex gap-3 dark:text-white">
                <ScrollText /> {branch_product.product.subCategory.categoryProduct.name}
              </p>
              <p className="mt-2 flex gap-3 dark:text-white">
                <DollarSign /> ${branch_product.price}
              </p>
              /* eslint-disable no-unused-vars */ /* eslint-enable no-unused-vars */
              <Button
                className="px-10 mt-3"
                style={global_styles().thirdStyle}
                // onPress={() => addProductToOrder(branch_product)}
              >
                Agregar
              </Button>
            </div>
          ))}
        </div>
      </div>
    </HeadlessModal>
  );
}

export default AddProduct;
