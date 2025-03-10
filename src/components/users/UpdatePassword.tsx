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
    <div className="p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSave(values)}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <>
            <div>
              <Input
                label="Contraseña"
                labelPlacement="outside"
                className="dark:text-white font-semibold"
                name="password"
                value={values.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Ingresa la contraseña"
                classNames={{
                  label: 'font-semibold text-gray-500 text-sm',
                }}
                variant="bordered"
                isInvalid={touched.password && !!errors.password}
                errorMessage={touched.password && errors.password}
              />
            </div>
            <ButtonUi
              onPress={() => handleSubmit()}
              className="w-full mt-4 text-sm font-semibold"
              theme={Colors.Primary}
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
