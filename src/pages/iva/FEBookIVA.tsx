import useGlobalStyles from '@/components/global/global.styles';
import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useSalesStore } from '@/store/sales.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { months } from '@/utils/constants';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { Fragment, useEffect, useState } from 'react';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { toast } from 'sonner';
import { export_excel_facturacion } from '../excel/generate_excel';
import saveAs from 'file-saver';
import { formatDateMMDDYYYY } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';
import { useViewsStore } from '@/store/views.store';
// import { jsPDF } from "jspdf"
// import autoTable from "jspdf-autotable"

function FEBookIVA() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const [branchId, setBranchId] = useState(0);
  const { transmitter, gettransmitter } = useTransmitterStore();
  const { branch_list, getBranchesList } = useBranchesStore();

  useEffect(() => {
    gettransmitter();
    getBranchesList();
  }, []);

  const { facturas_by_month, loading_facturas, getFeMonth } = useSalesStore();

  useEffect(() => {
    getFeMonth(branchId, monthSelected);
  }, [monthSelected, branchId]);

  const styles = useGlobalStyles();

  const handleExportExcel = async () => {
    if (facturas_by_month.length === 0) {
      toast.warning('No se encontraron facturas para el mes seleccionado');
      return;
    }
    const vouchers: Array<{ name: string; items: Array<Array<string | number>> }> = [];
    facturas_by_month.forEach((voucher) => {
      const formatName = (type: string) => {
        switch (type) {
          case 'T':
            return 'Tickets';
          case 'F':
            return 'Facturas';
          case 'FE':
            return 'Facturas Electrónicas';
        }
      };

      vouchers.push({
        name: formatName(voucher.typeVoucher) + ' ' + `(${voucher.code})`,
        items: voucher.sales.map((venta) => {
          return [
            formatDateMMDDYYYY(venta.day, monthSelected),
            venta.firstCorrelativ!,
            venta.lastCorrelative!,
            venta.firstNumeroControl!,
            venta.lastNumeroControl!,
            venta.firstSelloRecibido,
            venta.lastSelloRecibido,
            '',
            Number(venta.totalSales),
            '',
            Number(venta.totalSales),
            '',
          ];
        }),
      });
    });

    const month = months.find((month) => month.value === monthSelected)?.name || '';

    const blob = await export_excel_facturacion({
      transmitter,
      month,
      items: vouchers,
    });

    saveAs(blob, `Libro_Consumidor_Final_${month}.xlsx`);
  };
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'IVA de FE');

  const actionView = viewName?.actions.name || [];



  // const handleExportPDF = () => {
  //   const doc = new jsPDF({ orientation: "landscape" })
  //   const margin_left = 5
  //   const month = months.find((month) => month.value === monthSelected)?.name || ""
  //   const header = (doc: jsPDF, margin: number) => {
  //     doc.setFillColor("#edf2f4")
  //     doc.setDrawColor(0, 0, 0)
  //     const margin_top = margin - 15

  //     doc.roundedRect(margin_left, margin_top, 30, 15, 0, 0, "FD")
  //     doc.roundedRect(30 + margin_left, margin_top, 60, 5, 0, 0, "FD")
  //     doc.roundedRect(30 + margin_left, margin_top + 5, 30, 10, 0, 0, "FD")
  //     doc.roundedRect(60 + margin_left, margin_top + 5, 30, 10, 0, 0, "FD")
  //     doc.roundedRect(90 + margin_left, margin_top, 60, 5, 0, 0, "FD")
  //     doc.roundedRect(90 + margin_left, margin_top + 5, 30, 10, 0, 0, "FD")
  //     doc.roundedRect(120 + margin_left, margin_top + 5, 30, 10, 0, 0, "FD")
  //     doc.roundedRect(150 + margin_left, margin_top, 75, 5, 0, 0, "FD")
  //     doc.roundedRect(150 + margin_left, margin_top + 5, 25, 10, 0, 0, "FD")
  //     doc.roundedRect(175 + margin_left, margin_top + 5, 50, 5, 0, 0, "FD")
  //     doc.roundedRect(175 + margin_left, margin_top + 10, 25, 5, 0, 0, "FD")
  //     doc.roundedRect(200 + margin_left, margin_top + 10, 25, 5, 0, 0, "FD")
  //     doc.roundedRect(225 + margin_left, margin_top, 30, 15, 0, 0, "FD")
  //     doc.roundedRect(255 + margin_left, margin_top, 30, 15, 0, 0, "FD")

  //     doc.setFontSize(7)

  //     doc.text("FECHA EMISIÓN", 10, margin_top + 8)
  //     doc.text("FACTURAS", 55, margin_top + 4)

  //     const text = doc.splitTextToSize("CÓDIGO GENERACIÓN INICIAL", 27)
  //     doc.text(text, 50, margin_top + 10, { align: "center" })

  //     const codFinal = doc.splitTextToSize("CÓDIGO GENERACIÓN FINAL", 27)
  //     doc.text(codFinal, 80, margin_top + 10, { align: "center" })

  //     const controlSt = doc.splitTextToSize("NUMERO DE CONTROL DEL", 27)
  //     doc.text(controlSt, 110, margin_top + 10, { align: "center" })

  //     const controlEnd = doc.splitTextToSize("NUMERO DE CONTROL AL", 27)
  //     doc.text(controlEnd, 140, margin_top + 10, { align: "center" })

  //     doc.text("EXENTAS", 167.5, margin_top + 11, { align: "center" })
  //     doc.text("VENTAS", 190, margin_top + 3.5)
  //     doc.text("GRAVADAS", 200, margin_top + 8.5)
  //     doc.text("LOCALES", 187, margin_top + 13.5)
  //     doc.text("EXPORTACIONES", 207, margin_top + 13.5)

  //     const vTotal = doc.splitTextToSize("VENTAS TOTALES", 27)
  //     doc.text(vTotal, 245, margin_top + 8.5, { align: "center" })

  //     const vTerceros = doc.splitTextToSize("VENTAS POR CUENTA DE TERCEROS", 27)
  //     doc.text(vTerceros, 275, margin_top + 8.5, { align: "center" })
  //   }

  //   const data = facturas_by_month.map((factura) => {
  //     return {
  //       fecha: formatDateMMDDYYYY(factura.day, monthSelected),
  //       codGenI: factura.firstCorrelative!,
  //       codGenF: factura.lastCorrelative!,
  //       numeroI: factura.firstNumeroControl!.replaceAll("-", ""),
  //       numeroF: factura.lastNumeroControl!.replaceAll("-", ""),
  //       exento: 0,
  //       locales: Number(factura.totalSales),
  //       exp: 0,
  //       total: Number(factura.totalSales),
  //       tercero: 0
  //     }
  //   })

  //   const ventas_locales = data.map((factura) => factura.total).reduce((a, b) => a + b, 0)

  //   const exentas = data.map((factura) => factura.exento).reduce((a, b) => a + b, 0)

  //   const total = ventas_locales + exentas

  //   autoTable(doc, {
  //     startY: 50,
  //     margin: { left: 5, right: 7, top: 50, bottom: 10 },
  //     theme: "grid",
  //     showHead: false,
  //     body: [
  //       ...data.map((dt) => ({
  //         ...dt,
  //         exento: formatCurrency(dt.exento),
  //         locales: formatCurrency(dt.locales),
  //         exp: formatCurrency(dt.exp),
  //         total: formatCurrency(dt.total),
  //         tercero: formatCurrency(dt.tercero)
  //       }))
  //     ],
  //     styles: {
  //       lineColor: "#000000",
  //       fontSize: 7
  //     },
  //     columnStyles: {
  //       0: { cellWidth: 30 },
  //       1: { cellWidth: 30 },
  //       2: { cellWidth: 30 },
  //       3: { cellWidth: 30 },
  //       4: { cellWidth: 30 },
  //       5: { cellWidth: 25 },
  //       6: { cellWidth: 25 },
  //       7: { cellWidth: 25 },
  //       8: { cellWidth: 30 }
  //     },
  //     didDrawPage: (options) => {
  //       header(doc, options.settings.startY)
  //     }
  //   })

  //   // const pageSizeHeight = doc.internal.pageSize.height

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
  //   doc.setFontSize(10)
  //   doc.text(`VENTAS LOCALES GRAVADAS:   ${formatCurrency(ventas_locales)}`, 10, finalY_Other + 10)
  //   doc.text(`/1.13 = VENTAS NETAS GRAVADAS`, 175, finalY_Other + 10)
  //   doc.text(`${formatCurrency(total / 1.13)}`, 260, finalY_Other + 10)
  //   doc.text(`POR 13% IMPUESTO (DÉBITO FISCAL)`, 175, finalY_Other + 18)
  //   doc.text(`${formatCurrency((total / 1.13) * 0.13)}`, 260, finalY_Other + 18)
  //   doc.text(`TOTAL VENTAS GRAVADAS:`, 175, finalY_Other + 26)
  //   doc.text(`_______________`, 260, finalY_Other + 20)
  //   doc.text(`${formatCurrency(total)}`, 260, finalY_Other + 26)

  //   doc.text(`Oscar Leopoldo Ramirez Garcia`, 10, finalY_Other + 35)
  //   doc.setFont("helvetica", "bold")
  //   doc.text(`Nombre contador o contribuyente`, 10, finalY_Other + 40)
  //   doc.setFont("helvetica", "normal")

  //   doc.text(`_________________________________`, 200, finalY_Other + 35)
  //   doc.setFont("helvetica", "bold")
  //   doc.text(`Firma contador o Contribuyente`, 200, finalY_Other + 40)
  //   doc.setFont("helvetica", "normal")
  //   for (let i = 1; i <= pageCount; i++) {
  //     doc.setPage(i)
  //     doc.setFontSize(10)
  //     doc.text("Folio No. " + String(i), doc.internal.pageSize.width - 30, 5)
  //     doc.text("REGISTRO No.269660-0", 10, 10, { align: "left" })
  //     doc.text("ESTABLECIMIENTO: CS EQUIPOS Y SERVICIOS, S.A. DE C.V.", 90, 10, { align: "left" })
  //     doc.text("LIBRO DE VENTAS CONSUMIDOR FINAL", 150, 18, { align: "center" })
  //     doc.text(`MES: ${month.toUpperCase()}`, 10, 29, { align: "left" })
  //     doc.text(`A\u00D1O:  ${new Date().getFullYear()}`, 290, 29, { align: "right" })
  //   }

  //   doc.save(`Libro_Consumidor_Final_${month}.pdf`)
  // }
  return (
    <Layout title="IVA - FE">
      <div className=" w-full h-full p-10 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border-white border p-5 overflow-y-auto custom-scrollbar bg-white shadow rounded-xl dark:bg-gray-900">
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
                    setBranchId(Number(new Set(key).values().next().value));
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
              {/* <Button onClick={handleExportPDF} color="danger">
                Exportar a PDF
              </Button> */}
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
            </div>
          </div>

          <div className='max-w-full overflow-x-auto'>
            <div className="w-full max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] 2xl:max-h-[800px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
              {loading_facturas ? (
                <div className="w-full flex justify-center p-20 items-center flex-col">
                  <div className="loader"></div>
                  <p className="mt-5 dark:text-white text-gray-600 text-xl">Cargando...</p>
                </div>
              ) : (
                <>
                  {facturas_by_month.map((facturas, index) => (
                    <Fragment>
                      {facturas.sales.length > 0 ? (
                        <>
                          <div className="w-full py-10">
                            <p>
                              {facturas.typeVoucher === 'F' && `Facturas (${facturas.resolution})`}
                              {facturas.typeVoucher === 'FE' &&
                                `Facturas Electrónicas (${facturas.code})`}
                              {facturas.typeVoucher === 'T' && `Tickets (${facturas.code})`}
                            </p>
                          </div>
                          <table className="w-full">
                            <thead className="sticky top-0 z-20 bg-white">
                              <tr>
                                <th className="p-3 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Fecha
                                </th>
                                <th className="p-3 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Correlativo Inicial
                                </th>
                                <th className="p-3 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Correlativo Final
                                </th>
                                <th className="p-3 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Numero Control Inicial
                                </th>
                                <th className="p-3 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Numero Control Final
                                </th>
                                {/* <th className="p-3 w-32 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Sello Recibido Inicial
                                </th> */}
                                {/* <th className="p-3 w-32 text-xs font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                Sello Recibido Final
                                </th> */}
                                <th className="p-3 text-xs font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {facturas.sales.map((factura, index) => (
                                <tr key={index} className="border-b border-slate-200">
                                  <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                    {formatDateMMDDYYYY(factura.day, monthSelected)}
                                  </td>
                                  <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                    {factura.firstCorrelativ!}
                                  </td>
                                  <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                    {factura.lastCorrelative!}
                                  </td>
                                  <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                    {factura.firstNumeroControl!}
                                  </td>
                                  <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                    {factura.lastNumeroControl!}
                                  </td>
                                  {/* <td className="p-3 w-32 text-xs text-slate-500 dark:text-slate-100">
                                    <p className="truncate w-44">{factura.firstSelloRecibido!}</p>
                                  </td>
                                  <td className="p-3 w-32 text-xs text-slate-500 dark:text-slate-100">
                                  <p className="truncate w-44">{factura.lastSelloRecibido!}</p>
                                  </td> */}
                                  <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                                    {formatCurrency(Number(factura.totalSales))}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div>
                            <p className="mt-5">
                              /1.13 = VENTAS NETAS GRAVADAS:{' '}
                              {formatCurrency(
                                facturas.sales
                                  .map((factura) => Number(factura.totalSales))
                                  .reduce((a, b) => a + b, 0) / 1.13
                              )}
                            </p>
                            <p className="mt-2">
                              POR 13% IMPUESTO (DEBITO FISCAL):{' '}
                              {formatCurrency(
                                (facturas.sales
                                  .map((factura) => Number(factura.totalSales))
                                  .reduce((a, b) => a + b, 0) /
                                  1.13) *
                                0.13
                              )}
                            </p>
                            <p className="mt-2">
                              TOTAL VENTAS GRAVADAS:{' '}
                              {formatCurrency(
                                facturas.sales
                                  .map((factura) => Number(factura.totalSales))
                                  .reduce((a, b) => a + b, 0)
                              )}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full h-full flex dark:bg-gray-600 p-10 flex-col justify-center items-center">
                            <p>
                              {index === 0
                                ? 'FACTURAS(' + facturas.resolution + ')'
                                : 'Punto de Venta(' + facturas.code + ')'}
                            </p>
                            <p className="mt-5 dark:text-white text-gray-600 text-xl">
                              No se encontraron resultados
                            </p>
                          </div>
                        </>
                      )}
                    </Fragment>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default FEBookIVA;
