import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import { useState } from 'react';
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: number;
}

function DeleteModal(props: Props) {
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
              <ButtonUi
                isLoading={loading}
                className="px-10"
                theme={Colors.Error}
                onPress={handleDelete}
              >
                Eliminar
              </ButtonUi>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DeleteModal;
