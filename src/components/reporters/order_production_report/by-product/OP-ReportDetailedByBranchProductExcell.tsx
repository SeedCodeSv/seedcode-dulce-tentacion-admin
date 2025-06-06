import { PiMicrosoftExcelLogo } from "react-icons/pi"
import ExcelJS from 'exceljs';

import { useOrderProductionReportStore } from "@/store/reports/order-production-report.store"
import ButtonUi from "@/themes/ui/button-ui"
import { Colors } from "@/types/themes.types"
import { getElSalvadorDateTime } from "@/utils/dates";
import { hexToARGB } from "@/utils/utils";
import useGlobalStyles from "@/components/global/global.styles";


interface Props {
    branch: string;
    params: {
        page: number,
        limit: number,
        productId: number,
        branch: number,
        startDate: string,
        endDate: string,
        productName: string,
        status: string
    }
    comercialName: string
}
export default function OPReportDetailedExportExcell({ branch, params, comercialName }: Props) {
    const { po_report_detailed } = useOrderProductionReportStore()
    const styles = useGlobalStyles();

    const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');
    const fontColor = hexToARGB(styles.darkStyle.color);

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const DATE = getElSalvadorDateTime().fecEmi
        const time = getElSalvadorDateTime().horEmi

        po_report_detailed.map(async (data) => {

            const worksheet = workbook.addWorksheet(`${data.productName}`);

            const extraInfo = [
                [`${comercialName}`],
                [`Sucursal: ${branch}`],
                [`Fecha/Hora: ${DATE} - ${time}`],
                [`Reporte desde ${params.startDate} hasta ${params.endDate}`],
                []
            ];

            extraInfo.forEach((row, index) => {
                const newRow = worksheet.addRow(row);
                const rowIndex = newRow.number;

                worksheet.mergeCells(`A${rowIndex}:G${rowIndex}`);

                newRow.font = { bold: index === 0, size: 12 };
                newRow.alignment = { horizontal: 'center' };

            });

            const productRow = worksheet.addRow([`Producto: ${data.productName}`]);

            productRow.font = { bold: true, size: 12.5 };
            worksheet.addRow([]);


            const headers = ['Nº', 'Fecha/Hora de inicio', 'Fecha/Hora de fin', 'Cantidad', 'Producido', 'Dañado', 'Estado/Orden'];
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

            worksheet.columns = [
                { width: 6 },
                { width: 20 },
                { width: 20 },
                { width: 10 },
                { width: 10 },
                { width: 12 },
                { width: 15 },
            ];

            data.table.forEach((item, index) => {
                worksheet.addRow([
                    index + 1,
                    `${item.date} - ${item.time}`,
                    item.endDate && item.endTime ? `${item.endDate} - ${item.endTime}` : "No definido",
                    item.quantity,
                    item.producedQuantity,
                    item.damagedQuantity,
                    item.statusOrder
                ]);
            });


        })
        const buffer = await workbook.xlsx.writeBuffer()

        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download =  `REPORTE_ORDEN_DE_PRODUCCION_(DETALLADO)_${getElSalvadorDateTime().fecEmi}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <ButtonUi
            isDisabled={po_report_detailed.length === 0}
            startContent={<PiMicrosoftExcelLogo className="" size={25} />}
            theme={Colors.Success}
            onPress={exportToExcel}
        >
            <p className="font-medium hidden lg:flex"> Exportar a excel</p>
        </ButtonUi>
    )
}