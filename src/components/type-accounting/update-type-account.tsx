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

import { TypeOfAccount } from '@/types/type-of-account.types';
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  type: TypeOfAccount;
  isOpen: boolean;
  onClose: () => void;
}

function UpdateTypeAccounting(props: Props) {
  const { updateTypeOfAccount } = useTypeOfAccountStore();

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
                  className="w-full"
                  classNames={{ base: 'font-semibold' }}
                  label="Nombre"
                  labelPlacement="outside"
                  placeholder="Ingresa el nombre"
                  variant="bordered"
                  {...formik.getFieldProps('name')}
                  errorMessage={formik.errors.name}
                  isInvalid={!!formik.touched.name && !!formik.errors.name}
                />
                <Input
                  className="w-full"
                  classNames={{ base: 'font-semibold' }}
                  label="Descripción"
                  labelPlacement="outside"
                  placeholder="Ingresa la descripción"
                  variant="bordered"
                  {...formik.getFieldProps('description')}
                  errorMessage={formik.errors.description}
                  isInvalid={!!formik.touched.description && !!formik.errors.description}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="px-10"
                  color="danger"
                  isLoading={formik.isSubmitting}
                  variant="light"
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <ButtonUi
                  className="px-10"
                  isLoading={formik.isSubmitting}
                  theme={Colors.Primary}
                  type="submit"
                >
                  Guardar
                </ButtonUi>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default UpdateTypeAccounting;
