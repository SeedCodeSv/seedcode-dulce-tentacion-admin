import { useContext } from "react";
import { Button, Input } from "@nextui-org/react";
import { useConfigurationStore } from "../../store/perzonalitation.store";
import * as yup from "yup";
import { Formik } from "formik";
import { ThemeContext } from "../../hooks/useTheme";

interface Props {
  id: number;
  reloadData: () => void;
}

function UpdateConfigurationName(props: Props) {
  const { theme } = useContext(ThemeContext);
  const initialValues = {
    name: "",
  };

  const { UpdateConfigurationName } = useConfigurationStore();

  const validationSchema = yup.object().shape({
    name: yup.string().required("Nombre es requerido"),
  });

  const handleSave = async ({ name }: { name: string }) => {
    await UpdateConfigurationName({ name }, props.id);
  };

  return (
    <div className="mb-32 p t-5 sm:mb-0">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSave(values)}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <>
            <div>
            <Input
                label="Nombre un nombre"
                labelPlacement="outside"
                size="lg"
                name="userName"
                value={values.name}
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                placeholder="Ingresa un nombre"
                classNames={{
                  label: "font-semibold text-gray-500 text-sm",
                }}
                variant="bordered"
              />
              {errors.name && touched.name && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.name}
                </span>
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
}

export default UpdateConfigurationName;
