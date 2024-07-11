import { useContext } from 'react';
import { Button, Checkbox, Input } from '@nextui-org/react';
import { useConfigurationStore } from '../../store/perzonalitation.store';
import * as yup from 'yup';
import { Formik } from 'formik';
import { ThemeContext } from '../../hooks/useTheme';
import { IConfiguration } from '../../types/configuration.types';

interface Props {
  name: IConfiguration | undefined;
  reloadData: () => void;
  onClose: () => void;
}

function UpdateConfigurationName(props: Props) {
  const { theme } = useContext(ThemeContext);
  const { UpdateConfigurationName, personalization } = useConfigurationStore();

  const Namep = personalization?.find((config) => config.name)?.name || '';
  const print = personalization?.find((config) => config?.wantPrint)?.wantPrint || 0;

  const initialValues = {
    name: Namep,
    wantPrint: Boolean(print),
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required('Nombre es requerido'),
  });

  const handleSave = async ({ name, wantPrint }: { name: string; wantPrint: boolean }) => {
    await UpdateConfigurationName(
      { name, wantPrint: wantPrint ? true : false },
      props.name?.id || 0
    );
    props.reloadData();
    props.onClose();
  };

  return (
    <div className="p-4 dark:text-white">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSave(values)}
        enableReinitialize
      >
        {({ errors, touched, handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
          <>
            <div className="">
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
            <div className="mt-2 w-full">
              <Checkbox
                isSelected={values.wantPrint}
                checked={values.wantPrint}
                onChange={() => setFieldValue('wantPrint', !values.wantPrint)}
              >
                {values.wantPrint === true ? 'Deshabilitar impresión' : 'Habilitar impresión'}
              </Checkbox>
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
}

export default UpdateConfigurationName;
