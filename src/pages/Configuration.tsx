import { useViewsStore } from '@/store/views.store.ts';
import ConfigurationList from '../components/configuration/ConfigurationList.tsx';
import Layout from '../layout/Layout.tsx';

function Configuration() {
  const { actions } = useViewsStore();
  const viewSetting = actions.find((action) => action.view.name === 'Configuración');
  const actionsView = viewSetting?.actions.name || [];
  return (
    <>
      <Layout title="Configuración">
        <ConfigurationList actions={actionsView} />
      </Layout>
    </>
  );
}

export default Configuration;
