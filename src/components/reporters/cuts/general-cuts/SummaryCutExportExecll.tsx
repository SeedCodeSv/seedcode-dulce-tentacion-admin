import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from 'exceljs';

import useGlobalStyles from "@/components/global/global.styles";
import ButtonUi from "@/themes/ui/button-ui";
import { SearchCutReport } from "@/types/cashCuts.types";
import { Colors } from "@/types/themes.types";
import { formatDateSimple, getElSalvadorDateTime, getElSalvadorDateTimeText } from "@/utils/dates";
import { hexToARGB } from "@/utils/utils";
import { useCutReportStore } from "@/store/reports/cashCuts.store";

interface Props {
    branch: string;
    params: SearchCutReport
    comercialName: string
}


export default function SummaryCutExportExcell({ branch, params, comercialName }: Props) {
    const { cashCutsSummary } = useCutReportStore()

    const styles = useGlobalStyles();

    const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');
    const fontColor = hexToARGB(styles.darkStyle.color);


    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cortes');

        const DATE = getElSalvadorDateTime().fecEmi

        const extraInfo = [
            [`${comercialName}`],
            [`${branch !== '' ? `Sucursal: ${branch}` : 'Todas las sucursales'}`],
            [`Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`],
            [`Reporte desde ${params.dateFrom} hasta ${params.dateTo}`]
        ];

        extraInfo.forEach((row, index) => {
            const newRow = worksheet.addRow(row);
            const rowIndex = newRow.number;

            worksheet.mergeCells(`A${rowIndex}:G${rowIndex}`);
            newRow.font = { bold: index === 0, size: 13 };
            newRow.alignment = { horizontal: 'center' }
        });

        worksheet.addRow([]);

       const headers = ['Días (CIERRE)', 'Sum.Total Venta', 'Sum.Total Efectivo', 'Sum.Total Tarjeta', 'Sum.Otro Tipo de Pago','Sum.Entregado', 'Sum.Gastos']; 
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
            cell.alignment = { vertical: 'middle', horizontal: 'center'};
        });

         worksheet.columns = [
            { width: 20 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
        ];

       
        cashCutsSummary.cash_cuts_summary.forEach((item) => {
            worksheet.addRow([
                formatDateSimple(item.date),
                Number(item.sumTotalSales ?? 0),
                Number(item.sumTotalCash ?? 0),
                Number(item.sumTotalCard ?? 0),
                Number(item.sumTotalOthers ?? 0),
                Number(item.sumCashDelivered ?? 0),
                Number(item.sumExpenses ?? 0),
            ]);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = `RESUMEN_CORTES_${DATE}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <ButtonUi
            isDisabled={cashCutsSummary.cash_cuts_summary.length === 0}
            startContent={<PiMicrosoftExcelLogo className="" size={25} />}
            theme={Colors.Success}
            onPress={exportToExcel}
        >
            <p className="font-medium hidden lg:flex"> Exportar a excel</p>
        </ButtonUi>
    )
}