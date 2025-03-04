import { Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react";
import { Formik } from 'formik';
import { useContext, useEffect } from 'react';
import * as yup from 'yup';
import { useRolesStore } from '../../store/roles.store';
// import { useEmployeeStore } from '../../store/employee.store';
// import { Employee } from '../../types/employees.types';
import { Role } from '../../types/roles.types';
import { useUsersStore } from '../../store/users.store';
import { User, UserUpdate } from '../../types/users.types';
import { ThemeContext } from '../../hooks/useTheme';

interface Props {
  onClose: () => void;
  user?: User;
  reload: () => void;
}

function AddUsers(props: Props) {
  const { theme } = useContext(ThemeContext);

  const initialValues = {
    userName: props.user?.userName ?? '',
    roleId: props.user?.roleId ?? 0,
  };

  const validationSchema = yup.object().shape({
    userName: yup.string().required('El usuario es requerido'),
    roleId: yup.number().required('El rol es requerido').min(1, 'El rol es requerido'),
  });

  const { roles_list, getRolesList } = useRolesStore();
  const { patchUser } = useUsersStore();

  useEffect(() => {
    getRolesList();
  }, []);

  const handleSubmit = (values: UserUpdate) => {
    patchUser(values, Number(props?.user?.id)).then(() => {
      props.onClose();
      props.reload();
    });
  };

  return (
    <div className="">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, touched, errors, handleBlur, handleChange, handleSubmit }) => (
          <>
            <div className="mt-5 flex flex-col">
              <div className="mt-2">
                <Input
                  label="Nombre de usuario"
                  labelPlacement="outside"
                  name="userName"
                  value={values.userName}
                  onChange={handleChange('userName')}
                  onBlur={handleBlur('userName')}
                  placeholder="Ingresa el nombre de usuario"
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                  }}
                  variant="bordered"
                />
                {errors.userName && touched.userName && (
                  <span className="text-sm font-semibold text-red-500">{errors.userName}</span>
                )}
              </div>
              <div className="mt-2  ">
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const depSelected = JSON.parse(key as string) as Role;
                      handleChange('roleId')(depSelected.id.toString());
                    }
                  }}
                  onBlur={handleBlur('roleId')}
                  label="Rol"
                  labelPlacement="outside"
                  placeholder={props.user?.role.name ? props.user?.role.name : 'Selecciona el rol'}
                  variant="bordered"
                  classNames={{
                    base: 'font-semibold text-sm',
                  }}
                  defaultInputValue={props.user?.role.name || ''}
                >
                  {roles_list
                    .filter((rol) => rol.name !== 'TIENDA')
                    .map((dep) => (
                      <AutocompleteItem value={dep.id} key={JSON.stringify(dep)}>
                        {dep.name}
                      </AutocompleteItem>
                    ))}
                </Autocomplete>
                {errors.roleId && touched.roleId && (
                  <span className="text-sm font-semibold text-red-500">{errors.roleId}</span>
                )}
              </div>

              <Button
                onClick={() => handleSubmit()}
                className="w-full mt-4 text-sm font-semibold mb-3"
                style={{
                  backgroundColor: theme.colors.third,
                  color: theme.colors.primary,
                }}
              >
                Guardar
              </Button>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
}

export default AddUsers;
