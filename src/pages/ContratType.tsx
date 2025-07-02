import ListContractType from '../components/employee/typeContract/ListTypeContract';

import { useViewsStore } from '@/store/views.store';

function ContratType() {
  const { actions } = useViewsStore();

  const contractTypeView = actions.find((view) => view.view.name === 'Tipo de Contratacion');
  const actionsView = contractTypeView?.actions?.name || [];

  return (
    <>
      {contractTypeView ? (
        <ListContractType actions={actionsView} />
      ) : (
        <div className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
          <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
            <p className="text-lg font-semibold dark:text-white">
              No tiene permisos para ver este modulo
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default ContratType;
