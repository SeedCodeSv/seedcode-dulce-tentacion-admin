import { useContext, useEffect, useState } from 'react';
import { useRolesStore } from '../../store/roles.store';
import { Autocomplete, AutocompleteItem, Button, Checkbox } from '@nextui-org/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Role } from '../../types/roles.types';
import { ThemeContext } from '../../hooks/useTheme';
import { useViewsStore } from '../../store/views.store';
import { IView } from '../../types/view.types';
import { useActionsRolStore } from '../../store/actions_rol.store';
import { toast } from 'sonner';
interface Props {
  closeModal: () => void;
}
const AddActionRol = ({ closeModal }: Props) => {
  const [showActions, setShowActions] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Role>();
  const [selectedView, setSelectedView] = useState<IView>();

  const { theme } = useContext(ThemeContext);
  const [nombres, setNombres] = useState<{ name: string }[]>([{ name: 'Mostrar' }]);
  console.log(selectedRol, selectedView);
  const { getRolesList, roles_list } = useRolesStore();
  const { getViews, views_list } = useViewsStore();
  const { getActionsByRolView, actions_by_view_and_rol, OnCreateActionsRol } = useActionsRolStore();
  useEffect(() => {
    getRolesList();
    getViews();
  }, []);
  useEffect(() => {
    if (selectedRol && selectedView) {
      getActionsByRolView(selectedRol.id, selectedView.id);
      setShowActions(true);
      // OnGetActionsByView(selectedView.id).then(() => {
      //   setIsLoading(false);
      // });
    } else {
      setShowActions(false);
    }
  }, [selectedRol, selectedView]);
  const selectName = (name: string, state: boolean) => {
    if (state) {
      setNombres([...nombres, { name }]);
    } else {
      setNombres(nombres.filter((n) => n.name !== name));
    }
  };
  console.log('actions', actions_by_view_and_rol);
  const save_actions = async () => {
    // setShowModal(true);
    const actions_filter = nombres.filter((names) => {
      return !actions_by_view_and_rol.includes(names.name);
    });
    if (selectedRol) {
      if (selectedView) {
        if (actions_by_view_and_rol.length < 4) {
          const payload = {
            names: actions_filter,
            viewId: selectedView?.id,
          };
          const res = await OnCreateActionsRol(payload, selectedRol.id);
          if (res) {
            setShowActions(false);
            closeModal();
          }
        } else {
          toast.info('Este rol ya cuenta con todos los permisos');
        }
      } else {
        toast.info('Selecciona el modulo');
      }
    } else {
      toast.info('Seleccione un rol');
    }
  };
  const validationSchema = yup.object().shape({
    viewId: yup
      .number()
      .required('Debes seleccionar la vista')
      .min(1, 'Debes seleccionar la vista'),
    rolId: yup.number().required('Debes seleccionar el rol').min(1, 'Debes seleccionar el rol'),
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
        {({ errors, touched, handleBlur, handleSubmit, handleChange }) => (
          <>
            <div className="mt-4">
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const rolSelected = JSON.parse(key as string) as Role;
                    handleChange('rolId')(rolSelected.id.toString());
                    setSelectedRol(rolSelected);
                  }
                }}
                onBlur={handleBlur('rolId')}
                label="Roles"
                labelPlacement="outside"
                placeholder="Selecciona el rol"
                variant="bordered"
                classNames={{
                  base: 'font-semibold text-gray-500 text-sm',
                }}
              >
                {roles_list.map((rol) => (
                  <AutocompleteItem value={rol.name} key={JSON.stringify(rol)}>
                    {rol.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {errors.rolId && touched.rolId && (
                <span className="text-sm font-semibold text-red-500">{errors.rolId}</span>
              )}
            </div>
            <div className="mt-4">
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const viewSelected = JSON.parse(key as string) as IView;
                    handleChange('viewId')(viewSelected.id.toString());
                    setSelectedView(viewSelected);
                  }
                }}
                onBlur={handleBlur('viewId')}
                label="Módulos"
                labelPlacement="outside"
                placeholder="Selecciona el módulo"
                variant="bordered"
                classNames={{
                  base: 'font-semibold text-gray-500 text-sm',
                }}
              >
                {views_list.map((view) => (
                  <AutocompleteItem value={view.name} key={JSON.stringify(view)}>
                    {view.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {errors.viewId && touched.viewId && (
                <span className="text-sm font-semibold text-red-500">{errors.viewId}</span>
              )}
            </div>
            {showActions && (
              <div className="p-5 mt-5 border border-gray-200 rounded-lg">
                <div className="flex flex-col justify-between w-full gap-1 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
                  <Checkbox defaultSelected lineThrough isSelected>
                    Mostrar
                  </Checkbox>
                  {/* </div>
              <div> */}
                  {actions_by_view_and_rol.includes('Agregar') ? (
                    <Checkbox defaultSelected lineThrough isSelected>
                      Agregar1
                    </Checkbox>
                  ) : (
                    <Checkbox
                      lineThrough
                      checked={nombres.includes({ name: 'Agregar' })}
                      onChange={(checked) => selectName('Agregar', checked.target.checked)}
                    >
                      Agregar
                    </Checkbox>
                  )}
                </div>
                <div className="flex flex-col justify-between w-full gap-1 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
                  {actions_by_view_and_rol.includes('Editar') ? (
                    <Checkbox defaultSelected lineThrough isSelected>
                      Editar
                    </Checkbox>
                  ) : (
                    <Checkbox
                      lineThrough
                      checked={nombres.includes({ name: 'Editar' })}
                      onChange={(checked) => selectName('Editar', checked.target.checked)}
                    >
                      Editar
                    </Checkbox>
                  )}
                  {/* </div>
              <div> */}
                  {actions_by_view_and_rol.includes('Eliminar') ? (
                    <Checkbox defaultSelected lineThrough isSelected>
                      Eliminar
                    </Checkbox>
                  ) : (
                    <Checkbox
                      lineThrough
                      checked={nombres.includes({ name: 'Eliminar' })}
                      onChange={(checked) => selectName('Eliminar', checked.target.checked)}
                    >
                      Eliminar
                    </Checkbox>
                  )}
                </div>
              </div>
            )}
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

export default AddActionRol;
