import Layout from '../layout/Layout';

import ListSales from '@/components/sales-report/ListSales';

function SalesPage() {
  return (
    <div>
      <Layout title="Ventas por facturación electronica">
        <>
          <ListSales />
        </>
      </Layout>
    </div>
  );
}
export default SalesPage;
