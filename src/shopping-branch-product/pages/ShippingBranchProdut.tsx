import ContentProductBranch from '../components/ContentProductBranch';

import Layout from '@/layout/Layout';

function ShippingProductsBranchPage() {
  return (
    <Layout title="Nota de Remision">
      <div className="w-full h-full p-4 md:p-6  md:px-4 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full flex flex-col p-3 border border-white rounded-xl overflow-y-auto bg-white custom-scrollbar shadow  dark:bg-gray-900 scrollbar-hide">
          <ContentProductBranch />
        </div>
      </div>
    </Layout>
  );
}

export default ShippingProductsBranchPage;
