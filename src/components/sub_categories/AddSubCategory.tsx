import { Input, Button } from '@nextui-org/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ThemeContext } from '../../hooks/useTheme';
import { useContext } from 'react';
import { ISubCategory, ISubCategoryPayload } from '../../types/sub_categories.types';
import { useSubCategoryStore } from '../../store/sub-category';

interface Props {
  closeModal: () => void;
  subCategory?: ISubCategory;
}

const AddSubCategory = (props: Props) => {
  const { theme } = useContext(ThemeContext);

  const validationSchema = yup.object().shape({
    name: yup.string().required('**Debes especificar el nombre de la categoría**'),
  });

  const initialValues = {
    name: props.subCategory?.name ?? '',
    categoryProductId: props.subCategory?.categoryProductId ?? 0,
  };

  const { postSubCategory, patchSubCategory } = useSubCategoryStore();

  const handleSave = (payload: ISubCategoryPayload) => {
    if (props.subCategory) {
      patchSubCategory(payload, props.subCategory.id);
      props.closeModal();
    } else {
      postSubCategory(payload);
      props.closeModal();
    }
  };

  return (
    <div className="p-5 w-full">
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSave}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <>
            <div className="flex flex-col w-full dark:text-white">
              <Input
                name="name"
                labelPlacement="outside"
                value={values.name}
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                placeholder="Ingresa el nombre de la categoría"
                classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                variant="bordered"
                label="Nombre"
              />
              {errors.name && touched.name && (
                <>
                  <span className="text-sm font-semibold text-red-600">{errors.name}</span>
                </>
              )}
            </div>
            <Button
              onClick={() => handleSubmit()}
              className="w-full mt-4 text-sm font-semibold"
              style={{
                backgroundColor: theme.colors.third,
                color: theme.colors.primary,
              }}
            >
              Guardar
            </Button>
          </>
        )}
      </Formik>
    </div>
  );
};

export default AddSubCategory;
