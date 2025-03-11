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
};

export default AddStatusEmployee;
