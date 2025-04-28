import { Card, CardBody, CardHeader } from '@heroui/react';
import { EditIcon, RefreshCcw, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router';

import { useSupplierStore } from '../../store/supplier.store';

import { MobileViewProps } from './types/movile-view.types';

import { Supplier } from '@/types/supplier.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function MobileViewSupplier({ handleActive, actions, DeletePopover }: MobileViewProps) {
  const { supplier_pagination } = useSupplierStore();
  const { OnGetBySupplier } = useSupplierStore();
  const navigate = useNavigate();

  const handleNavigate = (supplier: Supplier) => {
    const path = supplier.esContribuyente
      ? `/update-supplier-tribute/${supplier.id}`
      : `/update-supplier-normal/${supplier.id}`;

    navigate(path);
    OnGetBySupplier(supplier.id ?? 0);
  };

  const changeTypeSupplier = (supplier: Supplier) => {
    const path = `/update-supplier-tribute/${supplier.id}`;

    navigate(path);
    OnGetBySupplier(supplier.id ?? 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3 overflow-y-auto p-2">
      {supplier_pagination.suppliers.map((item, index) => (
        <Card key={index}>
          <CardHeader>{item.nombre}</CardHeader>
          <CardBody>
            <p>
              <span className="font-semibold">Telefono:</span>
              {item.telefono}
            </p>
            <p>
              <span className="font-semibold">Dirreccion:</span>
              {`${item.direccion?.nombreDepartamento} ${item.direccion?.municipio} ${item.direccion?.complemento}`}
            </p>
            <div className="flex w-full gap-2 mt-3">
              <span
                className={`px-2 text-white rounded-lg ${
                  item.esContribuyente ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {item.esContribuyente ? 'CONTRIBUYENTE' : 'CONSUMIDOR FINAL'}
              </span>
            </div>
          </CardBody>
          <CardHeader className="flex gap-5">
            {actions.includes('Editar') && item.isActive && (
              <ButtonUi isIconOnly theme={Colors.Success} onPress={() => handleNavigate(item)}>
                <EditIcon className="dark:text-white" size={20} />
              </ButtonUi>
            )}
            {actions.includes('Cambiar Tipo de Proveedor') &&
              item.isActive &&
              item.esContribuyente === false && (
                <ButtonUi isIconOnly theme={Colors.Warning} onPress={() => changeTypeSupplier(item)}>
                  <Repeat className="dark:text-white" size={20} />
                </ButtonUi>
              )}
            {actions.includes('Eliminar') && item.isActive && <DeletePopover supplier={item} />}
            {actions.includes('Activar') && !item.isActive && (
              <ButtonUi isIconOnly theme={Colors.Info} onPress={() => handleActive(item.id)}>
                <RefreshCcw />
              </ButtonUi>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default MobileViewSupplier;
