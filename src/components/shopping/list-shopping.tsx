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
import { Filter, Pen, SearchIcon, Trash } from 'lucide-react';
import NO_DATA from '@/assets/svg/no_data.svg';
import { useNavigate } from 'react-router-dom';
import Pagination from '../global/Pagination';
import { useAuthStore } from '@/store/auth.store';
import { useBranchProductStore } from '@/store/branch_product.store';
import { useShoppingStore } from '@/store/shopping.store';
import { ArrayAction } from '@/types/view.types';
import AddButton from '../global/AddButton';
import { useEffect, useState } from 'react';
import TooltipGlobal from '../global/TooltipGlobal';
import BottomDrawer from '../global/BottomDrawer';
import axios from 'axios';
import { API_URL, limit_options } from '@/utils/constants';
import { toast } from 'sonner';
import ThGlobal from '@/themes/ui/th-global';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import useThemeColors from '@/themes/use-theme-colors';

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
  const [openVaul, setOpenVaul] = useState(false);
  const { user } = useAuthStore();
  const { getBranchesList, branches_list } = useBranchProductStore();
  const [branchId, setBranchId] = useState(search_params.branchId ?? 0);
  useEffect(() => {
    getPaginatedShopping(
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
      1,
      limit,
      dateInitial,
      dateEnd,
      branchId
    );
    getBranchesList();
  }, [limit]);

  const searchDailyReport = () => {
    getPaginatedShopping(
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
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
          user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
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
          user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
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
              isLoading={loadingDelete}
              className="border border-white rounded-xl px-10 font-semibold"
              theme={Colors.Default}
              onPress={modalConfirm.onClose}
            >
              Cancelar
            </ButtonUi>
            <ButtonUi
              isLoading={loadingDelete}
              className="border border-white rounded-xl px-10 font-semibold"
              theme={Colors.Error}
              onPress={() => deletePermanently(selectedShoppingId ?? 0)}
            >
              Eliminar
            </ButtonUi>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className=" w-full h-full bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full flex flex-col border border-white overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex justify-between mt-6 w-full px-5">
            <div className="md:hidden justify-start flex-grow mt-0">
              <TooltipGlobal text="Filtrar">
                <ButtonUi
                  theme={Colors.Primary}
                  isIconOnly
                  onPress={() => setOpenVaul(true)}
                  type="button"
                >
                  <Filter />
                </ButtonUi>
              </TooltipGlobal>
              <BottomDrawer
                open={openVaul}
                onClose={() => setOpenVaul(false)}
                title="Filtros disponibles"
              >
                <div className="flex flex-col  gap-2">
                  <Input
                    className="dark:text-white border border-white rounded-xl"
                    onChange={(e) => {
                      setDateInitial(e.target.value);
                    }}
                    placeholder="Buscar por fecha..."
                    type="date"
                    value={dateInitial}
                    variant="bordered"
                    label="Fecha inicial"
                    labelPlacement="outside"
                    classNames={{
                      label: 'text-sm font-semibold',
                    }}
                  />
                  <Input
                    className="dark:text-white border border-white rounded-xl"
                    onChange={(e) => {
                      setDateEnd(e.target.value);
                    }}
                    value={dateEnd}
                    placeholder="Buscar por fecha..."
                    variant="bordered"
                    label="Fecha final"
                    type="date"
                    labelPlacement="outside"
                    classNames={{
                      label: 'text-sm font-semibold',
                    }}
                  />
                  <div className="w-full">
                    <p className="text-sm font-semibold dark:text-white">Sucursal</p>
                    <Autocomplete
                      className="dark:text-white font-semibold border border-white rounded-xl"
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="Selecciona la sucursal"
                      clearButtonProps={{ onClick: () => setBranchId('') }}
                      selectedKey={branchId}
                      onSelectionChange={(key) =>
                        key ? setBranchId(String(key)) : setBranchId('')
                      }
                    >
                      {branches_list.map((item) => (
                        <AutocompleteItem key={item.name} className="dark:text-white">
                          {item.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>

                  <ButtonUi
                    theme={Colors.Primary}
                    className="mt-6 font-semibold"
                    onPress={() => {
                      searchDailyReport();
                      setOpenVaul(false);
                    }}
                  >
                    Buscar
                  </ButtonUi>
                </div>
              </BottomDrawer>
            </div>
            <div className="flex justify-end mt-0 flex-grow">
              {actions.includes('Agregar') && (
                <AddButton onClick={() => navigate('/create-shopping')} />
              )}
            </div>
          </div>
          <div className="flex justify-between mt-4 gap-3 md:gap-5 items-end px-2">
            <Input
              className="dark:text-white border border-white rounded-xl hidden md:flex"
              onChange={(e) => {
                setDateInitial(e.target.value);
              }}
              placeholder="Buscar por fecha..."
              type="date"
              value={dateInitial}
              variant="bordered"
              label="Fecha inicial"
              labelPlacement="outside"
              classNames={{
                label: 'text-sm font-semibold',
              }}
            />
            <Input
              className="dark:text-white border border-white rounded-xl hidden md:flex"
              onChange={(e) => {
                setDateEnd(e.target.value);
              }}
              defaultValue={dateEnd}
              placeholder="Buscar por fecha..."
              variant="bordered"
              label="Fecha final"
              type="date"
              labelPlacement="outside"
              classNames={{
                label: 'text-sm font-semibold',
              }}
            />
            <Autocomplete
              className="dark:text-white font-semibold border border-white rounded-xl hidden md:flex"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Selecciona la sucursal"
              label="Sucursal"
              clearButtonProps={{ onClick: () => setBranchId('') }}
              selectedKey={branchId}
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
              variant="bordered"
              labelPlacement="outside"
              label="Cantidad a mostrar"
              classNames={{
                label: 'font-semibold',
              }}
              defaultSelectedKeys={['5']}
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
              }}
            >
              {limit_options.map((option) => (
                <SelectItem className="w-full dark:text-white" key={option}>
                  {option}
                </SelectItem>
              ))}
            </Select>
            <div className="hidden md:flex items-end justify-end">
              <ButtonUi
                theme={Colors.Primary}
                startContent={<SearchIcon className="w-full" />}
                onPress={searchDailyReport}
              >
                Buscar
              </ButtonUi>
            </div>
          </div>

          <div className="mt-6 m-6">
            <div className="max-h-full  overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
              <table className="w-full">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr>
                    <ThGlobal className="text-left p-3">No.</ThGlobal>
                    <ThGlobal className="text-left p-3">No. de control</ThGlobal>
                    <ThGlobal className="text-left p-3">Cod. generación</ThGlobal>
                    <ThGlobal className="text-left p-3">Fecha/Hora emisión</ThGlobal>
                    <ThGlobal className="text-left p-3">Subtotal</ThGlobal>
                    <ThGlobal className="text-left p-3">IVA</ThGlobal>
                    <ThGlobal className="text-left p-3">Monto total</ThGlobal>
                    <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                  </tr>
                </thead>
                <tbody className="max-h-[600px] w-full overflow-y-auto">
                  {loading_shopping ? (
                    <tr>
                      <td colSpan={5} className="p-3 text-sm text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center w-full h-64">
                          <div className="loader"></div>
                          <p className="mt-3 text-xl font-semibold">Cargando...</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {shoppingList.length > 0 ? (
                        <>
                          {shoppingList.map((cat) => (
                            <tr className="border-b border-slate-200" key={cat.id}>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {cat.id}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                {cat.controlNumber}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                {cat.generationCode}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                {cat.fecEmi} {cat.horEmi}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                {cat.subTotal}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                {cat.totalIva}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                {cat.montoTotalOperacion}
                              </td>

                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                <div className="flex gap-2">
                                  <ButtonUi
                                    onPress={() =>
                                      navigate(`/edit-shopping/${cat.id}/${cat.controlNumber}`)
                                    }
                                    theme={Colors.Success}
                                    isIconOnly
                                  >
                                    <Pen />
                                  </ButtonUi>
                                  {cat.generationCode !== 'N/A' && (
                                    <>
                                      <ButtonUi
                                        onPress={() => handleVerify(cat.id)}
                                        theme={Colors.Error}
                                        isIconOnly
                                      >
                                        <Trash />
                                      </ButtonUi>
                                    </>
                                  )}
                                  {cat.generationCode === 'N/A' && (
                                    <Popover className="border border-white rounded-xl">
                                      <PopoverTrigger>
                                        <Button style={style} isIconOnly>
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
                                              onPress={() => onDeleteConfirm(cat.id)}
                                              theme={Colors.Error}
                                              className="mr-2"
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
                        </>
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            <div className="flex flex-col items-center justify-center w-full">
                              <img src={NO_DATA} alt="X" className="w-32 h-32" />
                              <p className="mt-3 text-xl">No se encontraron resultados</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            {pagination_shopping.totalPag > 1 && (
              <>
                <div className="w-full mt-5">
                  <Pagination
                    previousPage={pagination_shopping.prevPag}
                    nextPage={pagination_shopping.nextPag}
                    currentPage={pagination_shopping.currentPag}
                    totalPages={pagination_shopping.totalPag}
                    onPageChange={(page) => {
                      getPaginatedShopping(
                        user?.correlative?.branch.transmitterId ??
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
          </div>
        </div>
      </div>
    </>
  );
}

export default ShoppingPage;
