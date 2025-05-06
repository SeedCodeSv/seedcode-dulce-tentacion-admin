import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react';
import { useEffect } from 'react';

import { RenderStatus, Status } from './render-order-status';

import ThGlobal from '@/themes/ui/th-global';
import { useProductionOrderStore } from '@/store/production-order.store';

type DisclosureProps = ReturnType<typeof useDisclosure>;

interface Props {
  id: number;
  modalMoreInformation: DisclosureProps;
}

function DetailsProductionOrder({ id, modalMoreInformation }: Props) {
  const { productionOrder, getProductionsOrder, loadingProductionOrder } =
    useProductionOrderStore();

  useEffect(() => {
    getProductionsOrder(id);
  }, [id]);

  return (
    <Modal {...modalMoreInformation} scrollBehavior="inside" size="4xl">
      <ModalContent>
        <ModalHeader>Orden #{id}</ModalHeader>
        <ModalBody>
          {loadingProductionOrder && (
            <div className="py-4 flex justify-center items-center w-full h-full">
              <div className="loader" />
            </div>
          )}
          {!loadingProductionOrder && productionOrder ? (
            <>
              <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                <p className="text-sm font-semibold">
                  Sucursal de origen:{' '}
                  <span className="font-normal">{productionOrder.receptionBranch.name}</span>
                </p>
                <p className="text-sm font-semibold">
                  Sucursal de destino:{' '}
                  <span className="font-normal">{productionOrder.destinationBranch.name}</span>
                </p>
                <p className="text-sm font-semibold">
                  Fecha de inicio: <span className="font-normal">{productionOrder.date}</span>
                </p>
                <p className="text-sm font-semibold">
                  Hora de inicio: <span className="font-normal">{productionOrder.time}</span>
                </p>
                <p className="text-sm font-semibold">
                  Fecha de fin:{' '}
                  <span className="font-normal">{productionOrder.endDate ?? '-'}</span>
                </p>
                <p className="text-sm font-semibold">
                  Hora de fin: <span className="font-normal">{productionOrder.endTime ?? '-'}</span>
                </p>
                <p className="text-sm font-semibold">
                  Encargado:{' '}
                  <span className="font-normal">
                    {productionOrder.employee.firstName +
                      ' ' +
                      productionOrder.employee.secondName +
                      ' ' +
                      productionOrder.employee.firstLastName +
                      ' ' +
                      productionOrder.employee.secondLastName}
                  </span>
                </p>
                <p className="text-sm font-semibold flex gap-5">
                  <p>Estado de la orden:</p>
                  {RenderStatus({ status: productionOrder.statusOrder as Status }) ||
                    productionOrder.statusOrder}
                </p>
                <div className="col-span-2">
                  <p className="text-sm font-semibold">
                    Observaciones:{' '}
                    <span className="font-normal">{productionOrder.observations}</span>
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-semibold">
                    Mas información:{' '}
                    <span className="font-normal">
                      {(JSON.parse(productionOrder.moreInformation) as string[]).join(', ')}
                    </span>
                  </p>
                </div>
              </div>
              <p className="font-semibold">Detalle de la orden</p>
              <div className="overflow-y-auto overflow-x-auto custom-scrollbar">
                <table className="w-full">
                  <thead className="sticky top-0 z-20 bg-white">
                    <tr>
                      <ThGlobal className="text-left p-3">Producto en producción</ThGlobal>
                      <ThGlobal className="text-left p-3">Cantidad de producción</ThGlobal>
                    </tr>
                  </thead>
                  <tbody>
                    {productionOrder.productionOrderDetails.map((porD, index) => (
                      <tr key={index}>
                        <td className="p-3">{porD.products.name}</td>
                        <td className="p-3">{porD.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="w-full h-full flex items-center justify-center">
                <p>No se encontraron detalles de la orden</p>
              </div>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default DetailsProductionOrder;
