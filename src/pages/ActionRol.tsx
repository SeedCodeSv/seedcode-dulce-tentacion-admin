import Layout from '../layout/Layout';
import ListActionRol from '../components/action-rol/list-rol-actions';
function ActionRol() {
  return (
    <Layout title="Acción por rol">
      <div className=" w-full h-full bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border-white border p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <ListActionRol />
        </div>
      </div>
    </Layout>
  );
}

export default ActionRol;
