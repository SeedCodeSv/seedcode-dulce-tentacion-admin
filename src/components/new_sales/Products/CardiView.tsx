import { useBranchProductStore } from '../../../store/branch_product.store';
import { BranchProduct } from '../../../types/branch_products.types';
import classNames from 'classnames';
import { DataView } from 'primereact/dataview';
import { formatCurrency } from '../../../utils/dte';
import { Button } from '@nextui-org/react';
import { Plus } from 'lucide-react';
import { global_styles } from '../../../styles/global.styles';
import { toast } from 'sonner';

interface Props {
  layout: 'grid' | 'list';
}

function CardView(props: Props) {
  const { branch_products } = useBranchProductStore();

  return (
    <div className="w-full pb-10">
      <DataView
        value={branch_products}
        gutter
        layout={props.layout}
        pt={{
          content: () => ({
            className: 'p-3',
          }),
          grid: () => ({
            className:
              'grid bg-transparent pb-10 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 mt-5',
          }),
        }}
        color="surface"
        itemTemplate={(product) => gridItem(product, props.layout)}
        emptyMessage="No employee found"
      />
    </div>
  );
}

export default CardView;

const gridItem = (product: BranchProduct, layout: 'grid' | 'list') => {
  /* eslint-disable react-hooks/rules-of-hooks */
  const { addProductCart } = useBranchProductStore();
  /* eslint-enable react-hooks/rules-of-hooks */
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow-sm hover:shadow-lg border dark:border-gray-600 p-4 rounded'
          )}
          key={product.id}
        >
          <p className="font-semibold">{product.product.name}</p>
          <p className="text-sm mt-2 text-green-700 font-semibold">
            Precio: {formatCurrency(Number(product.price))}{' '}
          </p>
          <p className="text-sm mt-2 text-blue-800 font-semibold">
            Categoría:{product.product.categoryProduct.name}
          </p>
          <div className="mt-3">
            <Button
              style={global_styles().secondaryStyle}
              isIconOnly
              onClick={() => {
                addProductCart(product);
                toast.success('Producto agregado al carrito');
              }}
            >
              <Plus />
            </Button>
          </div>
        </div>
      ) : (
        <ListItem product={product} />
      )}
    </>
  );
};

const ListItem = ({ product }: { product: BranchProduct }) => {
  const { addProductCart } = useBranchProductStore();
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4 gap-10">
        <div className="flex flex-col justify-center">
          <p className="font-semibold">{product.product.name}</p>
          <p className="text-sm mt-2 text-green-700 font-semibold">
            Precio: {formatCurrency(Number(product.price))}{' '}
          </p>
          <p className="text-sm mt-2 text-blue-800 font-semibold">
            Categoría:{product.product.categoryProduct.name}
          </p>
        </div>
        <div className="flex flex-col items-end justify-between w-full">
          <Button
            style={global_styles().secondaryStyle}
            isIconOnly
            onClick={() => {
              addProductCart(product);
              toast.success('Producto agregado al carrito');
            }}
          >
            <Plus />
          </Button>
        </div>
      </div>
    </>
  );
};
