import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  Input,
  Select,
  SelectItem,
  useDisclosure,
  type Selection,
} from '@heroui/react';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { X } from 'lucide-react';

import Pagination from '../global/Pagination';
import { ResponsiveFilterWrapper } from '../global/ResposiveFilters';

import { useBranchProductStore } from '@/store/branch_product.store';
import { BranchProductRecipe } from '@/types/products.types';
import { typesProduct } from '@/utils/constants';
import { ThemeContext } from '@/hooks/useTheme';
import { useDebounce } from '@/hooks/useDebounce';
import EmptyBox from '@/assets/empty-box.png';
import { useProductsStore } from '@/store/products.store';

type ProductRecipe = BranchProductRecipe & {
  quantity: number;
};

type DisclosureProps = ReturnType<typeof useDisclosure>;

interface Props {
  modalProducts: DisclosureProps;
  selectedProducts: ProductRecipe[];
  setSelectedProducts: Dispatch<SetStateAction<ProductRecipe[]>>;
  selectedBranch: Selection;
  setSelectedBranch: Dispatch<SetStateAction<Selection>>;
  selectedTypeProduct: Selection;
  setSelectedTypeProduct: Dispatch<SetStateAction<Selection>>;
}

function SelectProduct({
  modalProducts,
  selectedProducts,
  selectedBranch,
  selectedTypeProduct,
  setSelectedTypeProduct,
}: Props) {
  const { getBranchProductsRecipe } =
    useBranchProductStore();

  const {
    productsAndRecipe,
    productsAndRecipePagination,
    getPaginatedProductsAndRecipe,
  } = useProductsStore();

  const hasProductInArray = (id: number) => {
    return selectedProducts.some((p) => p.id === id);
  };


  const { theme, context } = useContext(ThemeContext);
  const [searchParams, setSearchParams] = useState({
    name: '',
  });

  const dbounceName = useDebounce(searchParams.name, 300);

  useEffect(() => {
    const typeProduct = new Set(selectedTypeProduct).values().next().value;

    getPaginatedProductsAndRecipe(
      1,
      10,
      0,
      0,
      String(dbounceName),
      '',
      1,
      typeProduct ? String(typeProduct) : ''
    );
  }, [dbounceName, selectedTypeProduct]);

  return (
    <>
      <Drawer
        closeButton={<X size={40} />}
        isDismissable={false}
        isOpen={modalProducts.isOpen}
        placement="right"
        scrollBehavior="inside"
        size="full"
        onOpenChange={modalProducts.onOpenChange}
      >
        <DrawerContent>
          <DrawerBody>
            <div className="flex flex-col gap-4 h-full overflow-y-auto">
              <p className="text-lg font-semibold dark:text-white">Lista de productos</p>
              <ResponsiveFilterWrapper withButton={false}>
                <Input
                  className="text-xs dark:text-white w-full"
                  classNames={{ label: 'font-semibold' }}
                  label="Buscar producto..."
                  labelPlacement="outside"
                  placeholder="Escriba para buscar"
                  variant="bordered"
                  onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
                />
                <Select
                  className="dark:text-white"
                  classNames={{ label: 'font-semibold' }}
                  label="Tipo de producto"
                  labelPlacement="outside"
                  placeholder="Seleccione la sucursal"
                  selectedKeys={selectedTypeProduct}
                  selectionMode="single"
                  variant="bordered"
                  onSelectionChange={setSelectedTypeProduct}
                >
                  {typesProduct.map((typ) => (
                    <SelectItem key={typ} className="dark:text-white">
                      {typ}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  className="dark:text-white"
                  classNames={{ label: 'font-semibold' }}
                  label="Categoría"
                  labelPlacement="outside"
                  placeholder="Seleccione la sucursal"
                  variant="bordered"
                >
                  <SelectItem key={'1'} className="dark:text-white">
                    Sucursal 1
                  </SelectItem>
                </Select>
                <Select
                  className="dark:text-white"
                  classNames={{ label: 'font-semibold' }}
                  label="Sub-categoría"
                  labelPlacement="outside"
                  placeholder="Seleccione la sucursal"
                  variant="bordered"
                >
                  <SelectItem key={'1'} className="dark:text-white">
                    Sucursal 1
                  </SelectItem>
                </Select>
              </ResponsiveFilterWrapper>

              <div className="h-full overflow-y-auto flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 2xl:grid-cols-5">
                  {productsAndRecipe.map((recipe) => (
                    <button
                      key={recipe.id}
                      className={classNames(
                        !recipe.recipeBook && ' opacity-50 cursor-not-allowed',
                        hasProductInArray(recipe.id) && ' border-green-500 shadow shadow-green-50',
                        'flex flex-col items-start w-full border shadow rounded-[12px] p-3 cursor-pointer'
                      )}
                      style={{
                        backgroundColor:
                          context === 'dark'
                            ? theme.colors[context].table.background
                            : theme.colors[context].table.textColor,
                        color:
                          context === 'dark'
                            ? theme.colors[context].table.textColor
                            : theme.colors[context].table.background,
                      }}
                      // onClick={() => {
                      //   if (recipe.recipeBook) {
                      //     handleVerifyProduct(recipe);
                      //   } else {
                      //     toast.error('Este producto no cuenta con receta disponible');
                      //   }
                      // }}
                    >
                      <div className="w-full flex flex-col items-start ">
                        <p className="font-semibold ">{recipe.name}</p>
                        {/* <p className="text-xs">
                          Cantidad maxima:{' '}
                          {recipe.recipeBook
                            ? recipe.recipeBook.maxProduction
                            : 'No hay receta disponible'}
                        </p> */}
                        <p className="text-xs font-semibold py-2">Receta: </p>
                        <div className="w-full grid grid-cols-1 place-content-start">
                          {recipe.recipeBook ? (
                            <>
                              <ul className="grid grid-cols-2 gap-3 w-full place-items-start">
                                {recipe.recipeBook.productRecipeBookDetails.map((rb) => (
                                  <li key={rb.id} className="text-xs">
                                    • {rb.product.name}
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
                      </div>
                    </button>
                  ))}
                  {productsAndRecipe.length === 0 && (
                    <div className="flex flex-col justify-center items-center w-full h-full py-10 col-span-5">
                      <img alt="NO DATA" className="w-40" src={EmptyBox} />
                      <p className="text-lg font-semibold mt-3 dark:text-white">
                        No se encontraron resultados
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Pagination
              currentPage={productsAndRecipePagination.currentPag}
              nextPage={productsAndRecipePagination.nextPag}
              previousPage={productsAndRecipePagination.prevPag}
              totalItems={productsAndRecipePagination.total}
              totalPages={productsAndRecipePagination.totalPag}
              onPageChange={(page) => {
                getBranchProductsRecipe(
                  Number(new Set(selectedBranch).values().next().value),
                  page,
                  10,
                  '',
                  String(dbounceName),
                  '',
                  String(new Set(selectedTypeProduct).values().next().value ?? '')
                );
              }}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SelectProduct;
