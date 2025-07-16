import { ChevronLeft, ChevronRight, Plus, Search, Trash } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import classNames from 'classnames';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

import { useProductsStore } from '@/store/products.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import EmptyBox from '@/assets/empty-box.png';
import { Product } from '@/types/products.types';
import { filtrarPorCategoria } from '@/components/add-product/validation-add-product';
import { preventLetters } from '@/utils';
import { API_URL } from '@/utils/constants';

type ProductOrder = Product & { quantity: number; extraUniMedida: string };

function AddRecipeBook({ id }: { id: number }) {
  const { productsDetails, loadingProductsDetails, getProductsDetails } = useProductsStore();
  const [loadingSave, setLoadingSave] = useState(false);
const [performance, setPerformance] = useState('')

  useEffect(() => {
    getProductsDetails(id);
  }, [id]);

  const typeSearch = ['NOMBRE', 'CODIGO'];
  const [selectedTypeSearch, setSelectedTypeSearch] = useState<'NOMBRE' | 'CODIGO'>('NOMBRE');
  const [name, setName] = useState('');
  const modalAddProducts = useDisclosure();

  const { paginated_products, getPaginatedProducts } = useProductsStore();

  const navigate = useNavigate()

  useEffect(() => {
    getPaginatedProducts(1, 20,0,0, '', '', 1);
  }, []);

  const [productsRecipe, setProductsRecipe] = useState<ProductOrder[]>([]);

  const handleEditQuantity = (quantity: number, index: number) => {
    const list_suppliers = [...productsRecipe];

    list_suppliers[index].quantity = quantity;
    setProductsRecipe(list_suppliers);
  };

  const handleEditUniMedida = (uniMedida: string, index: number) => {
    const list_suppliers = [...productsRecipe];

    list_suppliers[index].extraUniMedida = uniMedida;
    setProductsRecipe(list_suppliers);
  };

  const handleDeleteProduct = (index: number) => {
    const list_suppliers = [...productsRecipe];

    list_suppliers.splice(index, 1);
    setProductsRecipe(list_suppliers);
  };

  const services = useMemo(() => new SeedcodeCatalogosMhService(), []);

  const handleSearch = (page = 1) => {
    getPaginatedProducts(
      page,
      20,
      0,
      0,
      selectedTypeSearch === 'NOMBRE' ? name : '',
      selectedTypeSearch === 'CODIGO' ? name : '',
      1
    );
  };

  const handleAddSupplier = (prd: Product) => {
    const list_suppliers = [...productsRecipe];

    const checkIfExist = list_suppliers.findIndex((lsP) => lsP.id === prd.id);

    if (checkIfExist === -1) {
      list_suppliers.push({ ...prd, quantity: 1, extraUniMedida: prd.uniMedida });
    } else {
      list_suppliers.splice(checkIfExist, 1);
    }

    setProductsRecipe(list_suppliers);
  };

  const checkIsSelectedSupplier = (id: number) => {
    return productsRecipe.some((ssp) => ssp.id === id);
  };

  const handle_save_recipe = () => {
    const recipe = {
      productId: id,
      performance: Number(performance ?? '1'),
      recipe: productsRecipe.map((pr) => ({
        productId: pr.id,
        quantity: pr.quantity,
        extraUniMedida: pr.extraUniMedida,
      })),
    };

    setLoadingSave(true);

    axios.post(API_URL + '/product-recipe-book', recipe).then(() => {
      toast.success('Receta guardada con exito');
      setLoadingSave(false);
      navigate("/products")
    }).catch(() => {
      toast.error('Error al guardar la receta');
      setLoadingSave(false);
    })
  };

  return (
    <div className=" w-full h-full bg-white dark:bg-gray-900">
      <div className="w-full h-full  p-5 overflow-y-auto flex flex-col bg-white shadow rounded-xl dark:bg-gray-900">
        {!productsDetails && !loadingProductsDetails && (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-lg font-semibold dark:text-white">
              No se encontró el producto solicitado
            </p>
          </div>
        )}

        <div className="flex flex-col w-full h-full">
          <p className="text-lg font-semibold dark:text-white">{productsDetails?.name}</p>
          <div className="grid grid-cols-2 gap-5 mt-7">
            <div>
              <Input
              className="dark:text-white font-semibold max-w-72"
              classNames={{ label: 'font-semibold' }}
              label="Rendimiento"
              labelPlacement="outside"
              placeholder="Ingresa la receta de preparación"
              value={performance}
              variant="bordered"
              onKeyDown={preventLetters}
              onValueChange={(value) => setPerformance(value)}
            />
            </div>
            <div>
               <p>
                <span className="font-semibold">Código:</span> {productsDetails?.code}{' '}
              </p>
              <p>
                <span className="font-semibold">Categoría:</span>{' '}
                {productsDetails?.subCategory.name}{' '}
              </p>
            </div>
          </div>

          <div className="w-full flex justify-between">
            <p className="text-lg font-semibold mt-5 dark:text-white">Recetario</p>
            <ButtonUi isIconOnly theme={Colors.Success} onPress={modalAddProducts.onOpen}>
              <Plus />
            </ButtonUi>
          </div>
          {productsRecipe.length === 0 && (
            <div className="mt-4 w-full h-full">
              <div className="w-full flex flex-col justify-center items-center">
                <img alt="empty-box" className="w-44" src={EmptyBox} />
                <p className="mt-3 dark:text-white ">No se encontraron productos en el recetario</p>
              </div>
            </div>
          )}
          <div className="w-full mt-3  overflow-y-auto grid md:grid-cols-3 grid-cols-2 xl:grid-cols-4 gap-4">
            {productsRecipe.map((sp: ProductOrder) => (
              <div
                key={sp.id}
                className="items-center gap-2 h-full py-2 shadow border rounded-[12px] p-4 flex flex-col"
              >
                <p className="text-sm font-semibold w-full">{sp.name}</p>
                <div className="mt-3 w-full">
                  <Input
                    classNames={{
                      label: 'font-semibold',
                    }}
                    endContent={
                      <div className="flex items-center">
                        <label className="sr-only" htmlFor="currency">
                          Currency
                        </label>
                        <select
                          className="outline-none border-0 bg-transparent text-default-400 text-small"
                          id="currency"
                          name="currency"
                          value={sp.extraUniMedida}
                          onChange={(e) =>
                            handleEditUniMedida(e.target.value, productsRecipe.indexOf(sp))
                          }
                        >
                          {filtrarPorCategoria(
                            sp.unidaDeMedida,
                            services.get014UnidadDeMedida()
                          ).map((tpS) => (
                            <option key={tpS.codigo} value={tpS.codigo}>
                              {tpS.valores}
                            </option>
                          ))}
                        </select>
                      </div>
                    }
                    label="Cantidad por unidad"
                    placeholder="Ingresa la cantidad del producto"
                    type="string"
                    value={sp.quantity.toString()}
                    variant="bordered"
                    onKeyDown={preventLetters}
                    onValueChange={(quantity) =>
                      handleEditQuantity(quantity as unknown as number, productsRecipe.indexOf(sp))
                    }
                  />
                </div>
                <div className="w-full flex justify-end mt-3">
                  <ButtonUi
                    isIconOnly
                    theme={Colors.Error}
                    onPress={handleDeleteProduct.bind(null, productsRecipe.indexOf(sp))}
                  >
                    <Trash />
                  </ButtonUi>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex justify-end mt-2">
          <ButtonUi isLoading={loadingSave} theme={Colors.Primary} onPress={handle_save_recipe}>Guardar receta</ButtonUi>
        </div>
      </div>
      <Modal isOpen={modalAddProducts.isOpen} scrollBehavior="inside" size="2xl" onOpenChange={modalAddProducts.onOpenChange}>
        <ModalContent>
          <ModalHeader>Selecciona los productos de la receta</ModalHeader>
          <ModalBody>
            <div className="flex gap-5 items-end">
              <Input
                className="dark:text-white"
                classNames={{
                  label: 'font-semibold',
                }}
                endContent={
                  <div className="flex items-center">
                    <label className="sr-only" htmlFor="currency">
                      Currency
                    </label>
                    <select
                      className="outline-none border-0 bg-transparent text-default-400 text-small"
                      id="currency"
                      name="currency"
                      onChange={(e) => {
                        setSelectedTypeSearch(e.currentTarget.value as 'NOMBRE');
                      }}
                    >
                      {typeSearch.map((tpS) => (
                        <option key={tpS} value={tpS}>
                          {tpS}
                        </option>
                      ))}
                    </select>
                  </div>
                }
                label="Buscar proveedor"
                labelPlacement="outside"
                placeholder="Escribe para buscar"
                startContent={<Search />}
                type="text"
                value={name}
                variant="bordered"
                onValueChange={setName}
              />
              <ButtonUi theme={Colors.Primary} onPress={() => handleSearch(1)}>
                Buscar
              </ButtonUi>
            </div>
            <div className="flex flex-col overflow-y-auto h-full w-full gap-3">
              {paginated_products.products.map((bpr) => (
                <button
                  key={bpr.id}
                  className={classNames(
                    checkIsSelectedSupplier(bpr.id)
                      ? 'shadow-green-100 dark:shadow-gray-500 border-green-400 dark:border-gray-800 bg-green-50 dark:bg-gray-950'
                      : '',
                    'shadow border dark:border-gray-600 w-full flex flex-col justify-start rounded-[12px] p-4'
                  )}
                  onClick={() => handleAddSupplier(bpr)}
                >
                  <div className="flex justify-between gap-5 w-full">
                    <p className="text-sm font-semibold dark:text-white">{bpr.name}</p>
                    <Checkbox
                      checked={checkIsSelectedSupplier(bpr.id)}
                      isSelected={checkIsSelectedSupplier(bpr.id)}
                      onValueChange={() => {
                        handleAddSupplier(bpr);
                      }}
                    />
                  </div>
                  <div className="w-full dark:text-white flex flex-col justify-start text-left mt-2">
                    <p className="w-full dark:text-white">Código: {bpr.code}</p>
                    <p className="w-full dark:text-white">Subcategoría: {bpr.subCategory.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </ModalBody>
          <ModalFooter className="w-full flex justify-between">
            <ButtonUi
              isIconOnly
              theme={Colors.Primary}
              onPress={() => {
                handleSearch(paginated_products.prevPag);
              }}
            >
              <ChevronLeft />
            </ButtonUi>
            <span className="text-sm font-semibold dark:text-white">
              {paginated_products.currentPag} / {paginated_products.totalPag}
            </span>
            <ButtonUi
              isIconOnly
              theme={Colors.Primary}
              onPress={() => {
                handleSearch(paginated_products.nextPag);
              }}
            >
              <ChevronRight />
            </ButtonUi>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default AddRecipeBook;
