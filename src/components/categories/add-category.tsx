import { Input, ModalContent, Modal, ModalBody, ModalFooter, ModalHeader } from '@heroui/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useCategoriesStore } from '../../store/categories.store';
import { useState } from 'react';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  closeModal: () => void;
  isOpen: boolean;
  category?: {
    id: number;
    name: string;
  };
}

const AddCategory = (props: Props) => {
  const validationSchema = yup.object().shape({
    name: yup.string().required('**Debes especificar el nombre de la categoría**'),
  });

  const { postCategories, patchCategory } = useCategoriesStore();

  const [loading, setLoading] = useState(false);
  const handleSave = async ({ name }: { name: string }) => {
    setLoading(true);
    if (props.category) {
      const data = await patchCategory(name, props.category.id);
      if (data.ok === true) {
        props.closeModal();
        setLoading(false);
      }
    } else {
      const data = await postCategories(name);
      if (data.ok === true) {
        props.closeModal();
        setLoading(false);
      }
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.closeModal} size="lg">
      <ModalContent>
        <ModalHeader>{props.category ? 'Editar' : 'Agregar'} categoría</ModalHeader>
        <Formik
          validationSchema={validationSchema}
          initialValues={{ name: props.category?.name ?? '' }}
          onSubmit={handleSave}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <>
              <ModalBody>
                <div className="flex flex-col w-full dark:text-white">
                  <Input
                    name="name"
                    labelPlacement="outside"
                    className="dark:text-white"
                    value={values.name}
                    onChange={handleChange('name')}
                    onBlur={handleBlur('name')}
                    placeholder="Ingresa el nombre de la categoría"
                    classNames={{
                      base: 'text-sm font-semibold text-gray-600',
                    }}
                    variant="bordered"
                    label="Nombre"
                    isInvalid={!!errors.name && touched.name}
                    errorMessage={touched.name && errors.name}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                {loading ? (
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="loaderBranch w-2 h-2 mt-2"></div>
                    <p className="mt-3 text-sm font-semibold">Cargando...</p>
                  </div>
                ) : (
                  <ButtonUi onPress={() => handleSubmit()} theme={Colors.Primary}>
                    Guardar
                  </ButtonUi>
                )}
              </ModalFooter>
            </>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddCategory;
