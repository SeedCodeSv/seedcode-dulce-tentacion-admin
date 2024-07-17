import Layout from '../layout/Layout';
import {  useEffect } from 'react';

import ListStudyLevel from '@/components/employee/studyLevel/ListStudyLevel';
import { useViewsStore } from '@/store/views.store';

function EstudyLevel() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();

  const studyLevelView = viewasAction.find((view) => view.view.name === 'Nivel de Estudio');
  const actions = studyLevelView?.actions?.name || [];
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  return (
    <Layout title="Nivel de Estudio">
   
        <ListStudyLevel actions={actions} />
      
    </Layout>
  );
}

export default EstudyLevel;
