import { Card, CardBody, CardHeader } from '@heroui/react';
import { RefreshCcw, EditIcon } from 'lucide-react';

import { useEmployeeStore } from '../../store/employee.store';

import { IMobileView } from './types/mobile-view.types';
import ProofSalary from './employees-pdfs/ProofSalary';
import ProofeOfEmployment from './employees-pdfs/ProofeOfEmployment';
import ContractPDF from './ContractPdf';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function MobileView(props: IMobileView) {
  const { openEditModal, DeletePopover, actions, handleActivate } = props;
  const { employee_paginated } = useEmployeeStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3 overflow-y-auto p-2">
      {employee_paginated.employees.map((item, index) => (
        <Card key={index}>
          <CardHeader>{`${item.firstName} ${item.firstLastName} ${item.firstLastName} ${item.secondLastName}`}</CardHeader>
          <CardBody>
            <p>
              <span className="font-semibold">Código:</span>
              {item.code}
            </p>
            <p>
              <span className="font-semibold">Sucursal:</span>
              {item.branch.name}
            </p>
          </CardBody>
          <CardHeader className="flex gap-5">
            {actions.includes('Editar') && item.isActive && (
              <ButtonUi isIconOnly showTooltip theme={Colors.Success}
                tooltipText='Editar'
                onPress={() => openEditModal(item)}
              >
                <EditIcon className="dark:text-white" size={20} />
              </ButtonUi>
            )}
            {actions.includes('Eliminar') && item.isActive && <DeletePopover employee={item} />}
            {actions.includes('Activar') && !item.isActive && (
              <ButtonUi isIconOnly showTooltip theme={Colors.Info}
                tooltipText='Activar'
                onPress={() => handleActivate(item.id)}
              >
                <RefreshCcw />
              </ButtonUi>
            )}

            <ContractPDF employee={item} />
            <ProofSalary actions={actions} employee={item} />
            <ProofeOfEmployment actions={actions} employee={item} />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default MobileView;
