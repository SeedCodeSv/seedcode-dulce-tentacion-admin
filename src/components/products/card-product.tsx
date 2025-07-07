import { Card, CardBody, CardHeader } from '@heroui/react';
import { Book, EditIcon, RefreshCcw, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router';

import { IMobileView } from './types/mobile-view.types';

import { useProductsStore } from '@/store/products.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function CardProduct({
  actions,
  openEditModal,
  DeletePopover,
  handleActivate,
  handleShowRecipe,
  modalConvertOpen
}: IMobileView) {
  const { paginated_products } = useProductsStore();
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-3 overflow-y-auto p-2">
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
            {/* {actions.includes('Editar') && prd.isActive && ( */}
            <ButtonUi isIconOnly
              theme={Colors.Info}
              onPress={() => {
                if (modalConvertOpen) {
                  modalConvertOpen()
                }
              }}           
                   >
              <RefreshCcw className="dark:text-white" size={20} />
            </ButtonUi>
            {/* )} */}

            {actions.includes('Editar') && prd.isActive && (
              <ButtonUi isIconOnly theme={Colors.Success} onPress={() => openEditModal(prd)}>
                <EditIcon className="dark:text-white" size={20} />
              </ButtonUi>
            )}
            {/* {actions.includes('Asignar productos') && ( */}

            {/* // )} */}
            <ButtonUi
              isIconOnly
              showTooltip
              className="border border-white"
              theme={Colors.Info}
              tooltipText="Ver Receta"
              onPress={() => handleShowRecipe(prd.id)}
            >
              <Book size={20} />
            </ButtonUi>
            <ButtonUi
              isIconOnly
              showTooltip
              className="border border-white"
              theme={Colors.Secondary}
              tooltipText="Asignar productos"
              onPress={() => navigate(`/create-branch-product/${prd.id}`)}
            >
              <ShoppingBag size={20} />
            </ButtonUi>
            {actions.includes('Editar') && prd.isActive && <DeletePopover product={prd} />}
            {actions.includes('Activar') && !prd.isActive && (
              <ButtonUi isIconOnly theme={Colors.Info} onPress={() => handleActivate(prd.id)}>
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
