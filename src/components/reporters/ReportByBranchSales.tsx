import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { ThemeContext } from '../../hooks/useTheme';
import { fechaActualString, formatDateShort } from '../../utils/dates';
import { useBranchesStore } from '../../store/branches.store';
import { useReportsByBranch } from '../../store/reports/report_store';
import { useAuthStore } from '../../store/auth.store';
import { salesReportStore } from '../../store/reports/sales_report.store';
import { formatCurrency } from '../../utils/dte';
import { global_styles } from '../../styles/global.styles';
import useWindowSize from '@/hooks/useWindowSize';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import TooltipGlobal from '../global/TooltipGlobal';
import BottomDrawer from '../global/BottomDrawer';

function ReportSalesByBranch() {
  const { theme } = useContext(ThemeContext);
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(fechaActualString);
  const { branch_list, getBranchesList } = useBranchesStore();
  const { sales, OnGetReportByBranchSales } = useReportsByBranch();
  const { data, getSalesByTransmitter } = salesReportStore();
  const [branchId, setBranchId] = useState(0);
  const { user } = useAuthStore();

  const fetchInitialData = useCallback(() => {
    getBranchesList();
    OnGetReportByBranchSales(branchId, startDate, endDate);
    getSalesByTransmitter(
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
      startDate,
      endDate
    );
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSearch = () => {
    filterDrawer.onClose();
    OnGetReportByBranchSales(branchId, startDate, endDate);
    getSalesByTransmitter(
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
      startDate,
      endDate
    );
  };

  const { windowSize } = useWindowSize();

  const [currentPage, setCurrentPage] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (windowSize.width < 600) setItemsPerPage(3);
  }, [windowSize.width]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const filterDrawer = useDisclosure();

  const series = useMemo(() => {
    if (windowSize.width < 768) {
      return [
        {
          name: 'Total',
          data: data
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((d) => Number(d.total))
            .sort((a, b) => b - a),
        },
      ];
    }

    return [
      {
        name: 'Total',
        data: data.map((d) => Number(d.total)).sort((a, b) => b - a),
      },
    ];
  }, [windowSize.width, data, currentPage, itemsPerPage]);

  const labels = useMemo(() => {
    if (windowSize.width < 768) {
      return data
        .sort((a, b) => Number(b.total) - Number(a.total))
        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        .map((d) => d.branch);
    }

    return data.sort((a, b) => Number(b.total) - Number(a.total)).map((d) => d.branch);
  }, [windowSize.width, data, currentPage, itemsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const chartOptions: ApexOptions = {
    labels: labels,
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    grid: {
      show: true,
      borderColor: '#D8E3F0',

      strokeDashArray: 5,
    },
    colors: ['#219ebc'],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return formatCurrency(Number(val));
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },
    yaxis: {
      crosshairs: {
        show: true,
        stroke: {
          width: 1,
          color: '#fb6f92',
          dashArray: 3,
        },
      },
    },
    xaxis: {
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
    },
  };
  return (
    <>
      <div className="col-span-3 p-5 bg-gray-100 rounded-lg dark:bg-gray-900">
        <div className="flex flex-col w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="flex items-center justify-between w-full">
            {/* <p className="pb-4 text-lg font-semibold dark:text-white">Ventas</p> */}
            <TooltipGlobal text="Filtros">
              <Button
                style={global_styles().thirdStyle}
                className="flex md:hidden"
                onClick={filterDrawer.onOpen}
                isIconOnly
              >
                <Filter />
              </Button>
            </TooltipGlobal>
          </div>

          <div className="hidden grid-cols-1 gap-2 py-2 md:grid md:grid-cols-3">
            <Input
              variant="bordered"
              onChange={(e) => setStartDate(e.target.value)}
              defaultValue={startDate}
              className="w-full"
              type="date"
              label="Fecha inicial"
              labelPlacement="outside"
            />
            <Input
              variant="bordered"
              onChange={(e) => setEndDate(e.target.value)}
              defaultValue={endDate}
              className="w-full"
              label="Fecha final"
              type="date"
              labelPlacement="outside"
            />
            <div className="">
              <Autocomplete
                label="Sucursal"
                placeholder="Selecciona la sucursal"
                variant="bordered"
                labelPlacement="outside"
              >
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
          <div className="block py-5 md:hidden">
            <BottomDrawer
              open={filterDrawer.isOpen}
              onClose={filterDrawer.onClose}
              title="Filtros disponibles"
            >
              <label htmlFor="">Sucursal</label>
              <Select
                variant="bordered"
                placeholder="Selecciona la sucursal"
                onSelectionChange={(e) => {
                  if (e) {
                    const value = new Set([e]).values().next().value;
                    setBranchId(Number(value));
                  }
                }}
              >
                {branch_list.map((branch) => (
                  <SelectItem
                    onClick={() => setBranchId(branch.id)}
                    className="dark:text-white"
                    key={branch.id}
                    value={branch.id.toString()}
                  >
                    {branch.name}
                  </SelectItem>
                ))}
              </Select>
              <Input
                variant="bordered"
                onChange={(e) => setStartDate(e.target.value)}
                defaultValue={startDate}
                className="w-full"
                type="date"
                label="Fecha inicial"
                labelPlacement="outside"
              />
              <Input
                variant="bordered"
                onChange={(e) => setEndDate(e.target.value)}
                defaultValue={endDate}
                className="w-full"
                label="Fecha final"
                type="date"
                labelPlacement="outside"
              />
              <div className="mt-5 mb-10">
                <Button className="w-full font-semibold" onClick={handleSearch}>
                  Buscar
                </Button>
              </div>
            </BottomDrawer>
          </div>
          <div className="w-full">
            <div className="max-h-[600px] overflow-y-scroll flex flex-col gap-5 md:hidden">
              {sales.map((sale) => (
                <div className="w-full p-5 border shadow rounded-2xl">
                  <p className="font-semibold">
                    Numero de control:
                    <span className="font-normal">{sale.numeroControl}</span>
                  </p>
                  <p className="font-semibold">
                    Fecha:{' '}
                    <span className="font-normal">
                      {formatDateShort(sale.fecEmi)} - {sale.horEmi}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Cajero:
                    <span className="font-normal">
                      {sale.employee.firstName +
                        ' ' +
                        sale.employee.secondName +
                        ' ' +
                        sale.employee.firstLastName}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Descuento:{' '}
                    <span className="font-normal">{formatCurrency(Number(sale.totalDescu))}</span>
                  </p>
                  <p className="font-semibold">
                    Total:{' '}
                    <span className="font-bold text-red-600">
                      {formatCurrency(Number(sale.montoTotalOperacion))}
                    </span>
                  </p>
                </div>
              ))}
              {sales.length === 0 && (
                <p className="py-10 text-lg text-center">No se encontraron ventas para mostrar</p>
              )}
            </div>
            <div className="hidden w-full md:flex">
              <Table
                classNames={{
                  base: 'max-h-[520px]',
                  table: 'min-h-[400px] overflow-y-scroll',
                }}
                isHeaderSticky
                border={1}
              >
                <TableHeader>
                  <TableColumn width={200} style={global_styles().darkStyle}>
                    FECHA
                  </TableColumn>
                  <TableColumn width={200} style={global_styles().darkStyle}>
                    HORA
                  </TableColumn>
                  <TableColumn style={global_styles().darkStyle}>CAJERO</TableColumn>
                  <TableColumn width={200} style={global_styles().darkStyle}>
                    DESCUENTO
                  </TableColumn>
                  <TableColumn width={200} style={global_styles().darkStyle}>
                    TOTAL EN VENTAS
                  </TableColumn>
                  <TableColumn width={200} style={global_styles().darkStyle}>
                    NO. DE CONTROL
                  </TableColumn>
                </TableHeader>
                <TableBody emptyContent="No se encontraron resultados">
                  {sales.map((sale, index) => (
                    <TableRow key={index} className="border">
                      <TableCell>{formatDateShort(sale.fecEmi)}</TableCell>
                      <TableCell>{sale.horEmi}</TableCell>
                      <TableCell>
                        {sale.employee.firstLastName + ' ' + sale.employee.secondLastName}
                      </TableCell>
                      <TableCell>{formatCurrency(Number(sale.totalDescu))}</TableCell>
                      <TableCell>{formatCurrency(Number(sale.montoTotalOperacion))}</TableCell>
                      <TableCell>{sale.numeroControl}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="col-span-3 p-5 mt-3 bg-white border shadow rounded-2xl">
            <div className="flex items-center justify-between">
              <p className="pb-4 text-lg font-semibold dark:text-white">Ventas</p>
              {windowSize.width < 768 && (
                <>
                  <div className="flex gap-3">
                    <Button isIconOnly onClick={handlePrevPage}>
                      <ChevronLeft />
                    </Button>
                    <Button isIconOnly onClick={handleNextPage}>
                      <ChevronRight />
                    </Button>
                  </div>
                </>
              )}
            </div>
            <Chart options={chartOptions} series={series} type="bar" height={500} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportSalesByBranch;
