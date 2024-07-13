import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

import { useViewsStore } from '@/store/views.store';
import { useNavigate } from 'react-router';
import { create_action_by_view } from '@/services/actions.service';
import { toast } from 'sonner';
import AddButton from '../global/AddButton';

const PermissionTable: React.FC = () => {
  const permissions = ['Mostrar', 'Agregar', 'Editar', 'Eliminar'];

  const { OnGetViewasAction, viewasAction } = useViewsStore();
  const [selectedActions, setSelectedActions] = useState<{ [viewId: number]: string[] }>({});
  const [defaultActions, setDefaultActions] = useState<{ [viewId: number]: string[] }>({});
  const [selectedViewId, setSelectedViewId] = useState<number | null>(null);
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

  const handleSelectAllActions = (viewId: number) => {
    setSelectedActions((prev) => {
      const actions = prev[viewId] || [];
      const allSelected = actions.length === permissions.length;
      const newActions = allSelected ? defaultActions[viewId] : permissions;
      return {
        ...prev,
        [viewId]: newActions,
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
            names: item.names
              .filter((name) => !defaultActions[item.viewId]?.includes(name)) // Filtrar solo los nuevos seleccionados
              .map((name) => ({ name })),
          })
        )
      );
      toast.success('Acciones asignadas correctamente');
    } catch (error) {
      toast.error('Error al enviar el payload');
    }
  };

  const renderActions = (viewId: number) => (
    <div className="w-full p-2" key={viewId}>
      <div className="mb-4 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-blue-900 text-white flex justify-between items-center">
          <p className="font-semibold">
            {viewasAction.find((view) => view.view.id === viewId)?.view.name}
          </p>
          <div
            className={`cursor-pointer ${
              selectedActions[viewId]?.length === permissions.length
                ? 'bg-green-500'
                : 'bg-gray-500'
            } rounded-full h-8 w-8 flex items-center justify-center`}
            onClick={() => handleSelectAllActions(viewId)}
          >
            <Check className="text-white" />
          </div>
        </div>
        <div className="px-4 py-2 border-t border-gray-300">
          <div className="bg-white">
            <div className="grid grid-cols-2 gap-4">
              {[0, 2].map((startIdx) => (
                <div key={startIdx}>
                  {permissions.slice(startIdx, startIdx + 2).map((permission) => (
                    <div
                      key={permission}
                      className={`flex items-center justify-between px-4 py-2 border-b border-gray-200 cursor-pointer ${
                        defaultActions[viewId]?.includes(permission) ? 'cursor-not-allowed' : ''
                      }`}
                      onClick={() => handleSelectAction(viewId, permission)}
                    >
                      <span>{permission}</span>
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <div className="w-full lg:w-1/4 bg-gray-100 p-4">
        <div className="mb-4">
          <AddButton onClick={() => navigate('/AddActionRol')}></AddButton>
        </div>
        <div className="overflow-y-auto h-64 lg:h-full">
          {' '}
          {/* Ajusta la altura para dispositivos móviles y de escritorio */}
          {viewasAction.map((view) => (
            <div key={view.view.id} className="mb-2">
              <button
                className={`w-full text-left bg-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-200 transition ${
                  selectedViewId === view.view.id ? 'bg-blue-200' : ''
                }`}
                onClick={() => setSelectedViewId(view.view.id)}
              >
                {view.view.name}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full lg:w-3/4 p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow-xl rounded-xl dark:bg-gray-900">
          <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="flex items-start gap-3">
              <h1 className="dark:text-white">Agregar Acciones a Vistas</h1>
            </div>
          </div>

          <div>{selectedViewId && renderActions(selectedViewId)}</div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionTable;
