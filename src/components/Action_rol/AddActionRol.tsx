import React, { useContext, useEffect, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import Layout from '@/layout/Layout';
import { ThemeContext } from '@/hooks/useTheme';
import { useViewsStore } from '@/store/views.store';
import { useNavigate } from 'react-router';
import { create_action_by_view } from '@/services/actions.service';
import { toast } from 'sonner';

const permissions = ['Mostrar', 'Agregar', 'Editar', 'Eliminar'];

const PermissionTable: React.FC = () => {
  const { OnGetViewasAction, viewasAction } = useViewsStore();
  const { theme } = useContext(ThemeContext);
  const [selectedActions, setSelectedActions] = useState<{ [viewId: number]: string[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    OnGetViewasAction();
  }, [OnGetViewasAction]);

  useEffect(() => {
    if (viewasAction) {
      const initialSelectedActions: { [viewId: number]: string[] } = {};
      viewasAction.forEach(({ view, actions }) => {
        initialSelectedActions[view.id] = actions.name;
      });
      setSelectedActions(initialSelectedActions);
    }
  }, [viewasAction]);

  const handleSelectAction = (viewId: number, action: string) => {
    setSelectedActions((prev) => {
      const actions = prev[viewId] || [];
      return {
        ...prev,
        [viewId]: actions.includes(action)
          ? actions.filter((a) => a !== action)
          : [...actions, action],
      };
    });
  };

  const handleSubmit = async () => {
    const payload = Object.keys(selectedActions).map((viewId) => ({
      viewId: Number(viewId),
      names: selectedActions[Number(viewId)] || [],
    }));

    try {
      await Promise.all(
        payload.map((item) =>
          create_action_by_view({
            viewId: item.viewId,
            names: item.names.map((name) => ({ name })),
          })
        )
      );
      navigate('/actionRol');
    } catch (error) {
      toast.error('Error al enviar el payload');
    }
  };

  const renderSection = (view: { id: number; name: string }) => (
    <div className="w-full sm:w-1/2 p-2" key={view.id}>
      <div className="mb-4 bg-white shadow rounded-lg overflow-hidden">
        <div
          className="px-4 py-2"
          style={{ backgroundColor: theme.colors.dark, color: theme.colors.primary }}
        >
          <p className="text-white">{view.name}</p>
        </div>
        <div className="px-4 py-2 border-t border-gray-300">
          <div className="min-w-full bg-white">
            <div className="flex">
              <div className="w-1/2">
                <div>
                  {permissions.slice(0, 2).map((permission) => (
                    <div
                      key={permission}
                      className="px-4 py-2 border-b border-gray-200 text-center cursor-pointer"
                      onClick={() => handleSelectAction(view.id, permission)}
                    >
                      {permission}
                      <div className="mt-2 flex justify-center">
                        <div
                          className={`${
                            selectedActions[view.id]?.includes(permission)
                              ? 'bg-green-500'
                              : 'bg-gray-500'
                          } text-white rounded-full h-8 w-8 flex items-center justify-center`}
                        >
                          <Check className="text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-1/2">
                <div>
                  {permissions.slice(2, 4).map((permission) => (
                    <div
                      key={permission}
                      className="px-4 py-2 border-b border-gray-200 text-center cursor-pointer"
                      onClick={() => handleSelectAction(view.id, permission)}
                    >
                      {permission}
                      <div className="mt-2 flex justify-center">
                        <div
                          className={`${
                            selectedActions[view.id]?.includes(permission)
                              ? 'bg-green-500'
                              : 'bg-gray-500'
                          } text-white rounded-full h-8 w-8 flex items-center justify-center`}
                        >
                          <Check className="text-white" />
                        </div>
                      </div>
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
          <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="flex items-start gap-3"></div>
            <div className="flex w-full">
              <div className="flex items-end justify-end">
                <ArrowLeft onClick={() => navigate('/actionRol')} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap -mx-2">
            {viewasAction.map((view) => (
              <React.Fragment key={view.view.id}>{renderSection(view.view)}</React.Fragment>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={handleSubmit}
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
