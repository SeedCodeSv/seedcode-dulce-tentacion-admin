import Layout from '../layout/Layout';

import { useEffect } from 'react'; 
import ListStatusEmployee from '../components/employee/statusEmployee/ListStatusEmployee';
import { useViewsStore } from '@/store/views.store';

function StatusEmployee() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();
   
  const statusEmployeeView = viewasAction.find((view) => view.view.name === 'Estado del empleado');
  const actions = statusEmployeeView?.actions?.name || [];
    useEffect(() => {
      OnGetViewasAction();
    }, []);
  return (
    <Layout title="Estado del empleado">
      {statusEmployeeView ? (
        <ListStatusEmployee actions={actions} />
      ) : (
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-center w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
            <p className="text-lg font-semibold dark:text-white">
              No tiene permisos para ver este modulo
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default StatusEmployee;
