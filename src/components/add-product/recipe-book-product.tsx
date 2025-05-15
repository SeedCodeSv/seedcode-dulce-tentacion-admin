import { Input } from '@heroui/react';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { Trash } from 'lucide-react';

import { filtrarPorCategoria } from './validation-add-product';

import { Product } from '@/types/products.types';
import { preventLetters } from '@/utils';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';


type ProductOrder = Product & { quantity: number; extraUniMedida: string };

interface Props {
  selectedProducts: ProductOrder[];
  setSelectedProducts: Dispatch<SetStateAction<ProductOrder[]>>
}

function RecipeBookProduct({ selectedProducts, setSelectedProducts }: Props) {

  const handleEditQuantity = (quantity: number, index: number) => {
    const list_suppliers = [...selectedProducts];

    list_suppliers[index].quantity = quantity;
    setSelectedProducts(list_suppliers);
  };

  const handleEditUniMedida = (uniMedida: string, index: number) => {
    const list_suppliers = [...selectedProducts];

    list_suppliers[index].extraUniMedida = uniMedida;
    setSelectedProducts(list_suppliers);
  };

  const handleDeleteProduct = (index: number) => {
    const list_suppliers = [...selectedProducts];

    list_suppliers.splice(index, 1);
    setSelectedProducts(list_suppliers);
  };

  const services = useMemo(() => new SeedcodeCatalogosMhService(), [])

  return (
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
                        handleEditUniMedida(e.target.value, selectedProducts.indexOf(sp))
                      }
                    >
                      {filtrarPorCategoria(sp.unidaDeMedida, services.get014UnidadDeMedida()).map(
                        (tpS) => (
                          <option key={tpS.codigo} value={tpS.codigo}>
                            {tpS.valores}
                          </option>
                        )
                      )}
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
            <ButtonUi
              isIconOnly
              theme={Colors.Error}
              onPress={handleDeleteProduct.bind(null, selectedProducts.indexOf(sp))}
            >
              <Trash />
            </ButtonUi>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeBookProduct;
