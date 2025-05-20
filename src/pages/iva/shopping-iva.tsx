import { Button, Select, SelectItem, useDisclosure } from '@heroui/react';
import saveAs from 'file-saver';
import { useEffect, useMemo, useState } from 'react';
import { PiFilePdfDuotone, PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ArrowLeft, Printer, X } from 'lucide-react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import NO_DATA from '../../assets/no.png';

import { generate_shopping_excel } from './excel_functions/shopping.excel';

import { useExcludedSubjectStore } from '@/store/excluded_subjects.store';
import { useShoppingStore } from '@/store/shopping.store';
import { useViewsStore } from '@/store/views.store';
import { formatCurrency } from '@/utils/dte';
import { formatDateToMMDDYYYY } from '@/utils/dates';
import { months } from '@/utils/constants';
import { useTransmitterStore } from '@/store/transmitter.store';
import Layout from '@/layout/Layout';
import FullPageLayout from '@/components/global/FullOverflowLayout';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import { get_user } from '@/storage/localStorage';
import DivGlobal from '@/themes/ui/div-global';

function ShoppingBookIVA() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const { transmitter, gettransmitter } = useTransmitterStore();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const showFullLayout = useDisclosure();
  const [typeOverlay, setTypeOverlay] = useState(0);

  const transmiter = get_user();

  const currentYear = new Date().getFullYear();
  const years = [
    { value: currentYear, name: currentYear.toString() },
    { value: currentYear - 1, name: (currentYear - 1).toString() },
  ];
  const [yearSelected, setYearSelected] = useState(currentYear);

  const [pdf, setPdf] = useState('');
  const { shopping_by_months, onGetShoppingByMonth, loading_shopping } = useShoppingStore();
  const { excluded_subjects_month, getExcludedSubjectByMonth } = useExcludedSubjectStore();

  useEffect(() => {
    onGetShoppingByMonth(
      Number(transmiter?.pointOfSale?.branch.transmitter.id),
      monthSelected <= 9 ? '0' + monthSelected : monthSelected.toString(),
      yearSelected
    );
    getExcludedSubjectByMonth(Number(transmiter?.pointOfSale?.branch.transmitter.id ), monthSelected, yearSelected);
  }, [monthSelected, yearSelected]);

  const formatData = useMemo(() => {
    const data = shopping_by_months.map((shop) => {
      const exenta = shop.tributes
        .filter((trib) => trib.codigo !== '20')
        .map((trib) => Number(trib.value))
        .reduce((a, b) => a + b, 0);

      const totalExenta = exenta + Number(shop.totalExenta) + Number(shop.totalNoSuj);

      return [
        formatDateToMMDDYYYY(shop.fecEmi),
        shop.generationCode === 'N/A' ? shop.controlNumber : shop.generationCode.replace(/-/g, ''),
        shop.supplier.nrc !== '0' ? shop.supplier.nrc : '',
        shop.supplier.nit !== '0' && shop.supplier.nit !== 'N/A'
          ? shop.supplier.nit
          : shop.supplier.numDocumento,
        shop.supplier.nombre,
        shop.typeSale === 'Interna' ? Number(shop.totalGravada) : 0,
        shop.typeSale === 'Internacion' ? Number(shop.totalGravada) : 0,
        shop.typeSale === 'Importacion' ? Number(shop.totalGravada) : 0,
        Number(shop.totalGravada) * 0.13,
        shop.typeSale === 'Interna' ? totalExenta : 0,
        shop.typeSale === 'Internacion' ? totalExenta : 0,
        shop.typeSale === 'Importacion' ? totalExenta : 0,
        Number(shop.montoTotalOperacion),
        Number(shop.ivaPerci1),
        0,
      ];
    });

    const dataExcluded = excluded_subjects_month.map((exc) => [
      formatDateToMMDDYYYY(exc.fecEmi),
      exc.codigoGeneracion.replace(/-/g, ''),
      '',
      exc.subject.nit !== '0' && exc.subject.nit !== 'N/A'
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
      0,
      0,
      Number(exc.totalCompra),
    ]);

    const formatData = [...data, ...dataExcluded]
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map((da, index) => [index + 1, ...da]);

    return formatData;
  }, [excluded_subjects_month, shopping_by_months]);

  const export_to_pdf = (type: 'print' | 'download') => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const margin_left = 5;
    const month = months.find((month) => month.value === monthSelected)?.name || '';
    const header = (doc: jsPDF, margin: number) => {
      doc.setFillColor('#edf2f4');
      doc.setDrawColor(0, 0, 0);
      const margin_top = margin - 10;

      doc.roundedRect(margin_left, margin_top, 10, 10, 0, 0, 'FD');
      doc.roundedRect(10 + margin_left, margin_top, 15, 10, 0, 0, 'FD');
      doc.roundedRect(25 + margin_left, margin_top, 30, 10, 0, 0, 'FD');
      doc.roundedRect(55 + margin_left, margin_top, 15, 10, 0, 0, 'FD');
      doc.roundedRect(70 + margin_left, margin_top, 25, 10, 0, 0, 'FD');
      doc.roundedRect(95 + margin_left, margin_top, 35, 10, 0, 0, 'FD');
      doc.roundedRect(130 + margin_left, margin_top, 60, 5, 0, 0, 'FD');
      doc.roundedRect(130 + margin_left, margin_top + 5, 15, 5, 0, 0, 'FD');
      doc.roundedRect(130 + margin_left + 15, margin_top + 5, 15, 5, 0, 0, 'FD');
      doc.roundedRect(130 + margin_left + 30, margin_top + 5, 15, 5, 0, 0, 'FD');
      doc.roundedRect(130 + margin_left + 45, margin_top + 5, 15, 5, 0, 0, 'FD');
      doc.roundedRect(190 + margin_left, margin_top, 45, 5, 0, 0, 'FD');
      doc.roundedRect(190 + margin_left, margin_top + 5, 15, 5, 0, 0, 'FD');
      doc.roundedRect(190 + margin_left + 15, margin_top + 5, 15, 5, 0, 0, 'FD');
      doc.roundedRect(190 + margin_left + 30, margin_top + 5, 15, 5, 0, 0, 'FD');
      doc.roundedRect(235 + margin_left, margin_top, 18, 10, 0, 0, 'FD');
      doc.roundedRect(253 + margin_left, margin_top, 18, 10, 0, 0, 'FD');
      doc.roundedRect(271 + margin_left, margin_top, 18, 10, 0, 0, 'FD');

      doc.setFontSize(6.2);

      const text1 = doc.splitTextToSize('No. Corr.', 5);

      doc.text(text1, 7, margin_top + 5);
      doc.text('Fecha', margin_left + 15, margin_top + 5);
      doc.text('No. Doc.', margin_left + 35, margin_top + 5);
      doc.text('No. Reg.', margin_left + 58, margin_top + 5);
      doc.text('NIT o DUI', margin_left + 78, margin_top + 5);
      doc.text('Nombre del proveedor', margin_left + 100, margin_top + 5);
      doc.text('Compras Gravadas', margin_left + 150, margin_top + 3);
      doc.text('Internas', margin_left + 133, margin_top + 8);
      doc.text('Internaciones', margin_left + 145.5, margin_top + 8);
      doc.text('Importaciones', margin_left + 160.2, margin_top + 8);
      doc.text('IVA', margin_left + 180, margin_top + 8);
      doc.text('Compras Exentas', margin_left + 205, margin_top + 3);
      doc.text('Internas', margin_left + 195, margin_top + 8);
      doc.text('Internaciones', margin_left + 206, margin_top + 8);
      doc.text('Importaciones', margin_left + 220.5, margin_top + 8);
      const text2 = doc.splitTextToSize('Total Compras', 10);

      doc.text(text2, margin_left + 243.5, margin_top + 4, { align: 'center' });
      const text3 = doc.splitTextToSize('Anticipo a cuenta IVA percibido', 15);

      doc.text(text3, margin_left + 262, margin_top + 3, { align: 'center' });
      const text4 = doc.splitTextToSize('Compras a Suj. Excluidos', 15);

      doc.text(text4, margin_left + 280, margin_top + 4, { align: 'center' });
    };

    autoTable(doc, {
      startY: 45,
      margin: { left: 5, right: 7, top: 45, bottom: 10 },
      theme: 'grid',
      body: formatData.map((row) =>
        row.map((value, index) =>
          index >= 6 && index <= 13 ? formatCurrency(Number(value)) : value
        )
      ),
      didDrawPage: (options) => {
        header(doc, options.settings.startY);
      },
      styles: {
        lineColor: '#000000',
        fontSize: 6.5,
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 15 },
        2: { cellWidth: 30 },
        3: { cellWidth: 15 },
        4: { cellWidth: 25 },
        5: { cellWidth: 35 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
        8: { cellWidth: 15 },
        9: { cellWidth: 15 },
        10: { cellWidth: 15 },
        11: { cellWidth: 15 },
        12: { cellWidth: 15 },
        13: { cellWidth: 18 },
        14: { cellWidth: 18 },
        15: { cellWidth: 18 },
      },
    });

    let finalY_Other = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    const pageCount = doc.internal.pages.length - 1;
    const total_heigth = doc.internal.pageSize.height;

    if (total_heigth - finalY_Other < 50) {
      doc.addPage();
      finalY_Other = 50; // Reiniciar la posición en la nueva página
    }
    doc.setFontSize(10);
    doc.text(`_________________________________`, 10, finalY_Other + 35);
    doc.setFont('helvetica', 'bold');
    doc.text(`Nombre contador o contribuyente`, 10, finalY_Other + 40);
    doc.setFont('helvetica', 'normal');

    doc.text(`_________________________________`, 200, finalY_Other + 35);
    doc.setFont('helvetica', 'bold');
    doc.text(`Firma contador o Contribuyente`, 200, finalY_Other + 40);
    doc.setFont('helvetica', 'normal');

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text('Folio No. ' + String(i), doc.internal.pageSize.width - 30, 5);
      doc.text(`${transmitter.nrc}`, 10, 10, { align: 'left' }); //nrc
      doc.text(`${transmitter.nombreComercial}`, 90, 10, { align: 'left' }); //nombre comercial
      doc.text('LIBRO DE COMPRAS', 150, 18, { align: 'center' });
      doc.text(`MES: ${month.toUpperCase()}`, 10, 29, { align: 'left' });
      doc.text(`A\u00D1O:  ${yearSelected}`, 290, 29, { align: 'right' });
    }
    if (type === 'download') {
      doc.save(`LIBRO_COMPRAS_${month}_${yearSelected}.pdf`);

      return undefined;
    } else {
      return doc.output('blob');
    }
  };

  const showPdf = () => {
    setLoadingPdf(true);
    showFullLayout.onOpen();
    setTypeOverlay(2);

    const blob = export_to_pdf('print');

    if (blob) {
      const url = URL.createObjectURL(blob);

      setPdf(url);
      setLoadingPdf(false);
    } else {
      toast.error('No se encontró el documento');
    }
  };

  useEffect(() => {
    gettransmitter();
  }, []);

  const handleExportExcel = async () => {
    if (shopping_by_months.length === 0) {
      toast.warning('No se encontaron ventas para el mes seleccionado');

      return;
    }
    const data = shopping_by_months.map((shop) => {
      const exenta = shop.tributes
        .filter((trib) => trib.codigo !== '20')
        .map((trib) => Number(trib.value))
        .reduce((a, b) => a + b, 0);

      const totalExenta = exenta + Number(shop.totalExenta) + Number(shop.totalNoSuj);

      return [
        formatDateToMMDDYYYY(shop.fecEmi),
        shop.generationCode === 'N/A' ? shop.controlNumber : shop.generationCode.replace(/-/g, ''),
        shop.supplier.nrc !== '0' ? shop.supplier.nrc : '',
        shop.supplier.nit !== '0' && shop.supplier.nit !== 'N/A'
          ? shop.supplier.nit
          : shop.supplier.numDocumento,
        shop.supplier.nombre,
        shop.typeSale === 'Interna' ? Number(shop.totalGravada) : 0,
        shop.typeSale === 'Internacion' ? Number(shop.totalGravada) : 0,
        shop.typeSale === 'Importacion' ? Number(shop.totalGravada) : 0,
        Number(shop.totalGravada) * 0.13,
        shop.typeSale === 'Interna' ? totalExenta : 0,
        shop.typeSale === 'Internacion' ? totalExenta : 0,
        shop.typeSale === 'Importacion' ? totalExenta : 0,
        Number(shop.montoTotalOperacion),
        Number(shop.ivaPerci1),
        0,
      ];
    });

    const dataExcluded = excluded_subjects_month.map((exc) => [
      formatDateToMMDDYYYY(exc.fecEmi),
      exc.codigoGeneracion.replace(/-/g, ''),
      '',
      exc.subject.nit !== '0' && exc.subject.nit !== 'N/A'
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
      Number(exc.totalCompra),
    ]);

    const formatData = [...data, ...dataExcluded]
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map((da, index) => [index + 1, ...da]);

    const month = months.find((month) => month.value === monthSelected)?.name || '';

    const blob = await generate_shopping_excel(formatData, month, transmitter, yearSelected);

    saveAs(blob, `Libro_Compras_${month}.xlsx`);
  };
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'IVA de Compras');
  const actionView = viewName?.actions.name || [];

  return (
    <Layout title="IVA de Compras">
      <>
        <DivGlobal>
          <div className="w-full flex pb-5 mt-10">
            <Link className=" dark:text-white flex" to="/">
              <ArrowLeft /> Regresar
            </Link>
          </div>
          <div className="w-full  mt-2">
            <div className="w-full flex justify-between gap-5">
              <Select
                className="w-44"
                classNames={{ label: 'font-semibold' }}
                label="Meses"
                labelPlacement="outside"
                selectedKeys={[`${monthSelected}`]}
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
              <Select
                className="w-44"
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
              <div className="w-full flex justify-end items-end gap-10">
                {actionView.includes('Imprimir') && (
                  <ButtonUi
                    className="px-10"
                    endContent={<Printer size={20} />}
                    theme={Colors.Info}
                    onPress={() => showPdf()}
                  >
                    Ver e imprimir
                  </ButtonUi>
                )}

                {actionView.includes('Exportar PDF') && (
                  <ButtonUi
                    className="px-10"
                    endContent={<PiFilePdfDuotone size={20} />}
                    theme={Colors.Error}
                    onPress={() => export_to_pdf('download')}
                  >
                    Exportar a PDF
                  </ButtonUi>
                )}

                {actionView.includes('Exportar Excel') && (
                  <ButtonUi
                    className="px-10"
                    endContent={<PiMicrosoftExcelLogoBold size={20} />}
                    theme={Colors.Success}
                    onPress={handleExportExcel}
                  >
                    Exportar a excel
                  </ButtonUi>
                )}
              </div>
            </div>
            <div>
              <div className="w-full max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] 2xl:max-h-[800px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
                {loading_shopping ? (
                  <div className="w-full flex justify-center p-20 items-center flex-col">
                    <div className="loader" />
                    <p className="mt-5 dark:text-white text-gray-600 text-xl">Cargando...</p>
                  </div>
                ) : (
                  <>
                    {shopping_by_months.length > 0 ? (
                      <>
                        <table className="w-full">
                          <thead className="sticky top-0 z-20 bg-white">
                            <tr>
                              <ThGlobal className="text-left p-3">Fecha declaración</ThGlobal>
                              <ThGlobal className="text-left p-3">Fecha de emision</ThGlobal>
                              <ThGlobal className="text-left p-3">No. doc</ThGlobal>
                              <ThGlobal className="text-left p-3">No. Reg.</ThGlobal>
                              <ThGlobal className="text-left p-3">NIT O DUI</ThGlobal>
                              <ThGlobal className="text-left p-3">Nombre del proveedor</ThGlobal>
                              <ThGlobal className="text-left p-3">Compras gravadas</ThGlobal>
                              <ThGlobal className="text-left p-3">IVA</ThGlobal>
                              <ThGlobal className="text-left p-3">Total compra</ThGlobal>
                            </tr>
                          </thead>
                          <tbody>
                            {shopping_by_months.map((shop, index) => (
                              <tr key={index} className="border-b border-slate-200">
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {formatDateToMMDDYYYY(shop.declarationDate ?? shop.fecEmi)}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {formatDateToMMDDYYYY(shop.fecEmi)}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {shop.generationCode !== 'N/A'
                                    ? shop.generationCode
                                    : shop.controlNumber}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {shop.supplier.nrc !== '0' ? shop.supplier.nrc : ''}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {shop.supplier.tipoDocumento !== 'N/A'
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
                        <div className="w-full h-full flex p-10 flex-col justify-center items-center">
                          <img alt="" className="w-44 mt-10" src={NO_DATA} />
                          <p className="mt-5 dark:text-white text-gray-600 text-xl">
                            No se encontraron resultados
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </DivGlobal>
        <FullPageLayout show={showFullLayout.isOpen}>
          <div
            className={classNames(
              'w-[500px] min-h-96 p-8 flex flex-col justify-center items-center bg-white rounded-[25px] bg-gradient-to-b',
              typeOverlay === 0 && 'from-blue-100 to-white',
              typeOverlay === 1 && 'from-green-100 to-white',
              typeOverlay === 2 && 'h-[95vh] w-[95vw] !p-0'
            )}
          >
            {typeOverlay === 2 && (
              <div className="w-[95vw] h-[95vh] bg-white rounded-2xl">
                <Button
                  isIconOnly
                  className="absolute bottom-6 left-6"
                  color="danger"
                  onClick={() => showFullLayout.onClose()}
                >
                  <X />
                </Button>
                {loadingPdf ? (
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <div className="loader" />
                    <p className="mt-5 text-xl">Cargando...</p>
                  </div>
                ) : (
                  <iframe className="w-full h-full" src={pdf} title='pdf' />
                )}
              </div>
            )}
          </div>
        </FullPageLayout>
      </>
    </Layout>
  );
}

export default ShoppingBookIVA;
