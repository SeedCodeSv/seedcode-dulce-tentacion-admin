import {
  Input,
  Textarea,
  Button,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { Formik } from "formik";
import { useContext, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
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
function AddProducts(props: Props) {
  const unidadDeMedidaList =
    new SeedcodeCatalogosMhService().get014UnidadDeMedida();
  const tipoItem = new SeedcodeCatalogosMhService().get011TipoDeItem();

  const validationSchema = yup.object().shape({
    name: yup.string().required("**El nombre es requerido**"),
    description: yup.string().required("**La descripción es requerida**"),
    price: yup
      .number()
      .required("**El precio es requerido**")
      .typeError("**El precio es requerido**"),
    costoUnitario: yup
      .number()
      .required("**El precio es requerido**")
      .typeError("**El precio es requerido**"),
    code: yup
      .string()
      .required("**El Código es requerido**")
      .length(12, "**El código debe tener exactamente 12 dígitos**"),
    categoryProductId: yup
      .number()
      .required("**Debes seleccionar la categoría**")
      .min(1, "**Debes seleccionar la categoría**"),
  });

  const initialValues = {
    name: props.product?.name ?? "",
    description: props.product?.description ?? "N/A",
    price: props.product?.price ?? "",
    costoUnitario: props.product?.costoUnitario ?? "",
    code: props.product?.code ?? "N/A",
    categoryProductId: props.product?.categoryProductId ?? 0,
    tipoDeItem: props.product?.tipoDeItem ?? "N/A",
    unidaDeMedida: props.product?.unidaDeMedida ?? "N/A",

    tipoItem: props.product?.tipoItem ?? "",
    uniMedida: props.product?.uniMedida ?? "",
  };
  const { list_categories, getListCategories } = useCategoriesStore();
  useEffect(() => {
    getListCategories();
  }, []);

  const {
    postProducts,
    patchProducts,
    cat_011_tipo_de_item,
    getCat011TipoDeItem,
  } = useProductsStore();
  const { getCat014UnidadDeMedida } = useBillingStore();
  useEffect(() => {
    getCat011TipoDeItem();
    getCat014UnidadDeMedida();
  }, []);
  const { theme } = useContext(ThemeContext);
  const handleSave = (values: ProductPayload) => {
    if (props.product) {
      patchProducts(values, props.product.id);
    } else {
      postProducts(values);
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

    return codigoGenerado;
  };

  return (
    <div className="mb-32 sm:mb-0 w-full pt-5">
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSave}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleSubmit,
          handleChange,
        }) => (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="mt-4">
                  <Input
                    label="Nombre"
                    labelPlacement="outside"
                    name="name"
                    value={values.name}
                    onChange={handleChange("name")}
                    onBlur={handleBlur("name")}
                    placeholder="Ingresa el nombre"
                    classNames={{
                      label:
                        "font-semibold text-gray-500 dark:text-gray-200 text-sm",
                    }}
                    variant="bordered"
                    size="lg"
                  />
                  {errors.name && touched.name && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.name}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <Textarea
                    label="Descripción"
                    labelPlacement="outside"
                    name="description"
                    value={values.description}
                    onChange={handleChange("description")}
                    onBlur={handleBlur("description")}
                    placeholder="Ingresa la descripción"
                    classNames={{
                      label: "font-semibold text-gray-500 text-sm",
                    }}
                    variant="bordered"
                    size="lg"
                  />
                  {errors.description && touched.description && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.description}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <Input
                    label="Precio"
                    labelPlacement="outside"
                    name="price"
                    value={values.price.toString()}
                    onChange={handleChange("price")}
                    onBlur={handleBlur("price")}
                    placeholder="00.00"
                    classNames={{
                      label: "font-semibold text-gray-500 text-sm",
                    }}
                    variant="bordered"
                    type="number"
                    startContent="$"
                    size="lg"
                  />
                  {errors.price && touched.price && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.price}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <Input
                    label="Costo unitario"
                    labelPlacement="outside"
                    name="costoUnitario"
                    value={values.costoUnitario.toString()}
                    onChange={handleChange("costoUnitario")}
                    onBlur={handleBlur("costoUnitario")}
                    placeholder="00.00"
                    classNames={{
                      label: "font-semibold text-gray-500 text-sm",
                    }}
                    variant="bordered"
                    type="number"
                    startContent="$"
                    size="lg"
                  />
                  {errors.costoUnitario && touched.costoUnitario && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.costoUnitario}
                    </span>
                  )}
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
                        handleChange("categoryProductId")(
                          branchSelected.id.toString()
                        );
                      }
                    }}
                    onBlur={handleBlur("categoryProductId")}
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
                    // selectedKey={selectedKeyCategory}
                    defaultSelectedKey={selectedKeyCategory}
                    value={selectedKeyCategory}
                    size="lg"
                  >
                    {list_categories.map((bra) => (
                      <AutocompleteItem
                        value={bra.name}
                        key={JSON.stringify(bra)}
                      >
                        {bra.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  {errors.categoryProductId && touched.categoryProductId && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.categoryProductId}
                    </span>
                  )}
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
                        onClick={() => {
                          handleChange("tipoDeItem")(item.valores.toString());
                          handleChange("tipoItem")(item.codigo.toString());
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
                        onClick={() => {
                          handleChange("unidaDeMedida")(
                            item.valores.toString()
                          );
                          handleChange("uniMedida")(item.codigo.toString());
                        }}
                      >
                        {item.valores}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  {errors.uniMedida && touched.uniMedida && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.uniMedida}
                    </span>
                  )}
                </div>
                <div className="flex mt-2 gap-2">
                  <div className="mt-2 w-full">
                    <Input
                      label="Código"
                      labelPlacement="outside"
                      name="code"
                      value={codigo || values.code}
                      onChange={(e) => {
                        handleChange("code")(e);
                        setCodigo(e.target.value);
                      }}
                      onBlur={handleBlur("code")}
                      placeholder="Ingresa o genera el código"
                      classNames={{
                        label: "font-semibold text-sm",
                      }}
                      variant="bordered"
                      size="lg"
                    />
                    {errors.code && touched.code && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.code}
                      </span>
                    )}
                  </div>
                  <div className="mt-10 w-full">
                    <Button
                      className="w-full text-sm font-semibold"
                      style={{
                        backgroundColor: theme.colors.third,
                        color: theme.colors.primary,
                      }}
                      onClick={() => {
                        const code = generarCodigo();
                        handleChange("code")(code); // Actualiza el valor del formulario con el código generado
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
}

export default AddProducts;
