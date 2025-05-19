import { Card, CardBody, CardHeader } from '@heroui/react';
import { EditIcon, RefreshCcw } from 'lucide-react';

import { MobileViewProps } from './types/mobile_view.types';

import { useSubCategoryStore } from '@/store/sub-category';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';


function CardSubCategory({ actions, handleEdit, handleActive, DeletePopover }: MobileViewProps) {
  const { sub_categories_paginated } = useSubCategoryStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3 overflow-y-auto p-2">
      {sub_categories_paginated.SubCategories.map((prd, index) => (
        <Card key={index}>
          <CardHeader>{prd.name}</CardHeader>
          <CardBody>
            <p>
              <span className="font-semibold">Categoría:</span>
              {prd.categoryProduct.name}
            </p>
          </CardBody>
          <CardHeader className="flex gap-5">
            {actions.includes('Editar') && prd.isActive && (
              <ButtonUi isIconOnly theme={Colors.Success} onPress={() => handleEdit(prd)}>
                <EditIcon className="dark:text-white" size={20} />
              </ButtonUi>
            )}
            {actions.includes('Editar') && prd.isActive && <DeletePopover subcategory={prd} />}
            {actions.includes('Activar') && !prd.isActive && (
              <ButtonUi isIconOnly theme={Colors.Info} onPress={() => handleActive(prd.id)}>
                <RefreshCcw />
              </ButtonUi>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default CardSubCategory;
