import {
  Button,
  Input,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Image as NextImage,
} from "@nextui-org/react";
import { global_styles } from "../../styles/global.styles";
import * as yup from "yup";
import { useExpenseStore } from "../../store/expenses.store.ts";
import { ICreacteExpense, IExpense } from "../../types/expenses.types.ts";
import { Formik } from "formik";
import { CategoryExpense } from "../../types/categories_expenses.types.ts";
import { useCategoriesExpenses } from "../../store/categories_expenses.store.ts";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { get_box } from "../../storage/localStorage.ts"
import { toast } from "sonner";
import DefaultImage from "../../assets/default.png";
import { ThemeContext } from "../../hooks/useTheme";
interface Props {
  closeModal: () => void;
  expenses?: IExpense | undefined;
}
const AddExpenses = (props: Props) => {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);

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

  const boxe = get_box() || 0;
  const [formData, setFormData] = useState<ICreacteExpense>({
    description: '',
    total: 0,
    boxId: Number(boxe) || 0,
    categoryExpenseId: 0,
    file: null,
  });

  const [selectedFile, setSelectedFile] = useState({ url: DefaultImage, type: "image/png" });


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type;
      if (fileType === "image/png" || fileType === "image/jpeg" || fileType === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        setSelectedFile({ url: fileUrl, type: fileType });
        setFormData((prevData) => ({
          ...prevData,
          file: file,
        }));
      } else {
        toast.error("Solo se permiten archivos PNG, JPG o PDF");
        setSelectedFile({ url: DefaultImage, type: "image/png" });
        setFormData((prevData) => ({
          ...prevData,
          file: null,
        }));
      }
    } else {
      setSelectedFile({ url: DefaultImage, type: "image/png" });
      setFormData((prevData) => ({
        ...prevData,
        file: null,
      }));
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (values: ICreacteExpense) => {
    const boxe = get_box();
    const boxId = Number(boxe) || 0;
    try {
      if (props.expenses) {
        await patchExpenses(props.expenses.id, { ...values });
      } else {
        if (!formData.file) {
          const defaultImageFile = await fetch(DefaultImage)
            .then((res) => res.blob())
            .then((blob) => new File([blob], "default.png", { type: "image/png" }));

          setFormData((prevData) => ({
            ...prevData,
            boxId: boxId,
            file: defaultImageFile,
          }));

          setSelectedFile({ url: DefaultImage, type: "image/png" });
        }
        await postExpenses({ ...values, file: formData.file });
      }
      props.closeModal();
      toast.success("Información guardada correctamente");
    } catch (error) {
      toast.error("Ocurrió un error al guardar la información");
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit({ ...values, boxId: formData.boxId });
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

            <div className="flex flex-col items-center justify-center m-4 2xl:mt-10">
              {!props.expenses && (
                <div className="flex flex-col items-center justify-center m-4 2xl:mt-10">
                  <div>
                    {selectedFile.type === "image/png" || selectedFile.type === "image/jpeg" ? (
                      <NextImage
                        src={selectedFile.url}
                        alt="Cargando..."
                        fallbackSrc={DefaultImage}
                        className="h-60 w-60 rounded-lg object-cover"
                      />
                    ) : (
                      <embed src={selectedFile.url} type="application/pdf" className="h-60 w-60 rounded-lg" />
                    )}
                  </div>
                  <div className="mt-2">
                    <label htmlFor="fileInput">
                      <Button
                        className="text-white font-semibold px-5"
                        onClick={handleButtonClick}
                        style={{
                          backgroundColor: theme.colors.dark,
                          color: theme.colors.primary,
                        }}
                        disabled={loading}
                      >
                        {loading ? "Cargando..." : "Selecciona un archivo"}
                      </Button>
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/png,image/jpeg,application/pdf"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </div>
                </div>
              )}
            </div>
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
