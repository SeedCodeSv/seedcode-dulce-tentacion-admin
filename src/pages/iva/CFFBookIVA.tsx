import { Button, Select, SelectItem } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import saveAs from 'file-saver';

import { export_excel_facturacion_ccfe } from '../excel/generate_excel';

import TableCcfe from './CCFE/TableCcfe';
import FacturacionCcfeItem from './CCFE/FacturacionCcfe';

import useGlobalStyles from '@/components/global/global.styles';
import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useSalesStore } from '@/store/sales.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { months } from '@/utils/constants';
import { formatCurrency } from '@/utils/dte';
import { useViewsStore } from '@/store/views.store';
import DivGlobal from '@/themes/ui/div-global';

// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"

function CFFBookIVA() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const [branchId, setBranchId] = useState(0);
  const [branchName, setBranchName] = useState('');
  const { transmitter, gettransmitter } = useTransmitterStore();
  const { branch_list, getBranchesList } = useBranchesStore();

  const currentYear = new Date().getFullYear();
  const years = [
    { value: currentYear, name: currentYear.toString() },
    { value: currentYear - 1, name: (currentYear - 1).toString() },
  ];
  const [yearSelected, setYearSelected] = useState(currentYear);

  useEffect(() => {
    gettransmitter();
    getBranchesList();
  }, []);

  const { loading_creditos, getCffMonth, creditos_by_month, factura_totals, facturacion_ccfe } =
    useSalesStore();

  useEffect(() => {
    getCffMonth(
      branchId,
      monthSelected > 9 ? `${monthSelected}` : `0${monthSelected}`,
      yearSelected
    );
  }, [monthSelected, branchId, yearSelected]);

  const styles = useGlobalStyles();

  const handleExportExcel = async () => {
    const data = creditos_by_month.map((cre, index) => [
      index + 1,
      cre.fecEmi,
      cre.codigoGeneracion,
      cre.numeroControl,
      cre.selloRecibido,
      cre.customer.nrc !== '0' ? cre.customer.nrc : '',
      cre.customer.nombre,
      Number(cre.totalExenta),
      // Number(cre.totalGravada),
      calculateGravadaWithoutVAT(Number(cre.totalGravada), Number(cre.montoTotalOperacion)),
      Number(cre.totalIva),
      0,
      0,
      0,
      Number(cre.montoTotalOperacion),
    ]);

    let items = [];

    if (creditos_by_month.length > 0 || factura_totals > 0) {
      items.push({
        name: 'CRÉDITOS FISCALES',
        sales: data,
        totals: {
          total: factura_totals,
          iva: 0,
          exenta: 0,
          gravada: factura_totals,
          retencion: 0,
        },
      });
    }

    const data_items = facturacion_ccfe.map((fact) => {
      return {
        name: `CRÉDITOS FISCALES ELECTRÓNICOS  (${fact.code})`,
        sales: fact.sales.map((cre, crei) => [
          crei + 1,
          cre.fecEmi,
          cre.codigoGeneracion,
          cre.numeroControl,
          cre.selloRecibido,
          cre.customer.nrc !== '0' ? cre.customer.nrc : '',
          cre.customer.nombre,
          Number(cre.totalExenta),
          Number(cre.totalGravada),
          Number(cre.totalIva),
          0,
          0,
          0,
          Number(cre.montoTotalOperacion),
        ]),
        totals: {
          exenta: 0,
          gravada: fact.sales_facturacion,
          iva: 0,
          retencion: 0,
          total: fact.sales_facturacion,
        },
      };
    });

    items = items.concat(data_items);

    const month = months.find((month) => month.value === monthSelected)?.name || '';

    const blob = await export_excel_facturacion_ccfe({
      items,
      month,
      transmitter,
      branch: branchName,
      yeatSelected: yearSelected,
    });

    saveAs(blob, `Libro_Ventas_CCF_${month}.xlsx`);
  };

  const totalIva = useMemo(() => {
    return creditos_by_month.map((cre) => Number(cre.totalIva)).reduce((a, b) => a + b, 0);
  }, [creditos_by_month]);
  const totalExenta = useMemo(() => {
    return creditos_by_month.map((cre) => Number(cre.totalExenta)).reduce((a, b) => a + b, 0);
  }, [creditos_by_month]);

  // const totalGravada = useMemo(() => {
  //   return creditos_by_month.map((cre) => Number(cre.totalGravada)).reduce((a, b) => a + b, 0);
  // }, [creditos_by_month]);

  const total = useMemo(() => {
    return creditos_by_month
      .map((cre) => Number(cre.montoTotalOperacion))
      .reduce((a, b) => a + b, 0);
  }, [creditos_by_month]);

  const calculateGravadaWithoutVAT = (gravada: number, total: number) => {
    if (gravada === total) {
      return parseFloat((gravada / 1.13).toFixed(2)); // Quitar IVA y redondear a 2 decimales
    }

    return gravada;
  };
  const totalGravadaSinIVA = useMemo(() => {
    return creditos_by_month
      .map((cre) =>
        calculateGravadaWithoutVAT(Number(cre.totalGravada), Number(cre.montoTotalOperacion))
      )
      .reduce((a, b) => a + b, 0);
  }, [creditos_by_month]);

  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'IVA de CCF');
  const actionView = viewName?.actions.name || [];

  return (
    <Layout title="IVA - CFF">
     <DivGlobal>
          <div className="w-full flex flex-col lg:flex-row gap-5">
            <div className="w-full">
              <Select
                className="w-full"
                classNames={{ label: 'font-semibold' }}
                defaultSelectedKeys={`${monthSelected}`}
                label="Meses"
                labelPlacement="outside"
                variant="bordered"
                onSelectionChange={(key) => {
                  if (key) {
                    setMonthSelected(Number(new Set(key).values().next().value));
                  }
                }}
              >
                {months.map((month) => (
                  <SelectItem key={month.value}>{month.name}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="w-full">
              <Select
                className="w-full"
                classNames={{ label: 'font-semibold' }}
                label="Año"
                labelPlacement="outside"
                selectedKeys={[`${yearSelected}`]}
                variant="bordered"
                onSelectionChange={(key) => {
                  if (key) {
                    setYearSelected(Number(new Set(key).values().next().value));
                  }
                }}
              >
                {years.map((years) => (
                  <SelectItem key={years.value}>{years.name}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="w-full">
              <Select
                className="w-full"
                classNames={{ label: 'font-semibold' }}
                defaultSelectedKeys={`${branchId}`}
                label="Sucursal"
                labelPlacement="outside"
                placeholder="Selecciona la sucursal"
                variant="bordered"
                onSelectionChange={(key) => {
                  if (key) {
                    const id = Number(new Set(key).values().next().value);

                    setBranchId(id);
                    const branch = branch_list.find((branch) => branch.id == id);

                    if (branch) setBranchName(branch.name);
                  }
                }}
              >
                {branch_list.map((branch) => (
                  <SelectItem key={branch.id}>{branch.name}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex justify-end items-end mt-3 md:mt-0">
              {actionView.includes('Exportar Excel') && (
                <Button
                  className="text-white font-semibold"
                  color="success"
                  style={styles.thirdStyle}
                  onClick={handleExportExcel}
                >
                  Exportar a excel
                  <PiMicrosoftExcelLogoBold size={25} />
                </Button>
              )}
              {/* <Button
                className="px-1O"
                endContent={<PiFilePdfDuotone size={20} />}
                onClick={() => makePdf("download")}
                color="danger"
              >
                Exportar a PDF
              </Button> */}
            </div>
          </div>
          <div className="overflow-y-auto">
            <p className="py-3 text-lg font-semibold">CRÉDITOS FISCALES</p>
            <div className="w-full max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] 2xl:max-h-[800px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
              {loading_creditos ? (
                <div className="w-full flex justify-center p-20 items-center flex-col">
                  <div className="loader" />
                  <p className="mt-5 dark:text-white text-gray-600 text-xl">Cargando...</p>
                </div>
              ) : (
                <>
                  {creditos_by_month.length > 0 ? (
                    <>
                      <TableCcfe />
                    </>
                  ) : (
                    <div className="w-full h-full flex p-10 flex-col justify-center items-center">
                      <p className="mt-5 dark:text-white text-gray-600 text-xl">
                        No se encontraron resultados
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="w-full overflow-x-auto custom-scrollbar mt-10 p-5 dark:bg-gray-800 bg-white border">
              <div className="min-w-[950px]">
                <div className="grid grid-cols-8 w-full">
                  <span className="border p-1 font-semibold" />
                  <span className="border p-1 text-sm md:font-semibold font-semibold">
                    Ventas Exentas
                  </span>
                  <span className="border p-1 text-sm md:font-semibold font-semibold">
                    Ventas Gravadas
                  </span>
                  <span className="border p-1 text-sm md:font-semibold font-semibold" />
                  <span className="border p-1 text-sm md:font-semibold font-semibold">
                    Exportaciones
                  </span>
                  <span className="border p-1 text-sm md:font-semibold font-semibold">IVA</span>
                  <span className="border p-1 text-sm md:font-semibold font-semibold">
                    Retención
                  </span>
                  <span className="border p-1 font-semibold">Total</span>
                </div>
                <div className="grid grid-cols-8 w-full">
                  <span className="border p-1">Consumidores finales</span>
                  <span className="border p-1">{formatCurrency(0)}</span>
                  {/* <span className="border p-1">{formatCurrency(factura_totals)}</span> */}
                  <span className="border p-1">
                    {formatCurrency(calculateGravadaWithoutVAT(factura_totals, factura_totals))}
                  </span>
                  <span className="border p-1" />
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1 font-semibold">{formatCurrency(factura_totals)}</span>
                </div>
                <div className="grid grid-cols-8 w-full">
                  <span className="border p-1">Contribuyentes</span>
                  <span className="border p-1">{formatCurrency(totalExenta)}</span>
                  {/* <span className="border p-1">{formatCurrency(totalGravada)}</span> */}
                  <span className="border p-1">
                    {formatCurrency(calculateGravadaWithoutVAT(totalGravadaSinIVA, total))}
                  </span>
                  <span className="border p-1" />
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1">{formatCurrency(totalIva)}</span>
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1 font-semibold">{formatCurrency(total)}</span>
                </div>
                <div className="grid grid-cols-8 w-full">
                  <span className="border p-1">Totales</span>
                  <span className="border p-1">{formatCurrency(totalExenta)}</span>
                  {/* <span className="border p-1">
                    {formatCurrency(totalGravada + factura_totals)}
                  </span> */}
                  <span className="border p-1">
                    {formatCurrency(
                      calculateGravadaWithoutVAT(
                        totalGravadaSinIVA + factura_totals,
                        total + factura_totals
                      )
                    )}
                  </span>
                  <span className="border p-1" />
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1">{formatCurrency(totalIva)}</span>
                  <span className="border p-1">{formatCurrency(0)}</span>
                  <span className="border p-1 font-semibold">
                    {formatCurrency(total + factura_totals)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              {facturacion_ccfe.map((item, index) => (
                <FacturacionCcfeItem key={index} facturacionCcfe={item} />
              ))}
            </div>
          </div>
      </DivGlobal>
    </Layout>
  );
}

export default CFFBookIVA;
