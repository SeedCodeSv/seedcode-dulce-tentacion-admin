import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Autocomplete, AutocompleteItem, Input } from '@heroui/react';
import viewActions from '../../actions.json';
import { useViewsStore } from '../../store/views.store';
import { useActionsRolStore } from '../../store/actions_rol.store';
import { useAuthStore } from '../../store/auth.store';
import { create_role_action } from '../../services/actions.service';
import { Role } from '../../types/auth.types';
import { get_all_roles } from '../../services/roles.service';
import { Search } from 'lucide-react';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
const PermissionAddActionRol: React.FC = () => {
  const { OnGetViewasAction, viewasAction } = useViewsStore();
  const [selectedActions, setSelectedActions] = useState<{ [viewId: number]: string[] }>({});
  const [defaultActions, setDefaultActions] = useState<{ [viewId: number]: string[] }>({});
  const { OnGetActionsByRolePage, roleActionsPage } = useActionsRolStore();
  const [dataRoles, setDataRoles] = useState<Role[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState(1);
  useEffect(() => {
    OnGetViewasAction(1, 5, '');
  }, [OnGetViewasAction]);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await get_all_roles();
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
  }, []);
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

  const { OnGetActionsByRol } = useViewsStore();

  const handleSubmit = async () => {
    if (selectedCustomer === 0) {
      toast.error('Selecciona el rol');
      return;
    }
    try {
      const actionIds = Object.entries(selectedActions)
        .flatMap(([viewId, actions]) => {
          if (actions.length === 0) return [];

          const numericViewId = parseInt(viewId);
          const view = viewasAction.find((va) => va.view.id === numericViewId);

          if (view && typeof view.actions === 'object') {
            return actions
              .filter((action) => !defaultActions[numericViewId]?.includes(action))
              .map((action) => {
                const actionIndex = view.actions.name.findIndex((name) => name === action);
                return actionIndex !== -1 ? { id: view.actions.id[actionIndex] } : null;
              });
          }
          return [];
        })
        .filter((id) => id !== null);
      const payload = {
        actionIds: actionIds as { id: number }[],
        roleId: selectedCustomer,
      };
      await create_role_action(payload);
      OnGetActionsByRole(user?.roleId as number);
      toast.success('Acciones asignadas correctamente');
      OnGetActionsByRol(user?.roleId ?? 0);
    } catch (error) {
      toast.error('Error al asignar acciones');
    }
  };
  const toggleSelectAllActions = (viewId: number, actions: string[]) => {
    setSelectedActions((prev) => {
      const allSelected = selectedActions[viewId]?.length === actions.length;
      const newActions = allSelected
        ? defaultActions[viewId]
        : [...new Set([...actions, ...defaultActions[viewId]])];
      return {
        ...prev,
        [viewId]: newActions,
      };
    });
  };

  const renderSection = (view: { id: number; name: string }) => {
    const actions = viewActions.view_actions.find((va) => va.view === view.name)?.actions || [];
    return (
      <div className="w-full sm:w-1/2 p-2" key={view.id}>
        <div
          className="mb-4 dark:bg-gray-900  shadow-lg border border-gray-300 rounded-lg overflow-hidden"
          style={{ height: '400px', width: '100%' }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white ">
            <p className="font-semibold">{view.name}</p>
            <div className="flex items-center justify-center">
              <span className="ml-2">Seleccionar todas</span>
              <input
                type="checkbox"
                checked={selectedActions[view.id]?.length === actions.length}
                onChange={() => toggleSelectAllActions(view.id, actions)}
                className="w-5 h-5 ml-2 text-teal-400 bg-teal-700 border-teal-600 rounded form-checkbox focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="border-t-2 border-white"></div>
          <div className="px-4 py-2 border-t border-teal-600">
            <div className="dark:bg-gray-900 bg-white h-full">
              <div className="grid grid-cols-2 gap-4 h-full">
                {actions.length === 0 ? (
                  <div className="col-span-2 text-center py-4">
                    <span className="dark:text-white">NO HAY ACCIONES ASIGNADAS</span>
                  </div>
                ) : (
                  actions.map((permission, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-center px-4 py-2 border-b dark:border-gray-600 cursor-pointer ${
                        defaultActions[view.id]?.includes(permission) ? 'cursor-not-allowed' : ''
                      }`}
                      onClick={() => {
                        !defaultActions[view.id]?.includes(permission) &&
                          handleSelectAction(view.id, permission);
                      }}
                    >
                      <div className="flex items-center w-full justify-center">
                        <input
                          type="checkbox"
                          checked={selectedActions[view.id]?.includes(permission)}
                          onChange={() => handleSelectAction(view.id, permission)}
                          disabled={defaultActions[view.id]?.includes(permission)}
                          className="form-checkbox h-5 w-5 text-teal-40 rounded focus:ring-teal-500"
                        />
                        <span className="dark:text-white flex ml-4 w-12">{permission}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const sortedViews = useMemo(() => {
    const withActions = viewasAction.filter(
      ({ view }) =>
        (viewActions.view_actions.find((va) => va.view === view.name)?.actions || []).length > 0
    );
    const withoutActions = viewasAction.filter(
      ({ view }) =>
        (viewActions.view_actions.find((va) => va.view === view.name)?.actions || []).length === 0
    );
    return [...withActions, ...withoutActions];
  }, [viewasAction]);
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const filteredViews = useMemo(() => {
    return sortedViews.filter(({ view }) =>
      view.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedViews, searchTerm]);
  return (
    <>
      <div className="w-full h-full p-5 overflow-y-auto custom-scrollbar1  shadow-xl rounded-xl dark:bg-gray-900">
        <div className="grid grid-cols-1 lg:flex-row justify-between items-center w-full gap-5 mb-5 lg:mb-10 lg:gap-0">
          <div className="flex w-full gap-5 lg:w-auto justify-between lg:justify-between">
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
                  key={role.id}
                  className="dark:text-white"
                >
                  {role.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <div className="flex w-full mb-4">
              <Input
                type="text"
                variant="bordered"
                label="Nombre"
                labelPlacement="outside"
                placeholder="Escribe ..."
                value={searchTerm}
                startContent={<Search />}
                onChange={handleSearchChange}
                className="w-full dark:text-white"
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap -mx-2">
          {filteredViews.map(({ view }) => (
            <React.Fragment key={view.id}>{renderSection(view)}</React.Fragment>
          ))}
        </div>
      </div>
      <div className="fixed bottom-8 right-8">
        <ButtonUi
          theme={Colors.Success}
          onPress={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          Guardar
        </ButtonUi>
      </div>
    </>
  );
};

export default PermissionAddActionRol;
