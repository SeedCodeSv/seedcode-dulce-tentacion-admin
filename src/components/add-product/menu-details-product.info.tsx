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
import { ChevronLeft, ChevronRight, Plus, Search, Trash } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';

import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';
import { useProductsStore } from '@/store/products.store';
import { Product } from '@/types/products.types';
import { preventLetters } from '@/utils';

type ProductOrder = Product & { quantity: number; uniMedidaExtra: string  };

interface Props {
  selectedProducts: ProductOrder[];
  setSelectedProducts: (products: ProductOrder[]) => void;
}

function MenuDetailsProductInfo({ selectedProducts, setSelectedProducts }: Props) {
  const [includesPrescription, setIncludesPrescription] = useState(false);
  const services = useMemo(() => new SeedcodeCatalogosMhService(), []);
  const { paginated_products, getPaginatedProducts } = useProductsStore();
  const typeSearch = ['NOMBRE', 'CODIGO'];
  const [selectedTypeSearch, setSelectedTypeSearch] = useState<'NOMBRE' | 'CODIGO'>('NOMBRE');
  const [name, setName] = useState('');

  useEffect(() => {
    getPaginatedProducts(
      1,
      20,
      0,
      0,
      selectedTypeSearch === 'NOMBRE' ? name : '',
      selectedTypeSearch === 'CODIGO' ? name : '',
      1
    );
  }, []);

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
    const list_suppliers = [...selectedProducts];

    const checkIfExist = list_suppliers.findIndex((lsP) => lsP.id === prd.id);

    if (checkIfExist === -1) {
      list_suppliers.push({
        ...prd, quantity: 1, uniMedidaExtra: prd.uniMedida,
        // MOP: 0,
        // CIF: 0
      });
    } else {
      list_suppliers.splice(checkIfExist, 1);
    }

    setSelectedProducts(list_suppliers);
  };

  const checkIsSelectedSupplier = (id: number) => {
    return selectedProducts.some((ssp) => ssp.id === id);
  };

  const modalAddProducts = useDisclosure();

  const handleEditQuantity = (quantity: number, index: number) => {
    const list_suppliers = [...selectedProducts];

    list_suppliers[index].quantity = quantity;
    setSelectedProducts(list_suppliers);
  };

  const handleEditUniMedida = (uniMedida: string, index: number) => {
    const list_suppliers = [...selectedProducts];

    list_suppliers[index].uniMedidaExtra = uniMedida;
    setSelectedProducts(list_suppliers);
  };

  const handleDeleteProduct = (index: number) => {
    const list_suppliers = [...selectedProducts];

    list_suppliers.splice(index, 1);
    setSelectedProducts(list_suppliers);
  };

  return (
    <div className="w-full border shadow rounded-[12px] p-5 mt-3">
      <p className="text-xl font-semibold dark:text-white py-3">Recetario</p>
      <div className="shadow border rounded-[12px] p-5">
        <div className="flex justify-between">
          <Checkbox
            checked={includesPrescription}
            defaultChecked={includesPrescription}
            size="lg"
            onValueChange={setIncludesPrescription}
          >
            <span className="dark:text-white font-semibold">Incluye receta</span>
          </Checkbox>
          {includesPrescription && (
            <>
              <ButtonUi isIconOnly theme={Colors.Success} onPress={modalAddProducts.onOpen}>
                <Plus />
              </ButtonUi>
            </>
          )}
        </div>

         <div className="w-full mt-3 max-h-96 overflow-y-auto md:grid md:grid-cols-3 flex flex-col gap-4">
          {selectedProducts.map((sp: ProductOrder) => (
            <div
              key={sp.id}
              className="items-center gap-2 py-2 shadow border rounded-[12px] p-4 flex flex-col"
            >
              <p className="text-sm font-semibold w-full dark:text-white">{sp.name}</p>
              <div className='flex justify-between items-end gap-5'>
              <div className="mt-3 w-full">
                <Input
                className='dark:text-white'
                  classNames={{
                    label: 'font-semibold dark:text-white',
                  }}
                  endContent={
                    <div className="flex items-center">
                      <label className="sr-only" htmlFor="currency">
                        Currency
                      </label>
                      <select
                        className="outline-none border-0 bg-transparent text-default-400 text-small dark:text-white"
                        id="currency"
                        name="currency"
                        value={sp.uniMedidaExtra}
                        onChange={(e) =>
                          handleEditUniMedida(e.target.value, selectedProducts.indexOf(sp))
                        }
                      >
                        {services.get014UnidadDeMedida().map((tpS) => (
                          <option key={tpS.codigo} value={tpS.codigo}>
                            {tpS.valores.slice(0, 15)}
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
                    handleEditQuantity(quantity as unknown as number, selectedProducts.indexOf(sp))
                  }
                />
              </div>
                <ButtonUi isIconOnly theme={Colors.Error} onPress={handleDeleteProduct.bind(null, selectedProducts.indexOf(sp))}>
                  <Trash />
                </ButtonUi>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal {...modalAddProducts} scrollBehavior="inside" size="2xl">
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
                    <p className="w-full dark:text-white">Correo: {bpr.code}</p>
                    <p className="w-full dark:text-white">NRC: {bpr.subCategory.name}</p>
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

export default MenuDetailsProductInfo;
