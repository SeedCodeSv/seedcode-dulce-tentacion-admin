import { Input, Select, SelectItem } from '@heroui/react';
import { useFormik } from 'formik';
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

  const formik = useFormik<UserPayload>({
    initialValues,
    validationSchema,
    onSubmit: (values, helpers) => {
      postUser({ ...values, userId: user?.id ?? 0 }).then((isValid) => {
        if(!isValid){
          return
        }
        helpers.setSubmitting(false);
        helpers.resetForm();
        props.onClose();
        props.reload();
      });
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="dark:text-white ">
      <form onSubmit={(e)=>{
        e.preventDefault();
        formik.handleSubmit();
      }}>
        <div className="flex flex-col">
          <div className="pt-2">
            <Input
              className="dark:text-white"
              classNames={{
                base: 'text-gray-500 text-sm font-semibold',
              }}
              {...formik.getFieldProps('userName')}
              errorMessage={formik.touched.userName && formik.errors.userName}
              isInvalid={formik.touched.userName && !!formik.errors.userName}
              label="Nombre de usuario"
              labelPlacement="outside"
              name="userName"
              placeholder="Ingresa el nombre de usuario"
              variant="bordered"
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
                  <Eye className="cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                )
              }
              {...formik.getFieldProps('password')}
              errorMessage={formik.touched.password && formik.errors.password}
              isInvalid={formik.touched.password && !!formik.errors.password}
              label="Contraseña"
              labelPlacement="outside"
              name="password"
              placeholder="Ingresa la Contraseña"
              type={showPassword ? 'text' : 'password'}
              variant="bordered"
            />
          </div>

          <div className="pt-2">
            <Select
              className="dark:text-white"
              classNames={{
                base: 'text-gray-500 text-sm font-semibold',
              }}
              errorMessage={formik.touched.roleId && formik.errors.roleId}
              isInvalid={formik.touched.roleId && !!formik.errors.roleId}
              label="Rol"
              labelPlacement="outside"
              placeholder="Selecciona el rol"
              variant="bordered"
              {...formik.getFieldProps('roleId')}
            >
              {roles_list
                .filter((dep) => dep.name !== 'TIENDA')
                .map((dep) => (
                  <SelectItem key={dep.id} className="dark:text-white">
                    {dep.name}
                  </SelectItem>
                ))}
            </Select>
          </div>
          <ButtonUi
            className="w-full mt-4 text-sm font-semibold mb-3"
            isDisabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
            theme={Colors.Primary}
            type="submit"
          >
            Guardar
          </ButtonUi>
        </div>
      </form>
    </div>
  );
}

export default AddUsers;
