import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from 'exceljs';
import { useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";

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


export default function ProductsExportExcellByBranches({ params, comercialName, headers }: Props) {
  const { products_selled_by_branches } = useProductsOrdersReportStore();
  const [isGenerating, setIsGenerating] = useState(false)


  const styles = useGlobalStyles();

  const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');
  const fontColor = hexToARGB(styles.darkStyle.color);


 const exportToExcel = async () => {
  if (!products_selled_by_branches.data || products_selled_by_branches.data.length === 0) {
    toast.error('No hay datos disponibles para exportar.');

    return;
  }

  setIsGenerating(true);

  // 👇 Da tiempo a React para mostrar el spinner antes del trabajo pesado
  await new Promise(resolve => setTimeout(resolve, 0));

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cortes');

    const DATE = getElSalvadorDateTime().fecEmi;

    const extraInfo = [
      [`${comercialName}`],
      [`Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`],
      [`Reporte desde ${params.startDate} hasta ${params.endDate}`],
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
      { width: 40 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
    ];

    const headerRow = worksheet.addRow(headers);

    headerRow.eachCell(cell => {
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

    products_selled_by_branches.data.forEach(row => {
      const rowData = headers.map(header => {
        if (header === 'Producto') return row.productName;
        if (header === 'Total General') return row.totalGeneral;

        return row[header] ?? 0;
      });

      worksheet.addRow(rowData);
    });

    const totalRowData = headers.map(header => {
      if (header === 'Producto') return 'Totales';
      if (header === 'Total General') return products_selled_by_branches.branchTotals.totalGeneral;

      return products_selled_by_branches.branchTotals[header] ?? 0;
    });

    const totalRow = worksheet.addRow(totalRowData);

    totalRow.font = { bold: true };

    worksheet.columns.forEach((column, idx) => {
      if (headers[idx] !== 'Producto') {
        column.numFmt = '#,##0.00';
      }
      column.alignment = { horizontal: 'left' };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = `VENTAS_POR_PRODUCTOS_DETALLADO_POR_SUCURSALES_${DATE}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    toast.error('Ocurrió un error al generar el Excel.');
  } finally {
    setIsGenerating(false); // 👈 Restablece el estado
  }
};



  return (
    <ButtonUi
      isDisabled={isGenerating || products_selled_by_branches.data.length === 0}
      startContent={
        isGenerating ? (
          <Loader className="animate-spinner"  />
        ) : (
          <PiMicrosoftExcelLogo size={25} />
        )
      }
      theme={Colors.Success}
      onPress={exportToExcel}
    >
      <p className="font-medium hidden lg:flex">
        {isGenerating ? 'Generando...' : 'Exportar a excel'}
      </p>
    </ButtonUi>
  )
}