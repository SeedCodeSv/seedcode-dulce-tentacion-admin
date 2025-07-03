import Layout from '../layout/Layout';
import ListStatusEmployee from '../components/employee/statusEmployee/ListStatusEmployee';

import { useViewsStore } from '@/store/views.store';

function StatusEmployee() {
  const { actions } = useViewsStore();

  const statusEmployeeView = actions.find((view) => view.view.name === 'Estados del Empleado');
  const actionsView = statusEmployeeView?.actions?.name || [];
  
  return (
    <>
        <ListStatusEmployee actions={actionsView} />
    </>
  );
}

export default StatusEmployee;
