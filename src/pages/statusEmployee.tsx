import Layout from '../layout/Layout';

import { useEffect } from 'react';
import ListStatusEmployee from '../components/employee/statusEmployee/ListStatusEmployee';
import { useViewsStore } from '@/store/views.store';

function StatusEmployee() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();

  const statusEmployeeView = viewasAction.find((view) => view.view.name === 'Estados del Empleado');
  const actions = statusEmployeeView?.actions?.name || [];
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  return (
    <Layout title="Estados del Empleado">
     
        <ListStatusEmployee actions={actions} />
     
    </Layout>
  );
}

export default StatusEmployee;
