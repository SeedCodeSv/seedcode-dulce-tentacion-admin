import {
  Input,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  Select,
  SelectItem,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { toast } from 'sonner';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useCategoriesStore } from '../../store/categories.store';
import { Product } from '../../types/products.types';
import { useProductsStore } from '../../store/products.store';
import { useSubCategoriesStore } from '../../store/sub-categories.store';

import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';

interface Props {
  product?: Product;
  onCloseModal: () => void;
  isOpen: boolean;
}

function UpdateProduct({ product, onCloseModal, isOpen }: Props) {
  const service = new SeedcodeCatalogosMhService();
  const unidadDeMedidaList = service.get014UnidadDeMedida();
  const itemTypes = service.get011TipoDeItem();
  const { getSubcategories, subcategories } = useSubCategoriesStore();

  const { list_categories, getListCategories } = useCategoriesStore();
  const { patchProducts } = useProductsStore();

  const [categorySelected, setCategorySelected] = useState('');

  useEffect(() => {
    getListCategories();
    getSubcategories(product?.subCategory.categoryPorudctId || 0);
  }, [getListCategories]);

  const formik = useFormik({
    initialValues: {
      name: product?.name || '',
      description: product?.description || '',
      subCategoryId: product?.subCategoryId || 0,
      tipoDeItem: product?.tipoDeItem || '',
      unidaDeMedida: product?.unidaDeMedida || '',
      tipoItem: product?.tipoItem || '',
      uniMedida: product?.uniMedida || '',
      code: product?.code || '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('**El nombre es requerido**'),
      description: yup.string().required('**La descripción es requerida**'),
      subCategoryId: yup.number().required('**Debes seleccionar la categoría**'),
      tipoDeItem: yup.string().required('**Debes seleccionar el tipo de item**'),
      unidaDeMedida: yup.string().required('**Debes seleccionar la unidad de medida**'),
      tipoItem: yup.string().required('**Selecciona el tipo de item**'),
      uniMedida: yup.string().required('**Selecciona la unidad de medida**'),
      code: yup.string().required('**Ingresa el codigo del producto**'),
    }),
    onSubmit(values, formikHelpers) {
      patchProducts(values, product?.id ?? 0)
        .then((res) => {
          if (res.ok) {
            toast.success('Se guardo el producto');
            onCloseModal();
          }
          formikHelpers.setSubmitting(false);
          onCloseModal()
        })
        .catch(() => {
          formik.setSubmitting(false);
          toast.error('Error al guardar el producto');
        });
    },
  });

  useEffect(() => {
    if (product) {
      formik.setValues({
        name: product?.name || '',
        description: product?.description || '',
        subCategoryId: product?.subCategoryId || 0,
        tipoDeItem: product?.tipoDeItem || '',
        unidaDeMedida: product?.unidaDeMedida || '',
        tipoItem: product?.tipoItem || '',
        uniMedida: product?.uniMedida || '',
        code: product?.code || '',
      });

      setCategorySelected(product?.subCategory.categoryProduct.id.toString() || '');
    }
  }, [product]);

  return (
    <>
      <Modal isDismissable={false} isOpen={isOpen} size="2xl" onClose={onCloseModal}>
        <ModalContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit(e);
            }}
          >
            <ModalHeader className="dark:text-white">Editar Producto</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                    <Input
                      className="dark:text-white"
                      classNames={{
                        label: 'font-semibold text-gray-500 dark:text-gray-200 text-sm',
                      }}
                      defaultValue={product?.name}
                      label="Nombre"
                      labelPlacement="outside"
                      placeholder="Ingresa el nombre"
                      variant="bordered"
                      {...formik.getFieldProps('name')}
                      errorMessage={formik.errors.name}
                      isInvalid={!!formik.errors.name && !!formik.touched.name}
                    />
                 
                  <div className="mt-2">
                    <Textarea
                      className="dark:text-white"
                      classNames={{ label: 'font-semibold text-gray-500 text-sm text-left' }}
                      defaultValue={product?.description}
                      label="Descripción"
                      labelPlacement="outside"
                      placeholder="Ingresa la descripción"
                      variant="bordered"
                      {...formik.getFieldProps('description')}
                      errorMessage={formik.errors.description}
                      isInvalid={!!formik.errors.description && !!formik.touched.description}
                    />
                  </div>
                  <div className="mt-2">
                    <Autocomplete
                      className="dark:text-white"
                      classNames={{ base: 'font-semibold text-sm' }}
                      label="Categoría producto"
                      labelPlacement="outside"
                      placeholder="Selecciona la categoría"
                      selectedKey={categorySelected}
                      variant="bordered"
                      onSelectionChange={(key) => {
                        if (key) {
                          const categorySelected = key.toString();

                          setCategorySelected(categorySelected);
                          getSubcategories(Number(categorySelected));
                        }
                      }}
                    >
                      {list_categories.map((category) => (
                        <AutocompleteItem key={category.id} className="dark:text-white">
                          {category.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="mt-2">
                    <Select
                      className="dark:text-white"
                      classNames={{ base: 'font-semibold text-sm' }}
                      label="Sub-categoría"
                      labelPlacement="outside"
                      placeholder="Selecciona la sub-categoría"
                      selectedKeys={[formik.values.subCategoryId.toString()]}
                      variant="bordered"
                      {...formik.getFieldProps('subCategoryId')}
                    >
                      {subcategories?.map((sub) => (
                        <SelectItem key={sub.id} className="dark:text-white">
                          {sub.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
                <div>
                  <div className="mt-2">
                    <Select
                      className="dark:text-white"
                      classNames={{ base: 'font-semibold' }}
                      label="Tipo de item"
                      labelPlacement="outside"
                      placeholder="Selecciona el item"
                      selectedKeys={[formik.values.tipoItem]}
                      variant="bordered"
                      onSelectionChange={(key) => {
                        if (key) {
                          const item = itemTypes.find((it) => it.codigo === key.currentKey);

                          if (item) {
                            formik.setFieldValue('tipoDeItem', item.valores),
                              formik.setFieldValue('tipoItem', item.codigo);

                            return;
                          }
                        }
                        formik.setFieldValue('tipoDeItem', ''),
                          formik.setFieldValue('tipoItem', '');
                      }}
                    >
                      {itemTypes.map((item) => (
                        <SelectItem key={item.codigo} className="dark:text-white">
                          {item.valores}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="mt-2">
                    <Autocomplete
                      className="pt-5 dark:text-white"
                      classNames={{ base: 'font-semibold' }}
                      defaultInputValue={product?.unidaDeMedida || ''}
                      label="Unidad de medida"
                      labelPlacement="outside"
                      name="unidadDeMedida"
                      placeholder="Selecciona unidad de medida"
                      variant="bordered"
                      onSelectionChange={(key) => {
                        if (key) {
                          const item = unidadDeMedidaList.find(
                            (it) => it.codigo === key.toString()
                          );

                          if (item) {
                            formik.setFieldValue('unidaDeMedida', item.valores),
                              formik.setFieldValue('uniMedida', item.codigo);

                            return;
                          }
                        }
                        formik.setFieldValue('unidaDeMedida', ''),
                          formik.setFieldValue('uniMedida', '');
                      }}
                    >
                      {unidadDeMedidaList.map((item) => (
                        <AutocompleteItem key={item.codigo} className="dark:text-white">
                          {item.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <div className="w-full mt-2">
                      <Input
                        className="dark:text-white"
                        classNames={{ label: 'font-semibold text-sm' }}
                        defaultValue={product?.code}
                        label="Código"
                        labelPlacement="outside"
                        placeholder="Ingresa o genera el código"
                        variant="bordered"
                        {...formik.getFieldProps('code')}
                        isInvalid={!!formik.errors.code && !!formik.touched.code}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ButtonUi className="px-10" theme={Colors.Primary} type="submit">
                Guardar producto
              </ButtonUi>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateProduct;
