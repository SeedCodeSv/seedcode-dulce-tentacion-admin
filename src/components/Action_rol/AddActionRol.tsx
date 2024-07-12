import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Check, UserRoundCheck } from 'lucide-react';
import Layout from '@/layout/Layout';
import { get_roles_list } from '@/services/users.service';
import { useActionsRolStore } from '@/store/actions_rol.store';
import { Role } from '@/types/users.types';
import { ThemeContext } from '@/hooks/useTheme';
import { toast } from 'sonner';

const permissions = ['Mostrar', 'Agregar', 'Editar', 'Eliminar'];

const PermissionTable: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolId, setRolId] = useState(0);
  const [selectedActions, setSelectedActions] = useState<{ [view: string]: { actions: string[], viewId: number } }>({});
  const { OnGetActionsByRolePage, roleActionsPage, OnCreateActionsRol } = useActionsRolStore();
  const { theme } = useContext(ThemeContext);
  const [viewId , setViewId] = useState(0);
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

  const handleActionSelect = (view: string, action: string, viewId: number) => {
    setViewId(viewId);
    setSelectedActions((prevState) => {
      const currentActions = prevState[view]?.actions || [];
      const newActions = currentActions.includes(action)
        ? currentActions.filter((a) => a !== action)
        : [...currentActions, action];
      return { ...prevState, [view]: { actions: newActions, viewId } };
    });
  };

  const handleSubmit = async () => {
    const payload = {
      names: Object.entries(selectedActions).flatMap(([, data]) =>
        data.actions.map((action) => ({ name: action }))
      ),
      viewId: viewId,
    };
    await OnCreateActionsRol(payload, viewId);
  };

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
                          <div onClick={() => handleActionSelect(vista, permission, rolId)} className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center cursor-pointer">
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
                          <div onClick={() => handleActionSelect(vista, permission, rolId)} className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center cursor-pointer">
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
    <Layout title="Roles">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => setRolId(role.id)}
                className="relative w-full shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl flex items-center"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setRolId(role.id)}
                aria-pressed={rolId === role.id}
              >
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
                  {role.id}
                </div>
                <div className="w-16 h-16 rounded-full mr-4">
                  <UserRoundCheck size={40} color="green" />
                </div>
                <p className="font-semibold dark:text-white">{role.name}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap -mx-2">
            {uniqueViews.map((view) => (
              <React.Fragment key={view}>
                {renderSection(view)}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedActions).length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PermissionTable;
