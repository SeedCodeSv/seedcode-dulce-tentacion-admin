import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { useEffect } from 'react';

import ProductionOrderView from './verify/production-order-view';
import { checkOrderFulfillment } from './stockChecker';

import { useProductionOrderStore } from '@/store/production-order.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

type DisclosureProps = ReturnType<typeof useDisclosure>;

interface Props {
  id: number;
  disclosure: DisclosureProps;
}

function VerifyProductionOrder({ id, disclosure }: Props) {
  const { productionOrderDetail, getProductionsOrderDetail } = useProductionOrderStore();

  useEffect(() => {
    getProductionsOrderDetail(id);
  }, [id]);

  const { canFulfillAll } = checkOrderFulfillment(productionOrderDetail?.details || []);

  return (
    <Modal {...disclosure} scrollBehavior="inside" size="full">
      <ModalContent>
        <ModalHeader>Confirmar orden de producción</ModalHeader>
        <ModalBody>
          {productionOrderDetail && (
            <ProductionOrderView productionOrder={productionOrderDetail!} />
          )}
        </ModalBody>
        <ModalFooter className="gap-5">
          <Button className="px-6" color="danger" variant="light" onClick={disclosure.onClose}>
            Cancelar
          </Button>
          <ButtonUi className="px-6" isDisabled={!canFulfillAll} theme={Colors.Success}>
            Confirmar
          </ButtonUi>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default VerifyProductionOrder;
