import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
import { Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react";
import { fechaActualString } from '../../utils/dates';
import { useBranchesStore } from '../../store/branches.store';
import { useReportExpensesStore } from '../../store/reports/expenses_report.store';
import { useAuthStore } from '../../store/auth.store';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { useReportsByBranch } from '../../store/reports/report_store';
import { formatCurrency } from '../../utils/dte';

function ExpensesByDatesTransmitter() {
  const { theme } = useContext(ThemeContext);
  const [startDate, setStartDate] = useState(fechaActualString);
  const [endDate, setEndDate] = useState(fechaActualString);
  const { user } = useAuthStore();
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const { expenses, OnGetReportExpenseByBranch } = useReportsByBranch();
  const { branch_list, getBranchesList } = useBranchesStore();
  const { data, getExpensesByTransmitter } = useReportExpensesStore();
  const [branchId, setBranchId] = useState(0);

  const fetchInitialData = useCallback(() => {
    getBranchesList();
    OnGetReportExpenseByBranch(branchId, startDate, endDate);
    getExpensesByTransmitter(
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
      startDate,
      endDate
    );
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSearch = () => {
    OnGetReportExpenseByBranch(branchId, startDate, endDate);
    getExpensesByTransmitter(
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
      startDate,
      endDate
    );
  };
  const series = [
    {
      name: 'Total',
      data: data.map((d) => Number(d.totalExpenses)),
    },
  ];

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    xaxis: {
      categories: data.map((d) => d.branch),
    },
  };

  return (
    <>
      <div className="col-span-3 bg-gray-100 p-5 dark:bg-gray-900 rounded-lg">
        {/* <p className="pb-4 text-lg font-semibold dark:text-white">Gastos por sucursal </p> */}
        <div className="grid grid-cols-2 gap-2 py-2">
          <label className="text-sm font-semibold dark:text-white">Fecha inicial</label>
          <label className="text-sm font-semibold dark:text-white">Fecha final</label>
          <Input
            onChange={(e) => setStartDate(e.target.value)}
            defaultValue={startDate}
            className="w-full "
            type="date"
          ></Input>
          <Input
            onChange={(e) => setEndDate(e.target.value)}
            defaultValue={endDate}
            className="w-full "
            type="date"
          ></Input>

          <div className="">
            <Autocomplete placeholder="Selecciona la sucursal">
              {branch_list.map((branch) => (
                <AutocompleteItem
                  onClick={() => setBranchId(branch.id)}
                  className="dark:text-white"
                  key={branch.id}
                >
                  {branch.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <Button
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.primary,
            }}
            className="font-semibold"
            color="primary"
            onClick={handleSearch}
          >
            Buscar
          </Button>
        </div>
        <div className="w-full overflow-x-auto sm:overflow-x-scroll">
          <DataTable
            className="w-full shadow"
            emptyMessage="No se encontraron resultados"
            tableStyle={{ minWidth: '50rem' }}
            scrollable
            value={expenses}
            scrollHeight="30rem"
          >
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="box.branch.name"
              header="Sucursal"
            />
            <Column
              headerStyle={style}
              field="Total"
              header="total"
              body={(rowData) => formatCurrency(Number(rowData.total))}
            />
          </DataTable>
        </div>
        <div className="col-span-3 bg-gray-100 p-5 dark:bg-gray-900 rounded-lg">
          <p className="pb-4 text-lg font-semibold dark:text-white">Gastos</p>
          <Chart options={chartOptions} series={series} type="bar" height={350} />
        </div>
      </div>
    </>
  );
}

export default ExpensesByDatesTransmitter;
