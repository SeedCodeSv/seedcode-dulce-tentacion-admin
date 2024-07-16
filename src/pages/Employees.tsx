import Layout from '../layout/Layout';
import ListEmployee from '../components/employee/ListEmployee';
import { useEffect } from 'react';
import { useViewsStore } from '@/store/views.store';
function Employees() {
  const { OnGetViewasAction, viewasAction, loading_views } = useViewsStore();
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  const empleadosView = viewasAction.find((view) => view.view.name === 'Empleados');
  const actions = empleadosView?.actions?.name || [];
  return (
    <Layout title="EMPLEADOS">
      {loading_views ? (
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent flex justify-center items-center">
            <p className="text-lg font-semibold dark:text-white">Cargando...</p>
          </div>
        </div>
      ) : empleadosView ? (
        <ListEmployee actions={actions} />
      ) : (
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent flex justify-center items-center">
            <p className="text-lg font-semibold dark:text-white">
              No tiene permisos para ver este modulo
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Employees;
