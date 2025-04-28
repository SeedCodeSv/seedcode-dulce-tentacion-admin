import { Button, Popover, PopoverTrigger, PopoverContent, useDisclosure } from '@heroui/react';
import { Trash } from 'lucide-react';

import { useCustomerStore } from '@/store/customers.store';
import ButtonUi from '@/themes/ui/button-ui';
import useThemeColors from '@/themes/use-theme-colors';
import { Customer } from '@/types/customers.types';
import { Colors } from '@/types/themes.types';

interface PopProps {
  customers: Customer;
}
export const DeletePopover = ({ customers }: PopProps) => {
  const deleteDisclosure = useDisclosure();
  const { deleteCustomer } = useCustomerStore();
  const handleDelete = async () => {
    await deleteCustomer(customers.id);
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
            <p className="font-semibold text-gray-600 dark:text-white">
              Eliminar {customers.nombre}
            </p>
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
