import Layout from '../layout/Layout'

import List from '@/components/multiple-warehouse-stock-control/List'


function MultipleWarehouseStockControl(): JSX.Element {
    return (
        <div>
            <Layout title="Control de existencias">
                <List />
            </Layout>
        </div>
    )
}

export default MultipleWarehouseStockControl
