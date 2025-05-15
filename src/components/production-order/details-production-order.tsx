import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react';
import { useEffect } from 'react';

import ProductionOrderDetails from './details';
import { ProductionOrder } from './details/types';

import { useProductionOrderStore } from '@/store/production-order.store';

type DisclosureProps = ReturnType<typeof useDisclosure>;

interface Props {
  id: number;
  modalMoreInformation: DisclosureProps;
}

function DetailsProductionOrder({ id, modalMoreInformation }: Props) {
  const { productionOrderDetail, getProductionsOrderDetail, loadingProductionOrder } =
    useProductionOrderStore();

  useEffect(() => {
    getProductionsOrderDetail(id);
  }, [id]);

  return (
    <Modal {...modalMoreInformation} scrollBehavior="inside" size="full">
      <ModalContent>
        <ModalHeader>Orden de Producción #{id}</ModalHeader>
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
