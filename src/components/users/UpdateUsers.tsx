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
import { User, UserUpdate } from "../../types/users.types";
import { ThemeContext } from "../../hooks/useTheme";

interface Props {
  onClose: () => void;
  user?: User;
}

function AddUsers(props: Props) {
  const { theme } = useContext(ThemeContext);

  const initialValues = {
    userName: props.user?.userName ?? "",
    roleId: props.user?.roleId ?? 0,
    employeeId: props.user?.employeeId ?? 0,
  };

  const validationSchema = yup.object().shape({
    userName: yup.string().required("El usuario es requerido"),
    roleId: yup
      .number()
      .required("El rol es requerido")
      .min(1, "El rol es requerido"),
    employeeId: yup
      .number()
      .required("El usuario es requerido")
      .min(1, "El usuario es requerido"),
  });

  const { roles_list, getRolesList } = useRolesStore();
  const { employee_list, getEmployeesList } = useEmployeeStore();
  const { patchUser } = useUsersStore();

  useEffect(() => {
    getRolesList();
    getEmployeesList();
  }, []);

  const handleSubmit = (values: UserUpdate) => {
    patchUser(values, Number(props?.user?.id));
    props.onClose();
  };

  return (
    <div className="mb-32 sm:mb-0">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
                label="Nombre de usuario"
                labelPlacement="outside"
                size="lg"
                name="userName"
                value={values.userName}
                onChange={handleChange("userName")}
                onBlur={handleBlur("userName")}
                placeholder="Ingresa el nombre de usuario"
                classNames={{
                  label: "font-semibold text-gray-500 text-sm",
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
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const depSelected = JSON.parse(key as string) as Employee;
                    handleChange("employeeId")(depSelected.id.toString());
                  }
                }}
                size="lg"
                onBlur={handleBlur("employeeId")}
                label="Empleado"
                labelPlacement="outside"
                placeholder={
                  props.user?.employee.fullName
                    ? props.user?.employee.fullName
                    : "Selecciona el empleado"
                }
                variant="bordered"
                classNames={{
                  base: "font-semibold text-gray-500 text-sm",
                }}
              >
                {employee_list.map((dep) => (
                  <AutocompleteItem value={dep.id} key={JSON.stringify(dep)}>
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
                size="lg"
                onBlur={handleBlur("roleId")}
                label="Rol"
                labelPlacement="outside"
                placeholder={
                  props.user?.role.name
                    ? props.user?.role.name
                    : "Selecciona el rol"
                }
                variant="bordered"
                classNames={{
                  base: "font-semibold text-gray-500 text-sm",
                }}
              >
                {roles_list.map((dep) => (
                  <AutocompleteItem value={dep.id} key={JSON.stringify(dep)}>
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

export default AddUsers;
