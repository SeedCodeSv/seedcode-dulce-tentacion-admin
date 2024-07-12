import React, { useContext, useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { ThemeContext } from '@/hooks/useTheme';
import { useViewsStore } from '@/store/views.store';
import { create_role_action } from '@/services/actions.service';
import { toast } from 'sonner';
import { get_roles_list } from '@/services/users.service';
import { Role } from '@/types/auth.types';

import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { ICreateRoleActionPayload } from '@/types/actions.types';
import AddButton from '../global/AddButton';
import { useNavigate } from 'react-router';

interface ViewAction {
  id: number[];
  name: string[];
}

interface View {
  id: number;
  name: string;
}

interface ViewAsAction {
  view: View;
  actions: ViewAction;
}

const PermissionTable: React.FC = () => {
  const { OnGetViewasAction, viewasAction } = useViewsStore();
  const { theme } = useContext(ThemeContext);
  const [dataRoles, setDataRoles] = useState<Role[]>([]);
  const [rolId, setRolId] = useState(0);
  const [selectedActions, setSelectedActions] = useState<{ [key: number]: number[] }>({});

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await get_roles_list();
        if (data) {
          setDataRoles(data.data.roles);
        }
      } catch (error) {
        toast.error('Error al obtener los roles');
      }
    };
    fetchRoles();
    OnGetViewasAction();
  }, [OnGetViewasAction]);

  const handleSubmit = async () => {
    try {
      for (const [, actionIds] of Object.entries(selectedActions)) {
        const payload: ICreateRoleActionPayload = {
          actionIds: actionIds.map((id) => ({ id })),
          roleId: rolId,
        };
        await create_role_action(payload);
      }
      toast.success('Acciones asignadas exitosamente');
      setSelectedActions({});
    } catch (error) {
      toast.error('Error al asignar las acciones');
    }
  };

  const handleActionToggle = (viewId: number, actionId: number) => {
    setSelectedActions((prevState) => {
      const currentSelectedActions = prevState[viewId] || [];
      if (currentSelectedActions.includes(actionId)) {
        return {
          ...prevState,
          [viewId]: currentSelectedActions.filter((id) => id !== actionId),
        };
      } else {
        return {
          ...prevState,
          [viewId]: [...currentSelectedActions, actionId],
        };
      }
    });
  };
  const navigate = useNavigate();
  const renderSection = (view: ViewAsAction) => {
    const uniqueActions = Array.from(new Set(view.actions.name)).slice(0, 4);

    return (
      <div className="w-full sm:w-1/2 p-2" key={view.view.id}>
        <div className="mb-4 bg-white shadow-lg rounded-lg overflow-hidden transition duration-500 hover:shadow-xl">
          <div
            className="px-4 py-2"
            style={{ backgroundColor: theme.colors.dark, color: theme.colors.primary }}
          >
            <p className="text-white font-semibold text-lg">{view.view.name}</p>
          </div>
          <div className="px-4 py-2 border-t border-gray-300">
            <div className="min-w-full bg-white">
              <div className="flex flex-wrap">
                {uniqueActions.map((action, index) => {
                  const actionId = view.actions.id[view.actions.name.indexOf(action)];
                  const isSelected = selectedActions[view.view.id]?.includes(actionId) || false;
                  return (
                    <div className="w-1/2 p-2" key={index}>
                      <div
                        className="px-4 py-2 border-b border-gray-200 text-center cursor-pointer transition duration-300 hover:bg-gray-100"
                        onClick={() => handleActionToggle(view.view.id, actionId)}
                      >
                        <p className="text-sm font-medium">{action}</p>
                        <div className="mt-2 flex justify-center">
                          <div
                            className={`rounded-full h-8 w-8 flex items-center justify-center transition duration-300 ${
                              isSelected ? 'bg-green-500' : 'bg-gray-500'
                            }`}
                          >
                            {isSelected && <Check className="text-white" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-700 transition duration-500">
        <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
          <div className="flex justify-center items-start gap-3">
            <div>
              <AddButton onClick={() => navigate('/AddActionRol')} />
            </div>
          </div>
          <div className="flex justify-end">
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
              {dataRoles.map((bra) => (
                <AutocompleteItem
                  value={bra.name}
                  key={bra.name}
                  onClick={() => setRolId(bra.id)}
                  className="dark:text-white"
                >
                  {bra.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
        </div>
        <div className="flex flex-wrap -mx-2">
          {viewasAction.map((view) => (
            <React.Fragment key={view.view.id}>{renderSection(view)}</React.Fragment>
          ))}
        </div>
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );

};

export default PermissionTable;
