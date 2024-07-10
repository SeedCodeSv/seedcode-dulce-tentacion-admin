import { Input, Button } from '@nextui-org/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useContext } from 'react';
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

  const handleSave = ({ name }: { name: string }) => {
    if (props.ContractTypes) {
      patchContratType(name, props.ContractTypes.id);
      props.closeModal();
    } else {
      postContractType(name);
      props.closeModal();
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
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                placeholder="Ingresa el nombre de la categoría"
                classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                variant="bordered"
                label="Nombre"
              />
              {errors.name && touched.name && (
                <>
                  <span className="text-sm font-semibold text-red-600">{errors.name}</span>
                </>
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
};

export default AddStatusEmployee;
