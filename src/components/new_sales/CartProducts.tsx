import { Button, Input, Tooltip } from '@nextui-org/react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useContext } from 'react';
import { BranchProduct, ICartProduct } from '../../types/branch_products.types';
import { useBranchProductStore } from '../../store/branch_product.store';
import { Minus, Plus, Trash } from 'lucide-react';
import { ThemeContext } from '../../hooks/useTheme';
import { descuentoProducto } from './MainView';
// import { descuentoProducto } from "./MainView"

function CartProducts() {
  const { cart_products, onMinusQuantity, onUpdateQuantity, onPlusQuantity, onRemoveProduct } =
    useBranchProductStore();

  const { theme } = useContext(ThemeContext);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const cellEditor = (product: ICartProduct) => {
    const product_finded = cart_products.find((p) => p.id === product.id);

    return (
      <div className="w-full">
        <Input
          variant="bordered"
          color="primary"
          className="w-32"
          type="number"
          defaultValue={product_finded?.quantity.toString()}
          onChange={(e) => onUpdateQuantity(product.id, Number(e.target.value))}
        />
      </div>
    );
  };

  // const formatCurrency = (value: number) => {
  //   return value.toLocaleString('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //   });
  // };


  const nameBodyTemplate = (product: BranchProduct) => {
    const name =
      product.product.name.length > 20
        ? `${product.product.name.substring(0, 20)}...`
        : product.product.name;
    return (
      <>
        {product.product.name.length > 20 ? (
          <Tooltip content={product.product.name} showArrow className="dark:text-white">
            <span>{name}</span>
          </Tooltip>
        ) : (
          <span>{name}</span>
        )}
      </>
    );
  };

  // const totalBodyTemplate = (product: BranchProduct) => {
  //   const product_finded = cart_products.find((p) => p.id === product.id);

  //   if (product_finded) {
  //     return formatCurrency(Number(product_finded.price) * product_finded.quantity);
  //   }
  //   return formatCurrency(0);
  // };
  const priceBodyTemplate = (item: BranchProduct) => {
    const currentDay = new Date().toLocaleDateString("es-ES", { weekday: "long" }).toUpperCase();
    const useFixedPrice = item.days ? item.days.includes(currentDay) : false;
    return useFixedPrice ? item.fixedPrice : item.price || 0;
  };

  return (
    <DataTable
      className="w-full shadow mt-5"
      emptyMessage="No se encontraron resultados"
      value={cart_products}
      tableStyle={{ minWidth: '50rem' }}
      size="small"
      scrollable
      scrollHeight="flex"
    >
      <Column
        headerClassName="text-sm font-semibold"
        headerStyle={{ ...style }}
        field="product.name"
        body={nameBodyTemplate}
        header="Nombre"
      />
      <Column
        headerClassName="text-sm font-semibold"
        headerStyle={style}
        field="quantity"
        header="Cantidad"
        editor={(options) => cellEditor(options.rowData as ICartProduct)}
      />

      <Column
        headerClassName="text-sm font-semibold"
        headerStyle={style}
        field="price"
        body={priceBodyTemplate}
        header="Precio"
      />
      <Column
        className="dark:bg-gray-900 dark:text-slate-400"
        headerClassName="text-sm font-semibold"
        headerStyle={style}
        bodyClassName={"bg-white"}
        body={(item) =>
          `${descuentoProducto.filter((d) => d.descripcion === item.product.name)[0]?.descuento || 0}%`
        }
        header="Descuento"
      />
      {/* <Column
        headerClassName="text-sm font-semibold"
        headerStyle={style}
        body={totalBodyTemplate}
        header="Total"
      /> */}

      <Column
        headerStyle={{ ...style }}
        header="Acciones"
        frozen={true}
        alignFrozen="right"
        body={(item) => (
          <div className="flex gap-4">
            <Button
              style={{
                backgroundColor: theme.colors.secondary,
              }}
              isIconOnly
              onClick={() => {
                onPlusQuantity(item.id);
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
                onMinusQuantity(item.id);
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
                onRemoveProduct(item.id);
              }}
            >
              <Trash size={18} className="text-white" />
            </Button>
          </div>
        )}
      />
    </DataTable>
  );
}

export default CartProducts;
