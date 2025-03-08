import { useAccountingItemsStore } from '@/store/accounting-items.store';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import useGlobalStyles from '../global/global.styles';
import Pagination from '../global/Pagination';
import { limit_options, typeOrden } from '@/utils/constants';
import { Pencil, Plus, Trash, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import { PiFilePdfDuotone } from 'react-icons/pi';
import ItemPdf from './ItemPdf';
import FullPageLayout from '../global/FullOverflowLayout';
import { useAuthStore } from '@/store/auth.store';

function List() {
  const {
    accounting_items,
    loading,
    accounting_items_pagination,
    getAccountingItems,
    deleteItem,
    search_item,
    report_for_item,
    getReportForItem,
  } = useAccountingItemsStore();
  const { getListTypeOfAccount, list_type_of_account } = useTypeOfAccountStore();

  const { user } = useAuthStore();

  const [startDate, setStartDate] = useState(search_item.startDate);
  const [endDate, setEndDate] = useState(search_item.endDate);
  const [limit, setLimit] = useState(search_item.limit);
  const [date, setDate] = useState('');

  const [typeItem, setTypeItem] = useState(search_item.typeItem || '');
  const [reportForItem, setReportForItem] = useState<number>(0);
  const showFullLayout = useDisclosure();
  const [correlative, setCorrelative] = useState('');
  const [typeOrder, setTypeOrder] = useState(search_item.typeOrder);

  const transId = useMemo(() => {
    return user?.correlative
      ? user.correlative.branch.transmitter.id
      : (user?.pointOfSale?.branch.transmitter.id ?? 0);
  }, [user]);

  useEffect(() => {
    getAccountingItems(Number(transId), 1, limit, startDate, endDate, typeItem, typeOrder);
    getListTypeOfAccount();
  }, [limit, startDate, endDate, typeItem, typeOrder]);

  useEffect(() => {
    if (reportForItem) {
      getReportForItem(Number(reportForItem));
    }
  }, [reportForItem]);

  const navigate = useNavigate();
  const styles = useGlobalStyles();

  const [selectedId, setSelectedId] = useState<number>(0);
  const deleteModal = useDisclosure();

  const handleDelete = () => {
    if (selectedId === 0) {
      toast.warning('Debe seleccionar una partida contable');
      return;
    }
    deleteItem(selectedId, transId)
      .then((res) => {
        if (res) {
          toast.success('La partida contable ha sido eliminada exitosamente');
          deleteModal.onClose();
        } else {
          toast.error('Error al eliminar la partida contable');
        }
      })
      .catch(() => {
        toast.error('Error al eliminar la partida contable');
      });
  };

  const handleShowPdf = (id: number, date: string, correlative: string) => {
    setReportForItem(id);
    setDate(date);
    setCorrelative(correlative);
    showFullLayout.onOpen();
  };

  const closeShowPdf = () => {
    setReportForItem(0);
    setDate('');
    setCorrelative('');
    showFullLayout.onClose();
  };

  return (
   <>
      <div className="w-full h-full flex flex-col border border-white p-3 bg-white shadow rounded-xl dark:bg-gray-900">
        <div className="w-full grid grid-cols-3 gap-5">
          <Input
            classNames={{ label: 'font-semibold' }}
            label="Fecha inicial"
            type="date"
            variant="bordered"
            labelPlacement="outside"
            onChange={(e) => setStartDate(e.target.value)}
            value={startDate}
          ></Input>
          <Input
            classNames={{ label: 'font-semibold' }}
            label="Fecha final"
            type="date"
            variant="bordered"
            labelPlacement="outside"
            onChange={(e) => setEndDate(e.target.value)}
            value={endDate}
          ></Input>
          <Select
            variant="bordered"
            className=""
            classNames={{ base: 'font-semibold' }}
            label="Tipo de partida"
            placeholder="Selecciona un tipo de partida"
            labelPlacement="outside"
            selectedKeys={[typeItem]}
            onSelectionChange={(key) => {
              if (key) {
                setTypeItem(String(key.currentKey));
              }
            }}
          >
            {list_type_of_account.map((item) => (
              <SelectItem key={item.id}>{item.name}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="w-full flex justify-between items-end mt-2">
          <Select
            variant="bordered"
            className="w-64"
            classNames={{ base: 'font-semibold' }}
            label="Cantidad a mostrar"
            placeholder="Selecciona un limite"
            labelPlacement="outside"
            selectedKeys={[limit.toString()]}
            onSelectionChange={(key) => {
              if (key) {
                setLimit(Number(key.currentKey));
              }
            }}
          >
            {limit_options.map((option) => (
              <SelectItem key={option}>{option}</SelectItem>
            ))}
          </Select>
          <Select
            variant="bordered"
            className="w-64"
            classNames={{ base: 'font-semibold' }}
            label="Ordenar registros"
            placeholder="Selecciona un tipo"
            labelPlacement="outside"
            selectedKeys={[typeOrder]}
            onSelectionChange={(key) => {
              if (key) {
                setTypeOrder(String(key.currentKey));
              }
            }}
          >
            {typeOrden.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
          <div className="flex gap-2 items-end justify-end">
            <Button style={styles.thirdStyle} onPress={() => navigate('/add-item-by-sales')}>
              Generar partida de ventas
            </Button>
            <Button
              isIconOnly
              style={styles.secondaryStyle}
              onPress={() => navigate('/add-accounting-items')}
            >
              <Plus />
            </Button>
          </div>
        </div>
        <div className="overflow-y-auto flex flex-col h-full custom-scrollbar mt-4">
          <table className="w-full">
            <thead className="sticky top-0 z-20 bg-white">
              <tr>
                <th style={styles.darkStyle} className="p-3 text-xs font-semibold text-left">
                  No. de partida
                </th>
                <th style={styles.darkStyle} className="p-3 text-xs font-semibold text-left">
                  Fecha
                </th>
                <th style={styles.darkStyle} className="p-3 text-xs font-semibold text-left">
                  Tipo de partida
                </th>
                <th style={styles.darkStyle} className="p-3 text-xs font-semibold text-left">
                  Concepto
                </th>
                <th style={styles.darkStyle} className="p-3 text-xs font-semibold text-left">
                  Correlativo
                </th>
                <th style={styles.darkStyle} className="p-3 text-xs font-semibold text-left">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <tr>
                    <td colSpan={7} className="p-3 text-sm text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center w-full h-64">
                        <div className="loader"></div>
                        <p className="mt-3 text-xl font-semibold">Cargando...</p>
                      </div>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {accounting_items.length > 0 ? (
                    accounting_items.map((type, index) => (
                      <tr className="border-b border-slate-200" key={index}>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {type.noPartida}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {type.date}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {type?.typeOfAccount?.name}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          <p className='truncate'>{type.concepOfTheItem}</p>
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {type?.correlative}
                        </td>
                        <td className="p-3 text-sm flex gap-5 text-slate-500 dark:text-slate-100">
                          <Button
                            isIconOnly
                            style={styles.secondaryStyle}
                            onPress={() =>
                              (window.location.href = '/edit-accounting-items/' + type.id)
                            }
                          >
                            <Pencil />
                          </Button>
                          <Button
                            isIconOnly
                            style={styles.dangerStyles}
                            onPress={() => {
                              setSelectedId(type.id);
                              deleteModal.onOpen();
                            }}
                          >
                            <Trash />
                          </Button>
                          <Button
                            isIconOnly
                            style={styles.warningStyles}
                            onPress={() => {
                              handleShowPdf(type.id, type.date, type.correlative);
                            }}
                          >
                            <PiFilePdfDuotone size={30} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-3 text-sm text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center w-full h-64">
                          <p className="mt-3 text-xl font-semibold">
                            No se encontraron partidas contables
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        {accounting_items_pagination.totalPag > 1 && (
          <>
            <div className="hidden w-full mt-5 md:flex">
              <Pagination
                previousPage={accounting_items_pagination.prevPag}
                nextPage={accounting_items_pagination.nextPag}
                currentPage={accounting_items_pagination.currentPag}
                totalPages={accounting_items_pagination.totalPag}
                onPageChange={(page) => {
                  getAccountingItems(transId, page, limit, startDate, endDate, typeItem, typeOrder);
                }}
              />
            </div>
          </>
        )}
      </div>
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Eliminar Partida Contable</ModalHeader>
              <ModalBody>
                <p>¿Está seguro de eliminar esta partida contable?</p>
              </ModalBody>
              <ModalFooter>
                <Button className="px-5" color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button className="px-5" style={styles.dangerStyles} onPress={() => handleDelete()}>
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <FullPageLayout show={showFullLayout.isOpen}>
        <div className="w-[100vw] h-[100vh] bg-white rounded-2xl">
          <Button
            color="danger"
            onPress={closeShowPdf}
            className="absolute bottom-6 left-6"
            isIconOnly
          >
            <X />
          </Button>
          <ItemPdf JSONData={report_for_item} date={date} correlative={correlative} />
        </div>
      </FullPageLayout>
    </>
  );
}

export default List;
