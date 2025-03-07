import classNames from 'classnames';
import { BranchProduct } from '../../../types/branch_products.types';
import { ClipboardList, DollarSign, Plus, ShoppingBag } from 'lucide-react';
import { ListItem } from './ListItem';
import { Button } from "@heroui/react";
import { global_styles } from '../../../styles/global.styles';
import { toast } from 'sonner';
import { useBranchProductStore } from '../../../store/branch_product.store';
export const GridItem = ({
  product,
  layout,
}: {
  product: BranchProduct;
  layout: 'grid' | 'list';
}) => {
  const { addProductCart } = useBranchProductStore();

  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow-sm mt-4 bg-slate-50 dark:bg-gray-700 dark:border border-gray-600  hover:shadow-lg p-8 rounded-2xl'
          )}
          key={product.id}
        >
          <div className="flex w-full gap-2 ">
            <ShoppingBag className="dark:text-gray-400  text-[#274c77]" size={33} />
            {product.product.name}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <DollarSign className="dark:text-gray-400 text-[#274c77]" size={33} />
            {product.price}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <ClipboardList className="dark:text-gray-400 text-[#274c77]" size={33} />
            {product.product.subCategory.name}
          </div>

          <div className="flex justify-end gap-6 mt-3">
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
        <>
          <ListItem product={product} />
        </>
      )}
    </>
  );
};
