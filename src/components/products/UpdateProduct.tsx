import {
  Input,
  Textarea,
  Button,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useCategoriesStore } from "../../store/categories.store";
import { Product, ProductPayload } from "../../types/products.types";
import { useProductsStore } from "../../store/products.store";
import { CategoryProduct } from "../../types/categories.types";
import { ThemeContext } from "../../hooks/useTheme";

import { useBillingStore } from "../../store/facturation/billing.store";
import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh";
interface Props {
  product?: Product;
  onCloseModal: () => void;
}
function UpdateProduct(props: Props) {
  const unidadDeMedidaList =
    new SeedcodeCatalogosMhService().get014UnidadDeMedida();

  const [unidadDeMedida, setUnidadDeMedida] = useState("");

  const { list_categories, getListCategories } = useCategoriesStore();
  useEffect(() => {
    getListCategories();
  }, []);

  const { patchProducts, cat_011_tipo_de_item, getCat011TipoDeItem } =
    useProductsStore();
  const { getCat014UnidadDeMedida } = useBillingStore();
  useEffect(() => {
    getCat011TipoDeItem();
    getCat014UnidadDeMedida();
  }, []);
  const { theme } = useContext(ThemeContext);

  const [dataUpdateProduct, setDataUpdateProduct] = useState<ProductPayload>();
  const handleSave = () => {
    if (dataUpdateProduct) {
      patchProducts(dataUpdateProduct, props.product?.id || 0);
    }

    props.onCloseModal();
  };
  const selectedKeyCategory = useMemo(() => {
    if (props.product) {
      const category = list_categories.find(
        (category) => category.id === props.product?.categoryProductId
      );

      return JSON.stringify(category);
    }
  }, [props, props.product, list_categories]);

  const [codigo, setCodigo] = useState("");

  const generarCodigo = () => {
    const makeid = (length: number) => {
      let result = "";
      const characters = "0123456789";
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
      }
      return result;
    };
    const codigoGenerado = makeid(12);
    setCodigo(codigoGenerado);
  };
  return (
    <div className="mb-32 sm:mb-0 w-full pt-5">
      <>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="mt-4">
              <Input
                label="Nombre"
                labelPlacement="outside"
                defaultValue={props.product?.name}
                onChange={(e) => {
                  setDataUpdateProduct({
                    ...dataUpdateProduct,
                    name: e.target.value,
                  });
                }}
                name="name"
                placeholder="Ingresa el nombre"
                classNames={{
                  label:
                    "font-semibold text-gray-500 dark:text-gray-200 text-sm",
                }}
                variant="bordered"
                size="lg"
              />
            </div>
            <div className="mt-2">
              <Textarea
                label="Descripción"
                defaultValue={props.product?.description}
                labelPlacement="outside"
                name="description"
                placeholder="Ingresa la descripción"
                classNames={{
                  label: "font-semibold text-gray-500 text-sm",
                }}
                variant="bordered"
                size="lg"
              />
            </div>
            <div className="mt-2">
              <Input
                label="Precio"
                defaultValue={props.product?.price}
                labelPlacement="outside"
                name="price"
                placeholder="00.00"
                classNames={{
                  label: "font-semibold text-gray-500 text-sm",
                }}
                variant="bordered"
                type="number"
                startContent="$"
                size="lg"
              />
            </div>
            <div className="mt-2">
              <Input
                label="Costo unitario"
                labelPlacement="outside"
                defaultValue={props.product?.costoUnitario}
                name="costoUnitario"
                placeholder="00.00"
                classNames={{
                  label: "font-semibold text-gray-500 text-sm",
                }}
                variant="bordered"
                type="number"
                startContent="$"
                size="lg"
              />
            </div>
          </div>
          <div>
            <div className="mt-2">
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const branchSelected = JSON.parse(
                      key as string
                    ) as CategoryProduct;
                  }
                }}
                label="Categoría producto"
                labelPlacement="outside"
                placeholder={
                  props.product?.categoryProduct.name ??
                  props.product?.categoryProduct.name ??
                  "Selecciona la categoría"
                }
                variant="bordered"
                classNames={{
                  base: "font-semibold text-gray-500 text-sm",
                }}
                defaultSelectedKey={selectedKeyCategory}
                value={selectedKeyCategory}
                size="lg"
              >
                {list_categories.map((bra) => (
                  <AutocompleteItem value={bra.name} key={JSON.stringify(bra)}>
                    {bra.name}
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
                placeholder={
                  props.product?.tipoDeItem ??
                  props.product?.tipoDeItem ??
                  "Selecciona el item"
                }
                size="lg"
              >
                {cat_011_tipo_de_item.map((item) => (
                  <AutocompleteItem
                    key={JSON.stringify(item)}
                    value={item.codigo}
                  >
                    {item.valores}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div className="mt-2">
              <Autocomplete
                className="pt-5"
                onSelectionChange={() => {
                  {
                    unidadDeMedidaList.map((item) => {
                      if (item.valores) {
                        setUnidadDeMedida(item.valores);
                      }
                    });
                  }
                }}
                variant="bordered"
                name="unidaDeMedida"
                label="Unidad de medida"
                labelPlacement="outside"
                placeholder={
                  props.product?.tipoDeItem ??
                  props.product?.tipoDeItem ??
                  "Selecciona unidad de medida"
                }
                size="lg"
              >
                {unidadDeMedidaList.map((item) => (
                  <AutocompleteItem
                    key={JSON.stringify(item)}
                    value={item.valores}
                    onChange={() => {
                      setUnidadDeMedida(item.valores);
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
                  defaultValue={props.product?.code}
                  placeholder="Ingresa o genera el código"
                  classNames={{
                    label: "font-semibold text-sm",
                  }}
                  variant="bordered"
                  size="lg"
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
          size="lg"
          onClick={handleSave}
          className="w-full mt-4 text-sm font-semibold"
          style={{
            backgroundColor: theme.colors.third,
            color: theme.colors.primary,
          }}
        >
          Guardar
        </Button>
      </>
    </div>
  );
}

export default UpdateProduct;
