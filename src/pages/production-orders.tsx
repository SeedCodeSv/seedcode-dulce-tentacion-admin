import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { Eye, Play } from 'lucide-react';
import { TbCancel } from 'react-icons/tb';
import { toast } from 'sonner';
import axios from 'axios';

import Layout from '@/layout/Layout';
import { useProductionOrderTypeStore } from '@/store/production-order-type.store';
import ThGlobal from '@/themes/ui/th-global';
import EmptyBox from '@/assets/empty-box.png';
import { formatDate } from '@/utils/dates';
import { useProductionOrderStore } from '@/store/production-order.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { get_employee_by_code } from '@/services/employess.service';
import { API_URL } from '@/utils/constants';
import DetailsProductionOrder from '@/components/production-order/details-production-order';
import { RenderStatus, Status } from '@/components/production-order/render-order-status';

function ProductionOrders() {
  const { productionOrderTypes, onGetProductionOrderTypes } = useProductionOrderTypeStore();

  const modalCancelOrder = useDisclosure();
  const modalMoreInformation = useDisclosure();

  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());

  const { productionOrders, getProductionsOrders } = useProductionOrderStore();

  useEffect(() => {
    onGetProductionOrderTypes();
    getProductionsOrders(1, 10, startDate, endDate, 0, '', 0, 0);
  }, [startDate, endDate]);

  const productionOrderStatus = ['Abierta', 'En Proceso', 'Completada', 'Cancelada'];

  const [moreInformation, setMoreInformation] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(0);

  const [loadingCancel, setLoadingCancel] = useState(false);

  const handleCancelOrder = (orderId: number) => {
    if (orderId === 0) return;

    if (employeeCode === '') {
      toast.error('Debe ingresar tu código de empleado');

      return;
    }

    setLoadingCancel(true);
    get_employee_by_code(employeeCode)
      .then((res) => {
        const employee = res.data.employee;

        if (!employee) {
          toast.error('Empleado no encontrado');

          return;
        }

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
          .post(API_URL + `/production-orders/cancel/${orderId}`, {
            reason: moreInformation !== '' ? moreInformation : 'No especificado',
            responsibleName: name,
          })
          .then(() => {
            toast.success('Orden cancelada exitosamente');
            modalCancelOrder.onClose();
            getProductionsOrders(1, 10, startDate, endDate, 0, '', 0, 0);
            setLoadingCancel(false);
          })
          .catch(() => {
            toast.error('Error al cancelar la orden');
            setLoadingCancel(false);
          });
      })
      .catch(() => {
        toast.error('Código invalido', {
          description: 'El empleado no se encuentra registrado en el sistema',
        });
        setLoadingCancel(false);
      });
  };

  return (
    <Layout title="Ordenes de producción">
      <div className=" w-full h-full flex flex-col overflow-y-auto p-5 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="grid grid-cols-4 gap-4">
          <Input
            classNames={{ label: 'font-semibold' }}
            label="Fecha de inicio"
            labelPlacement="outside"
            type="date"
            value={startDate}
            variant="bordered"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            classNames={{ label: 'font-semibold' }}
            label="Fecha de fin"
            labelPlacement="outside"
            type="date"
            value={endDate}
            variant="bordered"
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Select
            classNames={{ label: 'font-semibold' }}
            label="Estado de la orden"
            labelPlacement="outside"
            placeholder="Seleccione un estado"
            variant="bordered"
          >
            {productionOrderStatus.map((status) => (
              <SelectItem key={status}>{status}</SelectItem>
            ))}
          </Select>
          <Select
            classNames={{ label: 'font-semibold' }}
            label="Estado de la orden"
            labelPlacement="outside"
            placeholder="Seleccione un tipo de orden"
            variant="bordered"
          >
            {productionOrderTypes.map((type) => (
              <SelectItem key={type.id}>{type.name}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
          <table className="w-full">
            <thead className="sticky top-0 z-20 bg-white">
              <tr>
                <ThGlobal className="text-left p-3">No.</ThGlobal>
                <ThGlobal className="text-left p-3">Fecha de inicio</ThGlobal>
                <ThGlobal className="text-left p-3">Hora de inicio</ThGlobal>
                <ThGlobal className="text-left p-3">Fecha de fin</ThGlobal>
                <ThGlobal className="text-left p-3">Hora de fin </ThGlobal>
                <ThGlobal className="text-left p-3">Estado</ThGlobal>
                <ThGlobal className="text-left p-3">Acciones</ThGlobal>
              </tr>
            </thead>
            <tbody>
              {productionOrders.length === 0 && (
                <tr>
                  <td className="p-3" colSpan={7}>
                    <div className="flex flex-col justify-center items-center h-full">
                      <img alt="NO DATA" className="w-40" src={EmptyBox} />
                      <p className="text-lg font-semibold mt-3 dark:text-white">
                        No se encontraron resultados
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {productionOrders.map((porD, index) => (
                <tr key={index}>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{porD.date}</td>
                  <td className="p-3">{porD.time}</td>
                  <td className="p-3">{porD.endDate || 'No definido'}</td>
                  <td className="p-3">{porD.endTime || 'No definido'}</td>
                  <td className="p-3">
                    {RenderStatus({ status: porD.statusOrder as Status }) || porD.statusOrder}
                  </td>
                  <td className="p-3 flex gap-2">
                    {porD.statusOrder === 'Abierta' && (
                      <div className="flex gap-2">
                        <ButtonUi
                          isIconOnly
                          showTooltip
                          theme={Colors.Success}
                          tooltipText="Iniciar orden de producción"
                          onPress={() => {}}
                        >
                          <Play />
                        </ButtonUi>
                        <ButtonUi
                          isIconOnly
                          showTooltip
                          theme={Colors.Error}
                          tooltipText="Cancelar orden de producción"
                          onPress={() => {
                            setSelectedOrderId(porD.id);
                            modalCancelOrder.onOpen();
                          }}
                        >
                          <TbCancel size={20} />
                        </ButtonUi>
                      </div>
                    )}
                    <ButtonUi
                      isIconOnly
                      showTooltip
                      theme={Colors.Warning}
                      tooltipText="Ver orden de producción"
                      onPress={() => {
                        setSelectedOrderId(porD.id);
                        modalMoreInformation.onOpen();
                      }}
                    >
                      <Eye size={20} />
                    </ButtonUi>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal {...modalCancelOrder} isDismissable={false}>
          <ModalContent>
            <ModalHeader>Autorizar cancelación de orden</ModalHeader>
            <ModalBody>
              <Textarea
                classNames={{ label: 'font-semibold text-xs' }}
                label="Motivo de cancelación"
                placeholder="Ingrese el motivo de la cancelación"
                value={moreInformation}
                variant="bordered"
                onChange={(e) => setMoreInformation(e.target.value)}
              />
              <Input
                classNames={{ label: 'font-semibold text-xs' }}
                label="Código de empleado"
                placeholder="Ingrese el código de empleado"
                value={employeeCode}
                variant="bordered"
                onChange={(e) => setEmployeeCode(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <ButtonUi
                className="px-8"
                isLoading={loadingCancel}
                theme={Colors.Primary}
                onPress={() => handleCancelOrder(selectedOrderId ?? 0)}
              >
                Cancelar orden
              </ButtonUi>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <DetailsProductionOrder
          id={selectedOrderId ?? 0}
          modalMoreInformation={modalMoreInformation}
        />
      </div>
    </Layout>
  );
}

export default ProductionOrders;
