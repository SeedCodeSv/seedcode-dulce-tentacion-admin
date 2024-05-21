import {
  Button,
  Input,
  Textarea,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { global_styles } from "../../styles/global.styles";
import * as yup from "yup";
import { useExpenseStore } from "../../store/expenses.store.ts";
import { IExpense, IExpensePayload } from "../../types/expenses.types.ts";
import { Formik } from "formik";
import { CategoryExpense } from "../../types/categories_expenses.types.ts";
import { useCategoriesExpenses } from "../../store/categories_expenses.store.ts";
import { useEffect } from "react";
import {get_box} from "../../storage/localStorage.ts"
import { toast } from "sonner";
interface Props {
  closeModal: () => void;
  expenses?: IExpense | undefined;
}
const AddExpenses = (props: Props) => {
  const initialValues = {
    description: props.expenses?.description ?? "",
    categoryExpenseId: props.expenses?.categoryExpenseId ?? 0,
    total: props.expenses?.total ?? 0,
  };
  const validationSchema = yup.object().shape({
    description: yup.string().required("La descripción es requerido"),
    total: yup.number().required("El total es requerida"),
    categoryExpenseId: yup
      .number()
      .required("La categoría es requerido")
      .min(1, "La categoría es requerida"),
  });
  const { getListCategoriesExpenses, list_categories_expenses } =
    useCategoriesExpenses();
  const { postExpenses, patchExpenses } = useExpenseStore();
  useEffect(() => {
    getListCategoriesExpenses();
    get_box()
  }, []);
  const handleSubmit = (values: IExpensePayload) => {
    const box = get_box()
    if (props.expenses) {
      patchExpenses(props.expenses.id, values).then((res) => {
        if (res) props.closeModal();
      });
    } else {
      if(box === null){
        toast.info("No tienes una caja activa")
        return
      }
      postExpenses({
        ...values,
        boxId: Number(box),
      }).then((res) => {
        if (res) props.closeModal();
      });
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
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
          <div className="">
            <div className="pt-2">
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const depSelected = JSON.parse(
                      key as string
                    ) as CategoryExpense;
                    handleChange("categoryExpenseId")(
                      depSelected.id.toString()
                    );
                  }
                }}
                size="lg"
                onBlur={handleBlur("categoryExpenseId")}
                label="Categoría de gastos"
                labelPlacement="outside"
                placeholder={
                  props.expenses?.categoryExpense.name
                    ? props.expenses?.categoryExpense.name
                    : "Selecciona la categoría"
                }
                variant="bordered"
                classNames={{
                  base: "font-semibold text-gray-500 text-sm",
                }}
              >
                {list_categories_expenses.map((dep) => (
                  <AutocompleteItem value={dep.id} key={JSON.stringify(dep)} className="dark:text-white">
                    {dep.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {errors.categoryExpenseId && touched.categoryExpenseId && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.categoryExpenseId}
                </span>
              )}
            </div>
            <div className="mt-10">
              <Input
                label="Total"
                labelPlacement="outside"
                name="total"
                value={values.total.toString()}
                onChange={handleChange("total")}
                onBlur={handleBlur("total")}
                placeholder="00.00"
                classNames={{
                  label: "font-semibold text-gray-500 text-sm",
                }}
                variant="bordered"
                type="number"
                startContent="$"
              />
              {errors.total && touched.total && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.total}
                </span>
              )}
            </div>
            <div className="w-full pt-3 mb-8">
              <Textarea
                label="Descripción"
                placeholder="Descripción"
                size="lg"
                variant="bordered"
                classNames={{ label: "font-semibold" }}
                labelPlacement="outside"
                onChange={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
              />
              {errors.description && touched.description && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.description}
                </span>
              )}
            </div>
            <div>
              <Button
                type="submit"
                onClick={() => handleSubmit()}
                style={global_styles().thirdStyle}
                className="w-full font-semibold"
                size="lg"
              >
                Guardar
              </Button>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};

export default AddExpenses;
