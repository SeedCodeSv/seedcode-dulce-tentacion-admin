import ExcelJS from 'exceljs';
import { toast } from 'sonner';

import { getElSalvadorDateTimeText } from '@/utils/dates';
import { ITransmitter } from '@/types/transmitter.types';

export interface Daum {
    branchProductId: number;
    producto: string;
    code: string;
    branch: string;
    stock: string;
}

export const exportToExcelBranchProductReport = async (
    data: Daum[],
    transmitter: ITransmitter
) => {
    try {
        const workbook = new ExcelJS.Workbook();
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet('Reporte de Existencias');

        worksheet.addRow([]); 

        const headers = ['ID', 'Nombre del Producto', 'Código', 'Sucursal', 'Stock'];

        const extraInfo = [
            [`${transmitter.nombreComercial}`],
            [`Fecha: ${getElSalvadorDateTimeText().fecEmi}`],
        ];

        extraInfo.forEach((row, index) => {
            const newRow = worksheet.addRow(row);
            worksheet.mergeCells(`A${newRow.number}:E${newRow.number}`);
            newRow.font = { bold: index === 0, size: 13 };
            newRow.alignment = { horizontal: 'center' };
        });

        worksheet.addRow([]); // Espacio después del título

        // Definir anchos de columnas
        worksheet.columns = [
            { key: 'branchProductId', width: 10 },
            { key: 'producto', width: 35 },
            { key: 'code', width: 20 },
            { key: 'branch', width: 25 },
            { key: 'stock', width: 15 },
        ];

        // Agregar fila de encabezados
        const headerRow = worksheet.addRow(headers);

        // Estilos para encabezados
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF71A3' }, // Rosado pastel
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // 🔹 Filtro automático
        worksheet.autoFilter = {
            from: { row: headerRow.number, column: 1 },
            to: { row: headerRow.number, column: headers.length }
        };

        // 🔹 Ordenar por sucursal y luego por nombre de producto
        data.sort((a, b) => {
            if (a.branch === b.branch) {
                return a.producto.localeCompare(b.producto);
            }
            return a.branch.localeCompare(b.branch);
        });

        // Agregar filas de datos
        data.forEach((item) => {
            const row = worksheet.addRow([
                item.branchProductId,
                item.producto,
                item.code,
                item.branch,
                item.stock,
            ]);

            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
                if (colNumber > 1) {
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                }
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Reporte_Existencias_${getElSalvadorDateTimeText().fecEmi}.xlsx`;
        link.click();

        setTimeout(() => {
            URL.revokeObjectURL(url);
            link.remove();
        }, 100);
    } catch (error) {
        toast.error('Error al generar el archivo Excel.');
    }
};
