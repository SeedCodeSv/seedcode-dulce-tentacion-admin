import { Input } from '@heroui/react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Trash } from 'lucide-react';

import { Product } from '@/types/products.types';
import { preventLetters } from '@/utils';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

type ProductOrder = Product & {
  quantity: number;
  performanceQuantity: string;
  cost: number;
  MOP: number;
  CIF: number
};

interface Props {
  selectedProducts: ProductOrder[];
  setSelectedProducts: Dispatch<SetStateAction<ProductOrder[]>>;
  performance: string;
}

function RecipeBookProduct({ selectedProducts, setSelectedProducts, performance }: Props) {
  const handleEditQuantity = (quantity: number, index: number) => {
    const list_suppliers = [...selectedProducts];

    list_suppliers[index].quantity = quantity;

    const performanceQuantity = quantity / (Number(performance || 1) || 1);
    const cost = Number(list_suppliers[index].cost) / performanceQuantity;

    list_suppliers[index].cost = cost;
    list_suppliers[index].performanceQuantity = performanceQuantity.toFixed(4);

    setSelectedProducts(list_suppliers);
  };

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const products = [...selectedProducts];

      const newProducts = products.map((product) => {
        const quantity = Number(product.quantity);
        const performanceQuantity = quantity / (Number(performance || 1) || 1);
        const cost = Number(product.cost) / Number(performance);

        return {
          ...product,
          quantity: quantity,
          performanceQuantity: performanceQuantity.toFixed(4),
          cost: Number(cost),
        };
      });

      setSelectedProducts(newProducts);
    }
  }, [performance]);
  const handleDeleteProduct = (index: number) => {
    const list_suppliers = [...selectedProducts];

    list_suppliers.splice(index, 1);
    setSelectedProducts(list_suppliers);
  };

  return (
    <>
      <div className="w-full mt-3 max-h-96 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        {selectedProducts.map((sp: ProductOrder) => (
          <div
            key={sp.id}
            className="items-center gap-2 py-2 shadow border rounded-[12px] p-4 flex flex-col"
          >
            <div className="flex justify-between w-full">
              <p className="text-sm font-semibold w-full dark:text-white">{sp.name}</p>
              <ButtonUi
                isIconOnly
                theme={Colors.Error}
                onPress={handleDeleteProduct.bind(null, selectedProducts.indexOf(sp))}
              >
                <Trash />
              </ButtonUi>
            </div>
            <div className="flex justify-between items-end gap-5 w-full">
              <div className=" w-full grid grid-cols-2 gap-5">
                <Input
                  className="w-full"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Cantidad por rendimiento"
                  placeholder="Ingresa la cantidad por rendimiento"
                  type="string"
                  value={sp.quantity.toString()}
                  variant="bordered"
                  onKeyDown={preventLetters}
                  onValueChange={(quantity) =>
                    handleEditQuantity(quantity as unknown as number, selectedProducts.indexOf(sp))
                  }
                />
                <Input
                  readOnly
                  className="w-full"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Cantidad por unidad"
                  placeholder="Ingresa la cantidad del producto"
                  type="string"
                  value={sp.performanceQuantity.toString()}
                  variant="bordered"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default RecipeBookProduct;
