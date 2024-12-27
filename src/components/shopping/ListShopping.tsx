import { Autocomplete, AutocompleteItem, Button, Input, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { ChevronLeft, ChevronRight, Filter, Pen, SearchIcon, Trash } from 'lucide-react';
import NO_DATA from '@/assets/svg/no_data.svg';
import { useNavigate } from 'react-router-dom';
import Pagination from '../global/Pagination';
import { useAuthStore } from '@/store/auth.store';
import { useBranchProductStore } from '@/store/branch_product.store';
import useGlobalStyles from '../global/global.styles';
import { fechaEnFormatoDeseado } from '@/utils/date';
import { useShoppingStore } from '@/store/shopping.store';
import { ArrayAction } from '@/types/view.types';
import AddButton from '../global/AddButton';
import { useContext, useEffect, useState } from 'react';
import TooltipGlobal from '../global/TooltipGlobal';
import { global_styles } from '@/styles/global.styles';
import BottomDrawer from '../global/BottomDrawer';
import { ThemeContext } from '@/hooks/useTheme';
import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { toast } from 'sonner';

function ShoppingPage({ actions }: ArrayAction) {
  const styles = useGlobalStyles();
  const [dateInitial, setDateInitial] = useState(fechaEnFormatoDeseado);
  const [dateEnd, setDateEnd] = useState(fechaEnFormatoDeseado);
  const { shoppingList, getPaginatedShopping, loading_shopping, pagination_shopping } =
    useShoppingStore();
 
  const { theme } = useContext(ThemeContext);
  const [openVaul, setOpenVaul] = useState(false);
  const { user } = useAuthStore();
  const { getBranchesList, branches_list } = useBranchProductStore();
  const [branchId, setBranchId] = useState('');
  useEffect(() => {
    getPaginatedShopping(
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
      1,
      10,
      dateInitial,
      dateEnd,
      branchId
    );
    getBranchesList();
  }, []);

  const searchDailyReport = () => {
    getPaginatedShopping(
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
      1,
      10,
      dateInitial,
      dateEnd,
      branchId
    );
  };
  const navigate = useNavigate();

  // const onDelete = (id: number) => {
  //   axios
  //     .delete(API_URL + "/shoppings/" + id)
  //     .then(() => {
  //       getPaginatedShopping(
  //         user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
  //         1,
  //         10,
  //         dateInitial,
  //         dateEnd,
  //         branchId
  //       );
  //       toast.success("Eliminado con exito")
  //     })
  //     .catch(() => {
  //       toast.error("Error al eliminar")
  //     })
  // }



  const onDeleteConfirm = (id: number) => {
    axios
      .delete(API_URL + "/shoppings/" + id)
      .then(() => {
        getPaginatedShopping(
          user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
          1,
          10,
          dateInitial,
          dateEnd,
          branchId
        );
        toast.success("Eliminado con éxito");
      })
      .catch(() => {
        toast.error("Error al eliminar");
      });
  };
  return (
    <>
      <div className=" w-full h-full bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full flex flex-col border border-white overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex justify-between  mt-6 w-full">
            <div className="md:hidden justify-start flex-grow mt-0">
              <TooltipGlobal text="Filtrar">
                <Button
                  className="border border-white rounded-xl"
                  style={global_styles().thirdStyle}
                  isIconOnly
                  onClick={() => setOpenVaul(true)}
                  type="button"
                >
                  <Filter />
                </Button>
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
                    defaultValue={fechaEnFormatoDeseado}
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
                    defaultValue={fechaEnFormatoDeseado}
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
                    >
                      {branches_list.map((item) => (
                        <AutocompleteItem
                          key={JSON.stringify(item)}
                          onClick={() => setBranchId(item.name)}
                          value={item.name}
                          className="dark:text-white"
                        >
                          {item.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>

                  <Button
                    style={{
                      backgroundColor: theme.colors.secondary,
                      color: theme.colors.primary,
                      fontSize: '16px',
                    }}
                    className="mt-6 font-semibold"
                    onClick={() => {
                      searchDailyReport();
                      setOpenVaul(false);
                    }}
                  >
                    Buscar
                  </Button>
                </div>
              </BottomDrawer>
            </div>
            <div className="flex justify-end mt-0 flex-grow">
              {actions.includes('Agregar') && (
                <AddButton onClick={() => navigate('/CreateShopping')} />
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 m-4 gap-5 px-2">
            <Input
              className="dark:text-white border border-white rounded-xl hidden md:flex"
              onChange={(e) => {
                setDateInitial(e.target.value);
              }}
              placeholder="Buscar por fecha..."
              type="date"
              defaultValue={fechaEnFormatoDeseado}
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
              defaultValue={fechaEnFormatoDeseado}
              placeholder="Buscar por fecha..."
              variant="bordered"
              label="Fecha final"
              type="date"
              labelPlacement="outside"
              classNames={{
                label: 'text-sm font-semibold',
              }}
            />

            <div className="w-full ">
              <p className="text-sm font-semibold dark:text-white">Sucursal</p>
              <Autocomplete
                className="dark:text-white font-semibold border border-white rounded-xl hidden md:flex"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Selecciona la sucursal"
                clearButtonProps={{ onClick: () => setBranchId('') }}
              >
                {branches_list.map((item) => (
                  <AutocompleteItem
                    key={JSON.stringify(item)}
                    onClick={() => setBranchId(item.name)}
                    value={item.name}
                    className="dark:text-white"
                  >
                    {item.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>

            <div className="w-full hidden md:flex">
              <Button
                className="mt-6 border border-white"
                startContent={<SearchIcon className="w-full" />}
                onClick={searchDailyReport}
                style={styles.secondaryStyle}
              >
                Buscar
              </Button>
            </div>
          </div>

          <div className="mt-6 m-6">
            <div className="max-h-full  overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
              <table className="w-full">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      No.
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Número de control
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Código de generación
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Fecha/Hora emisión
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Subtotal
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      IVA
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Monto total
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Acciones
                    </th>
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
                                <div className='flex gap-2'>
                                  {cat.generationCode === 'N/A' && (
                                    <Button
                                      onClick={() => navigate(`/edit-shopping/${cat.id}`)}
                                      style={global_styles().secondaryStyle}
                                      isIconOnly
                                    >
                                      <Pen />
                                    </Button>
                                  )}
                                  {/* {cat.generationCode === 'N/A' && (
                                    <Button
                                      onClick={() => onDelete(cat.id)}
                                      style={global_styles().warningStyles}
                                      isIconOnly
                                    >
                                      <Trash />
                                    </Button>
                                  )} */}
                                  {cat.generationCode === 'N/A' && (
                                    <Popover className="border border-white rounded-xl"
                                    >
                                      <PopoverTrigger>
                                        <Button
                                          style={global_styles().warningStyles}
                                          isIconOnly
                                        >
                                          <Trash />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent>
                                        <div className="p-4">
                                          <p className="text-sm font-normal text-gray-600">
                                            ¿Deseas eliminar el registro {cat.controlNumber}?
                                          </p>
                                          <div className="flex justify-center mt-4">
                                            <Button
                                              onClick={() => onDeleteConfirm(cat.id)}
                                              style={{
                                                backgroundColor: '#FF4D4F',
                                                color: 'white',
                                              }}
                                              className="mr-2"
                                            >
                                              Sí, eliminar
                                            </Button>
                                            {/* <Button onClick={onClose} >
                                              Cancelar
                                            </Button> */}
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
                <div className="hidden w-full mt-5 md:flex">
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
                        10,
                        dateInitial,
                        dateEnd,
                        branchId
                      );
                    }}
                  />
                </div>
                <div className="flex items-center justify-between w-full mt-5 md:hidden">
                  <Button
                    onClick={() => {
                      getPaginatedShopping(
                        user?.correlative?.branch.transmitterId ??
                        user?.pointOfSale?.branch.transmitterId ??
                        0,
                        pagination_shopping.prevPag,

                        5,
                        dateInitial,
                        dateEnd,
                        branchId
                      );
                    }}
                    style={styles.darkStyle}
                    isIconOnly
                  >
                    <ChevronLeft />
                  </Button>
                  <span className="font-semibold">
                    {pagination_shopping.currentPag} de {pagination_shopping.totalPag}
                  </span>
                  <Button
                    onClick={() => {
                      getPaginatedShopping(
                        user?.correlative?.branch.transmitterId ??
                        user?.pointOfSale?.branch.transmitterId ??
                        0,
                        pagination_shopping.prevPag,

                        5,
                        dateInitial,
                        dateEnd,
                        branchId
                      );
                    }}
                    style={styles.darkStyle}
                    isIconOnly
                  >
                    <ChevronRight />
                  </Button>
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
