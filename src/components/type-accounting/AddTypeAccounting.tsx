import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import useGlobalStyles from '../global/global.styles';
import { Plus } from 'lucide-react';
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function AddTypeAccounting() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = () => {
    onOpen();
  };

  const styles = useGlobalStyles();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: {
      name: yup.string().required('**El nombre es requerido**'),
      description: yup.string().required('**La descripción es requerida**'),
    },
    onSubmit: () => {
      
    },
  });

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button isIconOnly style={styles.secondaryStyle} onPress={() => handleOpen()}>
          <Plus />
        </Button>
      </div>
      <Modal isOpen={isOpen} size={'lg'} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
              >
                <ModalHeader className="flex flex-col gap-1">Agregar tipo de partida</ModalHeader>
                <ModalBody>
                  <Input
                    labelPlacement="outside"
                    variant="bordered"
                    classNames={{ base: 'font-semibold' }}
                    label="Nombre"
                    placeholder="Ingresa el nombre"
                    className="w-full"
                    {...formik.getFieldProps('name')}
                    isInvalid={!!formik.touched.name && !!formik.errors.name}
                    errorMessage={formik.errors.name}
                  />
                  <Input
                    labelPlacement="outside"
                    variant="bordered"
                    classNames={{ base: 'font-semibold' }}
                    label="Descripción"
                    placeholder="Ingresa la descripción"
                    className="w-full"
                    {...formik.getFieldProps('description')}
                    isInvalid={!!formik.touched.description && !!formik.errors.description}
                    errorMessage={formik.errors.description}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button className="px-10" color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button className="px-10" style={styles.thirdStyle} type="submit">
                    Guardar
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
