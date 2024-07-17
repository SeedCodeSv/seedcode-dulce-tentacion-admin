import Layout from '../layout/Layout';
import ListUsers from '../components/users/ListUsers';
import { useEffect } from 'react';
import { useViewsStore } from '@/store/views.store';
function Users() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();

  const usuariosView = viewasAction.find((view) => view.view.name === 'Usuarios');
  const actions = usuariosView?.actions?.name || [];
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  return (
    <Layout title="Usuarios">
      <ListUsers actions={actions} />
    </Layout>
  );
}
export default Users;
