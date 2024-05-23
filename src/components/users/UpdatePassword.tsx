import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import * as yup from "yup";
import { useUsersStore } from "../../store/users.store";
import { useContext } from "react";
import { ThemeContext } from "../../hooks/useTheme";

interface Props {
  id: number;
  closeModal: () => void;
}

function UpdatePassword(props: Props) {
  const { theme } = useContext(ThemeContext);

  const initialValues = {
    password: "",
  };

  const { updatePassword } = useUsersStore();

  const validationSchema = yup.object().shape({
    password: yup.string().required("La contraseña es requerida"),
  });

  const handleSave = async ({ password }: { password: string }) => {
    const res = await updatePassword(props.id, password);

    if (res) {
      props.closeModal();
    }
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
                label="Nombre"
                labelPlacement="outside"
                name="password"
                value={values.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                placeholder="Ingresa la contraseña"
                classNames={{
                  label: "font-semibold text-gray-500 text-sm",
                }}
                variant="bordered"
              />
              {errors.password && touched.password && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.password}
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

export default UpdatePassword;
