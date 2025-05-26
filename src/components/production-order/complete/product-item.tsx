import React, { useEffect, useMemo, useState } from 'react';
import { Input } from '@heroui/react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';


import { Detail } from '@/types/production-order.types';
import { filtrarPorCategoria } from '@/components/add-product/validation-add-product';

type DevolutionProduct = {
  id: number;
  name: string;
  quantity: number;
  uniMedida: string;
  unidadDeMedida: string;
};

interface ProductItemProps {
  details: Detail[];
  canReturnProduct: boolean
  onQuantityChange: (id: number, produced: number, damaged: number) => void;
  onAddProductDevolution: (devolutionProduct: DevolutionProduct[]) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  canReturnProduct,
  details,
  onAddProductDevolution
}) => {
  const services = useMemo(() => new SeedcodeCatalogosMhService(), []);
  const [devolution, setDevolution] = useState<DevolutionProduct[]>([]);

  useEffect(() => {
    if (details) {
      setDevolution(
        details.map((item) => ({
          name: item.branchProduct.product.name,
          id: item.branchProduct.id,
          quantity: 0,
          uniMedida: item.branchProduct.product.uniMedida,
          unidadDeMedida: item.branchProduct.product.unidaDeMedida,
        }))
      );
    }
  }, []);

  const handleEditUniMedida = (uniMedida: string, index: number) => {
    const list_suppliers = [...devolution];

    list_suppliers[index].uniMedida = uniMedida;
    setDevolution(list_suppliers);
  };

  const handleEditQuantity = (quantity: number, index: number) => {
    const list_suppliers = [...devolution];

    list_suppliers[index].quantity = Number(quantity);
    setDevolution(list_suppliers);
  };

  useEffect(() => {
    if (canReturnProduct) {
      const validDevolution = devolution.filter((item) => item.quantity > 0);

      onAddProductDevolution(validDevolution);
    }
  }, [canReturnProduct, devolution]);

  return (
    <div className="grid grid-cols-2 gap-5">
      {devolution.map((ingredient) => (
        <>
          <div className="border p-4 bg-white dark:bg-gray-900 rounded-[12px]">
            <p className="pb-3 font-semibold dark:text-gray-100">{ingredient.name}</p>
            <Input
              className="w-full"
              classNames={{
                label: 'text-xs font-semibold',
                base: 'dark:text-white'
              }}
              endContent={
                <>
                  <select
                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                    id="currency"
                    name="currency"
                    value={ingredient.uniMedida}
                    onChange={(e) => {
                      handleEditUniMedida(String(e.target.value), devolution.indexOf(ingredient));
                    }
                    }
                  >
                    {filtrarPorCategoria(
                      ingredient.unidadDeMedida,
                      services.get014UnidadDeMedida()
                    ).map((tpS) => (
                      <option key={tpS.codigo} value={tpS.codigo}>
                        {tpS.valores}
                      </option>
                    ))}
                  </select>
                </>
              }
              label="Cantidad a devolver"
              placeholder="0"
              variant="bordered"
              onValueChange={(text) =>
                handleEditQuantity(
                  text as unknown as number,
                  devolution.indexOf(ingredient)
                )
              }
            />
          </div>
        </>
      ))}
    </div>
  );
};

export default ProductItem;
