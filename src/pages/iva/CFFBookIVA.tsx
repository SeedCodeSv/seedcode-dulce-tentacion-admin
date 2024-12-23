import useGlobalStyles from '@/components/global/global.styles';
import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useSalesStore } from '@/store/sales.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { months } from '@/utils/constants';
import { formatCurrency } from '@/utils/dte';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { export_excel_facturacion_ccfe } from '../excel/generate_excel';
import saveAs from 'file-saver';
import { useViewsStore } from '@/store/views.store';
import TableCcfe from './CCFE/TableCcfe';
import FacturacionCcfeItem from './CCFE/FacturacionCcfe';
// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"

function CFFBookIVA() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const [branchId, setBranchId] = useState(0);
  const [branchName, setBranchName] = useState('');
  const { transmitter, gettransmitter } = useTransmitterStore();
  const { branch_list, getBranchesList } = useBranchesStore();

  useEffect(() => {
    gettransmitter();
    getBranchesList();
  }, []);

  const { loading_creditos, getCffMonth, creditos_by_month, factura_totals, facturacion_ccfe } =
    useSalesStore();

  useEffect(() => {
    getCffMonth(branchId, monthSelected > 9 ? `${monthSelected}` : `0${monthSelected}`);
  }, [monthSelected, branchId]);

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
      .map((cre) => calculateGravadaWithoutVAT(Number(cre.totalGravada), Number(cre.montoTotalOperacion)))
      .reduce((a, b) => a + b, 0);
  }, [creditos_by_month]);

  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'IVA de CCF');
  const actionView = viewName?.actions.name || [];


  // const makePdf = () => {
  //   const doc = new jsPDF({ orientation: "landscape" })
  //   const margin_left = 5
  //   const month = months.find((month) => month.value === monthSelected)?.name || ""
  //   const header = (doc: jsPDF, margin: number) => {
  //     doc.setFillColor("#edf2f4")
  //     doc.setDrawColor(0, 0, 0)
  //     const margin_top = margin - 10

  //     doc.roundedRect(margin_left, margin_top, 10, 10, 0, 0, "FD")
  //     doc.roundedRect(10 + margin_left, margin_top, 15, 10, 0, 0, "FD")
  //     doc.roundedRect(25 + margin_left, margin_top, 35, 10, 0, 0, "FD")
  //     doc.roundedRect(60 + margin_left, margin_top, 15, 10, 0, 0, "FD")
  //     doc.roundedRect(75 + margin_left, margin_top, 45, 10, 0, 0, "FD")
  //     doc.roundedRect(120 + margin_left, margin_top, 40, 5, 0, 0, "FD")
  //     doc.roundedRect(120 + margin_left, margin_top + 5, 20, 5, 0, 0, "FD")
  //     doc.roundedRect(140 + margin_left, margin_top + 5, 20, 5, 0, 0, "FD")
  //     doc.roundedRect(160 + margin_left, margin_top, 25, 10, 0, 0, "FD")
  //     doc.roundedRect(185 + margin_left, margin_top, 25, 10, 0, 0, "FD")
  //     doc.roundedRect(210 + margin_left, margin_top, 25, 10, 0, 0, "FD")
  //     doc.roundedRect(235 + margin_left, margin_top, 25, 10, 0, 0, "FD")
  //     doc.roundedRect(260 + margin_left, margin_top, 25, 10, 0, 0, "FD")

  //     doc.setFontSize(7)

  //     const text1 = doc.splitTextToSize("No. Corr.", 5)
  //     doc.text(text1, 7, margin_top + 5)
  //     doc.text("Fecha", margin_left + 15, margin_top + 5)
  //     doc.text("No. Documento", margin_left + 35, margin_top + 5)
  //     doc.text("No. Reg.", margin_left + 63, margin_top + 5)
  //     doc.text("Nombre del cliente", margin_left + 85, margin_top + 5)
  //     doc.text("Ventas internas", margin_left + 130, margin_top + 3)
  //     doc.text("Exentas", margin_left + 125, margin_top + 8)
  //     doc.text("Gravadas", margin_left + 145, margin_top + 8)
  //     doc.text("IVA Débito fiscal", margin_left + 165, margin_top + 5)
  //     const text2 = doc.splitTextToSize("Venta a cuenta de terceros", 18)
  //     doc.text(text2, margin_left + 197, margin_top + 4, { align: "center" })
  //     const text3 = doc.splitTextToSize("IVA Débito Fiscal a cuenta de terceros", 20)
  //     doc.text(text3, margin_left + 222, margin_top + 3, { align: "center" })
  //     doc.text("IVA Percibido", margin_left + 240, margin_top + 5)
  //     doc.text("Total", margin_left + 270, margin_top + 5)
  //   }

  //   const $exentas = creditos_by_month
  //     .map((cm) => Number(cm.totalExenta) + Number(cm.totalNoSuj))
  //     .reduce((a, b) => a + b, 0)
  //   const $gravadas = creditos_by_month
  //     .map((cm) => Number(cm.totalGravada))
  //     .reduce((a, b) => a + b, 0)

  //   const $iva13 = Number($gravadas * 0.13)

  //   const $sumTotal = $exentas + $gravadas + $iva13

  //   const finalData = [
  //     "",
  //     "",
  //     "",
  //     "",
  //     "TOTAL",
  //     formatCurrency(Number($exentas)),
  //     formatCurrency(Number($gravadas)),
  //     formatCurrency(Number($iva13)),
  //     formatCurrency(0.0),
  //     formatCurrency(0.0),
  //     formatCurrency(0.0),
  //     formatCurrency(Number($sumTotal))
  //   ]

  //   const formatedData = creditos_by_month.map((cre, index) => [
  //     index + 1,
  //     cre.fecEmi,
  //     cre.codigoGeneracion,
  //     cre.numeroControl,
  //     cre.selloRecibido,
  //     cre.customer.nrc !== '0' ? cre.customer.nrc : '',
  //     cre.customer.nombre,
  //     Number(cre.totalExenta),
  //     Number(cre.totalGravada),
  //     Number(cre.totalIva),
  //     0, // Otros valores que quieras incluir
  //     0,
  //     0,
  //     Number(cre.montoTotalOperacion),
  //   ]);


  //   autoTable(doc, {
  //     startY: 45,
  //     margin: { left: 5, right: 7, top: 45, bottom: 10 },
  //     theme: "grid",
  //     body: [
  //       ...formatedData.map((row) =>
  //         row.map((value, index) =>
  //           index >= 5 && index <= 11 ? formatCurrency(Number(value)) : value
  //         )
  //       ),
  //       finalData
  //     ],
  //     didDrawPage: (options) => {
  //       header(doc, options.settings.startY)
  //     },
  //     styles: {
  //       lineColor: "#000000",
  //       fontSize: 7
  //     },
  //     columnStyles: {
  //       0: { cellWidth: 10 },
  //       1: { cellWidth: 15 },
  //       2: { cellWidth: 35 },
  //       3: { cellWidth: 15 },
  //       4: { cellWidth: 45 },
  //       5: { cellWidth: 20 },
  //       6: { cellWidth: 20 },
  //       7: { cellWidth: 25 },
  //       8: { cellWidth: 25 },
  //       9: { cellWidth: 25 },
  //       10: { cellWidth: 25 },
  //       11: { cellWidth: 25 }
  //     }
  //   })


  //   let finalY_Other = (
  //     doc as unknown as {
  //       lastAutoTable: { finalY: number }
  //     }
  //   ).lastAutoTable.finalY

  //   const pageCount = doc.internal.pages.length - 1
  //   const total_heigth = doc.internal.pageSize.height

  //   if (total_heigth - finalY_Other < 50) {
  //     doc.addPage()
  //     finalY_Other = 50 // Reiniciar la posición en la nueva página
  //   }
  //   doc.setFontSize(8)
  //   doc.text(`Consumidores Finales:`, 10, finalY_Other + 15)
  //   doc.text(`Contribuyentes:`, 10, finalY_Other + 20)
  //   doc.text(`Totales:`, 10, finalY_Other + 25)

  //   doc.text(`Ventas Exentas`, 70, finalY_Other + 10)
  //   doc.text(`${formatCurrency(1290)}`, 70, finalY_Other + 15)
  //   doc.text(`${formatCurrency($exentas)}`, 70, finalY_Other + 20)
  //   doc.text(`${formatCurrency(1290)}`, 70, finalY_Other + 25)

  //   doc.text(`Ventas Gravadas`, 110, finalY_Other + 10)
  //   doc.text(`${formatCurrency(1290)}`, 110, finalY_Other + 15)
  //   doc.text(`${formatCurrency($gravadas)}`, 110, finalY_Other + 20)
  //   doc.text(`${formatCurrency(1290)}`, 110, finalY_Other + 25)

  //   doc.text(`Importaciones`, 150, finalY_Other + 10)
  //   doc.text(`${formatCurrency(1290)}`, 150, finalY_Other + 15)
  //   doc.text(`${formatCurrency(0)}`, 150, finalY_Other + 20)
  //   doc.text(`${formatCurrency(1290)}`, 150, finalY_Other + 25)

  //   doc.text(`IVA`, 190, finalY_Other + 10)
  //   doc.text(`${formatCurrency(1290)}`, 190, finalY_Other + 15)
  //   doc.text(`${formatCurrency($iva13)}`, 190, finalY_Other + 20)
  //   doc.text(`${formatCurrency(1290)}`, 190, finalY_Other + 25)

  //   doc.text(`Percibido`, 230, finalY_Other + 10)
  //   doc.text(`${formatCurrency(1290)}`, 230, finalY_Other + 15)
  //   doc.text(`${formatCurrency(0)}`, 230, finalY_Other + 20)
  //   doc.text(`${formatCurrency(1290)}`, 230, finalY_Other + 25)

  //   doc.text(`Total`, 270, finalY_Other + 10)
  //   doc.text(`${formatCurrency(1290)}`, 270, finalY_Other + 15)
  //   doc.text(`${formatCurrency($sumTotal)}`, 270, finalY_Other + 20)
  //   doc.text(`${formatCurrency(1290)}`, 270, finalY_Other + 25)

  //   doc.line(70, finalY_Other + 22, 287, finalY_Other + 22)

  //   doc.setFontSize(10)
  //   doc.text(`Oscar Leopoldo Ramirez Garcia`, 10, finalY_Other + 40)
  //   doc.setFont("helvetica", "bold")
  //   doc.text(`Nombre contador o contribuyente`, 10, finalY_Other + 45)
  //   doc.setFont("helvetica", "normal")

  //   doc.text(`_________________________________`, 200, finalY_Other + 40)
  //   doc.setFont("helvetica", "bold")
  //   doc.text(`Firma contador o Contribuyente`, 200, finalY_Other + 45)
  //   doc.setFont("helvetica", "normal")

  //   for (let i = 1; i <= pageCount; i++) {
  //     doc.setPage(i)
  //     doc.setFontSize(10)
  //     doc.text("Folio No. " + String(i), doc.internal.pageSize.width - 30, 5)
  //     doc.text("REGISTRO No.269660-0", 10, 10, { align: "left" })
  //     doc.text("ESTABLECIMIENTO: CS EQUIPOS Y SERVICIOS, S.A. DE C.V.", 90, 10, { align: "left" })
  //     doc.text("LIBRO DE VENTAS A CONTRIBUYENTES", 150, 18, { align: "center" })
  //     doc.text(`MES: ${month.toUpperCase()}`, 10, 29, { align: "left" })
  //     doc.text(`A\u00D1O:  ${new Date().getFullYear()}`, 290, 29, { align: "right" })
  //   }

  //   doc.save("example.pdf")
  // }
  return (
    <Layout title="IVA - CFF">
      <div className=" w-full h-full p-10 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border-white border p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="w-full flex flex-col lg:flex-row gap-5">
            <div className="w-full">
              <Select
                defaultSelectedKeys={`${monthSelected}`}
                onSelectionChange={(key) => {
                  if (key) {
                    setMonthSelected(Number(new Set(key).values().next().value));
                  }
                }}
                className="w-full"
                classNames={{ label: 'font-semibold' }}
                label="Meses"
                labelPlacement="outside"
                variant="bordered"
              >
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="w-full">
              <Select
                defaultSelectedKeys={`${branchId}`}
                onSelectionChange={(key) => {
                  if (key) {
                    const id = Number(new Set(key).values().next().value);
                    setBranchId(id);
                    const branch = branch_list.find((branch) => branch.id == id);

                    if (branch) setBranchName(branch.name);
                  }
                }}
                className="w-full"
                placeholder="Selecciona la sucursal"
                classNames={{ label: 'font-semibold' }}
                label="Sucursal"
                labelPlacement="outside"
                variant="bordered"
              >
                {branch_list.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex justify-end items-end mt-3 md:mt-0">
              {actionView.includes('Exportar Excel') && (
                <Button
                  onClick={handleExportExcel}
                  color="success"
                  style={styles.thirdStyle}
                  className="text-white font-semibold"
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
                  <div className="loader"></div>
                  <p className="mt-5 dark:text-white text-gray-600 text-xl">Cargando...</p>
                </div>
              ) : (
                <>
                  {creditos_by_month.length > 0 ? (
                    <>
                      <TableCcfe />
                    </>
                  ) : (
                    <div className="w-full h-full flex dark:bg-gray-600 p-10 flex-col justify-center items-center">
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
                  <span className="border p-1 font-semibold"></span>
                  <span className="border p-1 text-sm md:font-semibold font-semibold">
                    Ventas Exentas
                  </span>
                  <span className="border p-1 text-sm md:font-semibold font-semibold">
                    Ventas Gravadas
                  </span>
                  <span className="border p-1 text-sm md:font-semibold font-semibold"></span>
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
                  <span className="border p-1"></span>
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
                  <span className="border p-1"></span>
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
                    {formatCurrency(calculateGravadaWithoutVAT(totalGravadaSinIVA + factura_totals, total + factura_totals))}
                  </span>
                  <span className="border p-1"></span>
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
                <FacturacionCcfeItem facturacionCcfe={item} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CFFBookIVA;
