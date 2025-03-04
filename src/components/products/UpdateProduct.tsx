import { Input, Textarea, Button, Autocomplete, AutocompleteItem } from "@heroui/react";
import { useContext, useEffect, useState } from 'react';
import { useCategoriesStore } from '../../store/categories.store';
import { Product, ProductPayload } from '../../types/products.types';
import { useProductsStore } from '../../store/products.store';
import { CategoryProduct } from '../../types/categories.types';
import { ThemeContext } from '../../hooks/useTheme';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { useSubCategoriesStore } from '../../store/sub-categories.store';
import { toast } from 'sonner';
// import { toast } from 'sonner';
// import { verify_code_product } from '../../services/products.service';

interface Props {
  product?: Product;
  onCloseModal: () => void;
}

function UpdateProduct({ product, onCloseModal }: Props) {
  const service = new SeedcodeCatalogosMhService();
  const unidadDeMedidaList = service.get014UnidadDeMedida();
  const itemTypes = service.get011TipoDeItem();
  const { getSubcategories, subcategories } = useSubCategoriesStore();

  const { list_categories, getListCategories } = useCategoriesStore();
  const { patchProducts } = useProductsStore();
  const { theme } = useContext(ThemeContext);

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
    <div className="w-full pt-5">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div>
          <div className="pt-2">
            <Input
              label="Nombre"
              labelPlacement="outside"
              defaultValue={product?.name}
              onChange={(e) => handleInputChange(e, 'name')}
              name="name"
              placeholder="Ingresa el nombre"
              classNames={{
                label: 'font-semibold text-gray-500 dark:text-gray-200 text-sm',
              }}
              variant="bordered"
            />
          </div>
          <div className="mt-2">
            <Textarea
              label="Descripción"
              onChange={(e) => handleInputChange(e, 'description')}
              defaultValue={product?.description}
              labelPlacement="outside"
              name="description"
              placeholder="Ingresa la descripción"
              classNames={{ label: 'font-semibold text-gray-500 text-sm text-left' }}
              variant="bordered"
            />
          </div>
          <div className="mt-2">
            <Autocomplete
              onSelectionChange={(key) => {
                if (key) {
                  const categorySelected = JSON.parse(key as string) as CategoryProduct;
                  getSubcategories(categorySelected.id);
                }
              }}
              label="Categoría producto"
              labelPlacement="outside"
              placeholder="Selecciona la categoría"
              value={product?.subCategory?.categoryProduct.name || ''}
              variant="bordered"
              defaultInputValue={product?.subCategory?.categoryProduct.name || ''}
              classNames={{ base: 'font-semibold text-sm' }}
            >
              {list_categories.map((category) => (
                <AutocompleteItem
                  key={JSON.stringify(category)}
                  className="dark:text-white"
                >
                  {category.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <div className="mt-2">
            <Autocomplete
              name="subCategoryId"
              label="Subcategoría"
              labelPlacement="outside"
              placeholder="Selecciona la subcategoria"
              variant="bordered"
              classNames={{ base: 'font-semibold text-sm' }}
              className="dark:text-white"
              defaultInputValue={product?.subCategory.name || ''}
            >
              {subcategories?.map((sub) => (
                <AutocompleteItem
                  key={JSON.stringify(sub)}
                  onClick={() => {
                    setDataUpdateProduct((prev) => ({
                      ...prev,
                      subCategoryId: sub.id,
                    }));
                  }}
                  className="dark:text-white"
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
              variant="bordered"
              label="Tipo de item"
              labelPlacement="outside"
              placeholder="Selecciona el item"
              defaultInputValue={product?.tipoDeItem || ''}
            >
              {itemTypes.map((item) => (
                <AutocompleteItem
                  className="dark:text-white"
                  key={JSON.stringify(item)}
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
              variant="bordered"
              name="unidadDeMedida"
              label="Unidad de medida"
              labelPlacement="outside"
              placeholder="Selecciona unidad de medida"
              defaultInputValue={product?.unidaDeMedida || ''}
            >
              {unidadDeMedidaList.map((item) => (
                <AutocompleteItem
                  className="dark:text-white"
                  key={item.id}
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
                label="Código"
                labelPlacement="outside"
                name="code"
                defaultValue={product?.code}
                onChange={(e) => handleInputChange(e, 'code')}
                placeholder="Ingresa o genera el código"
                classNames={{ label: 'font-semibold text-sm' }}
                variant="bordered"
              />
            </div>
          </div>
        </div>
      </div>
      {!loading ? (
        <Button
          onClick={handleSave}
          className="w-full mt-4 text-sm font-semibold"
          style={{
            backgroundColor: theme.colors.third,
            color: theme.colors.primary,
          }}
        >
          Guardar
        </Button>
      ) : (
        <div className="flex flex-col items-center justify-center w-full">
          <div className="loaderBranch w-2 h-2 mt-2"></div>
          <p className="mt-3 text-sm font-semibold">Cargando...</p>
        </div>
      )}
    </div>
  );
}

export default UpdateProduct;
