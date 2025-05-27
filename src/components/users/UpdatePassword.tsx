import { Input } from '@heroui/react';
import { Formik } from 'formik';
import * as yup from 'yup';

import { useUsersStore } from '../../store/users.store';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  id: number;
  closeModal: () => void;
}

function UpdatePassword(props: Props) {
  const { updatePassword } = useUsersStore();

  const initialValues = {
    password: '',
  };

  const validationSchema = yup.object().shape({
    password: yup.string().required('La contraseña es requerida'),
  });

  const handleSave = async ({ password }: { password: string }) => {
    const res = await updatePassword(props.id, password);

    if (res) {
      props.closeModal();
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSave(values)}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <>
            <div>
              <Input
                className="dark:text-white font-semibold"
                classNames={{
                  label: 'font-semibold text-gray-500 text-sm',
                }}
                errorMessage={touched.password && errors.password}
                isInvalid={touched.password && !!errors.password}
                label="Contraseña"
                labelPlacement="outside"
                name="password"
                placeholder="Ingresa la contraseña"
                value={values.password}
                variant="bordered"
                onBlur={handleBlur('password')}
                onChange={handleChange('password')}
              />
            </div>
            <ButtonUi
              className="w-full mt-4 text-sm font-semibold"
              theme={Colors.Primary}
              onPress={() => handleSubmit()}
            >
              Guardar
            </ButtonUi>
          </>
        )}
      </Formik>
    </div>
  );
}

export default UpdatePassword;
