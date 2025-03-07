import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";
import useGlobalStyles from '../global/global.styles';
import { Plus } from 'lucide-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import { toast } from 'sonner';


export default function AddTypeAccounting() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { createTypeOfAccount } = useTypeOfAccountStore();

  const handleOpen = () => {
    onOpen();
  };

  const styles = useGlobalStyles();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('**El nombre es requerido**'),
      description: yup.string().required('**La descripción es requerida**'),
    }),
    onSubmit: (values, formikHelpers) => {
      createTypeOfAccount(values)
        .then((res) => {
          formikHelpers.setSubmitting(false);
          if (res) {
            formikHelpers.resetForm();
            onClose();
          }
        })
        .catch(() => {
          formikHelpers.setSubmitting(false);
          toast.error('Error al crear el tipo de partida');
        });
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
                  formik.handleSubmit(e);
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
                  <Button
                    isLoading={formik.isSubmitting}
                    className="px-10"
                    color="danger"
                    variant="light"
                    onPress={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    isLoading={formik.isSubmitting}
                    className="px-10"
                    style={styles.thirdStyle}
                    type="submit"
                  >
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
