import { Input, Button } from '@nextui-org/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useCategoriesStore } from '../../store/categories.store';
import { global_styles } from '@/styles/global.styles';

interface Props {
  closeModal: () => void;
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

  const handleSave = ({ name }: { name: string }) => {
    if (props.category) {
      patchCategory(name, props.category.id);
      props.closeModal();
    } else {
      postCategories(name);
      props.closeModal();
    }
  };

  return (
    <div className="w-full py-4">
      <Formik
        validationSchema={validationSchema}
        initialValues={{ name: props.category?.name ?? '' }}
        onSubmit={handleSave}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <>
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
            <Button
              onClick={() => handleSubmit()}
              className="w-full mt-4 text-sm font-semibold"
              style={global_styles().thirdStyle}
            >
              Guardar
            </Button>
          </>
        )}
      </Formik>
    </div>
  );
};

export default AddCategory;
