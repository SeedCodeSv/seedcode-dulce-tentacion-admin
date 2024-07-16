import Layout from '../layout/Layout';
import ListUsers from '../components/users/ListUsers';
import { useEffect } from 'react';
import { useViewsStore } from '@/store/views.store';
function Users() {
  const { OnGetViewasAction, viewasAction, loading_views } = useViewsStore();

  const usuariosView = viewasAction.find((view) => view.view.name === 'Usuarios');
  const actions = usuariosView?.actions?.name || [];
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  return (
    <Layout title="Usuarios">
      {loading_views ? (
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent flex justify-center items-center">
            <p className="text-lg font-semibold dark:text-white">Cargando...</p>
          </div>
        </div>
      ) : usuariosView ? (
        <ListUsers actions={actions} />
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
export default Users;
