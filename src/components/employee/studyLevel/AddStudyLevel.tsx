import { Input, Button, Textarea } from "@heroui/react";
import { Formik } from 'formik';
import * as yup from 'yup';
import { useContext } from 'react';
import { ThemeContext } from '../../../hooks/useTheme';
import { useStatusStudyLevel } from '@/store/studyLevel';

interface Props {
  closeModal: () => void;
  studyLevel?: {
    id: number;
    name: string;
    description: string;
  };
}

const AddStatusEmployee = (props: Props) => {
  const { theme } = useContext(ThemeContext);

  const validationSchema = yup.object().shape({
    name: yup.string().required('**Campo requerido**'),
    description: yup.string().required('**Campo requerido**'),
  });

  const { postStudyLevel, patchStudyLevel } = useStatusStudyLevel();

  const handleSave = ({ name, description }: { name: string; description: string }) => {
    if (props.studyLevel) {
      patchStudyLevel(name, props.studyLevel.id, description);
      props.closeModal();
    } else {
      postStudyLevel(name, description);
      props.closeModal();
    }
  };

  return (
    <div className="mt-4 w-full">
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          name: props.studyLevel?.name ?? '',
          description: props.studyLevel?.description ?? '',
        }}
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
                classNames={{ base: 'font-semibold text-sm  ' }}
                variant="bordered"
                isInvalid={!!errors.name && touched.name}
                errorMessage={errors.name}
                label="Nombre"
              />
            </div>
            <div className="mt-2 ">
              <Textarea
                label="Descripción"
                className="dark:text-white font-semibold"
                labelPlacement="outside"
                name="description"
                value={values.description}
                onChange={handleChange('description')}
                onBlur={handleBlur('description')}
                isInvalid={!!errors.description && touched.description}
                errorMessage={errors.description}
                placeholder="Ingresa la descripción"
                classNames={{
                  label: 'font-semibold text-sm ',
                }}
                variant="bordered"
              />
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
