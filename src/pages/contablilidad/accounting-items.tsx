import List from '@/components/accounting-items/list-table';
import Layout from '@/layout/Layout';

function AccountingItems() {
  return (
    <Layout title="Partidas Contables">
      <div className=" w-full h-full p-3 pt-6 flex flex-col bg-white dark:bg-gray-900">
        <List />
      </div>
    </Layout>
  );
}

export default AccountingItems;
