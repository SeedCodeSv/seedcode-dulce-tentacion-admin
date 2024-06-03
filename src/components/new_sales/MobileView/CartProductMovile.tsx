import { Button, Input, Tooltip } from '@nextui-org/react';
import { useContext } from 'react';
import { Minus, Plus, Trash } from 'lucide-react';
import { ThemeContext } from '../../../hooks/useTheme';
import { useBranchProductStore } from '../../../store/branch_product.store';
import { BranchProduct } from '../../../types/branch_products.types';

function CartProductsMobile() {
  const { cart_products, onMinusQuantity, onUpdateQuantity, onPlusQuantity, onRemoveProduct } =
    useBranchProductStore();

  const { theme } = useContext(ThemeContext);

  // const style = {
  //   backgroundColor: theme.colors.dark,
  //   color: theme.colors.primary,
  // };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const nameBodyTemplate = (product: BranchProduct) => {
    const name =
      product.product.name.length > 20
        ? `${product.product.name.substring(0, 20)}...`
        : product.product.name;
    return (
      <>
        {product.product.name.length > 20 ? (
          <Tooltip content={product.product.name} showArrow>
            <span>{name}</span>
          </Tooltip>
        ) : (
          <span>{name}</span>
        )}
      </>
    );
  };

  const totalBodyTemplate = (product: BranchProduct) => {
    const product_finded = cart_products.find((p) => p.id === product.id);

    if (product_finded) {
      return formatCurrency(Number(product_finded.price) * product_finded.quantity);
    }
    return formatCurrency(0);
  };

  return (
    <div className="grid  grid-cols-1 bg-gray-50 dark:bg-gray-800 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-[50vh] overflow-x-auto ">
      {cart_products.map((product) => (
        <div
          key={product.id}
          className="p-4 shadow-lg bg-gray-50 dark:bg-gray-700 rounded-lg flex flex-col justify-between h-auto"
        >
          <div className=" ">
            <div className="text-lg font-bold mb-2 text-black dark:text-white">{nameBodyTemplate(product)}</div>
            <div className="text-sm mb-2 text-black dark:text-white ">
              Cantidad:
              <Input
                variant="bordered"
                color="primary"
                className="w-16 ml-2"
                type="number"
                defaultValue={product.quantity.toString()}
                onChange={(e) => onUpdateQuantity(product.id, Number(e.target.value))}
              />
            </div>
            <div className="text-sm mb-2 text-black dark:text-white">
              Precio: {formatCurrency(Number(product.price))}
            </div>
            <div className="text-sm mb-2 text-black dark:text-white">
              Total: {totalBodyTemplate(product)}
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              style={{
                backgroundColor: theme.colors.secondary,
              }}
              isIconOnly
              onClick={() => {
                onPlusQuantity(product.id);
              }}
            >
              <Plus size={18} className="text-white" />
            </Button>
            <Button
              style={{
                backgroundColor: theme.colors.warning,
              }}
              isIconOnly
              onClick={() => {
                onMinusQuantity(product.id);
              }}
            >
              <Minus size={18} className="text-white" />
            </Button>
            <Button
              style={{
                backgroundColor: theme.colors.danger,
              }}
              isIconOnly
              onClick={() => {
                onRemoveProduct(product.id);
              }}
            >
              <Trash size={18} className="text-white" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartProductsMobile;
