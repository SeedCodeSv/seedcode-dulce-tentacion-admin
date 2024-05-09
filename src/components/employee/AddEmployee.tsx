import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import { Formik } from "formik";
import * as yup from "yup";
import { useBranchesStore } from "../../store/branches.store";
import { useContext, useEffect, useMemo } from "react";
import { Branches } from "../../types/branches.types";
import { Employee, EmployeePayload } from "../../types/employees.types";
import { useEmployeeStore } from "../../store/employee.store";
import { ThemeContext } from "../../hooks/useTheme";

interface Props {
  closeModal: () => void;
  employee: Employee | undefined;
}

function AddEmployee(props: Props) {
  const { theme } = useContext(ThemeContext);

  const initialValues = {
    fullName: props.employee?.fullName ?? "",
    phone: props.employee?.phone ?? "",
    branchId: props.employee?.branchId ?? 0,
  };

  const { getBranchesList, branch_list } = useBranchesStore();
  const { patchEmployee, postEmployee } = useEmployeeStore();

  useEffect(() => {
    getBranchesList();
  }, []);

  const validationSchema = yup.object().shape({
    fullName: yup.string().required("El nombre es requerido"),
    phone: yup.string().required("El teléfono es requerido"),
    branchId: yup
      .number()
      .required("La sucursal es requerida")
      .typeError("La sucursal es requerida"),
  });

  const handleSubmit = (values: EmployeePayload) => {
    if (props.employee) {
      patchEmployee(values, props.employee.id);
    } else {
      postEmployee(values);
    }

    props.closeModal();
  };

  const selectedKeyBranch = useMemo(() => {
    if (props.employee) {
      const branch = branch_list.find(
        (branch) => branch.id === props.employee?.branchId
      );

      return JSON.stringify(branch);
    }
  }, [props, props.employee, branch_list]);

  return (
    <div className="mb-32 sm:mb-0">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
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
            <div className="flex flex-col mt-4">
              <Input
                name="name"
                labelPlacement="outside"
                value={values.fullName}
                onChange={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                placeholder="Ingresa el nombre de la categoría"
                size="lg"
                classNames={{ label: "font-semibold text-sm  text-gray-600" }}
                variant="bordered"
                label="Nombre"
                autoComplete="off"
              />
              {errors.fullName && touched.fullName && (
                <>
                  <span className="text-sm font-semibold text-red-600">
                    {errors.fullName}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-col mt-4">
              <Input
                type="number"
                name="name"
                labelPlacement="outside"
                value={values.phone}
                onChange={handleChange("phone")}
                onBlur={handleBlur("phone")}
                placeholder="Ingresa el numero de teléfono"
                size="lg"
                classNames={{ label: "font-semibold text-sm  text-gray-600" }}
                variant="bordered"
                label="Teléfono"
                autoComplete="off"
              />
              {errors.phone && touched.phone && (
                <>
                  <span className="text-sm font-semibold text-red-600">
                    {errors.phone}
                  </span>
                </>
              )}
            </div>
            <div className="mt-4">
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const branchSelected = JSON.parse(
                      key as string
                    ) as Branches;
                    handleChange("branchId")(branchSelected.id.toString());
                  }
                }}
                onBlur={handleBlur("branchId")}
                label="Sucursal"
                labelPlacement="outside"
                placeholder={
                  props.employee?.branch.name
                    ? props.employee?.branch.name
                    : "Selecciona la sucursal"
                }
                variant="bordered"
                classNames={{
                  base: "font-semibold text-gray-500 text-sm",
                }}
                defaultSelectedKey={selectedKeyBranch}
                value={selectedKeyBranch}
              >
                {branch_list.map((bra) => (
                  <AutocompleteItem value={bra.name} key={JSON.stringify(bra)}>
                    {bra.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {errors.branchId && touched.branchId && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.branchId}
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
}

export default AddEmployee;
