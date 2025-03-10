import { Card, CardBody, CardHeader } from '@heroui/react';
import { useUsersStore } from '../../store/users.store';
import { EditIcon, RefreshCcw } from 'lucide-react';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { IMobileViewProps } from './types/mobile-view.types';

function CardProduct({
  actions,
  openEditModal,
  handleActivate,
  openKeyModal,
  DeletePopover,
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
              <ButtonUi onPress={() => openEditModal(item)} isIconOnly theme={Colors.Success}>
                <EditIcon className="dark:text-white" size={20} />
              </ButtonUi>
            )}
            {actions.includes('Editar') && item.active && (
              <ButtonUi onPress={() => openKeyModal(item)} isIconOnly theme={Colors.Warning}>
                <EditIcon className="dark:text-white" size={20} />
              </ButtonUi>
            )}
            {actions.includes('Editar') && item.active && <DeletePopover user={item} />}
            {actions.includes('Activar') && !item.active && (
              <ButtonUi theme={Colors.Info} onPress={() => handleActivate(item.id)} isIconOnly>
                <RefreshCcw />
              </ButtonUi>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default CardProduct;
