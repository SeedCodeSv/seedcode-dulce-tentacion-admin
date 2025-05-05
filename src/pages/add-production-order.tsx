import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  Input,
  Select,
  type Selection,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import classNames from 'classnames';

import Layout from '@/layout/Layout';
import ThGlobal from '@/themes/ui/th-global';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useBranchesStore } from '@/store/branches.store';
import { useBranchProductStore } from '@/store/branch_product.store';
import Pagination from '@/components/global/Pagination';

function AddProductionOrder() {
  const { getBranchesList, branch_list } = useBranchesStore();
  const [selectedBranch, setSelectedBranch] = useState<Selection>(new Set([]));
  const [moveSelectedBranch, setMoveSelectedBranch] = useState<Selection>(new Set([]));

  useEffect(() => {
    getBranchesList();
  }, []);

  const typesProduct = ["PRODUCTO DE VENTA", "INSUMO/INGREDIENTE"];
  const [selectedTypeProduct, setSelectedTypeProduct] = useState<Selection>(new Set([typesProduct[0]]));

  const {
    branchProductRecipe,
    branchProductRecipePaginated,
    // loadingBranchProductRecipe,
    getBranchProductsRecipe,
  } = useBranchProductStore();

  useEffect(() => {
    const selectedBranchS = new Set(selectedBranch);
    const selectedTypeProductS = new Set(selectedTypeProduct);

    if (selectedBranchS.size > 0 || selectedTypeProductS.size > 0) {
      getBranchProductsRecipe(Number(selectedBranchS.values().next().value), 1, 10, '', '', '', String(selectedTypeProductS.values().next().value) ?? "");
    }
  }, [selectedBranch, selectedTypeProduct]);

  const modalProducts = useDisclosure();

  return (
    <Layout title="Nueva Orden de Produccion">
      <>
        <div className=" w-full h-full flex flex-col overflow-y-auto p-5 lg:p-8 bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-3 gap-x-5 gap-y-2 mt-3">
            <Select
              classNames={{ label: 'font-semibold' }}
              label="Tipo de Orden"
              placeholder="Seleccione el tipo de orden de produccion"
              variant="bordered"
            >
              <SelectItem key={'1'}>Produccion</SelectItem>
              <SelectItem key={'2'}>Venta</SelectItem>
              <SelectItem key={'3'}>Produccion y Venta</SelectItem>
            </Select>
            <Select
              classNames={{ label: 'font-semibold' }}
              label="Extraer producto de"
              placeholder="Selecciona la sucursal de origen"
              selectedKeys={selectedBranch}
              selectionMode="single"
              variant="bordered"
              onSelectionChange={setSelectedBranch}
            >
              {branch_list.map((b) => (
                <SelectItem key={b.id}>{b.name}</SelectItem>
              ))}
            </Select>
            <Select
              classNames={{ label: 'font-semibold' }}
              label="Mover producto terminado a"
              placeholder="Seleccione la sucursal de destino"
              selectedKeys={moveSelectedBranch}
              selectionMode="single"
              variant="bordered"
              onSelectionChange={setMoveSelectedBranch}
            >
              {branch_list.map((b) => (
                <SelectItem key={b.id}>{b.name}</SelectItem>
              ))}
            </Select>
            <Select
              classNames={{ label: 'font-semibold' }}
              label="Encargado de la orden"
              placeholder="Selecciona el encargado de la orden"
              variant="bordered"
            >
              <SelectItem key={'1'}>Sucursal 1</SelectItem>
              <SelectItem key={'2'}>BODEGA 1</SelectItem>
              <SelectItem key={'3'}>BODEGA 2</SelectItem>
            </Select>
            <Input
              className="col-span-2"
              classNames={{ label: 'font-semibold' }}
              label="Observaciones"
              placeholder="Observaciones"
              variant="bordered"
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
                    <ThGlobal className="text-left p-3">Código</ThGlobal>
                    <ThGlobal className="text-left p-3">Cantidad a producir</ThGlobal>
                    <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
          <div className="flex justify-end gap-5">
            <ButtonUi className="px-6" theme={Colors.Error}>
              Cancelar
            </ButtonUi>
            <ButtonUi className="px-10" theme={Colors.Primary}>
              Guardar
            </ButtonUi>
          </div>
        </div>
        <Drawer
          isOpen={modalProducts.isOpen}
          placement="right"
          scrollBehavior="inside"
          size="full"
          onOpenChange={modalProducts.onOpenChange}
        >
          <DrawerContent>
            {/* <DrawerHeader>Productos</DrawerHeader> */}
            <DrawerBody>
              <div className="flex flex-col gap-4 h-full overflow-y-auto">
                <p className='text-lg font-semibold'>Lista de productos</p>
                <div className="grid grid-cols-4 gap-3 place-content-end">
                 <div className='flex gap-3 items-end'>
                 <Input
                    className="text-xs"
                    classNames={{ label: 'font-semibold' }}
                    label="Buscar producto..."
                    labelPlacement="outside"
                    placeholder="Escriba para buscar"
                    variant="bordered"
                  />
                  <ButtonUi theme={Colors.Primary}>Guardar</ButtonUi>
                 </div>
                  <Select
                    classNames={{ label: 'font-semibold' }}
                      label="Tipo de producto"
                      labelPlacement="outside"
                      placeholder="Seleccione la sucursal"
                      selectedKeys={selectedTypeProduct}
                      selectionMode="single"
                      variant="bordered"
                      onSelectionChange={setSelectedTypeProduct}
                    >
                      {typesProduct.map((typ) => <SelectItem key={typ}>{typ}</SelectItem>)}
                    </Select>
                    <Select
                    classNames={{ label: 'font-semibold' }}
                      label="Categoría"
                      labelPlacement="outside"
                      placeholder="Seleccione la sucursal"
                      variant="bordered"
                    >
                      <SelectItem key={'1'}>Sucursal 1</SelectItem>
                    </Select>
                    <Select
                    classNames={{ label: 'font-semibold' }}
                      label="Sub-categoría"
                      labelPlacement="outside"
                      placeholder="Seleccione la sucursal"
                      variant="bordered"
                    >
                      <SelectItem key={'1'}>Sucursal 1</SelectItem>
                    </Select>
                </div>

                <div className='h-full overflow-y-auto flex flex-col'>
                <div className="grid grid-cols-4 gap-2">
                  {branchProductRecipe.map((recipe) => (
                    <div
                      key={recipe.id}
                      className={classNames(
                        !recipe.recipeBook && ' opacity-50 bg-pink-50',
                        'flex flex-col w-full border shadow rounded-[12px] p-3'
                      )}
                    >
                      <p className="font-semibold">{recipe.product.name}</p>
                      <p className="text-xs">
                        Cantidad maxima:{' '}
                        {recipe.recipeBook
                          ? recipe.recipeBook.maxProduction
                          : 'No hay receta disponible'}
                      </p>
                      <p className="text-xs font-semibold py-2">Receta: </p>
                      {recipe.recipeBook ? (
                        <>
                          <ul className="grid grid-cols-2 gap-3 w-full">
                            {recipe.recipeBook.productRecipeBookDetails.map((rb) => (
                              <li key={rb.id} className="text-xs">
                                • {rb.branchProduct.product.name}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <>
                          <p>No hay receta disponible</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <Pagination
                currentPage={branchProductRecipePaginated.currentPag}
                nextPage={branchProductRecipePaginated.nextPag}
                previousPage={branchProductRecipePaginated.prevPag}
                totalItems={branchProductRecipePaginated.total}
                totalPages={branchProductRecipePaginated.totalPag}
                onPageChange={(page) => {
                  getBranchProductsRecipe(
                    Number(new Set(selectedBranch).values().next().value),
                    page,
                    10,
                    '',
                    '',
                    '',
                    String(new Set(selectedTypeProduct).values().next().value ?? "")
                  );
                }}
              />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    </Layout>
  );
}

export default AddProductionOrder;
