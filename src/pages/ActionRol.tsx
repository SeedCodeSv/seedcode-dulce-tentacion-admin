import Layout from '../layout/Layout';
import ListActionRol from '../components/Action_rol/ListActionRol';
function ActionRol() {
  return (
    <Layout title="Acción por rol">
      <div className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border-white border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <ListActionRol />
        </div>
      </div>
    </Layout>
  );
}

export default ActionRol;
