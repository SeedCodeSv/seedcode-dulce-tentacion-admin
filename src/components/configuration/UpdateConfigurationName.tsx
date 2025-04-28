import { Checkbox, Input } from "@heroui/react";
import * as yup from 'yup';
import { Formik } from 'formik';

import { useConfigurationStore } from '../../store/perzonalitation.store';
import { IConfiguration } from '../../types/configuration.types';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  name: IConfiguration | undefined;
  reloadData: () => void;
  onClose: () => void;
}

function UpdateConfigurationName(props: Props) {
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
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSave(values)}
      >
        {({ errors, touched, handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
          <>
            <div className="">
              <Input
                classNames={{
                  label: 'font-semibold text-gray-500 text-sm',
                }}
                label="Ingrese un nombre"
                labelPlacement="outside"
                name="name"
                placeholder="Ingresa un nombre"
                value={values.name}
                variant="bordered"
                onBlur={handleBlur('name')}
                onChange={handleChange('name')}
              />
              {errors.name && touched.name && (
                <span className="text-sm font-semibold text-red-500">{errors.name}</span>
              )}
            </div>
            <div className="mt-2 w-full">
              <Checkbox
                checked={values.wantPrint}
                isSelected={values.wantPrint}
                onChange={() => setFieldValue('wantPrint', !values.wantPrint)}
              >
                {values.wantPrint === true ? 'Deshabilitar impresión' : 'Habilitar impresión'}
              </Checkbox>
            </div>
            <ButtonUi
              className="w-full mt-4 text-sm font-semibold"
              theme={Colors.Success}
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

export default UpdateConfigurationName;
