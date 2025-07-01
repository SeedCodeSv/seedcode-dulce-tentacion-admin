import { Input, ModalContent, Modal, ModalBody, ModalFooter, ModalHeader, Checkbox } from '@heroui/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';

import { useCategoriesStore } from '../../store/categories.store';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  closeModal: () => void;
  isOpen: boolean;
  category?: {
    id: number;
    name: string;
    showSale: boolean
  };
}

const AddCategory = (props: Props) => {
  const validationSchema = yup.object().shape({
    name: yup.string().required('**Debes especificar el nombre de la categoría**'),
  });

  const { postCategories, patchCategory } = useCategoriesStore();
  // const [showSale, setShowSale] = useState(true)

  const [loading, setLoading] = useState(false);
  const handleSave = async ({ name, showSale }: { name: string; showSale: boolean }) => {
    setLoading(true);
    if (props.category) {
      const data = await patchCategory(name, showSale, props.category.id);

      if (data.ok === true) {
        props.closeModal();
        setLoading(false);
      }
    } else {
      const data = await postCategories(name, showSale);

      if (data.ok === true) {
        props.closeModal();
        setLoading(false);
      }
    }
  };

  return (
    <Modal isOpen={props.isOpen} size="lg" onClose={props.closeModal}>
      <ModalContent>
        <ModalHeader>{props.category ? 'Editar' : 'Agregar'} categoría</ModalHeader>
        <Formik
          initialValues={{ name: props.category?.name ?? '', showSale: props.category?.showSale ?? true }}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <>
              <ModalBody>
                <div className="flex flex-col gap-4 w-full dark:text-white">
                  <Input
                    className="dark:text-white"
                    classNames={{
                      base: 'text-sm font-semibold text-gray-600',
                    }}
                    errorMessage={touched.name && errors.name}
                    isInvalid={!!errors.name && touched.name}
                    label="Nombre"
                    labelPlacement="outside"
                    name="name"
                    placeholder="Ingresa el nombre de la categoría"
                    value={values.name}
                    variant="bordered"
                    onBlur={handleBlur('name')}
                    onChange={handleChange('name')}
                  />
                  karde

                </div>
              </ModalBody>
              <ModalFooter>
                {loading ? (
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="loaderBranch w-2 h-2 mt-2" />
                    <p className="mt-3 text-sm font-semibold">Cargando...</p>
                  </div>
                ) : (
                  <ButtonUi theme={Colors.Primary} onPress={() => handleSubmit()}>
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
