import ConfigurationList from '../components/configuration/ConfigurationList.tsx';

import { useViewsStore } from '@/store/views.store.ts';

function Configuration() {
  const { actions } = useViewsStore();
  const viewSetting = actions.find((action) => action.view.name === 'Configuración');
  const actionsView = viewSetting?.actions.name || [];

  return (
    <>
      <ConfigurationList actions={actionsView} />
    </>
  );
}

export default Configuration;
