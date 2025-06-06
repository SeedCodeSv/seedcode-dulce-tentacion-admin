import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react';
import { useEffect } from 'react';

import ProductionOrderDetails from './details';
import { ProductionOrder } from './details/types';
import StatusBadge from './details/status-badge';

import { useProductionOrderStore } from '@/store/production-order.store';

type DisclosureProps = ReturnType<typeof useDisclosure>;

interface Props {
  id: number;
  modalMoreInformation: DisclosureProps;
  onClose: () => void
}

function DetailsProductionOrder({ id, modalMoreInformation, onClose }: Props) {
  const { productionOrderDetail, getProductionsOrderDetail, loadingProductionOrder } =
    useProductionOrderStore();

  useEffect(() => {
    getProductionsOrderDetail(id);
  }, [id]);

  return (
    <Modal {...modalMoreInformation} className='dark:bg-gray-900' scrollBehavior="inside" size="full" onClose={onClose} >
      <ModalContent>
        <ModalHeader className='w-full flex justify-between px-12 py-6'>
          Orden de Producción #{id}
          {productionOrderDetail &&
            <StatusBadge status={productionOrderDetail.statusOrder} />
          }
          </ModalHeader>
        <ModalBody>
          {!loadingProductionOrder && productionOrderDetail && (
            <ProductionOrderDetails
              productionOrder={productionOrderDetail as unknown as ProductionOrder}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default DetailsProductionOrder;
