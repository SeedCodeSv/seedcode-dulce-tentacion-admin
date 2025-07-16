import { Card, CardBody, CardHeader } from '@heroui/react';
import { EditIcon, Key, RectangleEllipsis, RefreshCcw } from 'lucide-react';

import { useUsersStore } from '../../store/users.store';

import { IMobileViewProps } from './types/mobile-view.types';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';


function CardProduct({
  actions,
  openEditModal,
  handleActivate,
  openKeyModal,
  DeletePopover,
  setSelectedId,
generateCodeModal
}: IMobileViewProps) {
  const { users_paginated } = useUsersStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3 overflow-y-auto p-2">
      {users_paginated.users.map((item, index) => (
        <Card key={index}>
          <CardHeader>{item.userName}</CardHeader>
          <CardBody>
            <p>
              <span className="font-semibold">Rol:</span>
              {item.role.name}
            </p>
            {/* <p>
            <span className="font-semibold">Sub categoría:</span>
            {item.}
          </p> */}
          </CardBody>
          <CardHeader className="flex gap-5">
            {actions.includes('Editar') && item.active && (
              <ButtonUi isIconOnly theme={Colors.Success} onPress={() => openEditModal(item)}>
                <EditIcon className="dark:text-white" size={20} />
              </ButtonUi>
            )}
            {actions.includes('Editar') && item.active && (
              <ButtonUi isIconOnly theme={Colors.Warning} onPress={() => openKeyModal(item)}>
                <Key className="dark:text-white" size={20} />
              </ButtonUi>
            )}
            {actions.includes('Editar') && item.active && <DeletePopover user={item} />}
            {actions.includes('Activar') && !item.active && (
              <ButtonUi isIconOnly theme={Colors.Info} onPress={() => handleActivate(item.id)}>
                <RefreshCcw />
              </ButtonUi>
            )}
            <ButtonUi
              isIconOnly
              showTooltip
              theme={Colors.Info}
              tooltipText="Generar código"
              onPress={() => {
                setSelectedId(item.id);
                generateCodeModal.onOpen!();
              }}
            >
              <RectangleEllipsis />
            </ButtonUi>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default CardProduct;
