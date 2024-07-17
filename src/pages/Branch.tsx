import Layout from '../layout/Layout';
import ListBranch from '../components/branch/ListBranch';
import { useEffect, } from 'react';

import { useViewsStore } from '@/store/views.store';

function Branch() {
  const { OnGetViewasAction, viewasAction, loading_views } = useViewsStore()
  const branchView = viewasAction.find((view) => view.view.name === "Sucursales")
  const actions = branchView?.actions?.name || []
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  return (
    <Layout title="Sucursales">
      {loading_views ? (
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent flex justify-center items-center">
            <p className="text-lg font-semibold dark:text-white">Cargando...</p>
          </div>
        </div>

      ) : branchView ? (
        <ListBranch actions={actions} />
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

export default Branch;
