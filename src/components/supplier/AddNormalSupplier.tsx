import { isValidDUI } from "@avalontechsv/idsv";
import { PayloadSupplier, SupplierDirection } from "../../types/supplier.types";
import * as yup from "yup";
import { useEffect, useMemo, useState } from "react";
import { useBillingStore } from "../../store/facturation/billing.store";
import { get_user } from "../../storage/localStorage";
import { Formik } from "formik";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import { Departamento } from "../../types/billing/cat-012-departamento.types";
import { global_styles } from "../../styles/global.styles";
import { Municipio } from "../../types/billing/cat-013-municipio.types";
import { useSupplierStore } from "../../store/supplier.store";
import { toast } from "sonner";

interface Props {
  closeModal: () => void;
  supplier?: PayloadSupplier;
  supplier_direction?: SupplierDirection;
  id?: number;
}

function AddNormalSupplier(props: Props) {
  const initialValues = {
    nombre: props.supplier?.nombre ?? "",
    correo: props.supplier?.correo ?? "",
    telefono: props.supplier?.telefono ?? "",
    numDocumento: props.supplier?.numDocumento ?? "",
    municipio: props.supplier_direction?.municipio ?? "",
    nombreMunicipio: props.supplier_direction?.nombreMunicipio ?? "",
    departamento: props.supplier_direction?.departamento ?? "",
    nombreDepartamento: props.supplier_direction?.nombreDepartamento ?? "",
    complemento: props.supplier_direction?.complemento ?? "",
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

  const [selectedCodeDep, setSelectedCodeDep] = useState("0");

  const {
    getCat012Departamento,
    cat_012_departamento,
    getCat013Municipios,
    cat_013_municipios,
  } = useBillingStore();

  useEffect(() => {
    getCat012Departamento();
  }, []);

  useEffect(() => {
    getCat013Municipios(selectedCodeDep);
  }, [selectedCodeDep]);

  const {onPostSupplier} = useSupplierStore()

  const user = get_user();

  const selectedKeyDepartment = useMemo(() => {
    if (props.supplier_direction) {
      const department = cat_012_departamento.find(
        (department) =>
          department.codigo === props.supplier_direction?.departamento
      );

      return JSON.stringify(department);
    }
  }, [
    props,
    props.supplier_direction,
    cat_012_departamento,
    cat_012_departamento.length,
  ]);

  const selectedKeyCity = useMemo(() => {
    if (props.supplier_direction) {
      const city = cat_013_municipios.find(
        (department) =>
          department.codigo === props.supplier_direction?.municipio
      );

      return JSON.stringify(city);
    }
  }, [
    props,
    props.supplier_direction,
    cat_013_municipios,
    cat_013_municipios.length,
  ]);

  const onSubmit = (payload: PayloadSupplier) => {
    if (props.id) {
      toast.error("No se puede editar un proveedor normal");
    } else {
      const values = {
        ...payload,
        esContribuyente: 0,
        transmitterId: Number(user?.employee.branch.transmitterId),
      };
      onPostSupplier(values);
    }
    props.closeModal()
  };

  return (
    <div>
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
            <div className="pt-3">
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
            <div className="pt-3">
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
            <div className="grid grid-cols-2 gap-5 pt-3">
              <div>
                <Input
                  type="number"
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
                  type="number"
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
            <div className="grid grid-cols-2 gap-5 pt-3">
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
                  placeholder={
                    values.nombreDepartamento
                      ? values.nombreDepartamento
                      : "Selecciona el departamento"
                  }
                  variant="bordered"
                  classNames={{
                    base: "font-semibold text-gray-500 text-sm",
                  }}
                  className="dark:text-white"
                  // selectedKey={selectedKeyDepartment}
                  defaultSelectedKey={selectedKeyDepartment}
                  value={selectedKeyDepartment}
                >
                  {cat_012_departamento.map((dep) => (
                    <AutocompleteItem
                      value={dep.codigo}
                      key={JSON.stringify(dep)}
                      className="dark:text-white"
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
              <div>
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
                  className="dark:text-white"
                  placeholder={
                    values.nombreMunicipio
                      ? values.nombreMunicipio
                      : "Selecciona el municipio"
                  }
                  variant="bordered"
                  classNames={{
                    base: "font-semibold text-gray-500 text-sm",
                  }}
                  // selectedKey={selectedKeyCity}
                  defaultSelectedKey={props.supplier_direction?.municipio}
                  value={selectedKeyCity}
                >
                  {cat_013_municipios.map((dep) => (
                    <AutocompleteItem
                      value={dep.codigo}
                      key={JSON.stringify(dep)}
                      className="dark:text-white"
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
              style={global_styles().darkStyle}
            >
              Guardar
            </Button>
          </>
        )}
      </Formik>
    </div>
  );
}

export default AddNormalSupplier;
