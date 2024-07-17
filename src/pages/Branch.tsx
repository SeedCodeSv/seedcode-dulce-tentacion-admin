import Layout from '../layout/Layout';
import ListBranch from '../components/branch/ListBranch';
import { useEffect, } from 'react';

import { useViewsStore } from '@/store/views.store';

function Branch() {
  const { OnGetViewasAction, viewasAction } = useViewsStore()
  const branchView = viewasAction.find((view) => view.view.name === "Sucursales")
  const actions = branchView?.actions?.name || []
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  return (
    <Layout title="Sucursales">
     
        <ListBranch actions={actions} />
     
    </Layout>
  );
}

export default Branch;
