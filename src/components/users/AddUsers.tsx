import { Autocomplete, AutocompleteItem, Input } from '@heroui/react';
import { Formik } from 'formik';
import { useEffect } from 'react';
import * as yup from 'yup';

import { useRolesStore } from '../../store/roles.store';
import { Role } from '../../types/roles.types';
import { useUsersStore } from '../../store/users.store';
import { UserPayload } from '../../types/users.types';

import { useAuthStore } from '@/store/auth.store';
import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';

interface Props {
  onClose: () => void;
  reload: () => void;
}

function AddUsers(props: Props) {
  const { user } = useAuthStore();
  const validationSchema = yup.object().shape({
    userName: yup.string().required('**El usuario es requerido**'),
    password: yup.string().required('**La contraseña es requerida**'),
    roleId: yup.number().required('**El rol es requerido**').min(1, '**El rol es requerido**'),
  });

  const initialValues = {
    userName: '',
    password: '',
    roleId: 0,
  };

  const { roles_list, getRolesList } = useRolesStore();
  const { postUser } = useUsersStore();

  useEffect(() => {
    getRolesList();
  }, []);

  const handleSubmit = (values: UserPayload, resetForm: () => void) => {
    postUser({ ...values, userId: user?.id ?? 0 }).then(() => {
      resetForm();
      props.onClose();
      props.reload();
    });
  };

  return (
    <div className="dark:text-white ">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
      >
        {({ values, touched, errors, handleBlur, handleChange, handleSubmit }) => (
          <>
            <div className="mt-5 flex flex-col">
              <div className="pt-2">
                <Input
                  className="dark:text-white"
                  classNames={{
                    base: 'text-gray-500 text-sm font-semibold',
                  }}
                  errorMessage={touched.userName && errors.userName}
                  isInvalid={touched.userName && !!errors.userName}
                  label="Nombre de usuario"
                  labelPlacement="outside"
                  name="userName"
                  placeholder="Ingresa el nombre de usuario"
                  value={values.userName}
                  variant="bordered"
                  onBlur={handleBlur('userName')}
                  onChange={handleChange('userName')}
                />
              </div>
              <div className="pt-2">
                <Input
                  className="dark:text-white"
                  classNames={{
                    base: 'text-gray-500 text-sm font-semibold',
                  }}
                  errorMessage={touched.password && errors.password}
                  isInvalid={touched.password && !!errors.password}
                  label="Contraseña"
                  labelPlacement="outside"
                  name="password"
                  placeholder="Ingresa la Contraseña"
                  type="password"
                  value={values.password}
                  variant="bordered"
                  onBlur={handleBlur('password')}
                  onChange={handleChange('password')}
                />
              </div>

              <div className="pt-2">
                <Autocomplete
                  className="dark:text-white"
                  classNames={{
                    base: 'text-gray-500 text-sm font-semibold',
                  }}
                  errorMessage={touched.roleId && errors.roleId}
                  isInvalid={touched.roleId && !!errors.roleId}
                  label="Rol"
                  labelPlacement="outside"
                  placeholder="Selecciona el rol"
                  variant="bordered"
                  onBlur={handleBlur('roleId')}
                  onSelectionChange={(key) => {
                    if (key) {
                      const depSelected = JSON.parse(key as string) as Role;

                      handleChange('roleId')(depSelected.id.toString());
                    }
                  }}
                >
                  {roles_list
                    .filter((dep) => dep.name !== 'TIENDA')
                    .map((dep) => (
                      <AutocompleteItem key={JSON.stringify(dep)} className="dark:text-white">
                        {dep.name}
                      </AutocompleteItem>
                    ))}
                </Autocomplete>
              </div>
              <ButtonUi
                className="w-full mt-4 text-sm font-semibold mb-3"
                theme={Colors.Primary}
                onPress={() => handleSubmit()}
              >
                Guardar
              </ButtonUi>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
}

export default AddUsers;
