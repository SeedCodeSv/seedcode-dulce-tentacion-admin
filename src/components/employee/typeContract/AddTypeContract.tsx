import { Input, Button } from '@nextui-org/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';

import { useContractTypeStore } from '../../../store/contractType';
import { global_styles } from '@/styles/global.styles';

interface Props {
  closeModal: () => void;
  ContractTypes?: {
    id: number;
    name: string;
  };
}

const AddStatusEmployee = (props: Props) => {
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
                  style={global_styles().thirdStyle}
                  className="w-full mt-4 text-sm font-semibold"
                >
                  Guardar
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full">
                <div className="loaderBranch w-2 h-2 mt-2"></div>
                <p className="mt-3 text-sm font-semibold">Cargando...</p>
              </div>
            )}
          </>
        )}
      </Formik>
    </div>
  );
};

export default AddStatusEmployee;
