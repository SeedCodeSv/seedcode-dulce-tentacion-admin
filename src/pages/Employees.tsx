import ListEmployee from '../components/employee/ListEmployee';

import { useViewsStore } from '@/store/views.store';
function Employees() {
  const { actions } = useViewsStore();
  const empleadosView = actions.find((view) => view.view.name === 'Empleados');
  const actionsView = empleadosView?.actions?.name || [];

  return (
    <>
      <ListEmployee actions={actionsView} />
    </>
  );
}
export default Employees;
