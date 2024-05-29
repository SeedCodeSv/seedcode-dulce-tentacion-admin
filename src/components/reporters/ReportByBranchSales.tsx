import { useContext, useEffect, useState, useCallback } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { ThemeContext } from '../../hooks/useTheme';
import { fechaActualString } from '../../utils/dates';
import { useBranchesStore } from '../../store/branches.store';
import { useReportsByBranch } from '../../store/reports/report_store';
import { useAuthStore } from '../../store/auth.store';
import { salesReportStore } from '../../store/reports/sales_report.store';

function ReportSalesByBranch() {
  const { theme } = useContext(ThemeContext);
  const [startDate, setStartDate] = useState(fechaActualString);
  const [endDate, setEndDate] = useState(fechaActualString);
  const { branch_list, getBranchesList } = useBranchesStore();
  const { sales, OnGetReportByBranchSales } = useReportsByBranch();
  const { data, getSalesByTransmitter } = salesReportStore();
  const [branchId, setBranchId] = useState(0);
  const { user } = useAuthStore();

  const fetchInitialData = useCallback(() => {
    getBranchesList();
    OnGetReportByBranchSales(branchId, startDate, endDate);
  }, [branchId, startDate, endDate, getBranchesList, OnGetReportByBranchSales]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSearch = () => {
    OnGetReportByBranchSales(branchId, startDate, endDate);
    getSalesByTransmitter(user?.employee.branch.transmitterId || 0, startDate, endDate);
  };

  const series = [
    {
      name: 'Total',
      data: data.map((d) => Number(d.total)),
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

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  return (
    <>
      <div className="col-span-3 bg-gray-100 p-5 dark:bg-gray-900 rounded-lg">
        <p className="pb-4 text-lg font-semibold dark:text-white">Ventas</p>
        <div className="grid grid-cols-2 gap-2 py-2">
          <label className="text-sm font-semibold dark:text-white">Fecha inicial</label>
          <label className="text-sm font-semibold dark:text-white">Fecha final</label>
          <Input
            onChange={(e) => setStartDate(e.target.value)}
            defaultValue={startDate}
            className="w-full"
            type="date"
          />
          <Input
            onChange={(e) => setEndDate(e.target.value)}
            defaultValue={endDate}
            className="w-full"
            type="date"
          />
          <div className="">
            <Autocomplete placeholder="Selecciona la sucursal">
              {branch_list.map((branch) => (
                <AutocompleteItem
                  onClick={() => setBranchId(branch.id)}
                  className="dark:text-white"
                  key={branch.id}
                  value={branch.id}
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
        <DataTable
          className="w-full shadow"
          emptyMessage="No se encontraron resultados"
          tableStyle={{ minWidth: '50rem' }}
          scrollable
          value={sales}
          scrollHeight="30rem"
        >
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
            field="numeroControl"
            header="Numero de control"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="box.branch.name"
            header="Sucursal"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="totalDescu"
            header="Descuento"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="montoTotalOperacion"
            header="Total"
          />
        </DataTable>
        <div className="col-span-3 bg-gray-100 p-5 dark:bg-gray-900 rounded-lg">
          <p className="pb-4 text-lg font-semibold dark:text-white">Ventas</p>
          <Chart options={chartOptions} series={series} type="bar" height={350} />
        </div>
      </div>
    </>
  );
}

export default ReportSalesByBranch;
