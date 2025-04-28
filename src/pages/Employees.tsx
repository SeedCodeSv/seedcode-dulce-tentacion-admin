import Layout from '../layout/Layout';
import ListEmployee from '../components/employee/ListEmployee';

import { useViewsStore } from '@/store/views.store';
function Employees() {
  const { actions } = useViewsStore();
  const empleadosView = actions.find((view) => view.view.name === 'Empleados');
  const actionsView = empleadosView?.actions?.name || [];

  return (
    <Layout title="EMPLEADOS">
      <ListEmployee actions={actionsView} />
    </Layout>
  );
}
export default Employees;
