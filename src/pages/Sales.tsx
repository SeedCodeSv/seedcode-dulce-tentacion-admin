import ListSales from '@/components/sales-report/ListSales';
import Layout from '../layout/Layout';


function SalesPage() {
    return (
        <div>
            <Layout title='Ventas'>
                <>
                    <ListSales/>
                </>
            </Layout>
        </div>
    )
}
export default SalesPage;