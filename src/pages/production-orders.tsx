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
  Selection,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { Eye, Play, Plus } from 'lucide-react';
import { TbCancel, TbCheck } from 'react-icons/tb';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router';

import { useProductionOrderTypeStore } from '@/store/production-order-type.store';
import { formatDate } from '@/utils/dates';
import { useProductionOrderStore } from '@/store/production-order.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { get_employee_by_code } from '@/services/employess.service';
import { API_URL } from '@/utils/constants';
import DetailsProductionOrder from '@/components/production-order/details-production-order';
import { RenderStatus, Status } from '@/components/production-order/render-order-status';
import VerifyProductionOrder from '@/components/production-order/verify-production-order';
import CompleteOrder from '@/components/production-order/complete';
import DivGlobal from '@/themes/ui/div-global';
import TdGlobal from '@/themes/ui/td-global';
import Pagination from '@/components/global/Pagination';
import { ResponsiveFilterWrapper } from '@/components/global/ResposiveFilters';
import EmptyTable from '@/components/global/EmptyTable';
import { TableComponent } from '@/themes/ui/table-ui';
import useWindowSize from '@/hooks/useWindowSize';
import RenderViewButton from '@/components/global/render-view-button';
import ProductionsOrderCard from '@/components/products/ProductionsOrderCard';

type Key = string;

interface ExtendedSelection extends Set<Key> {
  anchorKey?: Key;
  currentKey?: Key;
}

