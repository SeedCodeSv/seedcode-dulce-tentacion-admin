import { useContext, useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, Button, ButtonGroup } from '@nextui-org/react';
import { Filter, Building2, EditIcon, List } from 'lucide-react';
import { ThemeContext } from '../../hooks/useTheme';
import { global_styles } from '../../styles/global.styles';
import TooltipGlobal from '../global/TooltipGlobal';
import BottomDrawer from '../global/BottomDrawer';
import { usePointOfSales } from '@/store/point-of-sales.store';
import { Branches } from '@/types/branches.types';
import { useBranchesStore } from '@/store/branches.store';
import { PayloadPointOfSales, PointOfSales } from '@/types/point-of-sales.types';
import LoadingTable from '../global/LoadingTable';
import NoData from './types/NoData';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useWindowSize from '@/hooks/useWindowSize';
interface Props {
  actions: string[];
}
function ListPointOfSales({ actions }: Props) {
  const [editableSales, setEditableSales] = useState<PointOfSales[]>([]);
  const { theme } = useContext(ThemeContext);
  const [branch, setBranch] = useState(0);
  const { getBranchesList, branch_list } = useBranchesStore();
  const {
    getPointOfSalesList,
    point_of_sales_list,
    loading_point_of_sales_list,
    patchPointOfSales,
  } = usePointOfSales();

  useEffect(() => {
    getBranchesList();
    getPointOfSalesList(branch);
  }, []);

  const handleSearch = (searchParam: number | undefined) => {
    getPointOfSalesList(searchParam ?? branch);
  };

  const [openVaul, setOpenVaul] = useState(false);
  useEffect(() => {
    if (point_of_sales_list?.pointOfSales) {
      const salesData = Object.values(point_of_sales_list.pointOfSales).flat();
      setEditableSales(salesData);
    }
  }, [point_of_sales_list]);

  const handleEdit = (salePoint: PointOfSales) => {
    const updatedSale = editableSales.find((item) => item.id === salePoint.id);
    if (updatedSale) {
      const payload: PayloadPointOfSales = {
        prev: updatedSale.prev,
        next: updatedSale.next,
      };

      patchPointOfSales(payload, salePoint.id)
        .then((response) => {
          console.log('Actualización exitosa', response);
        })
        .catch((error) => {
          console.error('Error al actualizar:', error);
        });
    }
  };

  const handleChange = (id: number, field: keyof PayloadPointOfSales, value: string | number) => {
    setEditableSales((prevSales) =>
      prevSales.map((salePoint) =>
        salePoint.id === id
          ? {
              ...salePoint,
              [field]: value === '' ? '' : Number(value),
            }
          : salePoint
      )
    );
  };
  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'list'>(windowSize.width < 768 ? 'list' : 'table');

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleOpen = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <>
      <div className="w-full h-full p-4 md:p-6 md:px-4 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full flex flex-col p-8 mt-2 rounded-xl overflow-y-auto bg-white custom-scrollbar shadow border dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-col justify-between w-full gap-5 lg:flex-row lg:gap-0">
            <div className="hidden  w-full gap-5 md:flex">
              <div className="w-80">
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const branchSelected = JSON.parse(key as string) as Branches;
                      setBranch(branchSelected.id);
                    }
                  }}
                  className="w-full dark:text-white hidden md:flex"
                  label="Sucursal"
                  startContent={<Building2 size={20} />}
                  labelPlacement="outside"
                  placeholder="Selecciona una sucursal"
                  variant="bordered"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  clearButtonProps={{
                    onClick: () => setBranch(0),
                  }}
                >
                  {branch_list.map((bra) => (
                    <AutocompleteItem
                      value={bra.id}
                      className="dark:text-white"
                      key={JSON.stringify(bra)}
                    >
                      {bra.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>

              <div className="mt-6">
                <Button
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.primary,
                  }}
                  className="font-semibold w-32"
                  color="primary"
                  onClick={() => handleSearch(undefined)}
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>
          <div className="flex mt-0 md:mt-4 gap-5 mb-4 items-end justify-between">
            <div className="flex items-center gap-5 md:hidden">
              <div className="block md:hidden">
                <TooltipGlobal text="Buscar por filtros" color="primary">
                  <Button
                    style={global_styles().thirdStyle}
                    isIconOnly
                    type="button"
                    onClick={() => setOpenVaul(true)}
                  >
                    <Filter />
                  </Button>
                </TooltipGlobal>

                <BottomDrawer
                  open={openVaul}
                  onClose={() => setOpenVaul(false)}
                  title="Filtros disponibles"
                >
                  <div className="flex flex-col gap-3">
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const branchSelected = JSON.parse(key as string) as Branches;
                          setBranch(branchSelected.id);
                        }
                      }}
                      className="w-full dark:text-white "
                      label="Sucursal"
                      startContent={<Building2 size={20} />}
                      labelPlacement="outside"
                      placeholder="Selecciona una sucursal"
                      variant="bordered"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      clearButtonProps={{
                        onClick: () => setBranch(0),
                      }}
                    >
                      {branch_list.map((bra) => (
                        <AutocompleteItem
                          value={bra.id}
                          className="dark:text-white"
                          key={JSON.stringify(bra)}
                        >
                          {bra.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>

                    <Button
                      style={global_styles().darkStyle}
                      className="mb-10 font-semibold"
                      color="primary"
                      onClick={() => {
                        handleSearch(undefined);
                        setOpenVaul(false);
                      }}
                    >
                      Aplicar
                    </Button>
                  </div>
                </BottomDrawer>

                <ButtonGroup className="xl:flex hidden mt-4 border border-white rounded-xl ">
                  <Button
                    className="hidden md:inline-flex"
                    isIconOnly
                    color="secondary"
                    style={{
                      backgroundColor: view === 'table' ? theme.colors.third : '#e5e5e5',
                      color: view === 'table' ? theme.colors.primary : '#3e3e3e',
                    }}
                    onClick={() => setView('table')}
                  >
                    {/* <ITable /> */}
                  </Button>

                  <Button
                    isIconOnly
                    color="default"
                    style={{
                      backgroundColor: view === 'list' ? theme.colors.third : '#e5e5e5',
                      color: view === 'list' ? theme.colors.primary : '#3e3e3e',
                    }}
                    onClick={() => setView('list')}
                  >
                    <List />
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>

          <>
            {/* <div className="mt-4">
              {loading_point_of_sales_list ? (
                // Mostrar el componente de carga mientras los datos se están cargando
                <div className="flex justify-center items-center h-full">
                  <LoadingTable />
                </div>
              ) : point_of_sales_list?.pointOfSales &&
                Object.keys(point_of_sales_list.pointOfSales).length > 0 ? (
                Object.entries(point_of_sales_list.pointOfSales).map(
                  ([_locationKey, salePointArray], index) => (
                    <div
                      key={index}
                      className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4 mb-20" // Aquí agregamos el margen inferior
                    >
                      <table className="w-full border-collapse border border-gray-200 rounded-lg">
                        <thead>
                          <tr>
                            <th
                              colSpan={5}
                              className="p-3 text-center bg-[#1D3557] text-lg font-semibold dark:text-gray-100 dark:bg-slate-700 text-white border border-gray-200 sticky top-0 z-30 rounded-t-lg"
                            >
                              {point_of_sales_list.name || 'Nombre de la Sucursal'} -
                              {salePointArray[0]?.code || 'Código'} -
                              {salePointArray[0]?.codPuntoVenta || 'Código Punto de Venta'}
                            </th>
                          </tr>
                        </thead>

                        <thead className="sticky top-[48px] z-20 bg-white border border-gray-200">
                          <tr>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200">
                              Tipo
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200">
                              Descripción
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200">
                              Anterior
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200">
                              Siguiente
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200">
                              Acciones
                            </th>
                          </tr>
                        </thead>

                        <tbody className="max-h-[600px] w-full overflow-y-auto border border-gray-200">
                          {salePointArray.length === 0 ? (
                            <tr>
                              <td
                                colSpan={5}
                                className="p-3 text-sm text-center text-slate-500 border border-gray-200"
                              >
                                No se encontraron registros.
                              </td>
                            </tr>
                          ) : (
                            salePointArray.map((salePoint: PointOfSales, idx: number) => (
                              <tr className="border border-gray-400 h-16" key={idx}>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap border border-gray-200">
                                  {salePoint.typeVoucher}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100 border border-gray-200">
                                  {salePoint.description}
                                </td>
                                <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100 border border-gray-200">
                                  <input
                                    type="number"
                                    value={
                                      editableSales.find((item) => item.id === salePoint.id)
                                        ?.prev ?? salePoint.prev
                                    }
                                    onInput={(e) =>
                                      handleChange(salePoint.id, 'prev', e.currentTarget.value)
                                    }
                                    className="border p-2 rounded-md text-sm"
                                    placeholder="Anterior"
                                  />
                                </td>
                                <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100 border border-gray-200">
                                  <input
                                    type="number"
                                    value={
                                      editableSales.find((item) => item.id === salePoint.id)
                                        ?.next ?? salePoint.next
                                    }
                                    onInput={(e) =>
                                      handleChange(salePoint.id, 'next', e.currentTarget.value)
                                    }
                                    className="border p-2 rounded-md text-sm"
                                    placeholder="Siguiente"
                                  />
                                </td>
                                <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100 border border-gray-200">
                                  {actions.includes('Editar') && (
                                    <TooltipGlobal text="Editar">
                                      <Button
                                        className="border border-white"
                                        onClick={() => {
                                          handleEdit(salePoint);
                                        }}
                                        isIconOnly
                                        style={{ backgroundColor: theme.colors.secondary }}
                                      >
                                        <EditIcon
                                          style={{ color: theme.colors.primary }}
                                          size={20}
                                        />
                                      </Button>
                                    </TooltipGlobal>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )
                )
              ) : (
                // Mostrar la imagen NoData si no hay datos filtrados
                <div className="flex justify-center items-center h-full">
                  <NoData />
                </div>
              )}
            </div> */}

            {/* con ac?rdeon --------------------------------------------------------------- */}
            <div className="mt-4">
              {loading_point_of_sales_list ? (
                <div className="flex justify-center items-center h-full">
                  <LoadingTable />
                </div>
              ) : point_of_sales_list?.pointOfSales &&
                Object.keys(point_of_sales_list.pointOfSales).length > 0 ? (
                Object.entries(point_of_sales_list.pointOfSales).map(
                  ([_locationKey, salePointArray], index) => (
                    <div
                      key={index}
                      className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4 mb-6 w-full"
                    >
                      <table className="w-full border-collapse border border-gray-200 rounded-lg">
                        <thead>
                          <tr>
                            <th
                              colSpan={5}
                              className="p-3 text-center bg-[#1D3557] text-lg font-semibold dark:text-gray-100 dark:bg-slate-700 text-white border border-gray-200 sticky top-0 z-30 w-full"
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="mx-auto text-sm sm:text-base lg:text-lg">
                                  {point_of_sales_list.name || 'Nombre de la Sucursal'} -{' '}
                                  {salePointArray[0]?.code || 'Código'} -{' '}
                                  {salePointArray[0]?.codPuntoVenta || 'Código Punto de Venta'}
                                </span>
                                <button
                                  onClick={() => toggleOpen(index)}
                                  className="ml-2 focus:outline-none text-white"
                                >
                                  {openIndex === index ? (
                                    <ChevronUp size={20} />
                                  ) : (
                                    <ChevronDown size={20} />
                                  )}
                                </button>
                              </div>
                            </th>
                          </tr>
                        </thead>

                        <tbody
                          className={`transition-all duration-500 ease-in-out overflow-hidden ${
                            openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          {openIndex === index && (
                            <>
                              <thead className="sticky top-[48px] z-20 bg-white border border-gray-200">
                                <tr>
                                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200 w-1/5">
                                    Tipo
                                  </th>
                                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200 w-2/5">
                                    Descripción
                                  </th>
                                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200 w-1/5">
                                    Anterior
                                  </th>
                                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200 w-1/5">
                                    Siguiente
                                  </th>
                                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200 w-1/5">
                                    Acciones
                                  </th>
                                </tr>
                              </thead>

                              <tbody className="max-h-[600px] w-full overflow-y-auto border border-gray-200">
                                {salePointArray.length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan={5}
                                      className="p-3 text-sm text-center text-slate-500 border border-gray-200"
                                    >
                                      No se encontraron registros.
                                    </td>
                                  </tr>
                                ) : (
                                  salePointArray.map((salePoint: PointOfSales, idx: number) => (
                                    <tr className="border border-gray-400 h-16" key={idx}>
                                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap border border-gray-200">
                                        {salePoint.typeVoucher}
                                      </td>
                                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100 border border-gray-200">
                                        {salePoint.description}
                                      </td>
                                      <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100 border border-gray-200">
                                        <input
                                          type="number"
                                          value={
                                            editableSales.find((item) => item.id === salePoint.id)
                                              ?.prev ?? salePoint.prev
                                          }
                                          onInput={(e) =>
                                            handleChange(
                                              salePoint.id,
                                              'prev',
                                              e.currentTarget.value
                                            )
                                          }
                                          className="border p-2 rounded-md text-sm w-full sm:w-28"
                                          placeholder="Anterior"
                                        />
                                      </td>
                                      <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100 border border-gray-200">
                                        <input
                                          type="number"
                                          value={
                                            editableSales.find((item) => item.id === salePoint.id)
                                              ?.next ?? salePoint.next
                                          }
                                          onInput={(e) =>
                                            handleChange(
                                              salePoint.id,
                                              'next',
                                              e.currentTarget.value
                                            )
                                          }
                                          className="border p-2 rounded-md text-sm w-full sm:w-28"
                                          placeholder="Siguiente"
                                        />
                                      </td>
                                      <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100 border border-gray-200">
                                        {actions.includes('Editar') && (
                                          <TooltipGlobal text="Editar">
                                            <Button
                                              className="border border-white"
                                              onClick={() => {
                                                handleEdit(salePoint);
                                              }}
                                              isIconOnly
                                              style={{ backgroundColor: theme.colors.secondary }}
                                            >
                                              <EditIcon
                                                style={{ color: theme.colors.primary }}
                                                size={20}
                                              />
                                            </Button>
                                          </TooltipGlobal>
                                        )}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )
                )
              ) : (
                <div className="flex justify-center items-center h-full">
                  <NoData />
                </div>
              )}
            </div>
          </>
        </div>
      </div>
    </>
  );
}

export default ListPointOfSales;

// const ListItem = (props: GridProps) => {
//   const { category, handleEdit, actions } = props;
//   return (
//     <>
//       <div className="flex w-full p-5 border shadow dark:border-gray-600 rounded-2xl">
//         <div className="w-full">
//           <div className="flex items-center w-full gap-2">
//             <ScrollIcon className=" dark:text-blue-300" size={20} />
//             <p className="w-full dark:text-white">{category.name}</p>
//           </div>
//         </div>
//         <div className="flex flex-col items-end justify-between w-full gap-5">
//           {category.isActive && actions.includes('Editar') ? (
//             <TooltipGlobal text="Editar el registro" color="primary">
//               <Button
//                 className="border border-white"
//                 onClick={() => handleEdit(category)}
//                 isIconOnly
//                 style={global_styles().secondaryStyle}
//               >
//                 <EditIcon style={global_styles().secondaryStyle} size={20} />
//               </Button>
//             </TooltipGlobal>
//           ) : (
//             <Button
//               type="button"
//               disabled
//               style={global_styles().secondaryStyle}
//               className="flex font-semibold border border-white  cursor-not-allowed"
//               isIconOnly
//             >
//               {/* <Lock /> */}
//             </Button>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };
