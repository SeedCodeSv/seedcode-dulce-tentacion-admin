import { global_styles } from '@/styles/global.styles';
import { API_URL } from '@/utils/constants';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  controlNumber: string;
  id: number;
  reload: () => void;
}

export const DeleteShopingDTE = ({ controlNumber, id, reload }: Props) => {
  const onDeleteConfirm = () => {
    axios
      .delete(API_URL + '/shoppings/delete-permanently/' + id)
      .then((response) => {
        if (response.status === 200) {
          reload();
          toast.success('Eliminado con éxito');
        } else {
          toast.error('Error inesperado');
        }
      })
      .catch(() => {
        toast.error('Error al eliminar');
      });
  };

  return (
    <Popover className="border border-white rounded-xl">
      <PopoverTrigger>
        <Button style={global_styles().warningStyles} isIconOnly>
          <Trash />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4">
          <p className="text-sm font-normal text-gray-600 text-center">
            ¿Deseas eliminar este DTE
          </p>
          <p className="text-sm font-normal text-gray-600 text-center">
            {controlNumber}?{' '}
          </p>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => onDeleteConfirm()}
              style={{
                backgroundColor: '#FF4D4F',
                color: 'white',
              }}
              className="mr-2"
            >
              Sí, eliminar
            </Button>
            {/* <Button onClick={onClose} >
            Cancelar
          </Button> */}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
