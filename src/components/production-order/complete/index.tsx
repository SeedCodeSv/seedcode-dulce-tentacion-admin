import React, { useEffect, useMemo, useState } from 'react';
import { Info, Printer, Save } from 'lucide-react';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Button,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
} from '@heroui/react';
import { toast } from 'sonner';
import axios from 'axios';

import OrderHeader from './order-header';
import OrderDetails from './order-details';
import ProductsList from './products-list';
import CompletionNotes from './completion-notes';

import { useProductionOrderStore } from '@/store/production-order.store';
import { Detail } from '@/types/production-order.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { get_employee_by_code } from '@/services/employess.service';
import { API_URL } from '@/utils/constants';
type DevolutionProduct = {
  id: number;
  name: string;
  quantity: number;
  uniMedida: string;
  unidadDeMedida: string;
};
type Product = Detail & {
  producedQuantity: number;
  damagedQuantity: number;
  expectedQuantity: number;
  damagedReason: string;
  hasDevolution: boolean;
  devolutionProducts: DevolutionProduct[];
};

type disclosureProps = ReturnType<typeof useDisclosure>;

interface Props {
  id: number;
  disclosure: disclosureProps;
  reload:() => void
}

const CompleteOrder: React.FC<Props> = ({ id, disclosure, reload}) => {
  const { productionOrderDetail, getProductionsOrderDetail } = useProductionOrderStore();
  const [notes, setNotes] = useState<string>('');
  const [employeeCode, setEmployeeCode] = useState('');

  const [products, setProducts] = useState<Product[]>([]);

  const modalConfirmation = useDisclosure();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProductionsOrderDetail(id);
  }, [id]);

  useEffect(() => {
    if (productionOrderDetail && productionOrderDetail.details.length > 0) {
      setProducts(
        productionOrderDetail.details.map((detail) => ({
          ...detail,
          producedQuantity: detail.quantity,
          damagedQuantity: 0,
          expectedQuantity: detail.quantity,
          hasDevolution: false,
          devolutionProducts: [],
          damagedReason: '',
        }))
      );
    }
  }, [productionOrderDetail]);

  const handleSubmit = () => {
    if (employeeCode === '') {
      toast.error('Debe ingresar tu código de empleado');

      return;
    }
    setLoading(true);
    get_employee_by_code(employeeCode)
      .then((res) => {
        const employee = res.data.employee;

        if (!employee) {
          toast.error('Código incorrecto o no encontrado');
          setLoading(false);

          return;
        }

        const payload = {
          products: products.map((product) => ({
            id: product.id,
            producedQuantity: product.producedQuantity,
            damagedQuantity: product.damagedQuantity,
            missingQuantity: product.expectedQuantity - product.producedQuantity,
            damagedReason: product.damagedReason,
            devolutionProducts: product.hasDevolution ? product.devolutionProducts : [],
          })),
          notes,
          employee: employee.id,
        };

        axios
          .patch(API_URL + `/production-orders/finish/${productionOrderDetail?.id}`, payload)
          .then(() => {
            toast.success('Orden de producción finalizada');
            setLoading(false);
            modalConfirmation.onClose();
            disclosure.onClose()
            reload()
          })
          .catch(() => {
            setLoading(false);
          });
      })
      .catch(() => {
        toast.error('Código incorrecto o no encontrado');
        setLoading(false);
      });
  };

  const handlePrint = () => {
    window.print();
  };

  const allProductsComplete = products.every(
    (product) => product.producedQuantity > 0 || product.damagedQuantity > 0
  );

  const employeeName = useMemo(() => {
    if (productionOrderDetail) {
      return `${productionOrderDetail.employee.firstName} ${productionOrderDetail.employee.secondName} ${productionOrderDetail.employee.firstLastName} ${productionOrderDetail.employee.secondLastName}`;
    }

    return '';
  }, [productionOrderDetail]);

  return (
    <>
      <Drawer className='dark:bg-gray-900' {...disclosure} scrollBehavior="inside" size="full">
        <DrawerContent>
          <DrawerHeader>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-300">Finalizar orden de producción</h1>
          </DrawerHeader>
          <DrawerBody>
            {productionOrderDetail && (
              <div className=" py-8 px-4">
                <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow p-6 mb-6 print:shadow-none">
                  <OrderHeader
                    category={productionOrderDetail.productionOrderType.name}
                    orderNumber={productionOrderDetail.id.toString()}
                    status={productionOrderDetail.statusOrder}
                  />

                  <OrderDetails
                    creationDate={
                      productionOrderDetail?.date || '' + ' : ' + productionOrderDetail?.time || ''
                    }
                    destinationBranch={productionOrderDetail?.destinationBranch.name || ''}
                    employee={employeeName}
                    observations={JSON.parse(productionOrderDetail?.moreInformation || '[]')}
                    receptionBranch={productionOrderDetail?.receptionBranch.name || ''}
                  />
                  <ProductsList
                    products={products}
                    onProductUpdate={(updatedProducts) => {
                      setProducts(updatedProducts);
                    }}
                  />

                  <CompletionNotes onNotesChange={setNotes} />
                </div>
              </div>
            )}
          </DrawerBody>
          <DrawerFooter className="w-full">
            <div className="w-full flex justify-between mt-8 print:hidden">
              <div className="flex space-x-4">
                <ButtonUi theme={Colors.Error} onPress={handlePrint}>
                  <Printer className="w-5 h-5 mr-2" />
                  Imprimir resumen
                </ButtonUi>
              </div>
              <div className="flex space-x-4">
                <ButtonUi theme={Colors.Warning} onPress={disclosure.onClose}>Cancelar</ButtonUi>
                <ButtonUi
                  disabled={!allProductsComplete}
                  theme={Colors.Success}
                  onPress={modalConfirmation.onOpen}
                >
                  <Save className="w-5 h-5 mr-2" />
                  Finalizar orden
                </ButtonUi>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Modal {...modalConfirmation} className='dark:bg-gray-900 dark:text-gray-100' isDismissable={false}>
        <ModalContent>
          <ModalHeader>Confirmar orden de producción</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4 justify-center items-center">
              <Info className="w-12 h-12 text-blue-500" />
              <p className="text-center">
                Para completar la orden de producción debe ingresar el código de confirmación
              </p>
              <Input
                className="w-full dark:text-white"
                classNames={{
                  label: 'font-semibold text-gray-700',
                }}
                label="Código de confirmación"
                labelPlacement="outside"
                placeholder="Ingrese el código de confirmación"
                value={employeeCode}
                variant="bordered"
                onChange={(e) => setEmployeeCode(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter className="gap-5">
            <Button
              className="px-6"
              color="danger"
              isLoading={loading}
              variant="light"
              onPress={modalConfirmation.onClose}
            >
              Cancelar
            </Button>
            <ButtonUi
              className="px-6"
              isLoading={loading}
              theme={Colors.Success}
              onPress={handleSubmit}
            >
              Confirmar
            </ButtonUi>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CompleteOrder;
