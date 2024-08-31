import { ThemeContext } from '@/hooks/useTheme';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSalesInvalidation } from '../store/sales_invalidations.store';
import { fechaActualString } from '@/utils/dates';
import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { correlativesTypes } from '@/types/correlatives/correlatives_data.types';
import { Search } from 'lucide-react';
import { useBranchesStore } from '@/store/branches.store';
import Pagination from '@/components/global/Pagination';
import SmPagination from '@/components/global/SmPagination';
import { formatCurrencySales } from '@/utils/dte';

function SalesInvalidationList() {
  const [startDate, setStartDate] = useState(fechaActualString);
  const [endDate, setEndDate] = useState(fechaActualString);
  const { sales, OnGetSalesInvalidations, pagination_sales_invalidations } = useSalesInvalidation();
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
  useEffect(() => {
    OnGetSalesInvalidations(branchId, 1, 5, startDate, endDate, '', '');
  }, []);
  const { theme } = useContext(ThemeContext);

  const handleSearch = () => {
    OnGetSalesInvalidations(branchId, 1, 5, startDate, endDate, filter.typeVoucher, '');
  };
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  return (
    <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
      <div className="w-full h-full border-white border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
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
                  value={bra.id}
                  key={bra.id}
                >
                  {bra.name}
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
                setFilter({ ...filter, typeVoucher: selectCorrelativeType?.label || '' });
              }}
              label="Tipo de Factura"
              labelPlacement="outside"
              placeholder="Selecciona el Tipo de Factura"
              variant="bordered"
              className="dark:text-white"
              classNames={{
                base: 'text-gray-500 text-sm',
              }}
            >
              {correlativesTypes.map((dep) => (
                <AutocompleteItem className="dark:text-white" value={dep.label} key={dep.value}>
                  {dep.value + ' - ' + dep.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <Input
            label="Fecha inicial"
            labelPlacement="outside"
            classNames={{ label: 'font-semibold' }}
            variant="bordered"
            className="w-full"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="Fecha final"
            labelPlacement="outside"
            classNames={{ label: 'font-semibold' }}
            variant="bordered"
            className="w-full"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button
            startContent={<Search />}
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.primary,
            }}
            onClick={() => handleSearch()}
            className="w-full mt-5"
          >
            Buscar
          </Button>
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
            field="tipoDte"
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
            field="totalPagar"
            header="Total"
            className="dark:text-white"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            body={(rowData) => (
              <>
                <Button> Invalidar </Button>
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
                    OnGetSalesInvalidations(branchId, page, 5, startDate, endDate, '', '');
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
                      '',
                      ''
                    );
                  }}
                  handlePrev={() => {
                    OnGetSalesInvalidations(
                      branchId,
                      pagination_sales_invalidations.prevPag,
                      5,
                      startDate,
                      endDate,
                      '',
                      ''
                    );
                  }}
                  currentPage={pagination_sales_invalidations.currentPag}
                  totalPages={pagination_sales_invalidations.totalPag}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesInvalidationList;
