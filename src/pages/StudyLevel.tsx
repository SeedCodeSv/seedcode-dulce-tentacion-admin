import Layout from '../layout/Layout';

import ListStudyLevel from '@/components/employee/studyLevel/ListStudyLevel';
import { useViewsStore } from '@/store/views.store';

function EstudyLevel() {
  const { actions } = useViewsStore();

  const studyLevelView = actions.find((view) => view.view.name === 'Nivel de Estudio');
  const actionsView = studyLevelView?.actions?.name || [];

  return (
    <Layout title="Nivel de Estudio">
      <ListStudyLevel actions={actionsView} />
    </Layout>
  );
}

export default EstudyLevel;
