import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from 'exceljs';
import { useState } from "react";

import useGlobalStyles from "@/components/global/global.styles";
import ButtonUi from "@/themes/ui/button-ui";
import { IGetCutsReport, SearchCutReport } from "@/types/cashCuts.types";
import { Colors } from "@/types/themes.types";
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from "@/utils/dates";
import { hexToARGB } from "@/utils/utils";
import { useCutReportStore } from "@/store/reports/cashCuts.store";


interface Props {
    branch: string[];
    params: SearchCutReport
    comercialName: string
}


export default function DetailedCutExportExcell({ branch, params, comercialName }: Props) {
    const styles = useGlobalStyles();
    const { cashCutsDetailed, onGetCashCutReportDetailedExport } = useCutReportStore()
    const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');
    const fontColor = hexToARGB(styles.darkStyle.color);

    const [loading_data, setLoadingData] = useState(false)

    const handle = async () => {
        setLoadingData(true)
        const res = await onGetCashCutReportDetailedExport({ ...params, limit: cashCutsDetailed.total })

        if (res) {
            await exportToExcel(res.cashCutsDetailed)
            setLoadingData(false)
        }
    }


    const exportToExcel = async (cashCutsDetailed: IGetCutsReport) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cortes');

        const DATE = getElSalvadorDateTime().fecEmi

        const extraInfo = [
            [`${comercialName}`],
            [`${branch.length > 0 ? `Sucursal: ${branch}` : 'Todas las sucursales'}`],
            [`Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`],
            [`Reporte desde ${params.dateFrom} hasta ${params.dateTo}`]
        ];

        extraInfo.forEach((row, index) => {
            const newRow = worksheet.addRow(row);
            const rowIndex = newRow.number;

            worksheet.mergeCells(`A${rowIndex}:K${rowIndex}`);
            newRow.font = { bold: index === 0, size: 13 };
            newRow.alignment = { horizontal: 'center' }
        });


        const headers = ['Inicio', 'Cierre', 'Total Venta', 'Efectivo', 'Tarjeta', 'Otro Tipo de Pago', 'Gastos', 'Caja Chica', 'Total Entregado', 'Diferencia', 'Cajero', 'Sucursal'];
        const headerRow = worksheet.addRow(headers);

        worksheet.autoFilter = {
            from: { row: headerRow.number, column: 1 },
            to: { row: headerRow.number, column: worksheet.columns.length },
        };

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
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        });

        worksheet.columns = [
            { width: 20 },
            { width: 20 },
            { width: 12 },
            { width: 12 },
            { width: 12 },
            { width: 12 },
            { width: 15 },
            { width: 15 },
            { width: 15 },
            { width: 15 },
            { width: 45 },
            { width: 35 },

        ];

        cashCutsDetailed.cash_cuts_report.forEach((item) => {
            worksheet.addRow([
                `${item.startDate} - ${item.statTime}`,
                `${item.endDate} - ${item.endTime}`,
                Number(item.totalSales ?? 0),
                Number(item.totalCash ?? 0),
                Number(item.totalCard ?? 0),
                Number(item.totalOthers ?? 0),
                Number(item.expenses ?? 0),
                Number(item.pettyCash ?? 0),
                Number(item.cashDelivered ?? 0),
                Number(item.difference ?? 0),
                `${item.employee.firstName} ${item.employee.secondName} ${item.employee.firstLastName} ${item.employee.secondLastName}`,
                item.branchName ?? 'N/A'
            ]);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = `REPORTE_CORTES_${DATE}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <ButtonUi
            isDisabled={loading_data || cashCutsDetailed.cash_cuts_report.length === 0}
            startContent={<PiMicrosoftExcelLogo className="" size={25} />}
            theme={Colors.Success}
            onPress={handle}
        >
            <p className="font-medium hidden lg:flex"> Exportar a excel</p>
        </ButtonUi>
    )
}