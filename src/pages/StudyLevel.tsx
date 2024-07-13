import Layout from '../layout/Layout';
import {  useEffect } from 'react';

import ListStudyLevel from '@/components/employee/studyLevel/ListStudyLevel';
import { useViewsStore } from '@/store/views.store';

function EstudyLevel() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();

  const studyLevelView = viewasAction.find((view) => view.view.name === 'Nivel de estudio');
  const actions = studyLevelView?.actions?.name || [];
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  return (
    <Layout title="Nivel de estudio">
      {studyLevelView ? (
        <ListStudyLevel actions={actions} />
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
