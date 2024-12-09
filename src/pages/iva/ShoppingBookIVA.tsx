import useGlobalStyles from '@/components/global/global.styles';
import Layout from '@/layout/Layout';
import { useShoppingReportsStore } from '@/store/reports/shopping_reports.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { months } from '@/utils/constants';
import { formatDateToMMDDYYYY } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';
import { Button, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import saveAs from 'file-saver';
import { useEffect, useMemo, useState } from 'react';
import { PiFilePdfDuotone, PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { toast } from 'sonner';
import NO_DATA from '../../assets/no.png'
import { useViewsStore } from '@/store/views.store';
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useShoppingStore } from '@/store/shopping.store';
import { useAuthStore } from '@/store/auth.store';
import { useExcludedSubjectStore } from '@/store/excluded_subjects.store';
import { ArrowLeft, Printer, X } from 'lucide-react';
import { generate_shopping_excel } from './excel_functions/shopping.excel';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import FullPageLayout from '@/components/global/FullOverflowLayout';
function ShoppingBookIVA() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const { transmitter, gettransmitter } = useTransmitterStore();
  console.log("transmitter", transmitter)
  const { loading, shoppings, onGetShoppingReports } = useShoppingReportsStore();
  const [loadingPdf, setLoadingPdf] = useState(false)
  const showFullLayout = useDisclosure()
  const [typeOverlay, setTypeOverlay] = useState(0)
  const { user } = useAuthStore()
  console.log("data del usuario", user)

  const [pdf, setPdf] = useState("")
  const { shopping_by_months, onGetShoppingByMonth, loading_shopping } = useShoppingStore()
  const { excluded_subjects_month, getExcludedSubjectByMonth } = useExcludedSubjectStore()
  useEffect(() => {
    onGetShoppingByMonth(
      Number(user?.correlative?.branchId),
      monthSelected <= 9 ? "0" + monthSelected : monthSelected.toString()
    )
    getExcludedSubjectByMonth(Number(user?.correlative?.branchId), monthSelected)
  }, [monthSelected])


  const formatData = useMemo(() => {
    const data = shopping_by_months.map((shop) => {
      const exenta = shop.tributes
        .filter((trib) => trib.codigo !== "20")
        .map((trib) => Number(trib.value))
        .reduce((a, b) => a + b, 0)

      const totalExenta = exenta + Number(shop.totalExenta) + Number(shop.totalNoSuj)

      return [
        formatDateToMMDDYYYY(shop.fecEmi),
        shop.generationCode === "N/A" ? shop.controlNumber : shop.generationCode.replace(/-/g, ""),
        shop.supplier.nrc !== "0" ? shop.supplier.nrc : "",
        shop.supplier.nit !== "0" && shop.supplier.nit !== "N/A"
          ? shop.supplier.nit
          : shop.supplier.numDocumento,
        shop.supplier.nombre,
        shop.typeSale === "interna" ? Number(shop.totalGravada) : 0,
        shop.typeSale !== "interna" ? Number(shop.totalGravada) : 0,
        Number(shop.totalGravada) * 0.13,
        shop.typeSale === "interna" ? totalExenta : 0,
        shop.typeSale !== "interna" ? totalExenta : 0,
        Number(shop.montoTotalOperacion),
        Number(shop.ivaPerci1),
        0
      ]
    })

    const dataExcluded = excluded_subjects_month.map((exc) => [
      formatDateToMMDDYYYY(exc.fecEmi),
      exc.codigoGeneracion.replace(/-/g, ""),
      "",
      exc.subject.nit !== "0" && exc.subject.nit !== "N/A"
        ? exc.subject.nit
        : exc.subject.numDocumento,
      exc.subject.nombre,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      Number(exc.totalCompra)
    ])

    const formatData = [...data, ...dataExcluded]
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map((da, index) => [index + 1, ...da])

    return formatData
  }, [excluded_subjects_month, shopping_by_months])

  const export_to_pdf = (type: "print" | "download") => {
    const doc = new jsPDF({ orientation: "landscape" })
    const margin_left = 5
    const month = months.find((month) => month.value === monthSelected)?.name || ""
    const header = (doc: jsPDF, margin: number) => {
      doc.setFillColor("#edf2f4")
      doc.setDrawColor(0, 0, 0)
      const margin_top = margin - 10

      doc.roundedRect(margin_left, margin_top, 10, 10, 0, 0, "FD")
      doc.roundedRect(10 + margin_left, margin_top, 15, 10, 0, 0, "FD")
      doc.roundedRect(25 + margin_left, margin_top, 35, 10, 0, 0, "FD")
      doc.roundedRect(60 + margin_left, margin_top, 15, 10, 0, 0, "FD")
      doc.roundedRect(75 + margin_left, margin_top, 25, 10, 0, 0, "FD")
      doc.roundedRect(100 + margin_left, margin_top, 40, 10, 0, 0, "FD")
      doc.roundedRect(140 + margin_left, margin_top, 45, 5, 0, 0, "FD")
      doc.roundedRect(140 + margin_left, margin_top + 5, 15, 5, 0, 0, "FD")
      doc.roundedRect(140 + margin_left + 15, margin_top + 5, 15, 5, 0, 0, "FD")
      doc.roundedRect(140 + margin_left + 30, margin_top + 5, 15, 5, 0, 0, "FD")
      doc.roundedRect(185 + margin_left, margin_top, 45, 5, 0, 0, "FD")
      doc.roundedRect(185 + margin_left, margin_top + 5, 20, 5, 0, 0, "FD")
      doc.roundedRect(185 + margin_left + 20, margin_top + 5, 25, 5, 0, 0, "FD")
      doc.roundedRect(230 + margin_left, margin_top, 18, 10, 0, 0, "FD")
      doc.roundedRect(248 + margin_left, margin_top, 20, 10, 0, 0, "FD")
      doc.roundedRect(268 + margin_left, margin_top, 18, 10, 0, 0, "FD")

      doc.setFontSize(7)

      const text1 = doc.splitTextToSize("No. Corr.", 5)
      doc.text(text1, 7, margin_top + 5)
      doc.text("Fecha", margin_left + 15, margin_top + 5)
      doc.text("No. Doc.", margin_left + 43, margin_top + 5)
      doc.text("No. Reg.", margin_left + 63, margin_top + 5)
      doc.text("NIT o DUI", margin_left + 80, margin_top + 5)
      doc.text("Nombre del proveedor", margin_left + 107, margin_top + 5)
      doc.text("Compras Gravadas", margin_left + 155, margin_top + 3)
      doc.text("Internas", margin_left + 143, margin_top + 8)
      doc.text("Import.", margin_left + 158, margin_top + 8)
      doc.text("IVA", margin_left + 175, margin_top + 8)
      doc.text("Compras Exentas", margin_left + 195, margin_top + 3)
      doc.text("Internas", margin_left + 190, margin_top + 8)
      doc.text("Import.", margin_left + 213, margin_top + 8)
      const text2 = doc.splitTextToSize("Total Compras", 10)
      doc.text(text2, margin_left + 240, margin_top + 5, { align: "center" })
      const text3 = doc.splitTextToSize("Anticipo a cuenta IVA percibido", 15)
      doc.text(text3, margin_left + 258, margin_top + 3, { align: "center" })
      const text4 = doc.splitTextToSize("Compras a Suj. Excluidos", 15)
      doc.text(text4, margin_left + 278, margin_top + 3, { align: "center" })
    }

    autoTable(doc, {
      startY: 45,
      margin: { left: 5, right: 7, top: 45, bottom: 10 },
      theme: "grid",
      body: formatData.map((row) =>
        row.map((value, index) =>
          index >= 6 && index <= 13 ? formatCurrency(Number(value)) : value
        )
      ),
      didDrawPage: (options) => {
        header(doc, options.settings.startY)
      },
      styles: {
        lineColor: "#000000",
        fontSize: 7
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 15 },
        2: { cellWidth: 35 },
        3: { cellWidth: 15 },
        4: { cellWidth: 25 },
        5: { cellWidth: 40 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
        8: { cellWidth: 15 },
        9: { cellWidth: 20 },
        10: { cellWidth: 25 },
        11: { cellWidth: 18 },
        12: { cellWidth: 20 },
        13: { cellWidth: 18 }
      }
    })

    let finalY_Other = (
      doc as unknown as {
        lastAutoTable: { finalY: number }
      }
    ).lastAutoTable.finalY

    const pageCount = doc.internal.pages.length - 1
    const total_heigth = doc.internal.pageSize.height

    if (total_heigth - finalY_Other < 50) {
      doc.addPage()
      finalY_Other = 50 // Reiniciar la posición en la nueva página
    }
    doc.setFontSize(10)
    doc.text(`_________________________________`, 10, finalY_Other + 35)
    doc.setFont("helvetica", "bold")
    doc.text(`Nombre contador o contribuyente`, 10, finalY_Other + 40)
    doc.setFont("helvetica", "normal")

    doc.text(`_________________________________`, 200, finalY_Other + 35)
    doc.setFont("helvetica", "bold")
    doc.text(`Firma contador o Contribuyente`, 200, finalY_Other + 40)
    doc.setFont("helvetica", "normal")

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text("Folio No. " + String(i), doc.internal.pageSize.width - 30, 5)
      doc.text(`${transmitter.nrc}`, 10, 10, { align: "left" }) //nrc
      doc.text(`${transmitter.nombreComercial}`, 90, 10, { align: "left" }) //nombre comercial
      doc.text("LIBRO DE COMPRAS", 150, 18, { align: "center" })
      doc.text(`MES: ${month.toUpperCase()}`, 10, 29, { align: "left" })
      doc.text(`A\u00D1O:  ${new Date().getFullYear()}`, 290, 29, { align: "right" })
    }
    if (type === "download") {
      doc.save(`LIBRO_COMPRAS_${month}_${new Date().getFullYear()}.pdf`)
      return undefined
    } else {
      return doc.output("blob")
    }
  }

  const showPdf = () => {
    setLoadingPdf(true)
    showFullLayout.onOpen()
    setTypeOverlay(2)

    const blob = export_to_pdf("print")

    if (blob) {
      const url = URL.createObjectURL(blob)
      setPdf(url)
      setLoadingPdf(false)
    } else {
      toast.error("No se encontró el documento")
    }
  }

  useEffect(() => {
    gettransmitter();
  }, []);

  useEffect(() => {
    onGetShoppingReports(transmitter.id, monthSelected > 9 ? `${monthSelected}` : `0${monthSelected}`);
  }, [transmitter, monthSelected]);

  const handleExportExcel = async () => {
    if (shopping_by_months.length === 0) {
      toast.warning("No se encontaron ventas para el mes seleccionado")
      return
    }
    const data = shopping_by_months.map((shop) => {
      const exenta = shop.tributes
        .filter((trib) => trib.codigo !== "20")
        .map((trib) => Number(trib.value))
        .reduce((a, b) => a + b, 0)

      const totalExenta = exenta + Number(shop.totalExenta) + Number(shop.totalNoSuj)

      return [
        formatDateToMMDDYYYY(shop.fecEmi),
        shop.generationCode === "N/A" ? shop.controlNumber : shop.generationCode.replace(/-/g, ""),
        shop.supplier.nrc !== "0" ? shop.supplier.nrc : "",
        shop.supplier.nit !== "0" && shop.supplier.nit !== "N/A"
          ? shop.supplier.nit
          : shop.supplier.numDocumento,
        shop.supplier.nombre,
        shop.typeSale === "interna" ? Number(shop.totalGravada) : 0,
        shop.typeSale !== "interna" ? Number(shop.totalGravada) : 0,
        Number(shop.totalGravada) * 0.13,
        shop.typeSale === "interna" ? totalExenta : 0,
        shop.typeSale !== "interna" ? totalExenta : 0,
        Number(shop.montoTotalOperacion),
        Number(shop.ivaPerci1),
        0
      ]
    })

    const dataExcluded = excluded_subjects_month.map((exc) => [
      formatDateToMMDDYYYY(exc.fecEmi),
      exc.codigoGeneracion.replace(/-/g, ""),
      "",
      exc.subject.nit !== "0" && exc.subject.nit !== "N/A"
        ? exc.subject.nit
        : exc.subject.numDocumento,
      exc.subject.nombre,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      Number(exc.totalCompra)
    ])

    const formatData = [...data, ...dataExcluded]
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map((da, index) => [index + 1, ...da])

    const month = months.find((month) => month.value === monthSelected)?.name || ""

    const blob = await generate_shopping_excel(formatData, month, transmitter)

    saveAs(blob, `Libro_Compras_${month}.xlsx`)
  }
  const styles = useGlobalStyles()
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'IVA de Compras');
  const actionView = viewName?.actions.name || [];
  return (
    <Layout title="IVA de Compras">
      <>
        <div className="w-full h-full flex flex-col overflow-y-auto p-5 bg-white dark:bg-gray-800">
          <div className="w-full flex pb-5 mt-10">
            <Link to="/" className=" dark:text-white flex">
              <ArrowLeft /> Regresar
            </Link>
          </div>
          <div className="w-full  mt-2">
            <div className="w-full flex justify-between gap-5">
              <Select
                selectedKeys={[`${monthSelected}`]}
                onSelectionChange={(key) => {
                  if (key) {
                    setMonthSelected(Number(new Set(key).values().next().value))
                  }
                }}
                className="w-44"
                classNames={{ label: "font-semibold" }}
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
              <div className="w-full flex justify-end items-end gap-10">


                <Button
                  className="px-10"
                  endContent={<Printer size={20} />}
                  onClick={() => showPdf()}
                  color="secondary"
                >
                  Ver e imprimir
                </Button>
                <Button
                  className="px-10"
                  endContent={<PiFilePdfDuotone size={20} />}
                  onClick={() => export_to_pdf("download")}
                  color="danger"
                >
                  Exportar a PDF
                </Button>
                <Button
                  className="px-10"
                  endContent={<PiMicrosoftExcelLogoBold size={20} />}
                  onClick={handleExportExcel}
                  color="success"
                >
                  Exportar a excel
                </Button>
              </div>
            </div>
            <div>
              <div className="w-full max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] 2xl:max-h-[800px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
                {loading_shopping ? (
                  <div className="w-full flex justify-center p-20 items-center flex-col">
                    <div className="loader"></div>
                    <p className="mt-5 dark:text-white text-gray-600 text-xl">Cargando...</p>
                  </div>
                ) : (
                  <>
                    {shopping_by_months.length > 0 ? (
                      <>
                        <table className="w-full">
                          <thead className="sticky top-0 z-20 bg-white">
                            <tr>
                              <th
                                style={styles.darkStyle}
                                className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                              >
                                Fecha
                              </th>
                              <th
                                style={styles.darkStyle}
                                className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                              >
                                No. doc
                              </th>
                              <th
                                style={styles.darkStyle}
                                className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                              >
                                No. Reg.
                              </th>
                              <th
                                style={styles.darkStyle}
                                className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                              >
                                NIT O DUI
                              </th>
                              <th
                                style={styles.darkStyle}
                                className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                              >
                                Nombre del proveedor
                              </th>
                              <th
                                style={styles.darkStyle}
                                className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                              >
                                Compras gravadas
                              </th>
                              <th
                                style={styles.darkStyle}
                                className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                              >
                                IVA
                              </th>
                              <th
                                style={styles.darkStyle}
                                className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                              >
                                Total compras
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {shopping_by_months.map((shop, index) => (
                              <tr key={index} className="border-b border-slate-200">
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {formatDateToMMDDYYYY(shop.fecEmi)}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {shop.generationCode !== "N/A"
                                    ? shop.generationCode
                                    : shop.controlNumber}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {shop.supplier.nrc !== "0" ? shop.supplier.nrc : ""}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {shop.supplier.tipoDocumento !== "N/A"
                                    ? shop.supplier.numDocumento
                                    : shop.supplier.nit}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {shop.supplier.nombre}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {formatCurrency(Number(shop.totalGravada))}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {formatCurrency(Number(shop.totalGravada) * 0.13)}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {formatCurrency(Number(shop.montoTotalOperacion))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    ) : (
                      <>
                        <div className="w-full h-full flex dark:bg-gray-600 p-10 flex-col justify-center items-center">
                          <img className="w-44 mt-10" src={NO_DATA} alt="" />
                          <p className="mt-5 dark:text-white text-gray-600 text-xl">
                            No se encontraron resultados
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              <div>
                <p className="mt-5 text-xl font-semibold">Compras a sujetos excluidos</p>
                <div className="w-full max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] 2xl:max-h-[800px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
                  <table className="w-full">
                    <thead className="sticky top-0 z-20 bg-white">
                      <tr>
                        <th
                          style={styles.darkStyle}
                          className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                        >
                          Fecha
                        </th>
                        <th
                          style={styles.darkStyle}
                          className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                        >
                          No. doc
                        </th>
                        <th
                          style={styles.darkStyle}
                          className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                        >
                          NIT O DUI
                        </th>
                        <th
                          style={styles.darkStyle}
                          className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                        >
                          Nombre del proveedor
                        </th>
                        <th
                          style={styles.darkStyle}
                          className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                        >
                          Total compras
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {excluded_subjects_month.map((shop, index) => (
                        <tr key={index} className="border-b border-slate-200">
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {formatDateToMMDDYYYY(shop.fecEmi)}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {shop.codigoGeneracion}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {shop.subject.tipoDocumento !== "N/A"
                              ? shop.subject.numDocumento
                              : shop.subject.nit}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {shop.subject.nombre}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {formatCurrency(Number(shop.totalCompra))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FullPageLayout show={showFullLayout.isOpen}>
          <div
            className={classNames(
              "w-[500px] min-h-96 p-8 flex flex-col justify-center items-center bg-white rounded-[25px] bg-gradient-to-b",
              typeOverlay === 0 && "from-blue-100 to-white",
              typeOverlay === 1 && "from-green-100 to-white",
              typeOverlay === 2 && "h-[95vh] w-[95vw] !p-0"
            )}
          >
            {typeOverlay === 2 && (
              <div className="w-[95vw] h-[95vh] bg-white rounded-2xl">
                <Button
                  color="danger"
                  onClick={() => showFullLayout.onClose()}
                  className="absolute bottom-6 left-6"
                  isIconOnly
                >
                  <X />
                </Button>
                {loadingPdf ? (
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <div className="loader"></div>
                    <p className="mt-5 text-xl">Cargando...</p>
                  </div>
                ) : (
                  <iframe className="w-full h-full" src={pdf}></iframe>
                )}
              </div>
            )}
          </div>
        </FullPageLayout></>
    </Layout>
  );
}

export default ShoppingBookIVA;
