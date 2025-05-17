import { Autocomplete, AutocompleteItem, Input } from '@heroui/react';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';

import { useRolesStore } from '../../store/roles.store';
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

  const [showPassword, setShowPassword] = useState(false);

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
            <div className="flex flex-col">
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
                  endContent={
                    showPassword ? (
                      <EyeOff
                        className="cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <Eye
                        className="cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )
                  }
                  errorMessage={touched.password && errors.password}
                  isInvalid={touched.password && !!errors.password}
                  label="Contraseña"
                  labelPlacement="outside"
                  name="password"
                  placeholder="Ingresa la Contraseña"
                  type={showPassword ? 'text' : 'password'}
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
                      const depSelected = String(key);

                      handleChange('roleId')(depSelected);
                    }
                  }}
                >
                  {roles_list
                    .filter((dep) => dep.name !== 'TIENDA')
                    .map((dep) => (
                      <AutocompleteItem key={dep.id} className="dark:text-white">
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
