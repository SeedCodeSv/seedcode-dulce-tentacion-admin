import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'sonner';

import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';
import { useProductionOrderTypeStore } from '@/store/production-order-type.store';

type DisclosureProps = ReturnType<typeof useDisclosure>;

interface Props {
  disclosure: DisclosureProps;
}

function AddProductionOrderType(props: Props) {
  const { onCreateProductionOrderType, onGetProductionOrderTypes } = useProductionOrderTypeStore();

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('**El nombre es requerido**'),
    }),
    onSubmit(values, formikHelpers) {
      onCreateProductionOrderType(values.name)
        .then((res) => {
          formikHelpers.setSubmitting(false);
          if (res) {
            formikHelpers.resetForm();
            onGetProductionOrderTypes();
            props.disclosure.onClose();
          }
        })
        .catch(() => {
          formikHelpers.setSubmitting(false);
          toast.error('Error al crear el tipo de partida');
        });
    },
  });

  return (
    <Modal {...props.disclosure}>
      <ModalContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <ModalHeader>
            <h3>Agregar tipo de orden de producción</h3>
          </ModalHeader>
          <ModalBody>
            <Input
              classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
              label="Nombre"
              labelPlacement="outside"
              placeholder="Ingrese el nombre"
              variant="bordered"
              {...formik.getFieldProps('name')}
              errorMessage={formik.errors.name}
              isInvalid={!!formik.touched.name && !!formik.errors.name}
            />
          </ModalBody>
          <ModalFooter className="flex justify-end gap-5">
            <ButtonUi className="px-8" isLoading={formik.isSubmitting} theme={Colors.Error} onPress={props.disclosure.onClose}>
              Cancelar
            </ButtonUi>
            <ButtonUi
              className="px-8"
              isLoading={formik.isSubmitting}
              theme={Colors.Success}
              type="submit"
            >
              Guardar
            </ButtonUi>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AddProductionOrderType;
