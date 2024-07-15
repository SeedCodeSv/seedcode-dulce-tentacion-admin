import Layout from '../layout/Layout';
import { useEffect } from 'react';

import ListContractType from '../components/employee/typeContract/ListTypeContract';
import { useViewsStore } from '@/store/views.store';

function ContratType() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();

  const contractTypeView = viewasAction.find((view) => view.view.name === 'Tipo de Contratacion');
  const actions = contractTypeView?.actions?.name || [];
  useEffect(() => {
    OnGetViewasAction();
  }, []);
  return (
    <Layout title="Tipo de Contratación">
      {contractTypeView ? (
        <ListContractType actions={actions} />
      ) : (
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent flex justify-center items-center">
            <p className="text-lg font-semibold dark:text-white">
              No tiene permisos para ver este modulo
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ContratType;
