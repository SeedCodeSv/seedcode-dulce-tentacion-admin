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
interface Props {
  product?: Product;
  onCloseModal: () => void;
}

function AddProducts(props: Props) {
  const validationSchema = yup.object().shape({
    name: yup.string().required("**El nombre es requerido**"),
    description: yup.string().required("**La descripción es requerida**"),
    price: yup
      .number()
      .required("**El precio es requerido**")
      .typeError("**El precio es requerido**"),
    code: yup.string().required("**El Código es requerido**"),
    type: yup.string().required("**El tipo es requerido**"),
    categoryProductId: yup
      .number()
      .required("**Debes seleccionar la categoría**")
      .min(1, "**Debes seleccionar la categoría**"),
  });

  const initialValues = {
    name: props.product?.name ?? "",
    description: props.product?.description ?? "N/A",
    price: Number(props.product?.price) ?? 0,
    code: props.product?.code ?? "N/A",
    type: props.product?.type ?? "NORMAL",
    categoryProductId: props.product?.categoryProductId ?? 0,
  };

  const { list_categories, getListCategories } = useCategoriesStore();

  useEffect(() => {
    getListCategories();
  }, []);

  const { postProducts, patchProducts } = useProductsStore();
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
            <div>
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
              />
              {errors.description && touched.description && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.description}
                </span>
              )}
            </div>
            <div className="pt-2">
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
              />
              {errors.price && touched.price && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.price}
                </span>
              )}
            </div>
            <div className="mt-4">
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
              >
                {list_categories.map((bra) => (
                  <AutocompleteItem value={bra.name} key={JSON.stringify(bra)}>
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
            <div className="mt-8">
              <Input
                label="Código"
                labelPlacement="outside"
                name="price"
                value={values.code}
                onChange={handleChange("code")}
                onBlur={handleBlur("code")}
                placeholder="Ingresa el código"
                classNames={{
                  label: "font-semibold text-sm",
                }}
                variant="bordered"
              />
              {errors.code && touched.code && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.code}
                </span>
              )}
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
