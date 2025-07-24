import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from 'exceljs';

import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
// import { ITransmitter } from "@/types/transmitter.types";
import { getElSalvadorDateTime } from "@/utils/dates";
import { useReportBoxStore } from "@/store/report-box.store";
// import { Branch } from "@/types/auth.types";


interface Filter {
    startDate: string,
    endDate: string,
    branches: number[]


}

export default function ReportBoxesExcell({ 
    filters, 
    // transmitter,
    //  branch 
    }: { 
        filters: Filter,
        //  transmitter: ITransmitter, 
        //  branch: Branch | undefined 
        }) {
    const { export_box_excell } = useReportBoxStore()
   

    const handle = async () => {
        await exportToExcel()

    }



    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cajas');

        const DATE = getElSalvadorDateTime().fecEmi;

        const startDate = filters.startDate;
        const endDate = filters.endDate;

        const title = `Reporte de Cajas`;
        const subtitle = `Desde el ${startDate} hasta el ${endDate}`;

        worksheet.mergeCells('A1:J1');
        const titleCell = worksheet.getCell('A1');

        titleCell.value = title;
        titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7A9AC' } };

        worksheet.mergeCells('A2:J2');
        const subtitleCell = worksheet.getCell('A2');

        subtitleCell.value = subtitle;
        subtitleCell.font = { italic: true, color: { argb: 'FFFFFFFF' } };
        subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        subtitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7A9AC' } };

        worksheet.addRow([]);

        const columns = [
            'Sucursal',
            'Fecha',
            'Hora',
            'Inicio',
            'Final',
            'Total gastos',
            'Total en ventas',
            'Total invalidadas',
            // 'Total IVA',
            'Estado',
        ];

        worksheet.addRow(columns);

        const headerRow = worksheet.getRow(4);

        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE7A9AC' },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        worksheet.columns = [
            { width: 30 },
            { width: 20 },
            { width: 15 },
            { width: 15 },
            { width: 15 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
            { width: 15 },
        ];

        export_box_excell.forEach((item) => {
            worksheet.addRow([
                item?.pointOfSale?.branch?.name || '',
                item?.date || '',
                item?.time ?? '',
                Number(item?.start ?? 0),
                Number(Number(item?.totalSalesStatus ?? 0) + Number(item?.invalidatedTotal ?? 0)),
                Number(item?.totalExpense ?? 0),
                Number(item?.totalSalesStatus ?? 0),
                Number(item?.invalidatedTotal ?? 0),
                // Number(item?.totalIva ?? 0),
                item?.isActive ? 'ACTIVO' : 'INACTIVO',
            ]);
        });

        ['D', 'E', 'F', 'G', 'H'].forEach((col) => {
            worksheet.getColumn(col).numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
        });

        worksheet.autoFilter = {
            from: { row: 4, column: 1 },
            to: { row: 4, column: columns.length },
        };

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = `Reporte_de_Cajas_${DATE}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <ButtonUi
            showTooltip
            isDisabled={export_box_excell.length > 0 ? false : true}
            startContent={<PiMicrosoftExcelLogo className="" size={25} />}
            theme={Colors.Success}
            tooltipText="Exportar a excel"
            onPress={() => {
                // if (!loading_data) {
                handle()
                // }
                // else return
            }}
        />
    );
}