function ProductionOrders() {
  const { onGetProductionOrderTypes } = useProductionOrderTypeStore();

  const navigation = useNavigate();
  const { windowSize } = useWindowSize()
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : "table"
  )
  const modalCancelOrder = useDisclosure();
  const modalMoreInformation = useDisclosure();
  const modalVerifyOrder = useDisclosure();
  const modalCompleteOrder = useDisclosure();

  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());

  const { productionOrders, getProductionsOrders, paginationProductionOrders } =
    useProductionOrderStore();
  const [selectedStatus, setSelectedStatus] = useState<Selection>(new Set([]));
  const [selectedType] = useState<Selection>(new Set([]));
  const [page, setPage] = useState(1)

  useEffect(() => {
    onGetProductionOrderTypes();
  }, []);

  useEffect(() => {
    const status =
      (selectedStatus as ExtendedSelection).size > 0
        ? (selectedStatus as ExtendedSelection).currentKey || ''
        : '';
    const type =
      (selectedType as ExtendedSelection).size > 0
        ? (selectedType as ExtendedSelection).currentKey || 0
        : 0;

    getProductionsOrders(page, 5, startDate, endDate, 0, status, 0, +type);
  }, [page, startDate, endDate, selectedStatus, selectedType]);

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
            getProductionsOrders(1, 5, startDate, endDate, 0, '', 0, 0);
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


  // const handleGenerateReports = () => {

  // }

  return (
    <>
      <DivGlobal>

        <ResponsiveFilterWrapper withButton={false}>
          <Input
            className='dark:text-white'
            classNames={{ label: 'font-semibold' }}
            label="Fecha de inicio"
            labelPlacement="outside"
            type="date"
            value={startDate}
            variant="bordered"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            className='dark:text-white'
            classNames={{ label: 'font-semibold' }}
            label="Fecha de fin"
            labelPlacement="outside"
            type="date"
            value={endDate}
            variant="bordered"
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Select
            className='dark:text-white'
            classNames={{ label: 'font-semibold' }}
            label="Estado de la orden"
            labelPlacement="outside"
            placeholder="Seleccione un estado"
            selectedKeys={selectedStatus}
            variant="bordered"
            onSelectionChange={setSelectedStatus}
          >
            {productionOrderStatus.map((status) => (
              <SelectItem key={status} className='dark:text-white'>{status}</SelectItem>
            ))}
          </Select>
        </ResponsiveFilterWrapper>
        <div className="flex justify-end mt-2 gap-4">
          <RenderViewButton setView={setView} view={view} />

          <ButtonUi
            isIconOnly
            theme={Colors.Success}
            onPress={() => {
              navigation('/add-production-order');
            }}
          >
            <Plus />
          </ButtonUi>
        </div>
        <div>
          {/* <ButtonUi
            className="mt-4 font-semibold w-48 "
            color="success"
            theme={Colors.Success}
            onPress={() => {
              handleGenerateReports()
            }}
          >
            <p>Exportar Excel</p> <PiMicrosoftExcelLogoBold color={'text-color'} size={24} />
          </ButtonUi> */}
        </div>
        {(view === 'grid') && (
          <ProductionsOrderCard
            modalCancelOrder={() => modalCancelOrder.onOpen()}
            modalCompleteOrder={() => modalCompleteOrder.onOpen()}
            modalMoreInformation={() => modalMoreInformation.onOpen()}
            modalVerifyOrder={() => modalVerifyOrder.onOpen()}
            setSelectedOrderId={setSelectedOrderId}

          />
        )}
        {view === 'table' && (

          <TableComponent
            className='overflow-auto'
            headers={["Nº", "Fecha de inicio", "Hora de inicio", "Fecha de fin", 'Hora de fin', 'Estado', 'Acciones']}
          >
            {productionOrders.length === 0 && (
              <tr>
                <td className="p-3" colSpan={7}>
                  <EmptyTable />
                </td>
              </tr>
            )}
            {productionOrders.map((porD, index) => (
              <tr key={index}>
                <TdGlobal className="p-3">{index + 1}</TdGlobal>
                <TdGlobal className="p-3">{porD.date}</TdGlobal>
                <TdGlobal className="p-3">{porD.time}</TdGlobal>
                <TdGlobal className="p-3">{porD.endDate || 'No definido'}</TdGlobal>
                <TdGlobal className="p-3">{porD.endTime || 'No definido'}</TdGlobal>
                <TdGlobal className="p-3">
                  {RenderStatus({ status: porD.statusOrder as Status }) || porD.statusOrder}
                </TdGlobal>
                <TdGlobal className="p-3 flex gap-2">
                  {porD.statusOrder === 'Abierta' && (
                    <div className="flex gap-2">
                      <ButtonUi
                        isIconOnly
                        showTooltip
                        theme={Colors.Success}
                        tooltipText="Iniciar orden de producción"
                        onPress={() => {
                          setSelectedOrderId(porD.id);
                          modalVerifyOrder.onOpen();
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
                          setSelectedOrderId(porD.id);
                          modalCancelOrder.onOpen();
                        }}
                      >
                        <TbCancel size={20} />
                      </ButtonUi>
                    </div>
                  )}
                  {porD.statusOrder === 'En Proceso' && (
                    <>
                      <ButtonUi
                        isIconOnly
                        showTooltip
                        theme={Colors.Success}
                        tooltipText="Completar orden de producción"
                        onPress={() => {
                          setSelectedOrderId(porD.id);
                          modalCompleteOrder.onOpen();
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
                          setSelectedOrderId(porD.id);
                          modalCancelOrder.onOpen();
                        }}
                      >
                        <TbCancel size={20} />
                      </ButtonUi>
                    </>
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
                </TdGlobal>
              </tr>
            ))}
          </TableComponent>
        )}

        <div className="mt-3">
          <Pagination
            currentPage={paginationProductionOrders.currentPag}
            nextPage={paginationProductionOrders.nextPag}
            previousPage={paginationProductionOrders.prevPag}
            totalPages={paginationProductionOrders.totalPag}
            onPageChange={(page) => setPage(page)}
          />
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
        {selectedOrderId > 0 && (
          <DetailsProductionOrder
            id={selectedOrderId}
            modalMoreInformation={modalMoreInformation}
            onClose={() => {
              setSelectedOrderId(0)
            }}
          />
        )}
        <VerifyProductionOrder disclosure={modalVerifyOrder} id={selectedOrderId ?? 0}
          onReload={() => {
            setPage(1)
            getProductionsOrders(page, 5, startDate, endDate, 0, '', 0, 0);
            setSelectedOrderId(0)
          }} />
        <CompleteOrder disclosure={modalCompleteOrder} id={selectedOrderId ?? 0}
          reload={() => {
            setPage(1);
            getProductionsOrders(page, 5, startDate, endDate, 0, '', 0, 0);
            setSelectedOrderId(0)
          }} />
      </DivGlobal>
    </>
  );
}

export default ProductionOrders;
