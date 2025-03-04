import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { salesReportStore } from '../../store/reports/sales_report.store';
import { useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { ThemeContext } from '../../hooks/useTheme';
import { formatCurrency } from '../../utils/dte';
import { Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react";
import { fechaActualString } from '../../utils/dates';
import { useBranchesStore } from '../../store/branches.store';
import { return_branch_id } from '../../storage/localStorage';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { useBranchProductReportStore } from '../../store/reports/branch_product.store';

const MostProductTransmitterSelled = () => {
  const { theme } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { getProductMostSelledTable, products_most_selled } = salesReportStore();
  const { data, getProductMostSelledGrafic } = useBranchProductReportStore();
  const { user } = useAuthStore();
  const [branchId, setBranchId] = useState(0);
  const { branch_list, getBranchesList } = useBranchesStore();
  useEffect(() => {
    return_branch_id();
    getBranchesList();
    getProductMostSelledGrafic(
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
      startDate,
      endDate
    );
    getProductMostSelledTable(
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
      fechaActualString,
      fechaActualString,
      branchId
    );
  }, []);

  const search = () => {
    getProductMostSelledTable(
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
      startDate,
      endDate,
      branchId
    );
    getProductMostSelledGrafic(
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
      startDate,
      endDate
    );
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
      categories: data.map((d) => d.productName),
    },
  };

  return (
    <>
      <div className="col-span-3 bg-gray-100 p-5 dark:bg-gray-900 rounded-lg">
        {/* <p className="pb-4 text-xl font-semibold dark:text-white">Producto mas vendido</p> */}
        <div className="grid grid-cols-2 gap-2 py-2">
          <label className="text-sm font-semibold dark:text-white">Fecha inicial</label>
          <label className="text-sm font-semibold dark:text-white">Fecha final</label>
          <Input
            onChange={(e) => setStartDate(e.target.value)}
            defaultValue={fechaActualString}
            className="w-full "
            type="date"
          ></Input>
          <Input
            onChange={(e) => setEndDate(e.target.value)}
            defaultValue={fechaActualString}
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
            onClick={() => search()}
          >
            Buscar
          </Button>
        </div>
        <DataTable
          className="w-full shadow"
          emptyMessage="No se encontraron resultados"
          value={products_most_selled}
          tableStyle={{ minWidth: '50rem' }}
          scrollable
          scrollHeight="30rem"
        >
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="branchProduct.product.name"
            header="Producto"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="quantity"
            header="Cantidad"
            body={(rowData) => formatCurrency(Number(rowData.quantity))}
          />
          <Column
            headerStyle={style}
            field="total"
            header="Total"
            body={(rowData) => formatCurrency(Number(rowData.total))}
          />
        </DataTable>
        <div className="col-span-3 bg-gray-100 p-5 dark:bg-gray-900 rounded-lg">
          <p className="pb-4 text-lg font-semibold dark:text-white">Productos mas vendidos</p>
          <Chart options={chartOptions} series={series} type="bar" height={350} />
        </div>
      </div>
    </>
  );
};

export default MostProductTransmitterSelled;
