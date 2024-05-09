import { useContext, useEffect, useState } from "react";
import { useRolesStore } from "../../store/roles.store";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { Formik } from "formik";
import * as yup from "yup";
import { Role } from "../../types/roles.types";
import { ThemeContext } from "../../hooks/useTheme";

const AddActionRol = () => {
  const [showActions, setShowActions] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [nombres, setNombres] = useState<{ nombre: string }[]>([
    { nombre: "Mostrar" },
  ]);
  const { getRolesList, roles_list } = useRolesStore();

  useEffect(() => {
    getRolesList();
  }, []);

  const selectName = (nombre: string, state: boolean) => {
    if (state) {
      setNombres([...nombres, { nombre }]);
    } else {
      setNombres(nombres.filter((n) => n.nombre !== nombre));
    }
  };
  const save_actions = async () => {
    // setShowModal(true);
    const actions_filter = nombres.filter((nombre) => {
      //   return !actions_by_view.includes(nombre.nombre);
      // });
      // if (selectedRol) {
      //   if (selectedView) {
      //     if (actions_by_view.length < 4) {
      //       const payload = {
      //         nombres: actions_filter,
      //         vistaId: selectedView?.id,
      //       };
      //       const res = await OnCreateActions(payload, selectedRol.id);
      //       if (res) {
      //         closeModal();
      //         onCreateView();
      //         closeModal2();
      //         toast.success("Registro creado correctamente");
      //       }
      //     } else {
      //       ShowToast("warning", "Este rol ya cuenta con todos los permisos");
      //     }
      //   } else {
      //     ShowToast("warning", "Selecciona el modulo");
      //   }
      // } else {
      //   ShowToast("warning", "Seleccione un rol");
      // }
    });
  };
  const validationSchema = yup.object().shape({
    viewId: yup
      .number()
      .required("Debes seleccionar la vista")
      .min(1, "Debes seleccionar la vista"),
    rolId: yup
      .number()
      .required("Debes seleccionar el rol")
      .min(1, "Debes seleccionar el rol"),
  });

  const initialValues = {
    viewId: 0,
    rolId: 0,
  };

  return (
    <div>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={save_actions}
      >
        {({
          errors,
          touched,
          handleBlur,
          handleSubmit,
          handleChange,
        }) => (
          <>
            <div className="mt-4">
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const branchSelected = JSON.parse(key as string) as Role;
                    handleChange("rolId")(
                      branchSelected.id.toString()
                    );
                  }
                }}
                onBlur={handleBlur("rolId")}
                label="Roles"
                labelPlacement="outside"
                placeholder="Selecciona el rol"
                variant="bordered"
                classNames={{
                  base: "font-semibold text-gray-500 text-sm",
                }}
              >
                {roles_list.map((bra) => (
                  <AutocompleteItem value={bra.name} key={JSON.stringify(bra)}>
                    {bra.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {errors.rolId && touched.rolId && (
                <span className="text-sm font-semibold text-red-500">
                  {errors.rolId}
                </span>
              )}
            </div>
            <Button
              size="lg"
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

export default AddActionRol;
