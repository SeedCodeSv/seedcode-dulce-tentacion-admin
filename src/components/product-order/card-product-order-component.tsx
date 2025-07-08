import { Card, CardBody, CardHeader, Checkbox } from '@heroui/react';
// eslint-disable-next-line import/order
import { Eye, ReceiptText, StickyNote } from 'lucide-react';

// import { IMobileViewOrderProducst } from './types/mobile-view.types';

import { useNavigate } from 'react-router';

import { IMobileOrderProductsComp } from '../products/types/mobile-view.types';

import { RenderStatus, Status } from './render-order-status';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useOrderProductStore } from '@/store/order-product.store';
import { formatEmployee } from '@/utils/dates';

function CardProductOrderComponent({
  handleDetails,
  onAddBydetail,
  onAddBranchDestiny,
  onAddOrderId,
  addSelectedProducts,
  selectedIds,
  handleCheckboxChange
}: IMobileOrderProductsComp) {

  const { ordersProducts } = useOrderProductStore();

  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-3 overflow-y-auto p-2">
      {ordersProducts.order_products.map((prd, index) => (
        <Card key={index}>
          <CardHeader className='flex justify-between'>
            {prd.id}
            {RenderStatus({ status: prd.status as Status }) || prd.status}

            <Checkbox
              key={prd.id}
              checked={selectedIds.includes(prd.id)}
              onValueChange={() => handleCheckboxChange(prd.id)}
            />
          </CardHeader>
          <CardBody>
            <p>
              <span className="font-semibold">Fecha - Hora de inicio:</span>
              {prd.date} - {prd.time}
            </p>

            <p>
              <span className="font-semibold">Sucursal que solicita:</span>
              {prd.branch.name}
            </p>

            <p className='flex gap-2 mt-2'>
              <span className="font-semibold">Encargado:</span>
              {/* {prd.employee.firstName} {prd.employee.secondName} {prd.employee.firstLastName}{' '}
              {prd.employee.secondLastName} */}
              {formatEmployee(prd.employee as any)}
            </p>
          </CardBody>
          <CardHeader className="flex justify-between">

            <ButtonUi
              isIconOnly
              showTooltip
              theme={Colors.Info}
              tooltipText="Detalles"
              onPress={() => handleDetails(prd)}
            >
              <Eye />
            </ButtonUi>
            <ButtonUi
              isIconOnly
              showTooltip
              isDisabled={prd.status === 'Completada'}
              theme={Colors.Primary}
              tooltipText="Nota de Remisión"
              onPress={() => {
                navigate('/order-products-nota');
                onAddBydetail(prd.orderProductDetails);
                onAddBranchDestiny(prd.branch);
                onAddOrderId(prd.id);
              }}
            >
              <StickyNote />
            </ButtonUi>
            <ButtonUi
              isIconOnly
              showTooltip
              isDisabled={prd.status === 'Completada'}
              theme={Colors.Error}
              tooltipText="Orden de Producción"
              onPress={() => {
                navigate('/order-products-production');
                addSelectedProducts(prd.orderProductDetails);
                onAddBranchDestiny(prd.branch);
                onAddOrderId(prd.id);
              }}
            >
              <ReceiptText />
            </ButtonUi>

          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default CardProductOrderComponent;
