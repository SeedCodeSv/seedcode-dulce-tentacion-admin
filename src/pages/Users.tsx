import ListUsers from '../components/users/ListUsers';

import { useViewsStore } from '@/store/views.store';

function Users() {
  const { actions } = useViewsStore();

  const viewName = actions.find((v) => v.view.name == 'Usuarios');
  const actionView = viewName?.actions.name || [];

  return <ListUsers actions={actionView} />;
}
export default Users;
