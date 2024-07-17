import Layout from '../layout/Layout';
import ListEmployee from '../components/employee/ListEmployee';
import { useEffect } from 'react';
import { useViewsStore } from '@/store/views.store';
function Employees() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  const empleadosView = viewasAction.find((view) => view.view.name === 'Empleados');
  const actions = empleadosView?.actions?.name || [];
  return (
    <Layout title="EMPLEADOS">
      
        <ListEmployee actions={actions} />
     
    </Layout>
  );
}

export default Employees;
