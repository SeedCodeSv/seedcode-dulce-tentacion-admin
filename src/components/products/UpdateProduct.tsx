import { Input, Textarea, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useCategoriesStore } from '../../store/categories.store';
import { Product, ProductPayload } from '../../types/products.types';
import { useProductsStore } from '../../store/products.store';
import { CategoryProduct } from '../../types/categories.types';
import { ThemeContext } from '../../hooks/useTheme';
import { useBillingStore } from '../../store/facturation/billing.store';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';

interface Props {
  product?: Product;
  onCloseModal: () => void;
}

function UpdateProduct({ product, onCloseModal }: Props) {
  const unidadDeMedidaList = new SeedcodeCatalogosMhService().get014UnidadDeMedida();

  const { list_categories, getListCategories } = useCategoriesStore();
  const { patchProducts, cat_011_tipo_de_item, getCat011TipoDeItem } = useProductsStore();
  const { getCat014UnidadDeMedida } = useBillingStore();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    getListCategories();
    getCat011TipoDeItem();
    getCat014UnidadDeMedida();
  }, [getListCategories, getCat011TipoDeItem, getCat014UnidadDeMedida]);

  const initialProductState: ProductPayload = {
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    costoUnitario: product?.costoUnitario || '',
    categoryProductId: product?.categoryProductId || 0,
    tipoDeItem: product?.tipoDeItem || '',
    unidaDeMedida: product?.unidaDeMedida || '',
    tipoItem: product?.tipoItem || '',
    uniMedida: product?.uniMedida || '',
    code: product?.code || '',
  };

  const [dataUpdateProduct, setDataUpdateProduct] = useState<ProductPayload>(initialProductState);
  const [codigo, setCodigo] = useState(product?.code || '');

  const handleSave = () => {
    patchProducts(dataUpdateProduct, product?.id || 0);
    onCloseModal();
  };

  const selectedKeyCategory = useMemo(() => {
    if (product) {
      const category = list_categories.find(
        (category) => category.id === product.categoryProductId
      );
      return JSON.stringify(category);
    }
    return '';
  }, [product, list_categories]);

  const generarCodigo = () => {
    const makeid = (length: number) => {
      let result = '';
      const characters = '0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    };
    const codigoGenerado = makeid(12);
    setCodigo(codigoGenerado);
    setDataUpdateProduct((prev) => ({
      ...prev,
      code: codigoGenerado,
    }));
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
    <div className="mb-32 sm:mb-0 w-full pt-5">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="mt-4">
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
              classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
              variant="bordered"
            />
          </div>
          <div className="mt-2">
            <Input
              onChange={(e) => handleInputChange(e, 'price')}
              label="Precio"
              defaultValue={product?.price}
              labelPlacement="outside"
              name="price"
              placeholder="00.00"
              classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
              variant="bordered"
              type="number"
              startContent="$"
            />
          </div>
          <div className="mt-2">
            <Input
              onChange={(e) => handleInputChange(e, 'costoUnitario')}
              label="Costo unitario"
              labelPlacement="outside"
              defaultValue={product?.costoUnitario}
              name="costoUnitario"
              placeholder="00.00"
              classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
              variant="bordered"
              type="number"
              startContent="$"
            />
          </div>
        </div>
        <div>
          <div className="mt-2">
            <Autocomplete
              onSelectionChange={(key) => {
                if (key) {
                  const categorySelected = JSON.parse(key as string) as CategoryProduct;
                  setDataUpdateProduct((prev) => ({
                    ...prev,
                    categoryProductId: categorySelected.id,
                  }));
                }
              }}
              label="Categoría producto"
              labelPlacement="outside"
              placeholder={product?.categoryProduct?.name || 'Selecciona la categoría'}
              variant="bordered"
              classNames={{ base: 'font-semibold text-gray-500 text-sm' }}
              defaultSelectedKey={selectedKeyCategory}
              value={selectedKeyCategory}
            >
              {list_categories.map((category) => (
                <AutocompleteItem value={category.name} key={JSON.stringify(category)}>
                  {category.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <div className="mt-2">
            <Autocomplete
              className="pt-5"
              variant="bordered"
              label="Tipo de item"
              labelPlacement="outside"
              placeholder={product?.tipoDeItem || 'Selecciona el item'}
            >
              {cat_011_tipo_de_item.map((item) => (
                <AutocompleteItem
                  key={JSON.stringify(item)}
                  value={item.codigo}
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
              placeholder={product?.unidaDeMedida || 'Selecciona unidad de medida'}
            >
              {unidadDeMedidaList.map((item) => (
                <AutocompleteItem
                  key={item.id}
                  value={item.valores}
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

          <div className="flex mt-2 gap-2">
            <div className="mt-2 w-full">
              <Input
                label="Código"
                labelPlacement="outside"
                name="code"
                defaultValue={product?.code}
                value={codigo}
                placeholder="Ingresa o genera el código"
                classNames={{ label: 'font-semibold text-sm' }}
                variant="bordered"
              />
            </div>
            <div className="mt-10 w-full">
              <Button
                className="w-full text-sm font-semibold"
                style={{
                  backgroundColor: theme.colors.third,
                  color: theme.colors.primary,
                }}
                onClick={() => {
                  generarCodigo();
                }}
              >
                Generar Código
              </Button>
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
}

export default UpdateProduct;
