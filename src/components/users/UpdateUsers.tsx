import { Autocomplete, AutocompleteItem, Input } from '@heroui/react';
import { Formik } from 'formik';
import { useEffect } from 'react';
import * as yup from 'yup';

import { useRolesStore } from '../../store/roles.store';
import { Role } from '../../types/roles.types';
import { useUsersStore } from '../../store/users.store';
import { User, UserUpdate } from '../../types/users.types';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  onClose: () => void;
  user?: User;
  reload: () => void;
}

function AddUsers(props: Props) {
  const { roles_list, getRolesList } = useRolesStore();
  const { patchUser } = useUsersStore();

  const initialValues = {
    userName: props.user?.userName ?? '',
    roleId: props.user?.roleId ?? 0,
  };

  const validationSchema = yup.object().shape({
    userName: yup.string().required('El usuario es requerido'),
    roleId: yup.number().required('El rol es requerido').min(1, 'El rol es requerido'),
  });

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
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                  }}
                  label="Nombre de usuario"
                  labelPlacement="outside"
                  name="userName"
                  placeholder="Ingresa el nombre de usuario"
                  value={values.userName}
                  variant="bordered"
                  onBlur={handleBlur('userName')}
                  onChange={handleChange('userName')}
                />
                {errors.userName && touched.userName && (
                  <span className="text-sm font-semibold text-red-500">{errors.userName}</span>
                )}
              </div>
              <div className="mt-2  ">
                <Autocomplete
                  classNames={{
                    base: 'font-semibold text-sm',
                  }}
                  defaultInputValue={props.user?.role.name || ''}
                  label="Rol"
                  labelPlacement="outside"
                  placeholder={props.user?.role.name ? props.user?.role.name : 'Selecciona el rol'}
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
                    .filter((rol) => rol.name !== 'TIENDA')
                    .map((dep) => (
                      <AutocompleteItem key={JSON.stringify(dep)}>{dep.name}</AutocompleteItem>
                    ))}
                </Autocomplete>
                {errors.roleId && touched.roleId && (
                  <span className="text-sm font-semibold text-red-500">{errors.roleId}</span>
                )}
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
