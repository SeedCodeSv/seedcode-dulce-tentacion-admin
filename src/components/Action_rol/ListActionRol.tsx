import React, { useContext, useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useViewsStore } from '@/store/views.store';
import { useNavigate } from 'react-router';
import { create_action_by_view, create_view } from '@/services/actions.service';
import { toast } from 'sonner';
import AddButton from '../global/AddButton';
import { Button } from '@nextui-org/react';
import { ThemeContext } from '@/hooks/useTheme';
import permissionss from '../../actions.json';
const PermissionTable: React.FC = () => {
  const { OnGetViewasAction, viewasAction } = useViewsStore();
  const [selectedActions, setSelectedActions] = useState<{ [viewId: number]: string[] }>({});
  const [defaultActions, setDefaultActions] = useState<{ [viewId: number]: string[] }>({});
  const [selectedViewId, setSelectedViewId] = useState<number | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedViewName, setSelectedViewName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    OnGetViewasAction();
  }, [OnGetViewasAction]);

  useEffect(() => {
    if (viewasAction) {
      const initialSelectedActions: { [viewId: number]: string[] } = {};
      const initialDefaultActions: { [viewId: number]: string[] } = {};
      viewasAction.forEach(({ view, actions }) => {
        initialSelectedActions[view.id] = actions.name;
        initialDefaultActions[view.id] = actions.name;
      });
      setSelectedActions(initialSelectedActions);
      setDefaultActions(initialDefaultActions);
    }
  }, [viewasAction]);

  const handleSelectAction = (viewId: number, action: string) => {
    if (defaultActions[viewId]?.includes(action)) {
      return;
    }
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
  const handleOpenViewModal = () => {
    setIsViewModalOpen(true);
  };
  const handleSelectAllActions = (viewId: number) => {
    const allActions =
      permissionss.view_actions.find(
        (va) => va.view === viewasAction.find((view) => view.view.id === viewId)?.view.name
      )?.actions || [];
    const currentSelectedActions = selectedActions[viewId] || [];

    if (currentSelectedActions.length === allActions.length) {
      // Si todas las acciones están seleccionadas, deseleccionarlas
      setSelectedActions((prev) => ({
        ...prev,
        [viewId]: [],
      }));
    } else {
      // Si no todas las acciones están seleccionadas, seleccionarlas todas
      setSelectedActions((prev) => ({
        ...prev,
        [viewId]: allActions,
      }));
    }
  };

  const handleSelectView = (viewName: string) => {
    setSelectedViewName(viewName);
  };
  const handleSubmitCreateView = async () => {
    try {
      await create_view({
        name: selectedViewName,
        type: 'Drawer',
      });
      toast.success('Vista creada correctamente');
      OnGetViewasAction();
    } catch (error) {
      toast.error('Error al crear la vista');
    }
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
            names: item.names
              .filter((name) => !defaultActions[item.viewId]?.includes(name))
              .map((name) => ({ name })),
          })
        )
      );
      toast.success('Acciones asignadas correctamente');
    } catch (error) {
      toast.error('Error al enviar el payload');
    }
  };
  const { theme } = useContext(ThemeContext);
  const availableViews = permissionss.view_actions.filter(
    (view) => !(viewasAction ?? []).some((va) => va.view.name === view.view)
  );
  
  const renderActions = (viewId: number) => {
    const view = viewasAction.find((view) => view.view.id === viewId)?.view ;
    return (
      <div className="w-full p-2" key={viewId}>
        <div className="mb-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-blue-900 dark:bg-blue-700 text-white flex justify-between items-center">
            <p className="font-semibold">{view?.name}</p>
            <div
              onClick={() => handleSelectAllActions(viewId)}
              className={`cursor-pointer ${
                selectedActions[viewId]?.length ===
                permissionss.view_actions.find((va) => va.view === view?.name)?.actions.length
                  ? 'bg-green-500'
                  : 'bg-gray-500'
              } rounded-full h-8 w-8 flex items-center justify-center`}
            >
              <Check className="text-white" />
            </div>
          </div>
          <div className="px-4 py-2 border-t border-gray-300 dark:border-gray-700">
            <div className="bg-white dark:bg-gray-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {permissionss.view_actions
                  .find((va) => va.view === view?.name)
                  ?.actions.map((permission) => (
                    <div
                      key={permission}
                      className={`flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
                        defaultActions[viewId]?.includes(permission) ? 'cursor-not-allowed' : ''
                      }`}
                      onClick={() => handleSelectAction(viewId, permission)}
                    >
                      <span className="dark:text-white">{permission}</span>
                      <div
                        className={`${
                          selectedActions[viewId]?.includes(permission)
                            ? 'bg-green-500'
                            : 'bg-gray-500'
                        } rounded-full h-8 w-8 flex items-center justify-center`}
                      >
                        <Check className="text-white" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="w-full lg:w-1/4 bg-gray-100 dark:bg-gray-900 p-4 mt-2">
        <div className="flex justify-between mb-4 lg:hidden">
          <AddButton onClick={handleOpenViewModal}></AddButton>
          <AddButton onClick={() => navigate('/AddActionRol')}></AddButton>
        </div>
        <div className="overflow-y-auto h-64 lg:h-full">
          { viewasAction && viewasAction.map((view) => (
            <div key={view.view.id} className="mb-2">
              <button
                className={`w-full text-left bg-white dark:bg-gray-800 py-2 px-4 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                  selectedViewId === view.view.id ? 'bg-blue-200 dark:bg-blue-700' : ''
                }`}
                onClick={() => {
                  setSelectedViewId(view.view.id), setIsViewModalOpen(false);
                }}
              >
                <span className="dark:text-white">{view.view.name}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full lg:w-3/4 p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white dark:bg-gray-900 shadow-xl rounded-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-5 mb-5 lg:mb-10 lg:gap-0">
            <div className="lg:block hidden">
              <AddButton
                text="Agregar Vistas"
                onClick={() => {
                  setIsViewModalOpen(true), setSelectedViewId(0);
                }}
              ></AddButton>
            </div>
            <div className="hidden lg:block">
              <AddButton
                text="Agregar Acciones"
                onClick={() => navigate('/AddActionRol')}
              ></AddButton>
            </div>
          </div>
          <div className={`${selectedViewId ? '' : 'hidden'}`}>
            {selectedViewId && renderActions(selectedViewId)}
          </div>
          {isViewModalOpen && (
            <div className="flex flex-col space-y-2">
              { availableViews && availableViews.map((view) => (
                <div
                  onClick={() => handleSelectView(view.view)}
                  key={view.view}
                  className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 cursor-pointer 
                  "
                >
                  <span className="dark:text-white">{view.view}</span>
                  <div
                    className={`${selectedViewName === view.view ? '' : ' rounded-full h-8 w-8 flex items-center border-2 border-green-500 justify-center'} `}
                  >
                    <Check
                    size={10}
                      className={`${selectedViewName === view.view ? 'bg-green-500 w-8 h-8 rounded-full text-white' : 'text-white'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className={`${selectedViewId ? '' : 'hidden'}`}>
            <div className="mt-6 lg:mt-10 flex justify-end">
              {selectedViewId && (
                <Button
                  style={{ backgroundColor: theme.colors.dark, color: theme.colors.primary }}
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Guardar
                </Button>
              )}
            </div>
          </div>
          {isViewModalOpen && (
            <div className="mt-6 lg:mt-10 flex justify-end">
              <Button
                style={{ backgroundColor: theme.colors.dark, color: theme.colors.primary }}
                onClick={handleSubmitCreateView}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                Guar dar Vista
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PermissionTable;
