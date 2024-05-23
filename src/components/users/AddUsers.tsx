import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import { Formik } from "formik";
import { useContext, useEffect } from "react";
import * as yup from "yup";
import { useRolesStore } from "../../store/roles.store";
import { useEmployeeStore } from "../../store/employee.store";
import { Employee } from "../../types/employees.types";
import { Role } from "../../types/roles.types";
import { useUsersStore } from "../../store/users.store";
import { UserPayload } from "../../types/users.types";
import { ThemeContext } from "../../hooks/useTheme";
import classNames from "classnames";

interface Props {
  onClose: () => void;
}

function AddUsers(props: Props) {
  const { theme } = useContext(ThemeContext);

  const initialValues = {
    userName: "",
    password: "",
    roleId: 0,
    employeeId: 0,
  };

  const validationSchema = yup.object().shape({
    userName: yup.string().required("El usuario es requerido"),
    password: yup.string().required("La contraseña es requerida"),
    roleId: yup
      .number()
      .required("El rol es requerido")
      .min(1, "El rol es requerido"),
    employeeId: yup
      .number()
      .required("El empleado es requerido")
      .min(1, "El empleado es requerido"),
  });

  const { roles_list, getRolesList } = useRolesStore();
  const { employee_list, getEmployeesList } = useEmployeeStore();
  const { postUser } = useUsersStore();

  useEffect(() => {
    getRolesList();
    getEmployeesList();
  }, []);

  const handleSubmit = (values: UserPayload) => {
    postUser(values);
    props.onClose();
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
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
            <div className="mt-10">
              <Input
                label="Nombre de usuario"
                labelPlacement="outside"
                name="userName"
                value={values.userName}
                onChange={handleChange("userName")}
                onBlur={handleBlur("userName")}
                placeholder="Ingresa el nombre de usuario"
                classNames={{
                  label: "text-gray-500 text-base",
                }}
                variant="bordered"
              />
              {errors.userName && touched.userName && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.userName}
                </span>
              )}
            </div>
            <div className="pt-2">
              <Input
                label="Contraseña"
                labelPlacement="outside"
                name="userName"
                value={values.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                placeholder="Ingresa la Contraseña"
                type="password"
                classNames={{
                  label: "text-gray-500 text-base",
                }}
                variant="bordered"
              />
              {errors.password && touched.password && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.password}
                </span>
              )}
            </div>
            <div className="pt-2">
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const depSelected = JSON.parse(key as string) as Employee;
                    handleChange("employeeId")(depSelected.id.toString());
                  }
                }}
                onBlur={handleBlur("employeeId")}
                label="Empleado"
                labelPlacement="outside"
                className="dark:text-white"
                placeholder="Selecciona el empleado"
                variant="bordered"
                classNames={{
                  base: "text-gray-500 text-sm",
                }}
              >
                {employee_list.map((dep) => (
                  <AutocompleteItem
                    className="dark:text-white"
                    value={dep.id}
                    key={JSON.stringify(dep)}
                  >
                    {dep.fullName}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {errors.employeeId && touched.employeeId && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.employeeId}
                </span>
              )}
            </div>
            <div className="pt-2">
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const depSelected = JSON.parse(key as string) as Role;
                    handleChange("roleId")(depSelected.id.toString());
                  }
                }}
                onBlur={handleBlur("roleId")}
                label="Rol"
                labelPlacement="outside"
                placeholder="Selecciona el rol"
                variant="bordered"
                className="dark:text-white"
                classNames={{
                  base: "text-gray-500 text-sm",
                }}
              >
                {roles_list.map((dep) => (
                  <AutocompleteItem
                    className="dark:text-white"
                    value={dep.id}
                    key={JSON.stringify(dep)}
                  >
                    {dep.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {errors.roleId && touched.roleId && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.roleId}
                </span>
              )}
            </div>
            <Button
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

export default AddUsers;
