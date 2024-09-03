import { Input, Button } from '@nextui-org/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useContext, useState } from 'react';
import { ThemeContext } from '../../../hooks/useTheme';
import { useContractTypeStore } from '../../../store/contractType';

interface Props {
  closeModal: () => void;
  ContractTypes?: {
    id: number;
    name: string;
  };
}

const AddStatusEmployee = (props: Props) => {
  const { theme } = useContext(ThemeContext);
  const validationSchema = yup.object().shape({
    name: yup.string().required('**Campo requerido**'),
  });
  const { postContractType, patchContratType } = useContractTypeStore();
  const [loading, setLoading] = useState(false);

  const handleSave = async ({ name }: { name: string }) => {
    setLoading(true);
    try {
      if (props.ContractTypes) {
        const data = await patchContratType(name, props.ContractTypes.id);
        if (data.ok === true) {
          props.closeModal();
          setLoading(false);
        }
      } else {
        const data = await postContractType(name);
        if (data.ok === true) {
          props.closeModal();
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5 w-full">
      <Formik
        validationSchema={validationSchema}
        initialValues={{ name: props.ContractTypes?.name ?? '' }}
        onSubmit={handleSave}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <>
            <div className="flex flex-col w-full dark:text-white">
              <Input
                name="name"
                labelPlacement="outside"
                value={values.name}
                className="dark:text-white"
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                placeholder="Ingresa el nombre de la categoría"
                classNames={{ base: 'font-semibold text-sm' }}
                variant="bordered"
                label="Nombre"
                isInvalid={!!errors.name && touched.name}
                errorMessage={errors.name}
              />
            </div>
            {!loading ? (
              <>
                <Button
                  onClick={() => {
                    handleSubmit();
                  }}
                  className="w-full mt-4 text-sm font-semibold"
                  style={{
                    backgroundColor: theme.colors.third,
                    color: theme.colors.primary,
                  }}
                >
                  Guardar
                </Button>
              </>
            ) : (
              <div className="flex justify-center mt-4">
                <span className="loaderButton"></span>
              </div>
            )}
          </>
        )}
      </Formik>
    </div>
  );
};

export default AddStatusEmployee;
