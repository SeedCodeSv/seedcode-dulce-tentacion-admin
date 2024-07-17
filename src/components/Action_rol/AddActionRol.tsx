import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useViewsStore } from '@/store/views.store';
import { useNavigate } from 'react-router';
import { create_role_action } from '@/services/actions.service';
import { toast } from 'sonner';
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';
import { get_roles_list } from '@/services/users.service';
import { Role } from '@/types/auth.types';
import { useActionsRolStore } from '@/store/actions_rol.store';
import Layout from '@/layout/Layout';
import { ThemeContext } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth.store';
import viewActions from '../../actions.json'; 
const PermissionTable: React.FC = () => {
  const { OnGetViewasAction, viewasAction } = useViewsStore();
  const [selectedActions, setSelectedActions] = useState<{ [viewId: number]: string[] }>({});
  const [defaultActions, setDefaultActions] = useState<{ [viewId: number]: string[] }>({});
  const { OnGetActionsByRolePage, roleActionsPage } = useActionsRolStore();
  const [dataRoles, setDataRoles] = useState<Role[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState(1);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await get_roles_list();
        if (data) {
          setDataRoles(data.data.roles);
          if (data.data.roles.length > 0) {
            setSelectedCustomer(data.data.roles[0].id);
          }
        }
      } catch (error) {
        toast.error('Error al obtener los roles');
      }
    };
    OnGetActionsByRolePage(selectedCustomer);
    fetchRoles();
    OnGetViewasAction();
  }, [OnGetViewasAction, OnGetActionsByRolePage]);

  const selectedCustomerKey = useMemo(() => {
    return selectedCustomer.toString() ?? dataRoles[0].id.toString();
  }, [selectedCustomer]);

  useEffect(() => {
    if (selectedCustomer === 0) {
      if (dataRoles.length > 0) {
        setSelectedCustomer(dataRoles[0].id);
      }
    }
  }, [dataRoles]);

  useEffect(() => {
    if (viewasAction) {
      const initialSelectedActions: { [viewId: number]: string[] } = {};
      const initialDefaultActions: { [viewId: number]: string[] } = {};
      viewasAction.forEach(({ view }) => {
        initialSelectedActions[view.id] = [];
        initialDefaultActions[view.id] = [];
      });
      roleActionsPage.forEach(({ action }) => {
        if (initialSelectedActions[action.view.id]) {
          initialSelectedActions[action.view.id].push(action.name);
          initialDefaultActions[action.view.id].push(action.name);
        }
      });
      setSelectedActions(initialSelectedActions);
      setDefaultActions(initialDefaultActions);
    }
  }, [viewasAction, roleActionsPage]);

  const handleSelectAllActions = (viewId: number) => {
    setSelectedActions((prev) => {
      const actions = prev[viewId] || [];
      const view = viewasAction.find((v) => v.view.id === viewId);
      const allSelected = actions.length === (view?.actions ?? 0);

      if (allSelected) {
        const defaultActionsSet = new Set(defaultActions[viewId] || []);
        const newActions = actions.filter((action) => defaultActionsSet.has(action));

        return {
          ...prev,
          [viewId]: newActions,
        };
      } else {
        const nonSelectedActions = view
          ? viewActions.view_actions
              .find((va) => va.view === view.name)
              ?.actions.filter((action) => !defaultActions[viewId]?.includes(action)) ?? []
          : [];
        const newActions = [...actions, ...nonSelectedActions];

        return {
          ...prev,
          [viewId]: newActions,
        };
      }
    });
  };


  const handleSelectAction = (viewId: number, action: string) => {
    setSelectedActions((prev) => {
      const actions = prev[viewId] || [];
      const isDefaultAction = defaultActions[viewId]?.includes(action);

      if (!isDefaultAction) {
        const newActions = actions.includes(action)
          ? actions.filter((a) => a !== action)
          : [...actions, action];

        return {
          ...prev,
          [viewId]: newActions,
        };
      }
      return prev;
    });
  };

  const { OnGetActionsByRole } = useActionsRolStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (selectedCustomer === 0) {
      toast.error('Selecciona el rol');
      return;
    }
    try {
      const actionIds = Object.entries(selectedActions)
        .flatMap(([viewId, actions]) => {
          const numericViewId = parseInt(viewId);
          return actions
            .filter((action) => !defaultActions[numericViewId]?.includes(action)) // Filtrar acciones que no son predeterminadas
            .map((action) => {
              const view = viewasAction.find((va) => va.view.id === numericViewId);
              if (view) {
                const actionIndex = view.actions.name.indexOf(action);
                if (actionIndex !== -1) {
                  return { id: view.actions.id[actionIndex] };
                }
              }
              return null;
            });
        })
        .filter((id) => id !== null);

      const payload = {
        actionIds,
        roleId: selectedCustomer,
      };

      await create_role_action(payload);
      OnGetActionsByRole(user?.roleId as number);
      toast.success('Acciones asignadas correctamente');
      navigate('/actionRol');
    } catch (error) {
      toast.error('Error al asignar acciones');
    }
  };

  const { theme } = useContext(ThemeContext);

  const renderSection = (view: { id: number; name: string }) => (
    <div className="w-full sm:w-1/3 p-2" key={view.id}>
      <div className="mb-4 dark:bg-gray-900 bg-white shadow-lg border border-gray-300 rounded-lg overflow-hidden">
        <div
          style={{ backgroundColor: theme.colors.dark, color: theme.colors.primary }}
          className="flex items-center justify-between px-4 py-3 text-white bg-teal-700"
        >
          <p className="font-semibold">{view.name}</p>
          <div className="flex items-center justify-center">
            <span className="ml-2">Seleccionar todas</span>
            <input
              type="checkbox"
              checked={
                selectedActions[view.id]?.length ===
                viewActions.view_actions.find((va) => va.view === view.name)?.actions.length
              }
              onChange={() => handleSelectAllActions(view.id)}
              className="w-5 h-5 ml-2 text-teal-400 bg-teal-700 border-teal-600 rounded form-checkbox focus:ring-teal-500"
            />
          </div>
        </div>
        <div className="border-t-2 border-white"></div>
        <div className="px-4 py-2 border-t border-teal-600">
          <div className="dark:bg-gray-900 bg-white">
            <div className="grid grid-cols-2 gap-4 ">
              {viewActions.view_actions
                .find((va) => va.view === view.name)
                ?.actions.map((permission, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-center px-4 py-2 border-b dark:border-gray-600 cursor-pointer ${
                      defaultActions[view.id]?.includes(permission) ? 'cursor-not-allowed' : ''
                    }`}
                    onClick={() =>
                      !defaultActions[view.id]?.includes(permission) &&
                      handleSelectAction(view.id, permission)
                    }
                  >
                    <div className="flex items-center w-full justify-center">
                      <input
                        type="checkbox"
                        checked={selectedActions[view.id]?.includes(permission)}
                        onChange={() => handleSelectAction(view.id, permission)}
                        className="form-checkbox h-5 w-5 text-teal-40 rounded focus:ring-teal-500"
                      />
                      <span className="dark:text-white flex ml-4 w-12">{permission}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Acciones por rol">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800 relative">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow-xl rounded-xl dark:bg-gray-900">
          <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-5 mb-5 lg:mb-10 lg:gap-0">
            <div
              onClick={() => navigate('/actionRol')}
              className="flex justify-start w-full lg:w-auto cursor-pointer"
            >
              <ArrowLeft
                onClick={() => navigate('/actionRol')}
                className="text-gray-500 cursor-pointer hover:text-gray-700"
              />
              <h1 className="dark:text-white text-center">Regresar</h1>
            </div>

            <div className="flex w-full lg:w-auto justify-end lg:justify-center">
              <Autocomplete
                className="w-full dark:text-white"
                label="Selecciona el rol"
                labelPlacement="outside"
                placeholder="Selecciona el Rol"
                variant="bordered"
                defaultSelectedKey={selectedCustomerKey}
                value={selectedCustomerKey}
                selectedKey={selectedCustomerKey}
                onSelectionChange={(key) => setSelectedCustomer(Number(key))}
              >
                {dataRoles.map((role) => (
                  <AutocompleteItem
                    onClick={() => {
                      setSelectedCustomer(role.id), OnGetActionsByRolePage(role.id);
                    }}
                    value={role.name}
                    key={role.id}
                    className="dark:text-white"
                  >
                    {role.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </div>

          <div className="flex flex-wrap -mx-2">
            {viewasAction.map(({ view }) => (
              <React.Fragment key={view.id}>{renderSection(view)}</React.Fragment>
            ))}
          </div>
        </div>
        <div className="fixed bottom-6 right-4">
          <Button
            style={{ backgroundColor: theme.colors.dark, color: theme.colors.primary }}
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            Guardar
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PermissionTable;
