import Layout from '../layout/Layout';
import { useContext, useMemo } from 'react';
import { ActionsContext } from '../hooks/useActions';
import { filterActions } from '../utils/filters';
import ListStudyLevel from '@/components/employee/studyLevel/ListStudyLevel';

function EstudyLevel() {
  const { roleActions } = useContext(ActionsContext);

  const actions_role_view = useMemo(() => {
    if (roleActions) {
      const actions = filterActions('Nivel de estudio', roleActions)?.actions.map((re) => re.name);
      return actions;
    }
    return undefined;
  }, [roleActions]);
  return (
    <Layout title="Nivel de estudio">
      {actions_role_view ? (
        <ListStudyLevel actions={actions_role_view} />
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

export default EstudyLevel;
