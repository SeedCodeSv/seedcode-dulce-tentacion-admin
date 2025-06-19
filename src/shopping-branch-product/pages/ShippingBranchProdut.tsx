import ContentProductBranch from '../components/ContentProductBranch';

import DivGlobal from '@/themes/ui/div-global';
import Layout from '@/layout/Layout';

function ShippingProductsBranchPage() {
  return (
    <Layout title="Nota de Remision">
     <DivGlobal>
          <ContentProductBranch />
        </DivGlobal>
    </Layout>
  );
}

export default ShippingProductsBranchPage;
