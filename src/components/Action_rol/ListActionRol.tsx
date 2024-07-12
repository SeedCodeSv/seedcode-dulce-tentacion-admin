import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Check } from 'lucide-react';

import { get_roles_list } from '@/services/users.service';
import { useActionsRolStore } from '@/store/actions_rol.store';
import { Role } from '@/types/users.types';
import { ThemeContext } from '@/hooks/useTheme';
import { useNavigate } from 'react-router';
import AddButton from '../global/AddButton';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { toast } from 'sonner';

const permissions = ['Mostrar', 'Agregar', 'Editar', 'Eliminar'];

const ListRolActions: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolId, setRolId] = useState(0);
  const [selectedActions,] = useState<{ [view: string]: { actions: string[], viewId: number } }>({});
  const { OnGetActionsByRolePage, roleActionsPage } = useActionsRolStore();
  const { theme } = useContext(ThemeContext);
  const fetchRoles = useCallback(async () => {
    try {
      const data = await get_roles_list();
      if (data) {
        setRoles(data.data.roles);
      }
    } finally {
       toast.success("")
    }
  }, []);

  useEffect(() => {
    OnGetActionsByRolePage(rolId);
    fetchRoles();
  }, [rolId]);

  // const handleActionSelect = (view: string, action: string, viewId: number) => {
  //   setViewId(viewId);
  //   setSelectedActions((prevState) => {
  //     const currentActions = prevState[view]?.actions || [];
  //     const newActions = currentActions.includes(action)
  //       ? currentActions.filter((a) => a !== action)
  //       : [...currentActions, action];
  //     return { ...prevState, [view]: { actions: newActions, viewId } };
  //   });
  // };

  // const handleSubmit = async () => {
  //   const payload = {
  //     names: Object.entries(selectedActions).flatMap(([_view, data]) =>
  //       data.actions.map((action) => ({ name: action }))
  //     ),
  //     viewId: viewId,
  //   };
  //   await OnCreateActionsRol(payload, viewId);
  // };
  const navigate = useNavigate();

  const uniqueViews = Array.from(new Set(roleActionsPage.map((view) => view.action.view.name)));
  const renderSection = (vista: string) => (
    <div className="w-full sm:w-1/2 p-2" key={vista}>
      <div className="mb-4 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-2" style={{ backgroundColor: theme.colors.dark, color: theme.colors.primary }}>
          <p className='text-white'> {vista}</p>
        </div>
        <div className="px-4 py-2 border-t border-gray-300">
          <div className="min-w-full bg-white">
            <div className="flex">
              <div className="w-1/2">
                <div>
                  {permissions.slice(0, 2).map((permission) => (
                    <div key={permission} className="px-4 py-2 border-b border-gray-200 text-center">
                      {permission}
                      {roleActionsPage.some((action) => action.action.name === permission && action.action.view.name === vista) ? (
                        <div className="mt-2 flex justify-center">
                          <div className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
                            <Check className='text-white' />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 flex justify-center">
                          <div className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center cursor-pointer">
                            {selectedActions[vista]?.actions.includes(permission) && <Check className="text-white" />}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-1/2">
                <div>
                  {permissions.slice(2, 4).map((permission) => (
                    <div key={permission} className="px-4 py-2 border-b border-gray-200 text-center">
                      {permission}
                      {roleActionsPage.some((action) => action.action.name === permission && action.action.view.name === vista) ? (
                        <div className="mt-2 flex justify-center">
                          <div className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
                            <Check className='text-white' />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 flex justify-center">
                          <div className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center cursor-pointer">
                            {selectedActions[vista]?.actions.includes(permission) && <Check className="text-white" />}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (

    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
        <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
          <div className="flex items-start gap-3"></div>
          <div className="flex w-full">
            <div className="flex items-end justify-end">
              <AddButton onClick={() => navigate('/AddActionRol')} />
            </div>
          </div>
        </div>
        <Autocomplete

          className="w-full dark:text-white"
          label="Selecciona el rol"
          labelPlacement="outside"
          placeholder="Selecciona el Rol"
          variant="bordered"
          classNames={{
            base: 'font-semibold text-gray-500 text-sm',
          }}

        >
          {roles.map((bra) => (
            <AutocompleteItem
              onClick={() => setRolId(bra.id)}
              value={bra.name}
              key={JSON.stringify(bra)}
              className="dark:text-white"
            >
              {bra.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>

        <div className="flex flex-wrap -mx-2">
          {uniqueViews.map((view) => (
            <React.Fragment key={view}>
              {renderSection(view)}
            </React.Fragment>
          ))}
        </div>

      </div>
    </div>

  );
};

export default ListRolActions;



// <div className="grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5">
// {roles.map((role) => (
//   <div
//     key={role.id}
//     onClick={() => setRolId(role.id)}
//     className="relative w-full shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl flex items-center"
//     role="button"
//     tabIndex={0}
//     onKeyDown={(e) => e.key === 'Enter' && setRolId(role.id)}
//     aria-pressed={rolId === role.id}
//   >
//     <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
//       {role.id}
//     </div>
//     <div className="w-16 h-16 rounded-full mr-4">
//       <UserRoundCheck size={40} color="green" />
//     </div>
//     <p className="font-semibold dark:text-white">{role.name}</p>
//   </div>
// ))}
// </div>
{/* <div className="mt-4">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedActions).length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Enviar
            </button>
          </div> */}