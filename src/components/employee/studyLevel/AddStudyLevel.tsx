import { Input, Textarea } from "@heroui/react";
import { Formik } from 'formik';
import * as yup from 'yup';

import { useStatusStudyLevel } from '@/store/studyLevel';
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

interface Props {
  closeModal: () => void;
  studyLevel?: {
    id: number;
    name: string;
    description: string;
  };
}

const AddStatusEmployee = (props: Props) => {
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
        initialValues={{
          name: props.studyLevel?.name ?? '',
          description: props.studyLevel?.description ?? '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <>
            <div className="flex flex-col w-full dark:text-white">
              <Input
                classNames={{ base: 'font-semibold text-sm  ' }}
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
            <div className="mt-2 ">
              <Textarea
                className="dark:text-white font-semibold"
                classNames={{
                  label: 'font-semibold text-sm ',
                }}
                errorMessage={errors.description}
                isInvalid={!!errors.description && touched.description}
                label="Descripción"
                labelPlacement="outside"
                name="description"
                placeholder="Ingresa la descripción"
                value={values.description}
                variant="bordered"
                onBlur={handleBlur('description')}
                onChange={handleChange('description')}
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
};

export default AddStatusEmployee;
