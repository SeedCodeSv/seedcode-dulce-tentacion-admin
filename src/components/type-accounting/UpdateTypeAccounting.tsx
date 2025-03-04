import { TypeOfAccount } from '@/types/type-of-account.types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'sonner';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import useGlobalStyles from '../global/global.styles';

interface Props {
  type: TypeOfAccount;
  isOpen: boolean;
  onClose: () => void;
}

function UpdateTypeAccounting(props: Props) {
  const { updateTypeOfAccount } = useTypeOfAccountStore();
  const styles = useGlobalStyles();

  const formik = useFormik({
    initialValues: {
      name: props.type.name,
      description: props.type.description,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('**El nombre es requerido**'),
      description: yup.string().required('**La descripción es requerida**'),
    }),
    onSubmit: (values, formikHelpers) => {
      updateTypeOfAccount(values, props.type.id)
        .then((res) => {
          formikHelpers.setSubmitting(false);
          if (res) {
            formikHelpers.resetForm();
            props.onClose();
          }
        })
        .catch(() => {
          formikHelpers.setSubmitting(false);
          toast.error('Error al crear el tipo de partida');
        });
    },
  });
  return (
    <Modal isOpen={props.isOpen} size={'lg'} onClose={props.onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit(e);
              }}
            >
              <ModalHeader className="flex flex-col gap-1">Actualizar tipo de partida</ModalHeader>
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
  );
}

export default UpdateTypeAccounting;
