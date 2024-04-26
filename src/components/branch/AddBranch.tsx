import { Button, Input, Textarea } from "@nextui-org/react";
import { global_styles } from "../../styles/global.styles";
import * as yup from "yup";
import { Formik } from "formik";
import { Branches, IBranchForm } from "../../types/branches.types";
import { useBranchesStore } from "../../store/branches.store";
import { useAuthStore } from "../../store/auth.store";

interface Props {
  closeModal: () => void;
  branch?: Branches | undefined;
}

function AddBranch(props: Props) {
  const validationSchema = yup.object().shape({
    name: yup.string().required("El nombre es requerido"),
    address: yup.string().required("La dirección es requerida"),
    phone: yup.string().required("El teléfono es requerido"),
  });

  const { user } = useAuthStore();

  const { postBranch, patchBranch } = useBranchesStore();

  const handleSubmit = (values: IBranchForm) => {
    if (props.branch) {
      patchBranch(
        { ...values, transmitterId: user?.employee.branch.transmitterId ?? 0 },
        props.branch.id
      ).then((res) => {
        if (res) props.closeModal();
      });
    } else {
      postBranch({
        ...values,
        transmitterId: user?.employee.branch.transmitterId ?? 0,
      }).then((res) => {
        if (res) props.closeModal();
      });
    }
  };

  return (
    <Formik
      initialValues={{
        name: props.branch?.name ?? "",
        address: props.branch?.address ?? "",
        phone: props.branch?.phone ?? "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
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
          <div className="w-full mt-4">
            <div className="w-full pt-3 mb-4">
              <Input
                size="lg"
                label="Nombre"
                placeholder="Nombre de la sucursal"
                variant="bordered"
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                classNames={{ label: "font-semibold" }}
                labelPlacement="outside"
              />
              {errors.name && touched.name && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.name}
                </span>
              )}
            </div>
            <div className="w-full pt-3">
              <Input
                label="Teléfono"
                placeholder="Teléfono de la sucursal"
                size="lg"
                variant="bordered"
                classNames={{ label: "font-semibold" }}
                labelPlacement="outside"
                onChange={handleChange("phone")}
                onBlur={handleBlur("phone")}
                value={values.phone}
              />
              {errors.phone && touched.phone && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="w-full pt-3">
              <Textarea
                label="Dirección"
                placeholder="Dirección de la sucursal"
                size="lg"
                variant="bordered"
                classNames={{ label: "font-semibold" }}
                labelPlacement="outside"
                className="mb-4"
                onChange={handleChange("address")}
                onBlur={handleBlur("address")}
                value={values.address}
              />
              {errors.address && touched.address && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.address}
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
                {props.branch ? "Guardar cambios" : "Crear sucursal"}
              </Button>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
}

export default AddBranch;
