import { Input, Button } from "@heroui/react";
import { Formik } from 'formik';
import * as yup from 'yup';
import { useCategoriesExpenses } from '../../store/categories_expenses.store';
import { CategoryExpensePayload } from '../../types/categories_expenses.types.ts';
import { ThemeContext } from '../../hooks/useTheme';
import { useContext } from 'react';
import { get_user } from '../../storage/localStorage.ts';

interface Props {
  closeModal: () => void;
  categoryExpenses?: {
    id: number;
    name: string;
  };
}

const AddCategoryExpenses = (props: Props) => {
  const { theme } = useContext(ThemeContext);

  const validationSchema = yup.object().shape({
    name: yup.string().required('**Debes especificar el nombre de la categoría**'),
  });

  const { postCategoriesExpenses, pathCategoriesExpenses } = useCategoriesExpenses();

  const handleSave = ({ name }: { name: string }) => {
    const user = get_user();
    const payload: CategoryExpensePayload = {
      name: name,
      transmitterId: Number(
        user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0
      ),
    };
    if (props.categoryExpenses) {
      pathCategoriesExpenses(props.categoryExpenses.id, payload);
      props.closeModal();
    } else {
      postCategoriesExpenses(payload);
      props.closeModal();
    }
  };

  return (
    <div className="p-4">
      <Formik
        validationSchema={validationSchema}
        initialValues={{ name: props.categoryExpenses?.name ?? '' }}
        onSubmit={handleSave}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <>
            <div className="flex flex-col">
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

export default AddCategoryExpenses;
