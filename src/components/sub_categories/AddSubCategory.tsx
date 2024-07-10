import { Input, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ThemeContext } from '../../hooks/useTheme';
import { useContext, useEffect, useMemo } from 'react';
import { ISubCategory, ISubCategoryPayload } from '../../types/sub_categories.types';
import { useSubCategoryStore } from '../../store/sub-category';
import { useCategoriesStore } from '../../store/categories.store';
import { CategoryProduct } from '../../types/branch_products.types';

interface Props {
  closeModal: () => void;
  subCategory: ISubCategory | undefined;
}

const AddSubCategory = (props: Props) => {
  const { theme } = useContext(ThemeContext);

  const validationSchema = yup.object().shape({
    name: yup.string().required('**Debes especificar el nombre de la categoría**'),
    categoryProductId: yup.number().required('**Debes especificar el nombre de la categoría**'),
  });

  const initialValues = {
    name: props.subCategory?.name ?? '',
    categoryProductId: props.subCategory?.categoryPorudctId ?? 0,
  };

  const { postSubCategory, patchSubCategory } = useSubCategoryStore();
  const { list_categories, getListCategories } = useCategoriesStore();

  useEffect(() => {
    getListCategories();
  }, []);

  const handleSave = (payload: ISubCategoryPayload) => {
    if (props.subCategory) {
      patchSubCategory(payload, props.subCategory.id);
      props.closeModal();
    } else {
      postSubCategory(payload);
      props.closeModal();
    }
  };

  const selectedKeyCategory = useMemo(() => {
    if (props.subCategory) {
      const classProduct = list_categories.find(
        (classProduct) => classProduct.id === props.subCategory?.categoryPorudctId
      );
      return JSON.stringify(classProduct);
    }
  }, [props, props.subCategory, list_categories]);

  return (
    <div className="w-full mt-4">
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

              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const category = JSON.parse(key as string) as CategoryProduct;
                    handleChange('categoryProductId')(category.id.toString());
                  }
                }}
                onBlur={handleBlur('categoryProductId')}
                label="Categoría de producto"
                labelPlacement="outside"
                variant="bordered"
                className="dark:text-white mt-4 font-semibold"
                placeholder={
                  props.subCategory?.categoryProduct?.name
                    ? props.subCategory?.categoryProduct.name
                    : 'Selecciona una categoría'
                }
                defaultSelectedKey={selectedKeyCategory}
                value={selectedKeyCategory}
                name="categoryProductId"
              >
                {list_categories.map((bra) => (
                  <AutocompleteItem
                    className="dark:text-white"
                    value={bra.name}
                    key={JSON.stringify(bra)}
                  >
                    {bra.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {errors.categoryProductId && touched.categoryProductId && (
                <>
                  <span className="text-sm font-semibold text-red-600">
                    {errors.categoryProductId}
                  </span>
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
