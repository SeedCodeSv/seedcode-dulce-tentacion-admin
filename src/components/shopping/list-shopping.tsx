import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { Pen, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import Pagination from '../global/Pagination';
import AddButton from '../global/AddButton';
import { ResponsiveFilterWrapper } from '../global/ResposiveFilters';
import EmptyTable from '../global/EmptyTable';
import LoadingTable from '../global/LoadingTable';

import ShooppingExportExcell from './reportShoppingsExcell';

import { useAuthStore } from '@/store/auth.store';
import { useBranchProductStore } from '@/store/branch_product.store';
import { useShoppingStore } from '@/store/shopping.store';
import { ArrayAction } from '@/types/view.types';
import { API_URL, limit_options } from '@/utils/constants';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import useThemeColors from '@/themes/use-theme-colors';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';
import TdGlobal from '@/themes/ui/td-global';
import { useTransmitterStore } from '@/store/transmitter.store';

function ShoppingPage({ actions }: ArrayAction) {
  const {
    shoppingList,
    getPaginatedShopping,
    loading_shopping,
    pagination_shopping,
    search_params,
  } = useShoppingStore();
  const [dateInitial, setDateInitial] = useState(search_params.startDate);
  const [dateEnd, setDateEnd] = useState(search_params.endDate);
  const [limit, setLimit] = useState(5);
  const { user } = useAuthStore();
  const { getBranchesList, branches_list } = useBranchProductStore();
  const [branchId, setBranchId] = useState(search_params.branchId ?? 0);
  const { transmitter, gettransmitter } = useTransmitterStore()

  useEffect(() => {
    getPaginatedShopping(
      user?.pointOfSale?.branch.transmitterId ?? 0,
      1,
      limit,
      dateInitial,
      dateEnd,
      branchId
    );
  }, [limit]);

  useEffect(() => {
    gettransmitter()
    getBranchesList();
  }, []);

  const searchDailyReport = () => {
    getPaginatedShopping(
      user?.pointOfSale?.branch.transmitterId ?? 0,
      1,
      limit,
      dateInitial,
      dateEnd,
      branchId
    );
  };

  const navigate = useNavigate();

  const onDeleteConfirm = (id: number) => {
    axios
      .delete(API_URL + '/shoppings/' + id)
      .then(() => {
        getPaginatedShopping(
          user?.pointOfSale?.branch.transmitterId ?? 0,
          1,
          limit,
          dateInitial,
          dateEnd,
          branchId
        );
        toast.success('Eliminado con éxito');
      })
      .catch(() => {
        toast.error('Error al eliminar');
      });
  };

  const modalConfirm = useDisclosure();

  const [selectedShoppingId, setSelectedShoppingId] = useState<number | null>(null);

  const handleVerify = (id: number) => {
    setSelectedShoppingId(id);
    axios
      .get(API_URL + `/shoppings/verify-if-contain-item/${id}`)
      .then((res) => {
        if (res.data) {
          onDeleteConfirm(id);
        } else {
          modalConfirm.onOpen();
          toast.success('La compra incluye una partida contable');
        }
      })
      .catch(() => {
        modalConfirm.onOpen();
        toast.warning('La compra incluye una partida contable');
      });
  };

  const [loadingDelete, setLoadingDelete] = useState(false);

  const deletePermanently = (id: number) => {
    setLoadingDelete(true);
    axios
      .delete(API_URL + `/shoppings/delete-permanently/${id}`)
      .then(() => {
        getPaginatedShopping(
          user?.pointOfSale?.branch.transmitterId ?? 0,
          1,
          limit,
          dateInitial,
          dateEnd,
          branchId
        );
        setLoadingDelete(false);
        toast.success('Eliminado con éxito');
        modalConfirm.onClose();
      })
      .catch(() => {
        setLoadingDelete(false);
        toast.error('Error al eliminar');
      });
  };

  const style = useThemeColors({ name: Colors.Error });

  return (
    <>
      <Modal isDismissable={false} isOpen={modalConfirm.isOpen} onClose={modalConfirm.onClose}>
        <ModalContent>
          <ModalHeader>Confirmar eliminación</ModalHeader>
          <ModalBody>
            <p className="text-lg font-semibold text-center">
              Esta compra incluye una partida contable, ¿deseas eliminarla?
            </p>
            <p className="text-sm text-center font-semibold text-red-500">
              Esta acción no se puede deshacer(se eliminara la compra y la partida)
            </p>
          </ModalBody>
          <ModalFooter>
            <ButtonUi
              className="border border-white rounded-xl px-10 font-semibold"
              isLoading={loadingDelete}
              theme={Colors.Default}
              onPress={modalConfirm.onClose}
            >
              Cancelar
            </ButtonUi>
            <ButtonUi
              className="border border-white rounded-xl px-10 font-semibold"
              isLoading={loadingDelete}
              theme={Colors.Error}
              onPress={() => deletePermanently(selectedShoppingId ?? 0)}
            >
              Eliminar
            </ButtonUi>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <DivGlobal>
        <div className="flex flex-row-reverse lg:flex-col gap-5 w-full px-5">
          <ResponsiveFilterWrapper onApply={searchDailyReport}>
            <Input
              className="dark:text-white border border-white rounded-xl "
              classNames={{
                label: 'text-sm font-semibold',
              }}
              label="Fecha inicial"
              labelPlacement="outside"
              placeholder="Buscar por fecha..."
              type="date"
              value={dateInitial}
              variant="bordered"
              onChange={(e) => {
                setDateInitial(e.target.value);
              }}
            />
            <Input
              className="dark:text-white border border-white rounded-xl "
              classNames={{
                label: 'text-sm font-semibold',
              }}
              defaultValue={dateEnd}
              label="Fecha final"
              labelPlacement="outside"
              placeholder="Buscar por fecha..."
              type="date"
              variant="bordered"
              onChange={(e) => {
                setDateEnd(e.target.value);
              }}
            />
            <Autocomplete
              className="dark:text-white font-semibold "
              clearButtonProps={{ onClick: () => setBranchId('') }}
              label="Sucursal"
              labelPlacement="outside"
              placeholder="Selecciona la sucursal"
              selectedKey={branchId}
              variant="bordered"
              onSelectionChange={(key) => (key ? setBranchId(String(key)) : setBranchId(''))}
            >
              {branches_list.map((item) => (
                <AutocompleteItem key={item.name} className="dark:text-white">
                  {item.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Select
              className="dark:text-white border border-white rounded-xl"
              classNames={{
                label: 'font-semibold',
              }}
              defaultSelectedKeys={['5']}
              label="Cantidad a mostrar"
              labelPlacement="outside"
              value={limit}
              variant="bordered"
              onChange={(e) => {
                setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
              }}
            >
              {limit_options.map((option) => (
                <SelectItem key={option} className="w-full dark:text-white">
                  {option}
                </SelectItem>
              ))}
            </Select>
          </ResponsiveFilterWrapper>
          <div className="flex justify-between mt-0 flex-grow gap-4">
            <div className='flex gap-2'>
              <ShooppingExportExcell params={{ page: 0, limit, branchId: 0, startDate: dateInitial, endDate: dateEnd }} transmitter={transmitter} />
            </div>
            {actions.includes('Agregar') && (
              <AddButton onClick={() => navigate('/create-shopping')} />
            )}
          </div>
        </div>
        <TableComponent
          headers={["Nº", "No. de control", "Cod. generación", "Fecha/Hora emisión", 'Subtotal', 'IVA', 'Monto total', 'Acciones']}
        >
          {loading_shopping ? (
            <tr>
              <td className="p-6 text-sm text-center text-slate-500" colSpan={8}>
                <LoadingTable />
              </td>
            </tr>
          ) : shoppingList.length === 0 ? (
            <tr>
              <td colSpan={8}>
                <EmptyTable />
              </td>
            </tr>
          ) : shoppingList.map((cat) => (
            <tr key={cat.id} className="border-b border-slate-200">
              <TdGlobal className="p-3">
                {cat.id}
              </TdGlobal>
              <TdGlobal className="p-3 ">
                {cat.controlNumber}
              </TdGlobal>
              <TdGlobal className="p-3 ">
                {cat.generationCode}
              </TdGlobal>
              <TdGlobal className="p-3 ">
                {cat.fecEmi} {cat.horEmi}
              </TdGlobal>
              <TdGlobal className="p-3 ">
                {cat.subTotal}
              </TdGlobal>
              <TdGlobal className="p-3 ">
                {cat.totalIva}
              </TdGlobal>
              <TdGlobal className="p-3 ">
                {cat.montoTotalOperacion}
              </TdGlobal>

              <td className="p-3 ">
                <div className="flex gap-2">
                  <ButtonUi
                    isIconOnly
                    theme={Colors.Success}
                    onPress={() =>
                      navigate(`/edit-shopping/${cat.id}/${cat.controlNumber}`)
                    }
                  >
                    <Pen />
                  </ButtonUi>
                  {cat.generationCode !== 'N/A' && (
                    <>
                      <ButtonUi
                        isIconOnly
                        theme={Colors.Error}
                        onPress={() => handleVerify(cat.id)}
                      >
                        <Trash />
                      </ButtonUi>
                    </>
                  )}
                  {cat.generationCode === 'N/A' && (
                    <Popover className="border border-white rounded-xl">
                      <PopoverTrigger>
                        <Button isIconOnly style={style}>
                          <Trash />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="p-4">
                          <p className="text-sm font-normal text-gray-600">
                            ¿Deseas eliminar el registro {cat.controlNumber}?
                          </p>
                          <div className="flex justify-center mt-4">
                            <ButtonUi
                              className="mr-2"
                              theme={Colors.Error}
                              onPress={() => onDeleteConfirm(cat.id)}
                            >
                              Sí, eliminar
                            </ButtonUi>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </TableComponent>
        {pagination_shopping.totalPag > 1 && (
          <>
            <div className="w-full mt-5">
              <Pagination
                currentPage={pagination_shopping.currentPag}
                nextPage={pagination_shopping.nextPag}
                previousPage={pagination_shopping.prevPag}
                totalPages={pagination_shopping.totalPag}
                onPageChange={(page) => {
                  getPaginatedShopping(
                    user?.pointOfSale?.branch.transmitterId ??
                    0,
                    page,
                    limit,
                    dateInitial,
                    dateEnd,
                    branchId
                  );
                }}
              />
            </div>
          </>
        )}
      </DivGlobal>
    </>
  );
}

export default ShoppingPage;
