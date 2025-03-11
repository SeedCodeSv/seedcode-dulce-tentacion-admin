import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { DollarSign, Plus, ScrollText, Search, Trash, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBranchProductStore } from '../../store/branch_product.store';
import { Branches } from '../../types/branches.types';
import { useBranchesStore } from '../../store/branches.store';
import { useSupplierStore } from '../../store/supplier.store';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import HeadlessModal from '../global/HeadlessModal';
import { IBranchProductOrder, PurchaseOrderPayload } from '../../types/purchase_orders.types';
import { usePurchaseOrdersStore } from '../../store/purchase_orders.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  closeModal: () => void;
  reload: () => void;
}

function AddPurchaseOrders(props: Props) {
  const vaul = useDisclosure();
  const {
    getBranchProductOrders,
    branch_product_order,
    addProductOrder,
    updateQuantityOrders,
    deleteProductOrder,
    orders_by_supplier,
    clearProductOrders,
    updatePriceOrders,
  } = useBranchProductStore();

  const { getSupplierList, supplier_list } = useSupplierStore();
  const { branch_list, getBranchesList } = useBranchesStore();
  const [branch, setBranch] = useState('');
  const [supplier, setSupplier] = useState('');

  useEffect(() => {
    getBranchProductOrders(branch, supplier, '', '');
  }, [branch, supplier]);

  useEffect(() => {
    getBranchesList();
    getSupplierList('');
  }, []);

  const { postPurchaseOrder } = usePurchaseOrdersStore();

  const handleSaveOrder = async () => {
    for (let i = 0; i < orders_by_supplier.length; i++) {
      const products: IBranchProductOrder[] = orders_by_supplier[i].products.map((prd) => ({
        productId: prd.id,
        quantity: prd.quantity,
        unitPrice: Number(prd.price),
      }));

      const branchId = orders_by_supplier[i].products[0].branch.id;

      const total = products
        .map((p) => Number(p.unitPrice) * p.quantity)
        .reduce((a, b) => a + b, 0);

      const payload: PurchaseOrderPayload = {
        supplierId: orders_by_supplier[i].supplier.id,
        branchProducts: products,
        branchId,
        total,
      };

      await postPurchaseOrder(payload);
    }
    clearProductOrders();
    props.reload();
    props.closeModal();
  };

  return (
    <div className="w-full">
      <div className="flex flex-col justify-between w-full">
        <div className="flex justify-between w-full">
          <p className="text-xl font-semibold dark:text-white">Lista de productos</p>
          <ButtonUi onClick={vaul.onOpen} theme={Colors.Success}>
            <Plus />
          </ButtonUi>
        </div>

        {orders_by_supplier.length === 0 && (
          <div className="flex flex-col items-center w-full h-full">
            <div className="lds-ellipsis">
              <div className="bg-gray-600 dark:bg-gray-200"></div>
              <div className="bg-gray-600 dark:bg-gray-200"></div>
              <div className="bg-gray-600 dark:bg-gray-200"></div>
              <div className="bg-gray-600 dark:bg-gray-200"></div>
            </div>
            <p className="pb-10 text-xl dark:text-white">Aun no agregas productos</p>
          </div>
        )}

        {orders_by_supplier.map((supplier, index) => (
          <div key={index} className="w-full">
            <p className="dark:text-white">Proveedor: {supplier.supplier.nombre}</p>
            <DataTable
              className="mt-5 shadow"
              emptyMessage="No se encontraron resultados"
              value={supplier.products}
              tableStyle={{ minWidth: '50rem' }}
            >
              <Column headerClassName="text-sm font-semibold" field="id" header="No." />
              <Column
                headerClassName="text-sm font-semibold"
                field="product.name"
                header="Nombre"
              />
              <Column
                headerClassName="text-sm font-semibold"
                field="quantity"
                header="Cantidad"
                body={(item) => (
                  <Input
                    className="w-32"
                    variant="bordered"
                    defaultValue={item.quantity.toString()}
                    type="number"
                    lang="es"
                    onChange={(e) => {
                      updateQuantityOrders(item.id, Number(e.target.value));
                    }}
                  />
                )}
              />
              <Column
                headerClassName="text-sm font-semibold"
                field="product.code"
                header="Código"
              />
              <Column
                headerClassName="text-sm font-semibold"
                field="price"
                header="Precio"
                body={(item) => (
                  <Input
                    className="w-32"
                    variant="bordered"
                    defaultValue={item.price.toString()}
                    type="number"
                    startContent="$"
                    lang="es"
                    onChange={(e) => {
                      updatePriceOrders(item.id, Number(e.target.value));
                    }}
                  />
                )}
              />
              <Column
                headerStyle={{ borderTopRightRadius: '10px' }}
                header="Acciones"
                body={(item) => (
                  <div className="flex w-full gap-5">
                    <ButtonUi
                      theme={Colors.Warning}
                      isIconOnly
                      onPress={() => deleteProductOrder(item.id)}
                    >
                      <Trash size={18} />
                    </ButtonUi>
                  </div>
                )}
              />
            </DataTable>
          </div>
        ))}

        <div className="flex justify-end w-full mt-4">
          <ButtonUi onPress={handleSaveOrder} theme={Colors.Primary} className="px-16">
            Guardar
          </ButtonUi>
        </div>
      </div>
      <HeadlessModal
        isOpen={vaul.isOpen}
        onClose={vaul.onClose}
        title="Nueva orden de compra"
        size="w-screen h-screen bg-white pb-20 md:pb-0 p-5 overflow-y-auto xl:w-[80vw]"
      >
        <div className="w-full  dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <Select
                label="Sucursal"
                value={branch}
                onSelectionChange={(e) => {
                  const setkeys = new Set(e as unknown as string[]);
                  const keysArray = Array.from(setkeys);
                  if (keysArray.length > 0) {
                    setBranch(keysArray[0]);
                  }
                }}
                placeholder="Selecciona una sucursal"
                labelPlacement="outside"
                variant="bordered"
                className="w-full dark:text-white"
              >
                {branch_list.map((branch: Branches) => (
                  <SelectItem className="dark:text-white" key={branch.name}>
                    {branch.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Autocomplete
                label="Proveedor"
                value={branch}
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
          <div className="flex justify-end w-full py-5">
            <ButtonUi onPress={vaul.onClose} theme={Colors.Primary} className="px-10">
              Aceptar
            </ButtonUi>
          </div>
          <div className="grid w-full grid-cols-1 gap-5 mt-4 md:grid-cols-2 lg:grid-cols-3">
            {branch_product_order.map((branch_product) => (
              <div
                key={branch_product.id}
                className="p-4 border rounded-lg shadow dark:border-gray-500"
              >
                <p className="font-semibold dark:text-white">{branch_product.product.name}</p>
                <p className="dark:text-white">Stock: {branch_product.stock}</p>
                <p className="flex gap-3 mt-2 dark:text-white">
                  <Truck /> {branch_product.supplier.nombre}
                </p>
                <p className="flex gap-3 mt-2 dark:text-white">
                  <ScrollText /> {branch_product.product.subCategory.name}
                </p>
                <p className="flex gap-3 mt-2 dark:text-white">
                  <DollarSign /> ${branch_product.price}
                </p>
                <ButtonUi
                  className="px-10 mt-3"
                  theme={Colors.Primary}
                  onPress={() => addProductOrder(branch_product)}
                >
                  Agregar
                </ButtonUi>
              </div>
            ))}
          </div>
        </div>
      </HeadlessModal>
    </div>
  );
}

export default AddPurchaseOrders;
