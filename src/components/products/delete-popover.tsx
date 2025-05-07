import { Button, Popover, PopoverContent, PopoverTrigger, useDisclosure } from '@heroui/react';
import { Trash } from 'lucide-react';

import { useProductsStore } from '@/store/products.store';
import ButtonUi from '@/themes/ui/button-ui';
import useThemeColors from '@/themes/use-theme-colors';
import { Product } from '@/types/branch_products.types';
import { Colors } from '@/types/themes.types';

interface PopProps {
  product: Product;
}
export const DeletePopover = ({ product }: PopProps) => {
  const { deleteProducts } = useProductsStore();
  const deleteDisclosure = useDisclosure();

  const handleDelete = () => {
    deleteProducts(product.id);
    deleteDisclosure.onClose();
  };
  const style = useThemeColors({ name: Colors.Error });

  return (
    <>
      <Popover
        className="border border-white rounded-2xl"
        {...deleteDisclosure}
        showArrow
        backdrop="blur"
      >
        <PopoverTrigger>
          <Button isIconOnly style={style}>
            <Trash />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col items-center justify-center w-full p-5">
            <p className="font-semibold text-gray-600 dark:text-white">Eliminar {product.name}</p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="flex justify-center mt-4 gap-5">
              <ButtonUi
                className="border border-white"
                theme={Colors.Default}
                onPress={deleteDisclosure.onClose}
              >
                No, cancelar
              </ButtonUi>
              <ButtonUi theme={Colors.Error} onPress={() => handleDelete()}>
                Si, eliminar
              </ButtonUi>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
