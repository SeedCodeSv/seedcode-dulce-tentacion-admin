import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { toast } from "sonner";
import ExcelJS from 'exceljs';

import ButtonUi from "@/themes/ui/button-ui";
import { Colors, Styles } from "@/types/themes.types";
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from "@/utils/dates";
import { useOrderProductionReportStore } from "@/store/reports/order-production-report.store";
import { hexToARGB } from "@/utils/utils";
import useGlobalStyles from "@/components/global/global.styles";
import { Status } from "@/types/reports/order-production-report";

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

export default function OPReportExportExcell({ branch, params, comercialName }: Props) {
    const { production_orders_report, statusTotals } = useOrderProductionReportStore()
    const styles = useGlobalStyles();


    const exportToExcel = async () => {

        try {
            if (!production_orders_report || production_orders_report.length === 0) {
                toast.error('No hay datos disponibles para generar el Excel.');

                return;
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Reporte Orden de Producción(General)');
            
            const headers = ['Nº', 'Producto', 'Fecha/Hora de inicio', 'Fecha/Hora de fin', 'Cantidad', 'Producido', 'Dañado', 'Estado/Orden'];

            addHeader(worksheet, comercialName ?? '', branch, { startDate: params.startDate, endDate: params.endDate });

            const rows = production_orders_report.map((item, index) => [
                index + 1,
                item.branchProduct.product.name,
                `${item.date} - ${item.time}`,
                item.endDate && item.endTime ? `${item.endDate} - ${item.endTime}` : "No definido",
                item.quantity,
                item.producedQuantity,
                item.damagedQuantity,
                item.statusOrder
            ]);

            addBody(styles, worksheet, headers, rows, statusTotals);

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = `REPORTE_ORDEN_DE_PRODUCCION_(General)_${getElSalvadorDateTime().fecEmi}.xlsx`;
            link.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            toast.error('Ocurrió un error al descargar el Excel.');
        }
    };

    return (
        <ButtonUi
            isDisabled={production_orders_report.length === 0}
            startContent={<PiMicrosoftExcelLogo className="" size={25} />}
            theme={Colors.Success}
            onPress={exportToExcel}
        >
            <p className="font-medium hidden lg:flex"> Exportar a excel</p>
        </ButtonUi>
    )
}

function addBody(styles: Styles, worksheet: ExcelJS.Worksheet, headers: string[], data: (string | number)[][],
    statusTotals: Status) {

    const fontColor = hexToARGB(styles.darkStyle.color);
    const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');

    worksheet.addRow([`Pendientes: ${statusTotals.open}`]);
    worksheet.addRow([`Completadas: ${statusTotals.completed}`]);
    worksheet.addRow([`En Proceso: ${statusTotals.inProgress}`]);
    worksheet.addRow([`Canceladas: ${statusTotals.canceled}`]);

    worksheet.addRow([]);

    const tableStartRow = worksheet.rowCount + 1;

    worksheet.addTable({
        columns: headers.map(header => ({ name: header })),
        rows: data,
        name: 'Table1',
        ref: 'A12',
        headerRow: true,
        totalsRow: false,
    });

    const headerRow = worksheet.getRow(tableStartRow);

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

    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 10;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 10;
    worksheet.getColumn(8).width = 13;
}

function addHeader(worksheet: ExcelJS.Worksheet,
    commercialName: string,
    branch: string,
    params: {
        startDate: string,
        endDate: string,
    }) {

    worksheet.mergeCells('A1:H1');
    worksheet.getCell('A1').value = '(General)';
    worksheet.getCell('A1').font = { bold: true, size: 12 };
    worksheet.getCell('A1').alignment = { horizontal: 'left' };

    worksheet.mergeCells('A2:H2');
    worksheet.getCell('A2').value = commercialName;
    worksheet.getCell('A2').font = {size: 14, bold: true };
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A3:H3');
    worksheet.getCell('A3').value = `Sucursal: ${branch}`;
    worksheet.getCell('A3').font = { size: 14 };
    worksheet.getCell('A3').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A4:H4');
    worksheet.getCell('A4').value = `Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`;
    worksheet.getCell('A4').font = {  size: 13 };
    worksheet.getCell('A4').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A5:H5');
    worksheet.getCell('A5').value = `Reporte desde ${params.startDate} hasta ${params.endDate}`;
    worksheet.getCell('A5').font = { size: 13 };
    worksheet.getCell('A5').alignment = { horizontal: 'center' };

    worksheet.addRow([]);
}