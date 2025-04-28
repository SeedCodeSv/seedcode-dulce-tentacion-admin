import { Input, Button } from "@heroui/react";
import { Formik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { toast } from 'sonner';

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
      toast.error('Error al guardar el tipo de contrato');
      setLoading(false);
    }
  };

  return (
    <div className="p-5 w-full">
      <Formik
        initialValues={{ name: props.ContractTypes?.name ?? '' }}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <>
            <div className="flex flex-col w-full dark:text-white">
              <Input
                className="dark:text-white"
                classNames={{ base: 'font-semibold text-sm' }}
                errorMessage={errors.name}
                isInvalid={!!errors.name && touched.name}
                label="Nombre"
                labelPlacement="outside"
                name="name"
                placeholder="Ingresa el nombre de la categoría"
                value={values.name}
                variant="bordered"
                onBlur={handleBlur('name')}
                onChange={handleChange('name')}
              />
            </div>
            {!loading ? (
              <>
                <Button
                  className="w-full mt-4 text-sm font-semibold"
                  style={global_styles().thirdStyle}
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Guardar
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full">
                <div className="loaderBranch w-2 h-2 mt-2" />
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
