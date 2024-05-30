import { useContext } from 'react';
import { Button, Input } from '@nextui-org/react';
import { useConfigurationStore } from '../../store/perzonalitation.store';
import * as yup from 'yup';
import { Formik } from 'formik';
import { ThemeContext } from '../../hooks/useTheme';

interface Props {
  id: number;
  reloadData: () => void;
  onClose: () => void;
}

function UpdateConfigurationName(props: Props) {
  const { theme } = useContext(ThemeContext);
  const { UpdateConfigurationName, personalization } = useConfigurationStore();

  const Namep = personalization?.find((config) => config.name)?.name || '';

  const initialValues = {
    name: Namep,
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required('Nombre es requerido'),
  });

  const handleSave = async ({ name }: { name: string }) => {
    await UpdateConfigurationName({ name }, props.id);
    props.reloadData();
    props.onClose();
  };

  return (
    
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSave(values)}
        enableReinitialize
      >
        {({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <div className=''>
              <Input
                label="Ingrese un nombre"
                labelPlacement="outside"
                name="name"
                value={values.name}
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                placeholder="Ingresa un nombre"
                classNames={{
                  label: 'font-semibold text-gray-500 text-sm',
                }}
                variant="bordered"
              />
              {errors.name && touched.name && (
                <span className="text-sm font-semibold text-red-500">{errors.name}</span>
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
    
  );
}

export default UpdateConfigurationName;
