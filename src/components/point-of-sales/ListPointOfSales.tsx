import { useContext, useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, Button, Switch } from '@nextui-org/react';
import { Table as Filter, Building2, EditIcon } from 'lucide-react';
import { ThemeContext } from '../../hooks/useTheme';
import { global_styles } from '../../styles/global.styles';
import classNames from 'classnames';
import TooltipGlobal from '../global/TooltipGlobal';
import BottomDrawer from '../global/BottomDrawer';
import { usePointOfSales } from '@/store/point-of-sales.store';
import { Branches } from '@/types/branches.types';
import { useBranchesStore } from '@/store/branches.store';
import { PayloadPointOfSales, PointOfSales } from '@/types/point-of-sales.types';
import LoadingTable from '../global/LoadingTable';

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
  const [active, setActive] = useState(true);

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

  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  const toggleSection = (branchIndex: number) => {
    setExpandedSections((prevSections) => ({
      ...prevSections,
      [branchIndex]: !prevSections[branchIndex],
    }));
  };

  return (
    <>
      <div className="w-full h-full p-4 md:p-6 md:px-4 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full flex flex-col p-8 mt-2 rounded-xl overflow-y-auto bg-white custom-scrollbar shadow border dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-col justify-between w-full gap-5 lg:flex-row lg:gap-0">
            <div className="hidden  w-full gap-5 md:flex">
              <div className="w-full">
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
              </div>
            </div>
          </div>

          <div className="md:hidden flex justify-between items-end gap-4 mb-3">
            <div className="md:hidden items-center">
              <Switch
                onValueChange={(active) => setActive(active)}
                classNames={{
                  thumb: classNames(active ? 'bg-blue-500' : 'bg-gray-400'),
                  wrapper: classNames(active ? '!bg-blue-300' : 'bg-gray-200'),
                }}
                isSelected={active}
              >
                <span className="text-sm sm:text-base whitespace-nowrap">
                  Mostrar {active ? 'inactivos' : 'activos'}
                </span>
              </Switch>
            </div>
          </div>

          <>

            <div className="mt-4">
              {point_of_sales_list?.pointOfSales &&
                Object.entries(point_of_sales_list.pointOfSales).map(
                  ([locationKey, salePointArray], index) => (
                    <div
                      key={index}
                      className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4"
                    >
                      <table className="w-full border-collapse border border-gray-200 rounded-lg">
                        {/* Encabezado por punto de venta */}
                        <thead>
                          <tr>
                            <th
                              colSpan={5}
                              className="p-3 text-center bg-[#1D3557] text-lg font-semibold dark:text-gray-100 dark:bg-slate-700 text-white border border-gray-200 sticky top-0 z-30 rounded-t-lg"
                            >
                              {locationKey} - M001 - P001
                            </th>
                          </tr>
                        </thead>

                        {/* Encabezado de columnas */}
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

                        {/* Cuerpo de la tabla */}
                        <tbody className="max-h-[600px] w-full overflow-y-auto border border-gray-200">
                          {salePointArray.length === 0 ? (
                            <tr>
                              <td
                                colSpan={5}
                                className="p-3 text-sm text-center text-slate-500 border border-gray-200"
                              >
                                No hay datos disponibles.
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
                                  <TooltipGlobal text="Editar">
                                    <Button
                                      className="border border-white"
                                      onClick={() => {
                                        handleEdit(salePoint);
                                      }}
                                      isIconOnly
                                      style={{ backgroundColor: theme.colors.secondary }}
                                    >
                                      <EditIcon style={{ color: theme.colors.primary }} size={20} />
                                    </Button>
                                  </TooltipGlobal>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
            </div>

            {/* --Propio si arruino otro usar este--------------------- */}
            {/* <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
              <table className="w-full border-collapse border border-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th
                      colSpan={5}
                      className="p-3 text-center bg-[#1D3557] text-lg font-semibold  dark:text-gray-100 dark:bg-slate-700 text-white border border-gray-200 sticky top-0 z-30 rounded-t-lg"
                    >
                      Sonsonate - M001 - P001
                    </th>
                  </tr>
                </thead>

                <thead className="sticky top-[48px] z-20 bg-white border border-gray-200">
                  <tr>
                    <th
                      style={global_styles().darkStyle}
                      className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200"
                    >
                      Tipo
                    </th>
                    <th
                      style={global_styles().darkStyle}
                      className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200"
                    >
                      Descripción
                    </th>
                    <th
                      style={global_styles().darkStyle}
                      className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200"
                    >
                      Anterior
                    </th>
                    <th
                      style={global_styles().darkStyle}
                      className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200"
                    >
                      Siguiente
                    </th>
                    <th
                      style={global_styles().darkStyle}
                      className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="max-h-[600px] w-full overflow-y-auto border border-gray-200">
                  {loading_point_of_sales_list ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-3 text-sm text-center text-slate-500 border border-gray-200"
                      >
                        <LoadingTable />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {point_of_sales_list?.pointOfSales &&
                        Object.values(point_of_sales_list.pointOfSales).map(
                          (salePointArray: PointOfSales[]) =>
                            salePointArray.map((salePoint: PointOfSales, index: number) => (
                              <tr className="border border-gray-400 h-16" key={index}>
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
                                  <TooltipGlobal text="Editar">
                                    <Button
                                      className="border border-white"
                                      onClick={() => {
                                        handleEdit(salePoint);
                                      }}
                                      isIconOnly
                                      style={{
                                        backgroundColor: theme.colors.secondary,
                                      }}
                                    >
                                      <EditIcon
                                        style={{
                                          color: theme.colors.primary,
                                        }}
                                        size={20}
                                      />
                                    </Button>
                                  </TooltipGlobal>
                                </td>
                              </tr>
                            ))
                        )}
                    </>
                  )}
                </tbody>
              </table>
            </div> */}

            {/* estes no ---------------------------------------------- -----------------------*/}
            {/* <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
              <table className="w-full border-collapse border border-gray-200 rounded-lg">
         
                {point_of_sales_list?.pointOfSales &&
                  Object.values(point_of_sales_list.pointOfSales).map(
                    (salePointArray: PointOfSales[], indexGroup: number) => (
                      <tbody key={indexGroup}>
            
                        <thead>
                          <tr>
                            <th
                              colSpan={5}
                              className="p-3 text-center bg-[#1D3557] text-lg font-semibold dark:text-gray-100 dark:bg-slate-700 text-white border border-gray-200 sticky top-0 z-30 rounded-t-lg"
                            >
                              Sonsonate - {salePointArray[0]?.code} - P{indexGroup + 1}
                            </th>
                          </tr>
                        </thead>

                  
                        <thead className="sticky top-[48px] z-20 bg-white border border-gray-200">
                          <tr>
                            <th
                              style={global_styles().darkStyle}
                              className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200"
                            >
                              Tipo
                            </th>
                            <th
                              style={global_styles().darkStyle}
                              className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200"
                            >
                              Descripción
                            </th>
                            <th
                              style={global_styles().darkStyle}
                              className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200"
                            >
                              Anterior
                            </th>
                            <th
                              style={global_styles().darkStyle}
                              className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200"
                            >
                              Siguiente
                            </th>
                            <th
                              style={global_styles().darkStyle}
                              className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200 border border-gray-200"
                            >
                              Acciones
                            </th>
                          </tr>
                        </thead>

                       
                        {salePointArray.map((salePoint: PointOfSales, index: number) => (
                          <tr className="border border-gray-400 h-16" key={index}>
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
                                  editableSales.find((item) => item.id === salePoint.id)?.prev ??
                                  salePoint.prev
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
                                  editableSales.find((item) => item.id === salePoint.id)?.next ??
                                  salePoint.next
                                }
                                onInput={(e) =>
                                  handleChange(salePoint.id, 'next', e.currentTarget.value)
                                }
                                className="border p-2 rounded-md text-sm"
                                placeholder="Siguiente"
                              />
                            </td>
                            <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100 border border-gray-200">
                              <TooltipGlobal text="Editar">
                                <Button
                                  className="border border-white"
                                  onClick={() => {
                                    handleEdit(salePoint);
                                  }}
                                  isIconOnly
                                  style={{
                                    backgroundColor: theme.colors.secondary,
                                  }}
                                >
                                  <EditIcon
                                    style={{
                                      color: theme.colors.primary,
                                    }}
                                    size={20}
                                  />
                                </Button>
                              </TooltipGlobal>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )
                  )}
              </table>
            </div> */}
          </>
        </div>
      </div>
    </>
  );
}

export default ListPointOfSales;
