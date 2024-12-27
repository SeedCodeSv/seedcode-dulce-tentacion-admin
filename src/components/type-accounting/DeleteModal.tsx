import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import useGlobalStyles from '../global/global.styles';
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: number;
}

function DeleteModal(props: Props) {
  const styles = useGlobalStyles();
  const [loading, setLoading] = useState(false);

  const { deleteTypeOfAccount } = useTypeOfAccountStore();

  const handleDelete = () => {
    props.onClose();
    setLoading(true);
    deleteTypeOfAccount(props.id)
      .then((res) => {
        setLoading(false);
        if (res) {
          props.onClose();
        }
      })
      .catch(() => {
        props.onClose();
        setLoading(false);
      });
  };

  return (
    <Modal isOpen={props.isOpen} size={'sm'} onClose={props.onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Eliminar tipo de partida</ModalHeader>
            <ModalBody>
              <p>¿Estás seguro de que deseas eliminar este tipo de partida?</p>
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={loading}
                className="px-10"
                color="danger"
                variant="light"
                onPress={onClose}
              >
                Cancelar
              </Button>
              <Button
                isLoading={loading}
                className="px-10"
                style={styles.dangerStyles}
                onPress={handleDelete}
              >
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DeleteModal;
