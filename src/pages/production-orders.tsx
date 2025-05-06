import {
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { Check, Clock, Eye, Play, Settings, X } from 'lucide-react';
import { TbCancel } from 'react-icons/tb';

// import { usePermission } from '@/hooks/usePermission';
import Layout from '@/layout/Layout';
import { useProductionOrderTypeStore } from '@/store/production-order-type.store';
import ThGlobal from '@/themes/ui/th-global';
import EmptyBox from '@/assets/empty-box.png';
import { formatDate } from '@/utils/dates';
import { useProductionOrderStore } from '@/store/production-order.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function ProductionOrders() {
  // const { roleActions, returnActionsByView } = usePermission();
  const { productionOrderTypes, onGetProductionOrderTypes } = useProductionOrderTypeStore();

  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());

  const { productionOrders, getProductionsOrders } = useProductionOrderStore();

  useEffect(() => {
    onGetProductionOrderTypes();
    getProductionsOrders(1, 10, startDate, endDate, 0, '', 0, 0);
  }, []);

  const productionOrderStatus = ['Abierta', 'En Proceso', 'Completada', 'Cancelada'];

  // const actions = useMemo(() => returnActionsByView('Ordenes de producción'), [roleActions]);

  const [moreInformation, setMoreInformation] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');

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
                          onPress={() => {}}
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
                      onPress={() => {}}
                    >
                      <Eye size={20} />
                    </ButtonUi>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal isOpen isDismissable={false}>
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
              <ButtonUi className='px-6' theme={Colors.Error}>Aceptar</ButtonUi>
              <ButtonUi className='px-6' theme={Colors.Primary}>Validar</ButtonUi>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </Layout>
  );
}

export default ProductionOrders;

type Status = 'Abierta' | 'En Proceso' | 'Completada' | 'Cancelada';
type StatusColors = 'warning' | 'primary' | 'success' | 'danger';

export const RenderStatus = ({ status }: { status: Status }) => {
  const statusColor: Record<Status, StatusColors> = {
    Abierta: 'warning',
    'En Proceso': 'primary',
    Completada: 'success',
    Cancelada: 'danger',
  };

  return (
    <div className="flex gap-3">
      <Chip
        className="px-4"
        color={statusColor[status] || 'default'}
        endContent={
          <>
            {status === 'En Proceso' && <Settings className=" animate-spin" size={20} />}
            {status === 'Abierta' && <Clock className="text-white" size={20} />}
            {status === 'Cancelada' && <X className="text-white" size={20} />}
            {status === 'Completada' && <Check className="text-white" size={20} />}
          </>
        }
      >
        <span className="text-xs text-white">{status}</span>
      </Chip>
    </div>
  );
};
