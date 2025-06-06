import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from 'exceljs';

import ButtonUi from "@/themes/ui/button-ui";
import { Branches } from "@/types/branches.types";
import { Kardex } from "@/types/reports/reportKardex.types";
import { Colors } from "@/types/themes.types";
import { ITransmitter } from "@/types/transmitter.types";
import { getElSalvadorDateTime } from "@/utils/dates";
import useGlobalStyles from "@/components/global/global.styles";
import { hexToARGB } from "@/utils/utils";



export default function KardexExportExcell({ tableData, transmitter, branch }: { tableData: Kardex[]; transmitter: ITransmitter, branch: Branches }) {
    const styles = useGlobalStyles();

    const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');
    const fontColor = hexToARGB(styles.darkStyle.color);


    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Kardex');

        const DATE = getElSalvadorDateTime().fecEmi
        const time = getElSalvadorDateTime().horEmi

        const extraInfo = [
            [`${transmitter.nombre}`],
            [`${transmitter.nombreComercial}`],
            [`Sucursal: ${branch.name}`],
            [`Fecha: ${DATE}`],
            [`Hora: ${time}`],
        ];

        extraInfo.forEach((row, index) => {
            const newRow = worksheet.addRow(row);

            newRow.font = { bold: index === 0 };
        });

        worksheet.addRow([]);

        const headers = [
            'No.',
            'Descripción',
            'Entrada',
            'Salida',
            'Existencia',
            'Precio',
            'Costo unitario',
            'Utilidad',
            'Rentabilidad',
        ];
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
            { width: 40 },
            { width: 10 },
            { width: 10 },
            { width: 10 },
            { width: 12 },
            { width: 15 },
            { width: 12 },
            { width: 12 },
        ];

        tableData.forEach((item, index) => {
            worksheet.addRow([
                index + 1,
                item.productName || '',
                item.entries || 0,
                item.exits || 0,
                Number(item.quantity) || 0,
                Number(item.price ?? 0),
                Number(item.cost ?? 0),
                Number(item.utility ?? 0),
                Number(item.profitability ?? 0),
            ]);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = `REPORTE_KARDEX_${DATE}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <ButtonUi
            isDisabled={tableData.length === 0}
            startContent={<PiMicrosoftExcelLogo className="" size={25} />}
            theme={Colors.Success}
            onPress={exportToExcel}
        >
            <p className="font-medium hidden lg:flex"> Exportar a excel</p>
        </ButtonUi>
    );
}