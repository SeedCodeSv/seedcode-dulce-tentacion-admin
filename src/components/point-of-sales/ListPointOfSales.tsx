import { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, ButtonGroup, Input } from '@heroui/react';
import { Filter, Building2, Table2Icon, CreditCard } from 'lucide-react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

import TooltipGlobal from '../global/TooltipGlobal';
import BottomDrawer from '../global/BottomDrawer';
import LoadingTable from '../global/LoadingTable';

import NoData from './types/NoData';

import { usePointOfSales } from '@/store/point-of-sales.store';
import { Branches } from '@/types/branches.types';
import { useBranchesStore } from '@/store/branches.store';
import { PayloadPointOfSales, PointOfSales } from '@/types/point-of-sales.types';
import useWindowSize from '@/hooks/useWindowSize';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
interface Props {
  actions: string[];
}
function ListPointOfSales({ actions }: Props) {
  const [editableSales, setEditableSales] = useState<PointOfSales[]>([]);
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
          toast.success(response ? 'Actualizado correctamente' : 'Error al actualizar');
        })
        .catch(() => {
          toast.error('Error al actualizar');
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
      <div className="w-full h-full ">
        <div className="w-full h-full flex flex-col p-5 mt-2  overflow-y-auto bg-white custom-scrollbar  dark:bg-gray-900">
          <div className="flex flex-col justify-between w-full gap-5 lg:flex-row lg:gap-0">
            <div className="hidden  w-full gap-5 md:flex">
              <div className="w-80">
                <Autocomplete
                  className="w-full dark:text-white hidden md:flex"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  clearButtonProps={{
                    onClick: () => setBranch(0),
                  }}
                  label="Sucursal"
                  labelPlacement="outside"
                  placeholder="Selecciona una sucursal"
                  startContent={<Building2 size={20} />}
                  variant="bordered"
                  onSelectionChange={(key) => {
                    if (key) {
                      const branchSelected = JSON.parse(key as string) as Branches;

                      setBranch(branchSelected.id);
                    }
                  }}
                >
                  {branch_list.map((bra) => (
                    <AutocompleteItem key={JSON.stringify(bra)} className="dark:text-white">
                      {bra.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>

              <div className="mt-6">
                <ButtonUi
                  className="font-semibold w-32"
                  color="primary"
                  theme={Colors.Primary}
                  onPress={() => handleSearch(undefined)}
                >
                  Buscar
                </ButtonUi>
              </div>
            </div>
          </div>
          <div className="flex mt-0 md:mt-4 gap-5 mb-4 items-end justify-between">
            <div className="flex items-center gap-5 md:hidden">
              <div className="block md:hidden">
                <TooltipGlobal color="primary" text="Buscar por filtros">
                  <ButtonUi
                    isIconOnly
                    theme={Colors.Info}
                    type="button"
                    onPress={() => setOpenVaul(true)}
                  >
                    <Filter />
                  </ButtonUi>
                </TooltipGlobal>

                <BottomDrawer
                  open={openVaul}
                  title="Filtros disponibles"
                  onClose={() => setOpenVaul(false)}
                >
                  <div className="flex flex-col gap-3">
                    <Autocomplete
                      className="w-full dark:text-white "
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      clearButtonProps={{
                        onClick: () => setBranch(0),
                      }}
                      label="Sucursal"
                      labelPlacement="outside"
                      placeholder="Selecciona una sucursal"
                      startContent={<Building2 size={20} />}
                      variant="bordered"
                      onSelectionChange={(key) => {
                        if (key) {
                          const branchSelected = JSON.parse(key as string) as Branches;

                          setBranch(branchSelected.id);
                        }
                      }}
                    >
                      {branch_list.map((bra) => (
                        <AutocompleteItem key={JSON.stringify(bra)} className="dark:text-white">
                          {bra.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>

                    <ButtonUi
                      className="mb-10 font-semibold"
                      color="primary"
                      theme={Colors.Primary}
                      onPress={() => {
                        handleSearch(undefined);
                        setOpenVaul(false);
                      }}
                    >
                      Aplicar
                    </ButtonUi>
                  </div>
                </BottomDrawer>

                <ButtonGroup className="mt-4">
                  <ButtonUi
                    isIconOnly
                    theme={view === 'table' ? Colors.Primary : Colors.Default}
                    onPress={() => setView('table')}
                  >
                    <Table2Icon />
                  </ButtonUi>
                  <ButtonUi
                    isIconOnly
                    theme={view === 'list' ? Colors.Primary : Colors.Default}
                    onPress={() => setView('list')}
                  >
                    <CreditCard />
                  </ButtonUi>
                </ButtonGroup>
              </div>
            </div>
          </div>
          <>
            {/* con ac?rdeon --------------------------------------------------------------- */}
            <div className="mt-4">
              {loading_point_of_sales_list ? (
                <div className="flex justify-center items-center h-full">
                  <LoadingTable />
                </div>
              ) : point_of_sales_list?.pointOfSales &&
                Object.keys(point_of_sales_list.pointOfSales).length > 0 ? (
                Object.entries(point_of_sales_list.pointOfSales).map(
                  ([, salePointArray], index) => (
                    <div
                      key={index}
                      className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4 mb-6 w-full"
                    >
                      <table className="w-full border-collapse border border-gray-200 rounded-lg">
                        <thead>
                          <tr>
                            <th
                              className="p-3 text-center bg-[#1D3557] text-lg font-semibold dark:text-gray-100 dark:bg-slate-700 text-white border border-gray-200 sticky top-0 z-30 w-full"
                              colSpan={5}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="mx-auto text-sm sm:text-base lg:text-lg">
                                  {point_of_sales_list.name || 'Nombre de la Sucursal'} -{' '}
                                  {salePointArray[0]?.code || 'Código'} -{' '}
                                  {salePointArray[0]?.codPuntoVenta || 'Código Punto de Venta'}
                                </span>
                                <button
                                  className="ml-2 focus:outline-none text-white"
                                  onClick={() => toggleOpen(index)}
                                >
                                  {openIndex === index ? (
                                    <ChevronUp className="dark:text-white" size={20} />
                                  ) : (
                                    <ChevronDown className="dark:text-white" size={20} />
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
                                      className="p-3 text-sm text-center text-slate-500 border border-gray-200"
                                      colSpan={5}
                                    >
                                      No se encontraron registros.
                                    </td>
                                  </tr>
                                ) : (
                                  salePointArray.map((salePoint: PointOfSales, idx: number) => (
                                    <tr key={idx} className="border border-gray-400 h-16">
                                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap border border-gray-200">
                                        {salePoint.typeVoucher}
                                      </td>
                                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100 border border-gray-200">
                                        {salePoint.description}
                                      </td>
                                      <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100 border border-gray-200">
                                        <Input
                                          className="border border-white   text-sm w-full rounded-xl"
                                          defaultValue={salePoint.prev.toString()}
                                          placeholder="Anterior"
                                          type="number"
                                          variant="bordered"
                                          onInput={(e) =>
                                            handleChange(
                                              salePoint.id,
                                              'prev',
                                              e.currentTarget.value
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100 border border-gray-200">
                                        <Input
                                          className="border border-white rounded-xl text-sm w-full "
                                          defaultValue={salePoint.next.toString()}
                                          placeholder="Siguiente"
                                          type="number"
                                          variant="bordered"
                                          onInput={(e) =>
                                            handleChange(
                                              salePoint.id,
                                              'next',
                                              e.currentTarget.value
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100 border border-gray-200">
                                        {actions.includes('Editar') && (
                                          <ButtonUi
                                            isIconOnly
                                            theme={Colors.Success}
                                            onPress={() => {
                                              handleEdit(salePoint);
                                            }}
                                          >
                                            <p className="text-white ">Actualizar</p>
                                          </ButtonUi>
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
