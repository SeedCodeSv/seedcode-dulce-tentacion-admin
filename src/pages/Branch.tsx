import Layout from '../layout/Layout';
import ListBranch from '../components/branch/ListBranch';
import { useContext, useMemo } from 'react';
import { ActionsContext } from '@/hooks/useActions';
import { filterActions } from '@/utils/filters';

function Branch() {
   const { roleActions } = useContext(ActionsContext);

   const actions_role_view = useMemo(() => {
     if (roleActions) {
       const actions = filterActions('Sucursales', roleActions)?.actions.map((re) => re.name);
       return actions;
     }
     return undefined;
   }, [roleActions]);
  return (
    <Layout title="Sucursales">
      {actions_role_view ? (
        <ListBranch/>
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

export default Branch;
