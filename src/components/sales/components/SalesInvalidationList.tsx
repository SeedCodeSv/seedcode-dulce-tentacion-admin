import { ThemeContext } from '@/hooks/useTheme';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSalesInvalidation } from '../store/sales_invalidations.store';
import { fechaActualString } from '@/utils/dates';
import { Autocomplete, AutocompleteItem, Button, Input, Switch } from "@heroui/react";
import { correlativesTypes } from '@/types/correlatives/correlatives_data.types';
import { CheckCircle, CircleX, Eye, Lock, Search, XCircle } from 'lucide-react';
import { useBranchesStore } from '@/store/branches.store';
import Pagination from '@/components/global/Pagination';
import SmPagination from '@/components/global/SmPagination';
import { formatCurrencySales } from '@/utils/dte';
import HeadlessModal from '@/components/global/HeadlessModal';
import { toast } from 'sonner';
import DetailSale from './DetailSale';
import { Correlatives } from '@/types/correlatives/correlatives_types';
import { get_correlatives } from '@/services/correlatives.service';

function SalesInvalidationList({ actions }: { actions: string[] }) {
  const [startDate, setStartDate] = useState(fechaActualString);
  const [codeSale, setCodeSale] = useState<Correlatives[]>([]);
  const [codeSelected, setCodeSelected] = useState('');
  const [correlative, setCorrelative] = useState('');

  const [endDate, setEndDate] = useState(fechaActualString);
  const { sales, OnGetSalesInvalidations, OnInvalidation, pagination_sales_invalidations } =
    useSalesInvalidation();
  const { getBranchesList, branch_list } = useBranchesStore();

  const [filter, setFilter] = useState({
    typeVoucher: '',
    correlativeType: '',
  });
  useEffect(() => {
    getBranchesList();
  }, []);
  const [branchId, setBranchId] = useState(1);
  const selectedBranchId = useMemo(() => {
    return branchId.toString() ?? branch_list[0].id.toString();
  }, [branchId]);
  useEffect(() => {
    if (branch_list.length > 0) {
      setBranchId(branch_list[0].id);
    }
  }, [branch_list]);
  const [status, setStatus] = useState(1);

  const toggleStatus = () => {
    setStatus((prevStatus) => (prevStatus === 1 ? 2 : 1));
  };
  useEffect(() => {
    OnGetSalesInvalidations(
      branchId,
      1,
      5,
      startDate,
      endDate,
      filter.typeVoucher,
      codeSelected,
      status,
      correlative
    );

    const getIdBranch = async () => {
      if (branchId > 0) {
        const data = await get_correlatives(branchId);
        setCodeSale(data.data.correlatives);
      }
    };

    getIdBranch();
  }, [status, branchId]);
  const { theme } = useContext(ThemeContext);
  const handleSearch = () => {
    OnGetSalesInvalidations(
      branchId,
      1,
      5,
      startDate,
      endDate,
      filter.typeVoucher,
      codeSelected,
      status,
      correlative
    );
  };
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const [invalidationSale, setInvalidationSale] = useState({
    isOpenModalInvalidation: false,
    isOpenModalDetail: false,
    saleId: 0,
  });
  const handleInvalidationSale = async () => {
    try {
      const data = await OnInvalidation(invalidationSale.saleId);
      if (data.ok) {
        setInvalidationSale({
          isOpenModalInvalidation: false,
          saleId: 0,
          isOpenModalDetail: false,
        });
        toast.success('Venta invalidada');
        OnGetSalesInvalidations(
          branchId,
          1,
          5,
          startDate,
          endDate,
          filter.typeVoucher,
          '',
          status,
          correlative
        );
      }
    } catch (e) {
      toast.error('No se pudo invalidar la venta');
      setInvalidationSale({
        isOpenModalInvalidation: false,
        saleId: 0,
        isOpenModalDetail: false,
      });
    }
  };
  const [id, setId] = useState(0);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  return (
    <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
      <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
        <div className="grid grid-cols-3 gap-5  mb-3  md:grid">
          <div className="w-full">
            <Autocomplete
              defaultSelectedKey={selectedBranchId}
              value={selectedBranchId}
              selectedKey={selectedBranchId}
              label="Sucursal"
              onClear={() => setBranchId(0)}
              labelPlacement="outside"
              placeholder="Selecciona la sucursal"
              variant="bordered"
              className="dark:text-white"
              classNames={{
                base: 'font-semibold text-sm',
              }}
            >
              {branch_list.map((bra) => (
                <AutocompleteItem
                  onClick={() => setBranchId(bra.id)}
                  className="dark:text-white"
                  key={bra.id}
                >
                  {bra.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <div>
            <Autocomplete
              labelPlacement="outside"
              className="dark:text-white font-semibold text-sm"
              placeholder="Selecciona el punto de venta"
              variant="bordered"
              label="Punto de Venta"
            >
              {codeSale
                .filter((item) => item.typeVoucher === 'T')
                .map((item) => (
                  <AutocompleteItem
                    onClick={() => setCodeSelected(item.code || '')}
                    key={item.code || ''}
                  >
                    {item.code}
                  </AutocompleteItem>
                ))}
            </Autocomplete>
          </div>
          <div className="w-full">
            <Autocomplete
              onSelectionChange={(e) => {
                const selectCorrelativeType = correlativesTypes.find(
                  (dep) => dep.value === new Set([e]).values().next().value
                );
                setFilter({ ...filter, typeVoucher: selectCorrelativeType?.value || '' });
              }}
              label="Tipo de Factura"
              labelPlacement="outside"
              placeholder="Selecciona el Tipo de Factura"
              variant="bordered"
              className="dark:text-white font-semibold text-sm"
              classNames={{
                base: 'text-gray-500 text-sm',
              }}
            >
              {correlativesTypes
                .filter((dep) => ['F', 'CCF', 'T'].includes(dep.value)) // Filtra solo "F", "CCF", "T"
                .map((dep) => (
                  <AutocompleteItem className="dark:text-white" key={dep.value}>
                    {dep.value + ' - ' + dep.label}
                  </AutocompleteItem>
                ))}
            </Autocomplete>
          </div>
        </div>
        <div className="flex w-full gap-5">
          <Input
            label="Fecha inicial"
            labelPlacement="outside"
            classNames={{ label: 'font-semibold' }}
            variant="bordered"
            className="w-full dark:text-white"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="Fecha final"
            labelPlacement="outside"
            classNames={{ label: 'font-semibold' }}
            variant="bordered"
            className="w-full dark:text-white"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <Input
            // startContent={<FileCode2 />}
            className="w-full dark:text-white border border-white rounded-xl "
            variant="bordered"
            labelPlacement="outside"
            label="Correlativo"
            classNames={{
              label: 'font-semibold text-gray-700',
              inputWrapper: 'pr-0',
            }}
            value={correlative}
            onChange={(e) => setCorrelative(e.target.value)}
            placeholder="Escribe para buscar..."
            isClearable
            onClear={() => {
              setCorrelative('');
              // handleSearch('');
            }}
          />

          <Button
            startContent={<Search />}
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.primary,
            }}
            onClick={() => handleSearch()}
            className="mt-6 w-full"
          >
            Buscar
          </Button>
        </div>
        <div className="flex justify-end p-3">
          <span className="mr-3 dark:text-white">
            {status === 1 ? 'Invalidadas ' : 'Procesadas'}
          </span>
          <Switch
            checked={status === 2}
            onChange={toggleStatus}
            className={`${status === 2 ? 'bg-red-500' : 'bg-green-500'} 
                    relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
          ></Switch>
        </div>
        <DataTable
          emptyMessage="No se encontraron resultados"
          className="shadow dark:text-white w-full"
          value={sales}
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
            field="id"
            header="No."
            className="dark:text-white"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            body={(rowData) => (
              <>{rowData.employee.firstName + ' ' + rowData.employee.secondLastName}</>
            )}
            header="Empleado"
            className="dark:text-white"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            body={(rowData) => {
              const voucherType = correlativesTypes.find(
                (dep) => dep.value === rowData.typeVoucher
              );
              return voucherType ? `${voucherType.value} - ${voucherType.label} ` : 'Boleta';
            }}
            header="Tipo de Factura"
            className="dark:text-white"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            body={(rowData) => <>{rowData.fecEmi + ' ' + rowData.horEmi}</>}
            header="Fecha y Hora"
            className="dark:text-white"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            body={(rowData) => formatCurrencySales(rowData.montoTotalOperacion)}
            header="SubTotal"
            className="dark:text-white"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            body={(rowData) => formatCurrencySales(rowData.totalPagar)}
            header="Total"
            className="dark:text-white"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            body={(rowData) => (
              <>
                <div
                  className={`w-24 cursor-pointer h-5 rounded-xl text-center justify-center flex ${
                    rowData.salesStatusId === 1
                      ? 'bg-green-500'
                      : rowData.salesStatusId === 2
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <p className="text-white text-center">
                      {rowData.salesStatusId === 1
                        ? 'Procesada'
                        : rowData.salesStatusId === 2
                          ? 'Invalidada'
                          : 'Contingencia'}
                    </p>
                  </div>
                </div>
              </>
            )}
            header="Estado"
            className="dark:text-white"
          />

          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            body={(rowData) => (
              <>
                <div className="flex gap-3">
                  {actions.includes('Ver Detalle') ? (
                    <Button
                      onClick={() => {
                        setInvalidationSale({
                          saleId: rowData.id,
                          isOpenModalInvalidation: false,
                          isOpenModalDetail: true,
                        });
                        setId(rowData.id);
                        setOpenModalDetail(true);
                      }}
                      isIconOnly
                      style={{
                        backgroundColor: theme.colors.secondary,
                      }}
                    >
                      <Eye style={{ color: theme.colors.primary }} size={20} />
                    </Button>
                  ) : (
                    <Button
                      isIconOnly
                      style={{
                        backgroundColor: theme.colors.secondary,
                      }}
                    >
                      <Lock style={{ color: theme.colors.primary }} size={20} />
                    </Button>
                  )}

                  {rowData.isActivated && (
                    <>
                      {actions.includes('Invalidar') ? (
                        <Button
                          onClick={() => {
                            setInvalidationSale({
                              saleId: rowData.id,
                              isOpenModalInvalidation: true,
                              isOpenModalDetail: false,
                            });
                          }}
                          isIconOnly
                          style={{
                            backgroundColor: theme.colors.danger,
                          }}
                        >
                          <CircleX style={{ color: theme.colors.primary }} size={20} />
                        </Button>
                      ) : (
                        <Button
                          isIconOnly
                          style={{
                            backgroundColor: theme.colors.danger,
                          }}
                        >
                          <Lock style={{ color: theme.colors.primary }} size={20} />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
            header="Acciones"
            className="dark:text-white"
          />
        </DataTable>
        <div>
          {pagination_sales_invalidations.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  previousPage={pagination_sales_invalidations.prevPag}
                  nextPage={pagination_sales_invalidations.nextPag}
                  currentPage={pagination_sales_invalidations.currentPag}
                  totalPages={pagination_sales_invalidations.totalPag}
                  onPageChange={(page) => {
                    OnGetSalesInvalidations(
                      branchId,
                      page,
                      5,
                      startDate,
                      endDate,
                      '',
                      '',
                      status,
                      correlative
                    );
                  }}
                />
              </div>
              <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
                <SmPagination
                  handleNext={() => {
                    OnGetSalesInvalidations(
                      branchId,
                      pagination_sales_invalidations.nextPag,
                      5,
                      startDate,
                      endDate,
                      filter.typeVoucher,
                      codeSelected,
                      status,
                      correlative
                    );
                  }}
                  handlePrev={() => {
                    OnGetSalesInvalidations(
                      branchId,
                      pagination_sales_invalidations.prevPag,
                      5,
                      startDate,
                      endDate,
                      filter.typeVoucher,
                      codeSelected,
                      status,
                      correlative
                    );
                  }}
                  currentPage={pagination_sales_invalidations.currentPag}
                  totalPages={pagination_sales_invalidations.totalPag}
                />
              </div>
            </>
          )}
        </div>

        <HeadlessModal
          size="w-[350px] md:w-[500px]"
          isOpen={invalidationSale.isOpenModalInvalidation}
          onClose={() =>
            setInvalidationSale({
              saleId: 0,
              isOpenModalDetail: false,
              isOpenModalInvalidation: false,
            })
          }
          title="Invalidar Venta"
        >
          <div className="w-full h-full flex flex-col mt-3 p-2">
            <h1 className="text-center p-5 dark:text-white text-lg">
              ¿Está seguro de que desea invalidar esta venta? Esta acción es irreversible y afectará
              los registros en el sistema.
            </h1>

            <div className="w-full flex justify-between mt-5">
              <Button
                style={{
                  backgroundColor: theme.colors.danger,
                  color: theme.colors.primary,
                }}
                onClick={() => handleInvalidationSale()}
                className="flex items-center"
              >
                <XCircle className="mr-2" /> Invalidar Venta
              </Button>

              <Button
                style={{
                  backgroundColor: theme.colors.third,
                  color: theme.colors.primary,
                }}
                onClick={() =>
                  setInvalidationSale({
                    saleId: 0,
                    isOpenModalDetail: false,
                    isOpenModalInvalidation: false,
                  })
                }
                className="flex items-center"
              >
                <CheckCircle className="mr-2" /> Cancelar
              </Button>
            </div>
          </div>
        </HeadlessModal>

        {id > 0 && (
          <HeadlessModal
            size="w-[350px] md:w-[500px]"
            isOpen={openModalDetail}
            onClose={() => {
              setInvalidationSale({
                saleId: 0,
                isOpenModalInvalidation: false,
                isOpenModalDetail: false,
              }),
                setId(0);
              setOpenModalDetail(false);
            }}
            title=""
          >
            <DetailSale id={id}></DetailSale>
          </HeadlessModal>
        )}
      </div>
    </div>
  );
}

export default SalesInvalidationList;
