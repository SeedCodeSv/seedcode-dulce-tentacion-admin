import {
  Input,
  Textarea,
  useCheckbox,
  Chip,
  VisuallyHidden,
  tv,
  CheckboxGroup,
  Button,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { Formik } from "formik";
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useCategoriesStore } from "../../store/categories.store";
import { Product, ProductPayload } from "../../types/products.types";
import { useProductsStore } from "../../store/products.store";
import React, { useRef } from "react";
import { CategoryProduct } from "../../types/categories.types";
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

  const [search, setSearch] = useState("");

  const items_selected = useMemo(() => {
    if (search === "") {
      return list_categories.map((it) => {
        return {
          label: it.id + " - " + it.name,
          value: it.id + " - " + it.name,
        };
      });
    } else {
      const filteredItems = list_categories
        .filter((item) => {
          if (item.name.toLowerCase().includes(search.toLowerCase())) {
            return item;
          }
        })
        .map((it) => {
          return {
            label: it.id + " - " + it.name,
            value: it.id + " - " + it.name,
          };
        });

      return filteredItems;
    }
  }, [list_categories, search]);

  const { postProducts, patchProducts } = useProductsStore();

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
    <div className="mb-32 sm:mb-0 w-96">
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
                  label: "font-semibold text-gray-500 text-sm",
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
                    handleChange("categoryProductId")(branchSelected.id.toString());
                  }
                }}
                onBlur={handleBlur("categoryProductId")}
                label="Categoría producto"
                labelPlacement="outside"
                placeholder="Selecciona la categoría"
                variant="bordered"
                classNames={{
                  base: "font-semibold text-gray-500 text-sm",
                }}
                selectedKey={selectedKeyCategory}
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
            <div className="flex flex-col mt-2">
              <label className="mb-3 text-sm font-semibold text-gray-700">
                Tipo de producto
              </label>
              <CheckboxGroup
                orientation="horizontal"
                onChange={(e) => {
                  const selected = e as unknown as Array<string>;
                  handleChange("type")(selected[selected.length - 1] ?? "");
                }}
                onBlur={handleBlur("type")}
                value={[values.type]}
              >
                <CustomCheckBox value="NORMAL">NORMAL</CustomCheckBox>
                <CustomCheckBox value="EXTRAS">EXTRAS</CustomCheckBox>
              </CheckboxGroup>
              {errors.type && touched.type && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.type}
                </span>
              )}
            </div>

            <Button
              onClick={() => handleSubmit()}
              className="w-full mt-4 text-sm font-semibold text-white bg-[#B06161]"
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

const checkbox = tv({
  slots: {
    base: "border-default hover:bg-default-200",
    content: "text-default-500",
  },
  variants: {
    isSelected: {
      true: {
        base: "border-success bg-success hover:bg-success-500 hover:border-success-500",
        content: "text-primary-foreground pl-1",
      },
    },
    isFocusVisible: {
      true: {
        base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
      },
    },
  },
});

export const CustomCheckBox = (props: any) => {
  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    ...props,
  });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: `${styles.content()} text-sm`,
        }}
        color="primary"
        startContent={
          isSelected ? <Check className="ml-1" color="white" /> : null
        }
        variant="faded"
      >
        {children ? children : isSelected ? "Enabled" : "Disabled"}
      </Chip>
    </label>
  );
};
