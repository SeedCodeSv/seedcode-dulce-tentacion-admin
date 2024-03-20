import { Input, Button } from "@nextui-org/react";
import { Formik } from "formik";
import * as yup from "yup";
import { useCategoriesStore } from "../../store/categories.store";
import { ThemeContext } from "../../hooks/useTheme";
import { useContext } from "react";

interface Props {
  closeModal: () => void;
  category?: {
    id: number;
    name: string;
  };
}

const AddCategory = (props: Props) => {

  const { theme } = useContext(ThemeContext);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("**Debes especificar el nombre de la categoría**"),
  });

  const { postCategories, patchCategory } = useCategoriesStore();

  const handleSave = ({ name }: { name: string }) => {
    if (props.category) {
      patchCategory(name, props.category.id);
      props.closeModal()
    } else {
      postCategories(name);
      props.closeModal();
    }
  };

  return (
    <div className="mb-32 sm:mb-0">
      <Formik
        validationSchema={validationSchema}
        initialValues={{ name: props.category?.name ?? "" }}
        onSubmit={handleSave}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <>
            <div className="flex flex-col">
              <Input
                name="name"
                labelPlacement="outside"
                value={values.name}
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                placeholder="Ingresa el nombre de la categoría"
                size="lg"
                classNames={{ label: "font-semibold text-sm  text-gray-600" }}
                variant="bordered"
                label="Nombre"
              />
              {errors.name && touched.name && (
                <>
                  <span className="text-sm font-semibold text-red-600">
                    {errors.name}
                  </span>
                </>
              )}
            </div>
            <Button
              onClick={() => handleSubmit()}
              size="md"
              className="w-full mt-4 text-sm font-semibold"
              style={{
                backgroundColor: theme.colors.dark,
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

export default AddCategory;