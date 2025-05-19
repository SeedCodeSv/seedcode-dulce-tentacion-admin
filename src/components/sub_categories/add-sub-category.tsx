import { Input, Autocomplete, AutocompleteItem } from '@heroui/react';
import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useEffect, useMemo } from 'react';

import { ISubCategory, ISubCategoryPayload } from '../../types/sub_categories.types';
import { useSubCategoryStore } from '../../store/sub-category';
import { useCategoriesStore } from '../../store/categories.store';
import { CategoryProduct } from '../../types/branch_products.types';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  closeModal: () => void;
  subCategory: ISubCategory | undefined;
}

const AddSubCategory = (props: Props) => {
  const validationSchema = yup.object().shape({
    name: yup.string().required('**Debes especificar el nombre de la categoría**'),

    categoryProductId: yup
      .number()
      .required('**Estatus es requerido**')
      .min(1, '**Categoria es requerida**'),
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

  const handleSave = async (
    payload: ISubCategoryPayload,
    helpers: FormikHelpers<ISubCategoryPayload>
  ) => {
    try {
      if (props.subCategory) {
        const data = await patchSubCategory(payload, props.subCategory.id);

        if (data.ok === true) {
          helpers.setSubmitting(false);
          props.closeModal();
        }
      } else {
        const data = await postSubCategory(payload);

        if (data.ok === true) {
          helpers.setSubmitting(false);
        }
      }
    } catch (error) {
      helpers.setSubmitting(false);

      return;
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
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
          <>
            <div className="flex flex-col w-full dark:text-white">
              <Input
                classNames={{ base: 'font-semibold dark:text-gray-200 text-sm' }}
                errorMessage={errors.name}
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

              <Autocomplete
                className="dark:text-white mt-4 font-semibold"
                defaultSelectedKey={selectedKeyCategory}
                errorMessage={errors.categoryProductId}
                isInvalid={!!errors.categoryProductId && touched.name}
                label="Categoría de producto"
                labelPlacement="outside"
                name="categoryProductId"
                placeholder={
                  props.subCategory?.categoryProduct?.name
                    ? props.subCategory?.categoryProduct.name
                    : 'Selecciona una categoría'
                }
                value={selectedKeyCategory}
                variant="bordered"
                onBlur={handleBlur('categoryProductId')}
                onSelectionChange={(key) => {
                  if (key) {
                    const category = JSON.parse(key as string) as CategoryProduct;

                    handleChange('categoryProductId')(category.id.toString());
                  }
                }}
              >
                {list_categories.map((bra) => (
                  <AutocompleteItem key={JSON.stringify(bra)} className="dark:text-white">
                    {bra.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div className="mt-3 w-full flex justify-end">
              <ButtonUi
                className="px-10"
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                theme={Colors.Primary}
                onPress={() => handleSubmit()}
              >
                Guardar
              </ButtonUi>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default AddSubCategory;
