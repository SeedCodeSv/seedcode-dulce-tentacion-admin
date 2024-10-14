import ListSales from '@/components/sales-report/ListSales';
import Layout from '../layout/Layout';

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
