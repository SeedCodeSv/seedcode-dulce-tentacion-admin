import { ThemeContext } from '@/hooks/useTheme';
import { useCustomerStore } from '@/store/customers.store';
import { Customer } from '@/types/customers.types';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
} from '@nextui-org/react';
import { TrashIcon } from 'lucide-react';
import { useContext } from 'react';
interface PopProps {
  customers: Customer;
}
export const DeletePopover = ({ customers }: PopProps) => {
  const { theme } = useContext(ThemeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deleteCustomer } = useCustomerStore();
  const handleDelete = async (id: number) => {
    await deleteCustomer(id);
    onClose();
  };
  return (
    <Popover isOpen={isOpen} onClose={onClose} backdrop="blur" showArrow>
      <PopoverTrigger>
        <Button
          onClick={onOpen}
          isIconOnly
          style={{
            backgroundColor: theme.colors.danger,
          }}
        >
          <TrashIcon
            style={{
              color: theme.colors.primary,
            }}
            size={20}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-full p-5 dark:text-white flex flex-col items-center justify-center">
          <p className="font-semibold text-gray-600 dark:text-white text-center">
            Eliminar {customers.nombre}
          </p>
          <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
            ¿Estás seguro de eliminar este registro?
          </p>
          <div className="mt-4 flex justify-center">
            <Button onClick={onClose}>No, cancelar</Button>
            <Button
              onClick={() => handleDelete(customers.id)}
              className="ml-5"
              style={{
                backgroundColor: theme.colors.danger,
                color: theme.colors.primary,
              }}
            >
              Si, eliminar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};