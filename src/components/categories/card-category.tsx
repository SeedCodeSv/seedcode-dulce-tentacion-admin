import { Card, CardHeader, CardFooter } from '@heroui/react';
import { EditIcon, RefreshCcw } from 'lucide-react';

import { MobileViewProps } from './types/mobile_view.types';

import { useCategoriesStore } from '@/store/categories.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';


function CardCategory({ actions, handleActive, handleEdit, deletePopover }: MobileViewProps) {
  const { paginated_categories } = useCategoriesStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3 overflow-y-auto p-2">
      {paginated_categories.categoryProducts.map((prd, index) => (
        <Card key={index}>
          <CardHeader>{prd.name}</CardHeader>
          <CardFooter className="flex gap-5">
            {actions.includes('Editar') && prd.isActive && (
              <ButtonUi isIconOnly theme={Colors.Success} onPress={() => handleEdit(prd)}>
                <EditIcon className="dark:text-white" size={20} />
              </ButtonUi>
            )}
            {actions.includes('Editar') && prd.isActive && deletePopover({ category: prd })}
            {actions.includes('Activar') && !prd.isActive && (
              <ButtonUi isIconOnly theme={Colors.Info} onPress={() => handleActive(prd.id)}>
                <RefreshCcw />
              </ButtonUi>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default CardCategory;
