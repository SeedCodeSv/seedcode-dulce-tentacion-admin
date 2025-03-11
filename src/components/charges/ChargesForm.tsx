import { Input } from "@heroui/react";
import { Formik } from 'formik';
import * as yup from 'yup';
import { useChargesStore } from '../../store/charges.store';
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

interface Props {
  closeModal: () => void;
  charges?: {
    id: number;
    name: string;
  };
}

const ChargesForm = (props: Props) => {
  const validationSchema = yup.object().shape({
    name: yup.string().required('**Debes especificar el nombre de la categoría**'),
  });

  const { postCharge, patchCharge } = useChargesStore();

  const handleSave = ({ name }: { name: string }) => {
    if (props.charges) {
      patchCharge(name, props.charges.id);
      props.closeModal();
    } else {
      postCharge(name);
      props.closeModal();
    }
  };

  return (
    <div className="p-5 w-full dark:text-white ">
      <Formik
        validationSchema={validationSchema}
        initialValues={{ name: props.charges?.name ?? '' }}
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

export default ChargesForm;
