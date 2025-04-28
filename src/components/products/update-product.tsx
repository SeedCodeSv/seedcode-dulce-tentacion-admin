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
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { toast } from 'sonner';

import { useCategoriesStore } from '../../store/categories.store';
import { Product, ProductPayload } from '../../types/products.types';
import { useProductsStore } from '../../store/products.store';
import { CategoryProduct } from '../../types/categories.types';
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

  useEffect(() => {
    getListCategories();
    getSubcategories(product?.subCategory.categoryPorudctId || 0);
  }, [getListCategories]);

  const initialProductState: ProductPayload = {
    name: product?.name || '',
    description: product?.description || '',
    subCategoryId: product?.subCategoryId || 0,
    tipoDeItem: product?.tipoDeItem || '',
    unidaDeMedida: product?.unidaDeMedida || '',
    tipoItem: product?.tipoItem || '',
    uniMedida: product?.uniMedida || '',
    code: product?.code || '',
  };

  const [dataUpdateProduct, setDataUpdateProduct] = useState<ProductPayload>(initialProductState);

  const [loading, sertLoging] = useState(false);
  const handleSave = async () => {
    sertLoging(true);
    try {
      const response = await patchProducts(dataUpdateProduct, product?.id || 0);

      if (response.ok === true) {
        sertLoging(false);
        onCloseModal();
      }
    } catch (error) {
      sertLoging(false);
      toast.error('Error al actualizar el producto');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof ProductPayload
  ) => {
    const value =
      field === 'price' || field === 'costoUnitario' ? Number(e.target.value) : e.target.value;

    setDataUpdateProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <Modal isDismissable={false} isOpen={isOpen} size="2xl" onClose={onCloseModal}>
        <ModalContent>
          <ModalHeader>Editar Producto</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div>
                <div className="pt-2">
                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-500 dark:text-gray-200 text-sm',
                    }}
                    defaultValue={product?.name}
                    label="Nombre"
                    labelPlacement="outside"
                    name="name"
                    placeholder="Ingresa el nombre"
                    variant="bordered"
                    onChange={(e) => handleInputChange(e, 'name')}
                  />
                </div>
                <div className="mt-2">
                  <Textarea
                    classNames={{ label: 'font-semibold text-gray-500 text-sm text-left' }}
                    defaultValue={product?.description}
                    label="Descripción"
                    labelPlacement="outside"
                    name="description"
                    placeholder="Ingresa la descripción"
                    variant="bordered"
                    onChange={(e) => handleInputChange(e, 'description')}
                  />
                </div>
                <div className="mt-2">
                  <Autocomplete
                    classNames={{ base: 'font-semibold text-sm' }}
                    defaultInputValue={product?.subCategory?.categoryProduct.name || ''}
                    label="Categoría producto"
                    labelPlacement="outside"
                    placeholder="Selecciona la categoría"
                    value={product?.subCategory?.categoryProduct.name || ''}
                    variant="bordered"
                    onSelectionChange={(key) => {
                      if (key) {
                        const categorySelected = JSON.parse(key as string) as CategoryProduct;

                        getSubcategories(categorySelected.id);
                      }
                    }}
                  >
                    {list_categories.map((category) => (
                      <AutocompleteItem key={JSON.stringify(category)} className="dark:text-white">
                        {category.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div className="mt-2">
                  <Autocomplete
                    className="dark:text-white"
                    classNames={{ base: 'font-semibold text-sm' }}
                    defaultInputValue={product?.subCategory.name || ''}
                    label="Subcategoría"
                    labelPlacement="outside"
                    name="subCategoryId"
                    placeholder="Selecciona la subcategoria"
                    variant="bordered"
                  >
                    {subcategories?.map((sub) => (
                      <AutocompleteItem
                        key={JSON.stringify(sub)}
                        className="dark:text-white"
                        onClick={() => {
                          setDataUpdateProduct((prev) => ({
                            ...prev,
                            subCategoryId: sub.id,
                          }));
                        }}
                      >
                        {sub.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </div>
              <div>
                <div className="mt-2">
                  <Autocomplete
                    classNames={{ base: 'font-semibold' }}
                    defaultInputValue={product?.tipoDeItem || ''}
                    label="Tipo de item"
                    labelPlacement="outside"
                    placeholder="Selecciona el item"
                    variant="bordered"
                  >
                    {itemTypes.map((item) => (
                      <AutocompleteItem
                        key={JSON.stringify(item)}
                        className="dark:text-white"
                        onClick={() => {
                          setDataUpdateProduct((prev) => ({
                            ...prev,
                            tipoDeItem: item.valores,
                          }));
                          setDataUpdateProduct((prev) => ({
                            ...prev,
                            tipoItem: item.codigo,
                          }));
                        }}
                      >
                        {item.valores}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div className="mt-2">
                  <Autocomplete
                    className="pt-5"
                    classNames={{ base: 'font-semibold' }}
                    defaultInputValue={product?.unidaDeMedida || ''}
                    label="Unidad de medida"
                    labelPlacement="outside"
                    name="unidadDeMedida"
                    placeholder="Selecciona unidad de medida"
                    variant="bordered"
                  >
                    {unidadDeMedidaList.map((item) => (
                      <AutocompleteItem
                        key={item.id}
                        className="dark:text-white"
                        onClick={() => {
                          setDataUpdateProduct((prev) => ({
                            ...prev,
                            unidaDeMedida: item.valores,
                          }));
                          setDataUpdateProduct((prev) => ({
                            ...prev,
                            uniMedida: item.codigo,
                          }));
                        }}
                      >
                        {item.valores}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>

                <div className="flex gap-2 mt-5">
                  <div className="w-full mt-2">
                    <Input
                      classNames={{ label: 'font-semibold text-sm' }}
                      defaultValue={product?.code}
                      label="Código"
                      labelPlacement="outside"
                      name="code"
                      placeholder="Ingresa o genera el código"
                      variant="bordered"
                      onChange={(e) => handleInputChange(e, 'code')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {!loading ? (
              <ButtonUi className="px-10" theme={Colors.Primary} onPress={handleSave}>
                Guardar
              </ButtonUi>
            ) : (
              <div className="flex flex-col items-center justify-center w-full">
                <div className="loaderBranch w-2 h-2 mt-2" />
                <p className="mt-3 text-sm font-semibold">Cargando...</p>
              </div>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateProduct;
