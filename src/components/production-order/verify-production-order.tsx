import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

import ProductionOrderView from './verify/production-order-view';
import { checkOrderFulfillment } from './stockChecker';

import { useProductionOrderStore } from '@/store/production-order.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { API_URL } from '@/utils/constants';
import { getElSalvadorDateTime } from '@/utils/dates';
import { get_employee_by_code } from '@/services/employess.service';
import { GetEmployeeByCode } from '@/types/employees.types';

type DisclosureProps = ReturnType<typeof useDisclosure>;

interface Props {
  id: number;
  disclosure: DisclosureProps;
  onReload: () => void;
}

function VerifyProductionOrder({ id, disclosure, onReload }: Props) {
  const { productionOrderDetail, getProductionsOrderDetail } = useProductionOrderStore();

  useEffect(() => {
    getProductionsOrderDetail(id);
  }, [id]);

  const [employeeCode, setEmployeeCode] = useState('');

  const { canFulfillAll } = checkOrderFulfillment(productionOrderDetail || null);

  const modalConfirmation = useDisclosure();
  const [loading, setLoading] = useState(false);

  const onConfirm = () => {
    if (employeeCode === '') {
      toast.error('Debe ingresar tu código de empleado');

      return;
    }
    setLoading(true);
    get_employee_by_code(employeeCode)
      .then((res) => {
        const employee = res.data.employee;

        const name =
          employee.id +
          ' - ' +
          employee.firstName +
          ' ' +
          employee.secondName +
          ' ' +
          employee.firstLastName +
          ' ' +
          employee.secondLastName;

        axios
          .patch(API_URL + `/production-orders/start/${id}`, {
            reason: getElSalvadorDateTime().fecEmi + ' - ' + getElSalvadorDateTime().horEmi,
            responsibleName: name,
          })
          .then(() => {
            toast.success('Orden de producción confirmada');
            modalConfirmation.onClose();
            disclosure.onClose();
            setLoading(false);
            onReload();
          })
          .catch(() => {
            modalConfirmation.onClose();
            disclosure.onClose();
            setLoading(false);
          });
      })
      .catch((error: AxiosError<GetEmployeeByCode>) => {
        modalConfirmation.onClose();
        if (!error.response?.data.employee) {
          toast.error(`Empleado no encontrado`);
        } else {
          toast.error('Error desconocido');
        }
        setLoading(false);
      });
  };

  return (
    <>
      <Modal
        {...disclosure}
        className="dark:bg-gray-900"
        isDismissable={false}
        scrollBehavior="inside"
        size="full"
      >
        <ModalContent>
          <ModalHeader className="dark:text-white">Confirmar orden de producción</ModalHeader>
          <ModalBody>
            {productionOrderDetail && (
              <ProductionOrderView productionOrder={productionOrderDetail!} />
            )}
          </ModalBody>
          <ModalFooter className="gap-5">
            <Button className="px-6" color="danger" variant="light" onPress={disclosure.onClose}>
              Cancelar
            </Button>
            <ButtonUi
              className="px-6"
              isDisabled={!canFulfillAll}
              theme={Colors.Success}
              onPress={modalConfirmation.onOpen}
            >
              Confirmar
            </ButtonUi>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        className="dark:bg-gray-900 dark:text-gray-100"
        {...modalConfirmation}
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader>Confirmar orden de producción</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4 justify-center items-center">
              <Info className="w-12 h-12 text-blue-500" />
              <p className="text-center">
                Para iniciar la orden de producción debe ingresar el código de confirmación
              </p>
              <Input
                className="w-full"
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
              isDisabled={!canFulfillAll}
              isLoading={loading}
              theme={Colors.Success}
              onPress={onConfirm}
            >
              Confirmar
            </ButtonUi>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default VerifyProductionOrder;
