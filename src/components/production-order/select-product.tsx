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
import { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import { toast } from 'sonner';

import Pagination from '../global/Pagination';

import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';
import { useBranchProductStore } from '@/store/branch_product.store';
import { BranchProductRecipe } from '@/types/products.types';
import { typesProduct } from '@/utils/constants';
import { useAlert } from '@/lib/alert';

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
  setSelectedProducts,
  selectedBranch,
  selectedTypeProduct,
  setSelectedTypeProduct,
}: Props) {
  const { branchProductRecipe, branchProductRecipePaginated, getBranchProductsRecipe } =
    useBranchProductStore();

  const { show, close } = useAlert();

  const hasProductInArray = (id: number) => {
    return selectedProducts.some((p) => p.id === id);
  };

  const handleAddProductRecipe = (product: BranchProductRecipe) => {
    const productFind = selectedProducts.findIndex((sp) => sp.id === product.id);

    if (productFind !== -1) {
      const products = [...selectedProducts];

      products.splice(productFind, 1);
      setSelectedProducts(products);
      toast.warning(`Se elimino ${product.product.name} con éxito`);
    } else {
      const products = [...selectedProducts];

      products.push({
        ...product,
        quantity: 1,
      });
      setSelectedProducts(products);
      toast.success(`Se agrego ${product.product.name} con éxito`);
    }
  };

  const handleVerifyProduct = (product: BranchProductRecipe) => {
    const productFind = selectedProducts.findIndex((sp) => sp.id === product.id);

    if (product.recipeBook?.maxProduction === 0 && productFind === -1) {
      show({
        type: 'error',
        title: 'La cantidad de producción es 0',
        message: 'El stock de la receta no cumple con las condiciones de producción',
        isAutoClose: true,
        buttonOptions: (
          <>
            <ButtonUi
              theme={Colors.Success}
              onPress={() => {
                handleAddProductRecipe(product);
                close();
              }}
            >
              Agregar de todas formas
            </ButtonUi>
            <ButtonUi theme={Colors.Error} onPress={close}>
              Cerrar
            </ButtonUi>
          </>
        ),
      });
    } else {
      handleAddProductRecipe(product);
    }
  };

  return (
    <>
      <Drawer
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
              <div className="grid grid-cols-4 gap-3 place-content-end">
                <div className="flex gap-3 items-end">
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
                  {typesProduct.map((typ) => (
                    <SelectItem key={typ}>{typ}</SelectItem>
                  ))}
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

              <div className="h-full overflow-y-auto flex flex-col">
                <div className="grid grid-cols-3 gap-2">
                  {branchProductRecipe.map((recipe) => (
                    <button
                      key={recipe.id}
                      className={classNames(
                        !recipe.recipeBook && ' opacity-50 bg-gray-50 cursor-not-allowed',
                        hasProductInArray(recipe.id) &&
                          'bg-green-50 border-green-500 shadow shadow-green-50',
                        'flex flex-col items-start w-full border shadow rounded-[12px] p-3 cursor-pointer'
                      )}
                      onClick={() => {
                        if (recipe.recipeBook) {
                          handleVerifyProduct(recipe);
                        } else {
                          toast.error('Este producto no cuenta con receta disponible');
                        }
                      }}
                    >
                      <div className="w-full flex flex-col items-start">
                        <p className="font-semibold">{recipe.product.name}</p>
                        <p className="text-xs">
                          Cantidad maxima:{' '}
                          {recipe.recipeBook
                            ? recipe.recipeBook.maxProduction
                            : 'No hay receta disponible'}
                        </p>
                        <p className="text-xs font-semibold py-2">Receta: </p>
                        <div className="w-full grid grid-cols-1 place-content-start" >
                        {recipe.recipeBook ? (
                          <>
                            <ul className="grid grid-cols-2 gap-3 w-full place-items-start">
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
                      </div>
                    </button>
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
