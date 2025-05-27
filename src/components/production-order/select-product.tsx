import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
  type Selection,
} from '@heroui/react';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { PackageX, Store, TriangleAlert, X } from 'lucide-react';
import { toast } from 'sonner';

import Pagination from '../global/Pagination';
import { ResponsiveFilterWrapper } from '../global/ResposiveFilters';
import TooltipGlobal from '../global/TooltipGlobal';

import RegisterProduct from './registerProduct';

import { ProductAndRecipe } from '@/types/products.types';
import { typesProduct } from '@/utils/constants';
import { ThemeContext } from '@/hooks/useTheme';
import { useDebounce } from '@/hooks/useDebounce';
import EmptyBox from '@/assets/empty-box.png';
import { useProductsStore } from '@/store/products.store';
import { useProductionOrderStore } from '@/store/production-order.store';
import { useBranchesStore } from '@/store/branches.store';
import { ResponseVerifyProduct } from '@/types/production-order.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

type ProductRecipe = ResponseVerifyProduct & {
  quantity: number;
};

type DisclosureProps = ReturnType<typeof useDisclosure>;

interface Props {
  modalProducts: DisclosureProps;
  selectedProducts: ProductRecipe[];
  setSelectedProducts: Dispatch<SetStateAction<ProductRecipe[]>>;
  moveSelectedBranch: Selection;
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
  moveSelectedBranch,
  setSelectedProducts,
  setSelectedTypeProduct,
}: Props) {
  const { handleVerifyProduct, errors, verified_product } = useProductionOrderStore();
  const modalProduct = useDisclosure();
  const createProduct = useDisclosure()
  const { getBranchById } = useBranchesStore()
  const [productToCreate, setProductToCreate] = useState<ProductAndRecipe | null>(null);
  const modalError = useDisclosure();

  const { productsAndRecipe, productsAndRecipePagination, getPaginatedProductsAndRecipe } =
    useProductsStore();

  const handleAddProductRecipe = async (recipe: ResponseVerifyProduct): Promise<void> => {

      setSelectedProducts([
        {
          ...recipe,
          quantity: 1,
        },
      ]);
      toast.success(`Se agregó ${recipe.branchProduct?.product?.name} con éxito`);
      modalError.onClose()
      modalProducts.onClose();
  
  };



  const hasProductInArray = (id: number) => {
    return selectedProducts.some((p) => p?.branchProduct?.productId === id);
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

  const OnVerifyProduct = async (recipe: ProductAndRecipe) => {
    createProduct.onClose()
      const productFind = selectedProducts.find((sp) => sp.branchProduct.product.id === recipe.id);

    if (productFind) {
      setSelectedProducts([]);
      toast.warning(`Se eliminó ${recipe.name} con éxito`);

      return;
    }

    const res = await handleVerifyProduct({
      branchDestinationId: Number(new Set(moveSelectedBranch).values().next().value),
      branchDepartureId: Number(new Set(selectedBranch).values().next().value),
      productId: recipe.id,
    });

    if (!res.ok && res.message?.includes("No se encontró el producto")) {
      getBranchById(Number(new Set(moveSelectedBranch).values().next().value))
      setProductToCreate(recipe,);
      modalProduct.onOpen();

      return
    }

    if (!res.ok && res.errors && selectedProducts[0]?.branchProduct.id !== res.branchProduct.id) {
      modalProducts.onClose();
      getBranchById(Number(new Set(selectedBranch).values().next().value))
      modalError.onOpen();

      return
    }

    await handleAddProductRecipe(res)
  }


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
                      onClick={() => {
                        if (recipe.recipeBook) {
                          OnVerifyProduct(recipe);
                        } else {
                          toast.error('Este producto no cuenta con receta disponible');
                        }
                      }}
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
                getPaginatedProductsAndRecipe(
                  page,
                  10,
                  0,
                  0,
                  String(dbounceName),
                  '',
                  1,
                  String(new Set(selectedTypeProduct).values().next().value ?? '')
                );
              }}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {modalProduct.isOpen && productToCreate && (
        <Modal {...modalProduct} className='border-2 rounded-lg border-yellow-600' size={createProduct.isOpen ? '2xl' : 'md'}>
          {!createProduct.isOpen ? (
            <ModalContent>
              <ModalHeader className="flex gap-4">
                <TriangleAlert className="text-yellow-600" />
                Producto no encontrado
              </ModalHeader>
              <ModalBody>
                <p>
                  El producto <strong>{productToCreate.name}</strong> no existe en la sucursal
                  destino.
                </p>
                <p>¿Deseas crearlo?</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={() => modalProduct.onClose()}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    createProduct.onOpen();
                  }}
                >
                  Crear Producto
                </Button>
              </ModalFooter>
            </ModalContent>
          ) : (
            <RegisterProduct close={() => {
              modalProduct.onClose()
              createProduct.onClose()
            }} productToCreate={productToCreate} />
          )}
        </Modal>
      )}
      <Modal {...modalError}>
        <ModalContent>
          <ModalHeader className='flex gap-2'>
            <TriangleAlert className='text-orange-500' size={26} /> Advertencia
          </ModalHeader>
          <ModalBody>
            {errors && errors.length > 0 && errors.map((item, index) => (
              <span key={index} className="flex items-center gap-2 text-gray-700">
                {item.exist === false ? (
                  <TooltipGlobal text='Agregar'>
                    <Store
                      className="text-red-500 cursor-pointer"
                      size={20}
                      onClick={() => {
                        const product = verified_product.recipeBook.productRecipeBookDetails.find(
                          (prd) => prd.product.id === item.productId
                        );

                        if (product) {
                          setProductToCreate(product.product);
                          modalError.onClose();
                          modalProduct.onOpen();
                          createProduct.onOpen();
                        }
                      }}
                    />
                  </TooltipGlobal>
                ) : (
                  <PackageX className="text-yellow-500" size={20} />
                )}
                <p className="font-semibold">{item.nameProduct}</p> - {item.description}
              </span>
            ))}
            <strong>¡Advertencia: algunos datos podrían faltar y afectar los cálculos si decides continuar!</strong>
          </ModalBody>
          <ModalFooter className='flex w-full justify-start items-start'>
            <ButtonUi
              theme={Colors.Info}
              onPress={() => {
                modalError.onClose()
                modalProducts.onClose()
              }}
            >
              Cancelar Producción
            </ButtonUi>
            {errors.some((item) => item.exist === false)}
            <ButtonUi
              theme={Colors.Success}
              onPress={async () =>
              {
                if(errors.some((item) => item.exist === false)){
                  toast.error("Algunos productos no existen en la sucursal de origen. Verifica tu selección o créalos antes de continuar usando el botón junto a cada producto en la lista.",{duration: 7000} )
                
                  return
                }
                await handleAddProductRecipe(verified_product)
              }
              }
            >
              Continuar de todas formas
            </ButtonUi>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SelectProduct;
