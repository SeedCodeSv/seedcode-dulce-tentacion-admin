import { Card, CardBody, CardHeader } from '@heroui/react';
import { Eye, Play } from 'lucide-react';
import { TbCancel, TbCheck } from 'react-icons/tb';

import { IMobileViewOrderProducst } from './types/mobile-view.types';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useProductionOrderStore } from '@/store/production-order.store';
import { RenderStatus, Status } from '@/components/production-order/render-order-status';

function ProductionsOrderCard({
  modalVerifyOrder,
  modalCancelOrder,
  modalCompleteOrder,
  modalMoreInformation,
  setSelectedOrderId
}: IMobileViewOrderProducst) {

  const { productionOrders } =
    useProductionOrderStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-3 overflow-y-auto p-2">
      {productionOrders.map((prd, index) => (
        <Card key={index}>
          <CardHeader>{prd.observations}</CardHeader>
          <CardBody>
            <p>
              <span className="font-semibold">Fecha - Hora de inicio:</span>
              {prd.date} - {prd.time}
            </p>

            <p>
              <span className="font-semibold">Fecha - Hora de fin:</span>
              {prd.endDate || 'No definido'} -  {prd.endTime || 'No definido'}
            </p>

            <p className='flex gap-2 mt-2'>
              <span className="font-semibold">Estado:</span>
              {RenderStatus({ status: prd.statusOrder as Status }) || prd.statusOrder}

            </p>
          </CardBody>
          <CardHeader className="flex justify-between">
            <div>
              {prd.statusOrder === 'Abierta' && (
                <>
                  <ButtonUi
                    isIconOnly
                    showTooltip
                    theme={Colors.Success}
                    tooltipText="Iniciar orden de producción"
                    onPress={() => {
                      setSelectedOrderId(prd.id);
                      modalVerifyOrder()
                    }}
                  >
                    <Play />
                  </ButtonUi>
                  <ButtonUi
                    isIconOnly
                    showTooltip
                    theme={Colors.Error}
                    tooltipText="Cancelar orden de producción"
                    onPress={() => {
                      setSelectedOrderId(prd.id);
                      modalCancelOrder()
                    }}
                  >
                    <TbCancel size={20} />
                  </ButtonUi>
                </>
              )}
            </div>
            <div>
              {prd.statusOrder === 'En Proceso' && (
                <div className=''>
                  <ButtonUi
                    isIconOnly
                    showTooltip
                    className='right-24'
                    theme={Colors.Success}
                    tooltipText="Completar orden de producción"
                    onPress={() => {
                      setSelectedOrderId(prd.id);
                      modalCompleteOrder()
                    }}
                  >
                    <TbCheck size={20} />
                  </ButtonUi>
                  <ButtonUi
                    isIconOnly
                    showTooltip
                    theme={Colors.Error}
                    tooltipText="Cancelar orden de producción"
                    onPress={() => {
                      setSelectedOrderId(prd.id);
                      modalCancelOrder()
                    }}
                  >
                    <TbCancel size={20} />
                  </ButtonUi>
                </div>
              )}
            </div>
            <div>
              <ButtonUi
                isIconOnly
                showTooltip
                theme={Colors.Warning}
                tooltipText="Ver orden de producción"
                onPress={() => {
                  setSelectedOrderId(prd.id);
                  modalMoreInformation()
                }}
              >
                <Eye size={20} />
              </ButtonUi>
            </div>


          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default ProductionsOrderCard;
