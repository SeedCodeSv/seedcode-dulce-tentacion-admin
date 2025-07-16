import ListBranch from '../components/branch/ListBranch';

import { useViewsStore } from '@/store/views.store';

function Branch() {
  const { actions } = useViewsStore();
  const branchView = actions.find((view) => view.view.name === 'Sucursales');
  const actionsView = branchView?.actions?.name || [];

  return (
      <ListBranch actions={actionsView} />
  );
}

export default Branch;
