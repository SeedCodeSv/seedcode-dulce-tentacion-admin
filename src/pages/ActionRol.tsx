import Layout from '../layout/Layout';
import ListActionRol from '../components/action-rol/list-rol-actions';

import DivGlobal from '@/themes/ui/div-global';
function ActionRol() {
  return (
    <Layout title="Acción por rol">
      <DivGlobal>
          <ListActionRol />
        </DivGlobal>
    </Layout>
  );
}

export default ActionRol;
