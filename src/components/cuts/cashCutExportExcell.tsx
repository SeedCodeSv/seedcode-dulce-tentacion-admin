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

export default function CashCutExportExcell({ tableData, transmitter, branch }: { tableData: Kardex[]; transmitter: ITransmitter, branch: Branches }) {
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
            'Descripción',
            'Cantidad',
            'Total',
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
            { width: 40 },
            { width: 6 },
            { width: 6 },
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

    // const exportDataToExcel = async () => {
    //     const workbook = new ExcelJS.Workbook();
    //     const worksheet = workbook.addWorksheet('Reporte de Ventas');

    //     const data_convert = [
    //         { descripcion: '', cantidad: 0, total: 0, },
    //         { descripcion: '==============================================', cantidad: 0, total: 0 },
    //         { descripcion: 'DETALLE VENTAS POR COMPROBANTE', cantidad: 0, total: 0, },
    //         { descripcion: '==============================================', cantidad: 0, total: 0, },
    //         { descripcion: 'VENTAS CON FACTURA', cantidad: 0, total: 0, },
    //         {descripcion: `No. INICIAL: ${data?.Factura.inicio}`,cantidad: 0,total: 0,},
    //         {descripcion: `No. FINAL: ${data?.Factura.fin}`,cantidad: 0,total: 0,},
    //         {descripcion: `GRAVADAS:`,cantidad: 0,total: Number(data?.Factura.total) - Number(data?.Factura.total) * 0.13,},
    //         {descripcion: `IVA:`,cantidad: 0,total: Number(data?.Factura.total) * 0.13,},
    //         {descripcion: `SUB-TOTAL:`,cantidad: 0,total: Number(data?.Factura.total),},
    //         {descripcion: `EXENTAS:`,cantidad: 0,total: 0,},
    //         {descripcion: `NO-SUJETAS:`,cantidad: 0,total: 0,},
    //         {descripcion: `TOTAL:`,cantidad: 0,total: data?.Factura.total,},
    //         {descripcion: '',cantidad: 0,total: 0,},
    //         {descripcion: 'VENTAS CON CRÉDITO FISCAL',cantidad: 0,total: 0,},
    //         {descripcion: `No. INICIAL: ${data?.CreditoFiscal.inicio}`,cantidad: 0,total: 0,},
    //         {descripcion: `No. FINAL: ${data?.CreditoFiscal.fin}`,cantidad: 0,total: 0,},
    //         {descripcion: `GRAVADAS:`,cantidad: 0,total: Number(data?.CreditoFiscal.total) - Number(data?.CreditoFiscal.total) * 0.13,},
    //         {descripcion: `IVA:`,cantidad: 0,total: Number(data?.CreditoFiscal.total) * 0.13,},
    //         {
    //             descripcion: `SUB-TOTAL:`,
    //             cantidad: 0,
    //             total: Number(data?.CreditoFiscal.total),
    //         },
    //         {
    //             descripcion: `EXENTAS:`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `NO-SUJETAS:`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `TOTAL:`,
    //             cantidad: 0,
    //             total: data?.CreditoFiscal.total,
    //         },
    //         {
    //             descripcion: '',
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: 'DEVOLUCIONES CON NOTA DE CRÉDITO',
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `No. INICIAL: ${data?.DevolucionNC.inicio}`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `No. FINAL: ${data?.DevolucionNC.fin}`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `GRAVADAS:`,
    //             cantidad: 0,
    //             total: Number(data?.DevolucionNC.total) - Number(data?.DevolucionNC.total) * 0.13,
    //         },
    //         {
    //             descripcion: `IVA:`,
    //             cantidad: 0,
    //             total: Number(data?.DevolucionNC.total) * 0.13,
    //         },
    //         {
    //             descripcion: `SUB-TOTAL:`,
    //             cantidad: 0,
    //             total: Number(data?.DevolucionNC.total),
    //         },
    //         {
    //             descripcion: `EXENTAS:`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `NO-SUJETAS:`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `TOTAL:`,
    //             cantidad: 0,
    //             total: data?.DevolucionNC.total,
    //         },
    //         {
    //             descripcion: '',
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: 'DEVOLUCIONES CON TICKET',
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `No. INICIAL: ${data?.DevolucionT.inicio}`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `No. FINAL: ${data?.DevolucionT.fin}`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `GRAVADAS:`,
    //             cantidad: 0,
    //             total: Number(data?.DevolucionT.total) - Number(data?.DevolucionT.total) * 0.13,
    //         },
    //         {
    //             descripcion: `IVA:`,
    //             cantidad: 0,
    //             total: Number(data?.DevolucionT.total) * 0.13,
    //         },
    //         {
    //             descripcion: `SUB-TOTAL:`,
    //             cantidad: 0,
    //             total: Number(data?.DevolucionT.total),
    //         },
    //         {
    //             descripcion: `EXENTAS:`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `NO-SUJETAS:`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `TOTAL:`,
    //             cantidad: 0,
    //             total: data?.DevolucionT.total,
    //         },
    //         {
    //             descripcion: '',
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `TOTAL GENERAL:`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `GRAVADAS:`,
    //             cantidad: 0,
    //             total: Number(data?.totalGeneral) - Number(data?.totalGeneral) * 0.13,
    //         },
    //         {
    //             descripcion: `IVA:`,
    //             cantidad: 0,
    //             total: Number(data?.totalGeneral) * 0.13,
    //         },
    //         {
    //             descripcion: `SUB-TOTAL:`,
    //             cantidad: 0,
    //             total: Number(data?.totalGeneral) - Number(data?.totalGeneral) * 0.13,
    //         },
    //         {
    //             descripcion: `EXENTAS:`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `NO SUJETAS:`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `RETENCIONES:`,
    //             cantidad: 0,
    //             total: 0,
    //         },
    //         {
    //             descripcion: `TOTAL:`,
    //             cantidad: 0,
    //             total: data?.totalGeneral,
    //         },
    //     ];

    //     // Agrega encabezado si deseas
    //     worksheet.columns = [
    //         { header: 'Descripción', key: 'descripcion', width: 50 },
    //         { header: 'Cantidad', key: 'cantidad', width: 15 },
    //         { header: 'Total', key: 'total', width: 15 },
    //     ];

    //     // Agregar los datos
    //     data_convert.forEach((item) => {
    //         worksheet.addRow(item);
    //     });

    //     // Estilizar filas opcionalmente
    //     worksheet.eachRow((row, rowNumber) => {
    //         row.font = { name: 'Montserrat', size: 10 };
    //         if (rowNumber === 1) {
    //             row.font = { bold: true };
    //         }
    //     });

    //     // Generar buffer
    //     const buffer = await workbook.xlsx.writeBuffer();

    //     // Descargar archivo
    //     const blob = new Blob([buffer], {
    //         type:
    //             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //     });

    //     saveAs(blob, `Corte_x_${branchName}_${Date.now()}.xlsx`);
    // };



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