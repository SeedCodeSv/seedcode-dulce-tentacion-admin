import { useProductsStore } from '@/store/products.store';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { IMobileView } from './types/mobile-view.types';
import ButtonUi from '@/themes/ui/button-ui';
import { EditIcon, RefreshCcw } from 'lucide-react';
import { Colors } from '@/types/themes.types';

function CardProduct({ actions, openEditModal, DeletePopover, handleActivate }: IMobileView) {
  const { paginated_products } = useProductsStore();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3 overflow-y-auto p-2">
      {paginated_products.products.map((prd, index) => (
        <Card key={index}>
          <CardHeader>{prd.name}</CardHeader>
          <CardBody>
            <p>
              <span className="font-semibold">Código:</span>
              {prd.code}
            </p>
            <p>
              <span className="font-semibold">Sub categoría:</span>
              {prd.subCategory.name}
            </p>
          </CardBody>
          <CardHeader className="flex gap-5">
            {actions.includes('Editar') && prd.isActive && (
              <ButtonUi onPress={() => openEditModal(prd)} isIconOnly theme={Colors.Success}>
                <EditIcon className="dark:text-white" size={20} />
              </ButtonUi>
            )}
            {actions.includes('Editar') && prd.isActive && <DeletePopover product={prd} />}
            {actions.includes('Activar') && !prd.isActive && (
              <ButtonUi theme={Colors.Info} onPress={() => handleActivate(prd.id)} isIconOnly>
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
