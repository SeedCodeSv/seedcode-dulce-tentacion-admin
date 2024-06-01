import { ClipboardList, DollarSign, Plus, ShoppingBag } from 'lucide-react';
import { BranchProduct } from '../../../types/branch_products.types';
import { Button } from '@nextui-org/react';
import { global_styles } from '../../../styles/global.styles';
import { toast } from 'sonner';
import { useBranchProductStore } from '../../../store/branch_product.store';

export const ListItem = ({ product }: { product: BranchProduct }) => {
  const { addProductCart } = useBranchProductStore();
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4 bg-slate-50">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <ShoppingBag className="dark:text-gray-400 text-[#274c77]" size={33} />
            {product.product.name}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <DollarSign className="dark:text-gray-400 text-[#274c77]" size={33} />
            {product.price}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <ClipboardList className="dark:text-gray-400 text-[#274c77]" size={33} />
            {product.product.categoryProduct.name}
          </div>
          <div className="flex items-center w-full gap-2 mt-3 justify-end">
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
      </div>
    </>
  );
};
