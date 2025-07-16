import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from 'exceljs';
import { useState } from "react";
import { toast } from "sonner";

import ButtonUi from "@/themes/ui/button-ui";
import { IReportKardexGeneral } from "@/types/reports/reportKardex.types";
import { Colors } from "@/types/themes.types";
import { ITransmitter } from "@/types/transmitter.types";
import { getElSalvadorDateTime } from "@/utils/dates";
import useGlobalStyles from "@/components/global/global.styles";
import { hexToARGB } from "@/utils/utils";
import { useReportKardex } from "@/store/reports/reportKardex.store";
import { SearchReport } from "@/types/reports/productsSelled.report.types";




export default function KardexExportExcell({params, transmitter, branch }: {params: SearchReport, sorted: string; transmitter: ITransmitter, branch: string[] }) {
    const styles = useGlobalStyles();
  const { pagination_kardex,kardexGeneral, getReportKardexGeneralExport} = useReportKardex();

    const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');
    const fontColor = hexToARGB(styles.darkStyle.color);

     const [loading_data, setLoadingData] = useState(false)
    
        const handle = async () => {
            setLoadingData(true)
            const res = await getReportKardexGeneralExport({ ...params, limit: pagination_kardex.total })
    
            if (res) {
                await exportToExcel(res.kardexGeneral)
                setLoadingData(false)
            }
        }
    

    const exportToExcel = async (kardexGeneral: IReportKardexGeneral) => {

         if (!kardexGeneral.data || kardexGeneral.data.length === 0) {
        toast.error('No hay datos disponibles para generar el Excell.');

        return;
      }
      
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Kardex');

        const DATE = getElSalvadorDateTime().fecEmi
        const time = getElSalvadorDateTime().horEmi

        const extraInfo = [
            [`${transmitter.nombreComercial}`],
            [`${branch.length > 0 ? `Sucursal: ${branch}` : 'Todas las sucursales'}`],
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
            'Fecha/Hora',
            'Movimiento/Tipo',
            'Código',
            'Descripción',
            'Cantidad',
            'Costo unitario',
            'Total Movimiento',
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
            { width: 20 },
            { width: 25 },
            { width: 10 },
            { width: 40 },
            { width: 12 },
            { width: 15 },
            { width: 20 }
        ];

        kardexGeneral.data.forEach((item, index) => {
            worksheet.addRow([
                index + 1,
                `${item.date} - ${item.time}`,
                `${item.movementType} - ${item.inventoryType}`,
                item.productCode || '',
                item.productName || '',
                item.quantity || 0,
                item.unitCost ?? 0,
                item.totalMovement ?? 0,
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
            isDisabled={loading_data || kardexGeneral.length === 0}
            startContent={<PiMicrosoftExcelLogo className="" size={25} />}
            theme={Colors.Success}
            onPress={handle}
        >
            <p className="font-medium hidden lg:flex"> Exportar a excel</p>
        </ButtonUi>
    );
}