import React, { useContext, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useViewsStore } from '../../store/views.store';
import { create_view, create_action_by_view } from '../../services/actions.service';
import permissionss from '../../actions.json';
import PermissionAddActionRol from './AddActionRol';
import { useActionsRolStore } from '@/store/actions_rol.store';
import { IUpdateActions } from '@/types/actions_rol.types';
import { Button } from '@nextui-org/react';
import { ThemeContext } from '@/hooks/useTheme';

const PermissionTable: React.FC = () => {
  const { OnGetViewasAction, viewasAction } = useViewsStore();
  const { OnUpdateActions } = useActionsRolStore();
  const hasExecuted = useRef(false);

  useEffect(() => {
    OnGetViewasAction();
  }, [OnGetViewasAction]);

  const handleCreateOrUpdateViewsAndActions = async () => {
    if (hasExecuted.current) return;
    hasExecuted.current = true;
    try {
      const viewsInStore = new Set(viewasAction.map(({ view }) => view.name));
      const viewsToCreate = permissionss.view_actions.filter(({ view }) => !viewsInStore.has(view));

      if (viewsToCreate.length > 0) {
        const response = await create_view({
          views: viewsToCreate.map(({ view }) => ({
            name: view,
            type: 'Drawer',
          })),
        });

        if (response.data.ok === true && response.data.views) {
          await Promise.all(
            response.data.views.map(async (newView, index) => {
              const actions = viewsToCreate[index].actions;

              if (newView && newView.id) {
                try {
                  await create_action_by_view({
                    viewId: newView.id,
                    names: actions.map((name) => ({ name })),
                  });
                } catch (error) {
                  error;
                }
              }
            })
          );
        }
      }

      const actionsToUpdate: IUpdateActions[] = [];
      viewasAction.forEach(({ view }) => {
        const permissionView = permissionss.view_actions.find(
          (permission) => permission.view === view.name
        );

        if (permissionView) {
          const existingActions = new Set(
            viewasAction.filter((va) => va.view.id === view.id).flatMap((va) => va.actions.name)
          );

          const newActions = permissionView.actions.filter(
            (action) => !existingActions.has(action)
          );

          if (newActions.length > 0) {
            newActions.forEach((action) => {
              actionsToUpdate.push({
                viewId: view.id,
                name: action,
              });
            });
          }
        }
      });

      if (actionsToUpdate.length > 0) {
        await OnUpdateActions({ actions: actionsToUpdate });
      }
    } catch (error) {
      toast.error('Error al crear o actualizar las vistas y acciones');
      hasExecuted.current = false;
    }
  };

  useEffect(() => {
    if (viewasAction.length > 0) {
      handleCreateOrUpdateViewsAndActions();
    }
  }, [viewasAction]);

  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen">
        <div className="w-full lg:w-1/4 bg-gray-100 dark:bg-gray-900 p-4 mt-2">
          <div className="p-2 ">
            <Button
              style={{ backgroundColor: theme.colors.dark, color: theme.colors.primary }}
              onClick={handleCreateOrUpdateViewsAndActions}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              Actualizar
            </Button>
          </div>
          <div className="overflow-y-auto max-h-64 lg:max-h-full">
            {viewasAction &&
              viewasAction.map((view) => (
                <div key={view.view.id}>
                  <div
                    onClick={() => {}}
                    className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                  >
                    <span className="dark:text-white">{view.view.name}</span>

                    <div className="rounded-full h-8 w-8 flex bg-green-500 items-center border-2 border-green-500 justify-center">
                      <Check size={20} className="text-white" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="w-full lg:w-3/4 p-2 bg-gray-50 dark:bg-gray-800 flex flex-col">
          <div className="flex-grow overflow-y-auto custom-scrollbar p-3 bg-white dark:bg-gray-900 shadow-xl rounded-xl">
            <PermissionAddActionRol />
          </div>
        </div>
      </div>
    </>
  );
};

export default PermissionTable;
