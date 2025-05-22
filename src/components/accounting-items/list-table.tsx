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
import { Pencil, Plus, Trash, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PiFilePdfDuotone } from 'react-icons/pi';

import Pagination from '../global/Pagination';
import useGlobalStyles from '../global/global.styles';
import FullPageLayout from '../global/FullOverflowLayout';
import LoadingTable from '../global/LoadingTable';
import EmptyTable from '../global/EmptyTable';

import ItemPdf from './ItemPdf';

import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import { limit_options, typeOrden } from '@/utils/constants';
import { useAccountingItemsStore } from '@/store/accounting-items.store';
import { useAuthStore } from '@/store/auth.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';

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
    return (user?.pointOfSale?.branch.transmitter.id ?? 0);
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
    <DivGlobal>
        <div className="w-full grid grid-cols-3 gap-5">
          <Input
            classNames={{ label: 'font-semibold' }}
            label="Fecha inicial"
            labelPlacement="outside"
            type="date"
            value={startDate}
            variant="bordered"
            onChange={(e) => setStartDate(e.target.value)}
           />
          <Input
            classNames={{ label: 'font-semibold' }}
            label="Fecha final"
            labelPlacement="outside"
            type="date"
            value={endDate}
            variant="bordered"
            onChange={(e) => setEndDate(e.target.value)}
           />
          <Select
            className=""
            classNames={{ base: 'font-semibold' }}
            label="Tipo de partida"
            labelPlacement="outside"
            placeholder="Selecciona un tipo de partida"
            selectedKeys={[typeItem]}
            variant="bordered"
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
            className="w-64"
            classNames={{ base: 'font-semibold' }}
            label="Cantidad a mostrar"
            labelPlacement="outside"
            placeholder="Selecciona un limite"
            selectedKeys={[limit.toString()]}
            variant="bordered"
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
            className="w-64"
            classNames={{ base: 'font-semibold' }}
            label="Ordenar registros"
            labelPlacement="outside"
            placeholder="Selecciona un tipo"
            selectedKeys={[typeOrder]}
            variant="bordered"
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
            <ButtonUi theme={Colors.Info} onPress={() => navigate('/add-item-by-sales')}>
              Generar partida de ventas
            </ButtonUi>
            <ButtonUi
              isIconOnly
              theme={Colors.Success}
              onPress={() => navigate('/add-accounting-items')}
            >
              <Plus />
            </ButtonUi>
          </div>
        </div>
        <TableComponent
              headers={["Nº", 'Fecha'
,'Tipo'
,'Concepto'
,'Correlativo'
,'Acciones']}
            >
              {loading ? (
                <>
                  <tr>
                    <td className="p-3 text-sm text-center text-slate-500" colSpan={7}>
                      <LoadingTable/>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {accounting_items.length > 0 ? (
                    accounting_items.map((type, index) => (
                      <tr key={index} className="border-b border-slate-200">
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
                          <p className="truncate">{type.concepOfTheItem}</p>
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {type?.correlative}
                        </td>
                        <td className="p-3 text-sm flex gap-5 text-slate-500 dark:text-slate-100">
                          <ButtonUi
                            isIconOnly
                            theme={Colors.Success}
                            onPress={() =>
                              (window.location.href = '/edit-accounting-items/' + type.id)
                            }
                          >
                            <Pencil />
                          </ButtonUi>
                          <ButtonUi
                            isIconOnly
                            theme={Colors.Error}
                            onPress={() => {
                              setSelectedId(type.id);
                              deleteModal.onOpen();
                            }}
                          >
                            <Trash />
                          </ButtonUi>
                          <ButtonUi
                            isIconOnly
                            theme={Colors.Warning}
                            onPress={() => {
                              handleShowPdf(type.id, type.date, type.correlative);
                            }}
                          >
                            <PiFilePdfDuotone size={30} />
                          </ButtonUi>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-3 text-sm text-center text-slate-500" colSpan={7}>
                        <EmptyTable classText='mt-3 text-xl font-semibold'
                        text='No se encontraron partidas contables'
                        />
                      </td>
                    </tr>
                  )}
                </>
              )}
            </TableComponent>
        {accounting_items_pagination.totalPag > 1 && (
          <>
            <div className="hidden w-full mt-5 md:flex">
              <Pagination
                currentPage={accounting_items_pagination.currentPag}
                nextPage={accounting_items_pagination.nextPag}
                previousPage={accounting_items_pagination.prevPag}
                totalPages={accounting_items_pagination.totalPag}
                onPageChange={(page) => {
                  getAccountingItems(transId, page, limit, startDate, endDate, typeItem, typeOrder);
                }}
              />
            </div>
          </>
        )}
      </DivGlobal>
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
            isIconOnly
            className="absolute bottom-6 left-6"
            color="danger"
            onPress={closeShowPdf}
          >
            <X />
          </Button>
          <ItemPdf JSONData={report_for_item} correlative={correlative} date={date} />
        </div>
      </FullPageLayout>
    </>
  );
}

export default List;
