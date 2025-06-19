import { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, Input } from '@heroui/react';
import { Filter, Building2 } from 'lucide-react';
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
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import DivGlobal from '@/themes/ui/div-global';
import TdGlobal from '@/themes/ui/td-global';
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

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleOpen = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <>
      <DivGlobal>
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
            </div>
          </div>
        </div>
        <>
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
                    className="max-h-[70vh] overflow-y-auto overflow-x-auto custom-scrollbar mt-4 mb-6 w-full"
                  >
                    <table className="w-full border-separate border-spacing-0 border border-gray-200">
                      <thead className="sticky top-0 z-20 bg-[#1D3557] dark:bg-slate-700">
                        <tr>
                          <th
                            className="p-3 text-center text-white text-lg font-semibold border border-gray-200"
                            colSpan={5}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="mx-auto text-sm sm:text-base lg:text-lg">
                                {point_of_sales_list.name || 'Nombre de la Sucursal'} -{' '}
                                {salePointArray[0]?.code || 'Código'} -{' '}
                                {salePointArray[0]?.codPuntoVenta || 'Código Punto de Venta'}
                              </span>
                              <button className="ml-2 text-white" onClick={() => toggleOpen(index)}>
                                {openIndex === index ? (
                                  <ChevronUp className="dark:text-white" size={20} />
                                ) : (
                                  <ChevronDown className="dark:text-white" size={20} />
                                )}
                              </button>
                            </div>
                          </th>
                        </tr>

                        {openIndex === index && (
                          <tr className="sticky top-[48px] z-10 bg-slate-200 dark:bg-slate-800">
                            {['Tipo', 'Descripción', 'Anterior', 'Siguiente', 'Acciones'].map((header) => (
                              <th
                                key={header}
                                className="border-t border-b border-gray-200 p-3 text-sm font-semibold text-left text-slate-700 dark:text-slate-200 "
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        )}
                      </thead>


                      <tbody>
                        {openIndex === index && (
                          <>
                            {salePointArray.length === 0 ? (
                              <tr>
                                <td
                                  className="p-3 text-center text-sm text-slate-500 border border-gray-200"
                                  colSpan={5}
                                >
                                  No se encontraron registros.
                                </td>
                              </tr>
                            ) : (
                              salePointArray.map((salePoint: PointOfSales, idx: number) => (
                                <tr key={idx} className="h-16">
                                  <TdGlobal className="p-3 text-sm text-slate-600 dark:text-slate-100 whitespace-nowrap border-t border-gray-200 dark:border-gray-500">
                                    {salePoint.typeVoucher}
                                  </TdGlobal>
                                  <TdGlobal className="p-3 text-sm text-slate-600 dark:text-slate-100 whitespace-nowrap border-t border-gray-200 dark:border-gray-500">
                                    {salePoint.description}
                                  </TdGlobal>
                                  <TdGlobal className="p-3 border-t border-gray-200 dark:border-gray-500">
                                    <Input
                                      className="text-sm w-full rounded-xl"
                                      defaultValue={salePoint.prev.toString()}
                                      placeholder="Anterior"
                                      type="number"
                                      variant="bordered"
                                      onInput={(e) =>
                                        handleChange(salePoint.id, 'prev', e.currentTarget.value)
                                      }
                                    />
                                  </TdGlobal>
                                  <TdGlobal className="p-3 border-t border-gray-200 dark:border-gray-500">
                                    <Input
                                      className="text-sm w-full rounded-xl"
                                      defaultValue={salePoint.next.toString()}
                                      placeholder="Siguiente"
                                      type="number"
                                      variant="bordered"
                                      onInput={(e) =>
                                        handleChange(salePoint.id, 'next', e.currentTarget.value)
                                      }
                                    />
                                  </TdGlobal>
                                  <TdGlobal className="p-3 border-t border-gray-200 dark:border-gray-500">
                                    {actions.includes('Editar') && (
                                      <ButtonUi
                                        isIconOnly
                                        className='w-full'
                                        theme={Colors.Success}
                                        onPress={() => handleEdit(salePoint)}
                                      >
                                        Actualizar
                                      </ButtonUi>
                                    )}
                                  </TdGlobal>
                                </tr>
                              ))
                            )}
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
      </DivGlobal>
    </>
  );
}

export default ListPointOfSales;
