import * as yup from "yup";
import { Formik } from "formik";
import {
  CustomerDirection,
  PayloadCustomer,
} from "../../types/customers.types";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import { useCustomerStore } from "../../store/customers.store";
import { isValidDUI } from "@avalontechsv/idsv";
import { useBillingStore } from "../../store/facturation/billing.store";
import { useContext, useEffect, useMemo, useState } from "react";
import { Municipio } from "../../types/billing/cat-013-municipio.types";
import { Departamento } from "../../types/billing/cat-012-departamento.types";
import { ThemeContext } from "../../hooks/useTheme";

interface Props {
  closeModal: () => void;
  customer?: PayloadCustomer;
  customer_direction?: CustomerDirection;
  id?: number;
}

const AddClientNormal = (props: Props) => {

  const {theme} = useContext(ThemeContext)

  const initialValues = {
    nombre: props.customer?.nombre ?? "",
    correo: props.customer?.correo ?? "",
    telefono: props.customer?.telefono ?? "",
    numDocumento: props.customer?.numDocumento ?? "",
    municipio: props.customer_direction?.municipio ?? "",
    nombreMunicipio: props.customer_direction?.nombreMunicipio ?? "",
    departamento: props.customer_direction?.departamento ?? "",
    nombreDepartamento: props.customer_direction?.nombreDepartamento ?? "",
    complemento: props.customer_direction?.complemento ?? "",
  };

  const validationSchema = yup.object().shape({
    nombre: yup.string().required("El nombre es requerido"),
    correo: yup.string().required("El correo es requerido"),
    telefono: yup.string().required("El teléfono es requerido"),
    numDocumento: yup
      .string()
      .test("isValidDUI", "El DUI no es valido", (value) => {
        if (value && value !== "") {
          return isValidDUI(value);
        } else {
          return true;
        }
      }),
    departamento: yup
      .string()
      .required("**Debes seleccionar el departamento**"),
    municipio: yup.string().required("**Debes seleccionar el municipio**"),
    complemento: yup.string().required("**El complemento es requerida**"),
  });

  const {
    getCat012Departamento,
    cat_012_departamento,
    getCat013Municipios,
    cat_013_municipios,
  } = useBillingStore();

  useEffect(() => {
    getCat012Departamento();
    getCat013Municipios();
  }, []);

  const [selectedCodeDep, setSelectedCodeDep] = useState("0");

  const { postCustomer, patchCustomer } = useCustomerStore();

  const onSubmit = (payload: PayloadCustomer) => {
    if (props.id || props.id !== 0) {
      patchCustomer(payload, props.id!);
    } else {
      postCustomer(payload);
    }
    props.closeModal();
  };

  const filteredMunicipios = useMemo(() => {
    if (selectedCodeDep === "0") {
      return cat_013_municipios;
    }
    return cat_013_municipios.filter(
      (municipio) => municipio.departamento === selectedCodeDep
    );
  }, [cat_013_municipios, selectedCodeDep]);

  const selectedKeyDepartment = useMemo(() => {
    if (props.customer_direction) {
      const department = cat_012_departamento.find(
        (department) =>
          department.codigo === props.customer_direction?.departamento
      );

      return JSON.stringify(department);
    }
  }, [
    props,
    props.customer_direction,
    cat_012_departamento,
    cat_012_departamento.length,
  ]);

  const selectedKeyCity = useMemo(() => {
    if (props.customer_direction) {
      const city = cat_013_municipios.find(
        (department) =>
          department.codigo === props.customer_direction?.municipio
      );

      return JSON.stringify(city);
    }
  }, [
    props,
    props.customer_direction,
    cat_013_municipios,
    cat_013_municipios.length,
  ]);

  return (
    <div className="mb-32 sm:mb-0">
      <Formik
        initialValues={{ ...initialValues }}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(values)}
      >
        {({
          values,
          touched,
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <>
            <div>
              <Input
                label="Nombre"
                labelPlacement="outside"
                name="name"
                value={values.nombre}
                onChange={handleChange("nombre")}
                onBlur={handleBlur("nombre")}
                placeholder="Ingresa el nombre"
                classNames={{
                  label: "font-semibold text-gray-500 text-sm",
                }}
                variant="bordered"
              />
              {errors.nombre && touched.nombre && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.nombre}
                </span>
              )}
            </div>
            <div>
              <Input
                label="Correo electrónico"
                labelPlacement="outside"
                name="correo"
                value={values.correo}
                onChange={handleChange("correo")}
                onBlur={handleBlur("correo")}
                placeholder="Ingresa el correo"
                classNames={{
                  label: "font-semibold text-gray-500 text-sm",
                }}
                variant="bordered"
              />
              {errors.correo && touched.correo && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.correo}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <Input
                  label="Teléfono"
                  labelPlacement="outside"
                  name="telefono"
                  value={values.telefono}
                  onChange={handleChange("telefono")}
                  onBlur={handleBlur("telefono")}
                  placeholder="Ingresa el telefono"
                  classNames={{
                    label: "font-semibold text-gray-500 text-sm",
                  }}
                  variant="bordered"
                />
                {errors.telefono && touched.telefono && (
                  <span className="text-sm font-semibold text-red-500">
                    {errors.telefono}
                  </span>
                )}
              </div>
              <div>
                <Input
                  label="Numero documento"
                  labelPlacement="outside"
                  name="numDocumento"
                  value={values.numDocumento}
                  onChange={handleChange("numDocumento")}
                  onBlur={handleBlur("numDocumento")}
                  placeholder="Ingresa el numero documento"
                  classNames={{
                    label: "font-semibold text-gray-500 text-sm",
                  }}
                  variant="bordered"
                />
                {errors.numDocumento && touched.numDocumento && (
                  <span className="text-sm font-semibold text-red-500">
                    {errors.numDocumento}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const depSelected = JSON.parse(
                        key as string
                      ) as Municipio;
                      setSelectedCodeDep(depSelected.codigo);
                      handleChange("departamento")(depSelected.codigo);
                      handleChange("nombreDepartamento")(depSelected.valores);
                    }
                  }}
                  onBlur={handleBlur("departamento")}
                  label="Departamento"
                  labelPlacement="outside"
                  placeholder="Selecciona el departamento"
                  variant="bordered"
                  classNames={{
                    base: "font-semibold text-gray-500 text-sm",
                  }}
                  selectedKey={selectedKeyDepartment}
                  defaultSelectedKey={selectedKeyDepartment}
                  value={selectedKeyDepartment}
                >
                  {cat_012_departamento.map((dep) => (
                    <AutocompleteItem
                      value={dep.codigo}
                      key={JSON.stringify(dep)}
                    >
                      {dep.valores}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                {errors.departamento && touched.departamento && (
                  <span className="text-sm font-semibold text-red-500">
                    {errors.departamento}
                  </span>
                )}
              </div>
              <div className="pt-2">
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const depSelected = JSON.parse(
                        key as string
                      ) as Departamento;
                      handleChange("municipio")(depSelected.codigo);
                      handleChange("nombreMunicipio")(depSelected.valores);
                    }
                  }}
                  onBlur={handleBlur("municipio")}
                  label="Municipio"
                  labelPlacement="outside"
                  placeholder="Selecciona el departamento"
                  variant="bordered"
                  classNames={{
                    base: "font-semibold text-gray-500 text-sm",
                  }}
                  selectedKey={selectedKeyCity}
                  defaultSelectedKey={selectedKeyCity}
                  value={selectedKeyCity}
                >
                  {filteredMunicipios.map((dep) => (
                    <AutocompleteItem
                      value={dep.codigo}
                      key={JSON.stringify(dep)}
                    >
                      {dep.valores}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                {errors.municipio && touched.municipio && (
                  <span className="text-sm font-semibold text-red-500">
                    {errors.municipio}
                  </span>
                )}
              </div>
            </div>
            <div className="pt-2">
              <Textarea
                label="Complemento de dirección"
                classNames={{
                  label: "font-semibold text-gray-500 text-sm",
                }}
                labelPlacement="outside"
                variant="bordered"
                placeholder="Ingresa el complemento de dirección"
                name="complemento"
                value={values.complemento}
                onChange={handleChange("complemento")}
                onBlur={handleBlur("complemento")}
              />
              {errors.complemento && touched.complemento && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.complemento}
                </span>
              )}
            </div>
            <Button
              onClick={() => handleSubmit()}
              className="w-full mt-4 text-sm font-semibold"
              style={{
                backgroundColor: theme.colors.dark,
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

export default AddClientNormal;
