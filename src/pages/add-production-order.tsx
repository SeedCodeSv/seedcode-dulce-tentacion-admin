import { Input, Select, type Selection, SelectItem, useDisclosure } from '@heroui/react';
import { Book, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router';

import Layout from '@/layout/Layout';
import ThGlobal from '@/themes/ui/th-global';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useBranchesStore } from '@/store/branches.store';
import { useBranchProductStore } from '@/store/branch_product.store';
import { BranchProductRecipe } from '@/types/products.types';
import { useEmployeeStore } from '@/store/employee.store';
import { useProductionOrderTypeStore } from '@/store/production-order-type.store';
import { preventLetters } from '@/utils';
import SelectProduct from '@/components/production-order/select-product';
import { API_URL, typesProduct } from '@/utils/constants';
import RecipeBook from '@/components/production-order/product-recipe';
import DivGlobal from '@/themes/ui/div-global';
import TdGlobal from '@/themes/ui/td-global';

type ProductRecipe = BranchProductRecipe & {
  quantity: number;
};

function AddProductionOrder() {
  const { getBranchesList, branch_list } = useBranchesStore();
  const { productionOrderTypes, onGetProductionOrderTypes } = useProductionOrderTypeStore();

  const [selectedBranch, setSelectedBranch] = useState<Selection>(new Set([]));
  const [moveSelectedBranch, setMoveSelectedBranch] = useState<Selection>(new Set([]));
  const [selectedEmployee, setSelectedEmployee] = useState<Selection>(new Set([]));
  const [selectedProductionOrderType, setSelectedProductionOrderType] = useState<Selection>(
    new Set([])
  );
  const [observation, setObservation] = useState('');

  const [productId, setProductId] = useState(0);
  const modalRecipe = useDisclosure();

  const { getEmployeesList, employee_list } = useEmployeeStore();

  useEffect(() => {
    getBranchesList();
    getEmployeesList();
    onGetProductionOrderTypes();
  }, []);
  const [selectedTypeProduct, setSelectedTypeProduct] = useState<Selection>(
    new Set([typesProduct[0]])
  );
  const [selectedProducts, setSelectedProducts] = useState<ProductRecipe[]>([]);

  const { getBranchProductsRecipe } = useBranchProductStore();

  useEffect(() => {
    const selectedBranchS = new Set(selectedBranch);
    const selectedTypeProductS = new Set(selectedTypeProduct);

    if (selectedBranchS.size > 0) {
      getBranchProductsRecipe(
        Number(selectedBranchS.values().next().value),
        1,
        10,
        '',
        '',
        '',
        String(selectedTypeProductS.values().next().value) ?? ''
      );
    }
  }, [selectedBranch, selectedTypeProduct]);

  const modalProducts = useDisclosure();

  const handleUpdateQuantity = (product: ProductRecipe, quantity: number) => {
    const productFind = selectedProducts.findIndex((sp) => sp.id === product.id);

    if (productFind !== -1) {
      const products = [...selectedProducts];

      products[productFind] = { ...product, quantity: quantity };
      setSelectedProducts(products);
    }
  };

  const handleSaveOrder = () => {
    const branch = new Set(selectedBranch).values().next().value;

    if (!branch) {
      toast.error('Debe seleccionar una sucursal');

      return;
    }

    const employee = new Set(selectedEmployee).values().next().value;

    if (!employee) {
      toast.error('Debe seleccionar un empleado');

      return;
    }

    const productionOrderType = new Set(selectedProductionOrderType).values().next().value;

    if (!productionOrderType) {
      toast.error('Debe seleccionar un tipo de orden');

      return;
    }

    if (selectedProducts.length === 0) {
      toast.error('Debe agregar al menos un producto');

      return;
    }

    if (!moveSelectedBranch) {
      toast.error('Debe seleccionar una sucursal de destino');

      return;
    }

    const destinationBranch = new Set(moveSelectedBranch).values().next().value;
    const prodType = new Set(selectedProductionOrderType).values().next().value;

    const payload = {
      receptionBranch: Number(branch),
      destinationBranch: Number(destinationBranch),
      employee: Number(employee),
      productionOrderType: Number(prodType),
      products: selectedProducts.map((p) => ({
        branchProductId: p.id,
        productId: p.product.id,
        recipeId: p.recipeBook?.id ?? 0,
        quantity: +p.quantity,
        max: p.recipeBook?.maxProduction ?? 0,
      })),
      observation,
      moreInformation: '[]',
    };

    axios
      .post(API_URL + '/production-orders', payload)
      .then(() => {
        toast.success('Orden de producción creada exitosamente');
      })
      .catch(() => {
        toast.error('Error al crear la orden de producción');
      });
  };

  const handleDeleteProduct = (product: ProductRecipe) => {
    const productFind = selectedProducts.findIndex((sp) => sp.id === product.id);

    if (productFind !== -1) {
      const products = [...selectedProducts];

      products.splice(productFind, 1);
      setSelectedProducts(products);
    }
  };

  const navigation = useNavigate();

  return (
    <Layout title="Nueva Orden de Producción">
      <>
        <RecipeBook
          isOpen={modalRecipe.isOpen}
          productId={productId}
          onOpenChange={modalRecipe.onOpenChange}
        />
        <DivGlobal className=" w-full h-full flex flex-col overflow-y-auto p-5 lg:p-8">
          <div className="grid grid-cols-3 gap-x-5 gap-y-2 mt-3">
            <Select
              className="dark:text-white"
              classNames={{ label: 'font-semibold' }}
              label="Tipo de Orden"
              placeholder="Seleccione el tipo de orden de producción"
              selectedKeys={selectedProductionOrderType}
              selectionMode="single"
              variant="bordered"
              onSelectionChange={setSelectedProductionOrderType}
            >
              {productionOrderTypes.map((b) => (
                <SelectItem key={b.id} className="dark:text-white">
                  {b.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="dark:text-white"
              classNames={{ label: 'font-semibold' }}
              label="Extraer producto de"
              placeholder="Selecciona la sucursal de origen"
              selectedKeys={selectedBranch}
              selectionMode="single"
              variant="bordered"
              onSelectionChange={setSelectedBranch}
            >
              {branch_list.map((b) => (
                <SelectItem key={b.id} className="dark:text-white">
                  {b.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="dark:text-white"
              classNames={{ label: 'font-semibold' }}
              label="Mover producto terminado a"
              placeholder="Seleccione la sucursal de destino"
              selectedKeys={moveSelectedBranch}
              selectionMode="single"
              variant="bordered"
              onSelectionChange={setMoveSelectedBranch}
            >
              {branch_list.map((b) => (
                <SelectItem key={b.id} className="dark:text-white">
                  {b.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="dark:text-white"
              classNames={{ label: 'font-semibold' }}
              label="Encargado de la orden"
              placeholder="Selecciona el encargado de la orden"
              selectedKeys={selectedEmployee}
              selectionMode="single"
              variant="bordered"
              onSelectionChange={setSelectedEmployee}
            >
              {employee_list.map((e) => (
                <SelectItem
                  key={e.id}
                  className="dark:text-white"
                  textValue={
                    e.firstName +
                    ' ' +
                    e.secondName +
                    ' ' +
                    e.firstLastName +
                    ' ' +
                    e.secondLastName
                  }
                >
                  {e.firstName ?? '-'} {e.secondName ?? '-'} {e.firstLastName ?? '-'}{' '}
                  {e.secondLastName ?? '-'}
                </SelectItem>
              ))}
            </Select>
            <Input
              className="col-span-2 d"
              classNames={{ label: 'font-semibold' }}
              label="Observaciones"
              placeholder="Observaciones"
              value={observation}
              variant="bordered"
              onChange={(e) => setObservation(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-end w-full my-2">
            <p className="text-sm font-semibold">Productos</p>
            <ButtonUi
              isIconOnly
              isDisabled={new Set(selectedBranch).size === 0}
              theme={Colors.Success}
              onPress={modalProducts.onOpen}
            >
              <Plus />
            </ButtonUi>
          </div>
          <div className="w-full h-full overflow-y-auto">
            <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar">
              <table className="w-full">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr>
                    <ThGlobal className="text-left p-3">No.</ThGlobal>
                    <ThGlobal className="text-left p-3">Producto</ThGlobal>
                    <ThGlobal className="text-left p-3">Descripción</ThGlobal>
                    <ThGlobal className="text-left p-3">Código</ThGlobal>
                    <ThGlobal className="text-left p-3">Unidad de medida</ThGlobal>
                    <ThGlobal className="text-left p-3">Cantidad a producir</ThGlobal>
                    <ThGlobal className="text-left p-3">Cantidad maxima de producción</ThGlobal>
                    <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((sp, i) => (
                    <tr key={sp.id}>
                      <TdGlobal className="p-3">{i + 1}</TdGlobal>
                      <TdGlobal className="p-3">{sp.product.name}</TdGlobal>
                      <TdGlobal className="p-3">{sp.product.description}</TdGlobal>
                      <TdGlobal className="p-3">{sp.product.code}</TdGlobal>
                      <TdGlobal className="p-3">{sp.product.unidaDeMedida}</TdGlobal>
                      <TdGlobal className="p-3">
                        <Input
                          aria-labelledby="Cantidad a producir"
                          className="max-w-44"
                          classNames={{
                            base: 'font-semibold',
                          }}
                          labelPlacement="outside"
                          placeholder="Cantidad a producir"
                          value={sp.quantity.toString()}
                          variant="bordered"
                          onKeyDown={preventLetters}
                          onValueChange={(text) =>
                            handleUpdateQuantity(sp, text as unknown as number)
                          }
                        />
                      </TdGlobal>
                      <TdGlobal className="p-3">{sp.recipeBook?.maxProduction ?? '0'}</TdGlobal>
                      <TdGlobal className="p-3 flex gap-3">
                        <ButtonUi
                          isIconOnly
                          theme={Colors.Error}
                          onPress={() => handleDeleteProduct(sp)}
                        >
                          <Trash />
                        </ButtonUi>
                        <ButtonUi
                          isIconOnly
                          theme={Colors.Warning}
                          onPress={() => {
                            setProductId(sp.product.id);
                            modalRecipe.onOpen();
                          }}
                        >
                          <Book />
                        </ButtonUi>
                      </TdGlobal>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end gap-5">
            <ButtonUi
              className="px-6"
              theme={Colors.Error}
              onPress={() => navigation('/production-orders')}
            >
              Cancelar
            </ButtonUi>
            <ButtonUi className="px-10" theme={Colors.Primary} onPress={handleSaveOrder}>
              Guardar
            </ButtonUi>
          </div>
        </DivGlobal>
        <SelectProduct
          modalProducts={modalProducts}
          selectedBranch={selectedBranch}
          selectedProducts={selectedProducts}
          selectedTypeProduct={selectedTypeProduct}
          setSelectedBranch={setSelectedBranch}
          setSelectedProducts={setSelectedProducts}
          setSelectedTypeProduct={setSelectedTypeProduct}
        />
      </>
    </Layout>
  );
}

export default AddProductionOrder;
