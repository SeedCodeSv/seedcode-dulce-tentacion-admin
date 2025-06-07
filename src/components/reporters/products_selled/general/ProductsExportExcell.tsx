import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from 'exceljs';

import useGlobalStyles from "@/components/global/global.styles";
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from "@/utils/dates";
import { hexToARGB } from "@/utils/utils";
import { useProductsOrdersReportStore } from "@/store/reports/productsSelled_report.store";
import { SearchReport } from "@/types/reports/productsSelled.report.types";

interface Props {
  params: SearchReport
  comercialName: string
  headers: string[]
}


export default function ProductsExportExcell({ params, comercialName, headers }: Props) {
  const { summary_products_selled } = useProductsOrdersReportStore();


  const styles = useGlobalStyles();

  const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');
  const fontColor = hexToARGB(styles.darkStyle.color);


  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cortes');

    const DATE = getElSalvadorDateTime().fecEmi;

    // Info superior del reporte
    const extraInfo = [
      [`${comercialName}`],
      [`Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`],
      [`Reporte desde ${params.startDate} hasta ${params.endDate}`]
    ];

    extraInfo.forEach((row, index) => {
      const newRow = worksheet.addRow(row);
      const rowIndex = newRow.number;

      const lastColumnIndex = headers.length;
      const lastColumnLetter = worksheet.getColumn(lastColumnIndex).letter;

      worksheet.mergeCells(`A${rowIndex}:${lastColumnLetter}${rowIndex}`);
      newRow.font = { bold: index === 0, size: 13 };
      newRow.alignment = { horizontal: 'center' };
    });

    worksheet.addRow([]); // Espacio vacío
    worksheet.columns = [
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
    ];

    // Cabecera de la tabla
    const headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      cell.font = {
        bold: true,
        color: { argb: fontColor },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Filas de contenido
    summary_products_selled.summary.forEach(row => {
      const rowData = headers.map(header => {
        if (header === 'Fecha') return row.date;
        if (header === 'Total General') return row.totalGeneral;

        return row[header] ?? 0;
      });

      worksheet.addRow(rowData);
    });

    // Fila de totales
    const totalRowData = headers.map(header => {
      if (header === 'Fecha') return 'Totales';
      if (header === 'Total General') return summary_products_selled.totals.totalGeneral;

      return summary_products_selled.totals[header] ?? 0;
    });

    const totalRow = worksheet.addRow(totalRowData);

    totalRow.font = { bold: true };

    // Formato numérico para columnas (excepto "Fecha")
    worksheet.columns.forEach((column, idx) => {
      if (headers[idx] !== 'Fecha') {
        column.numFmt = '#,##0.00';
      }
      column.alignment = { horizontal: 'center' };
    });

    // Generar y descargar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = `RESUMEN_PRODUCTOS_VENDIDOS_${DATE}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <ButtonUi
      isDisabled={summary_products_selled.summary.length === 0}
      startContent={<PiMicrosoftExcelLogo className="" size={25} />}
      theme={Colors.Success}
      onPress={exportToExcel}
    >
      <p className="font-medium hidden lg:flex"> Exportar a excel</p>
    </ButtonUi>
  )
}