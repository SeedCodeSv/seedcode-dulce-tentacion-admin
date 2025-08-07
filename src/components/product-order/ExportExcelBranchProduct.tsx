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

        const extraInfo = [
            [`${transmitter.nombreComercial}`],
            [`Fecha: ${getElSalvadorDateTimeText().fecEmi}`],
        ];

        extraInfo.forEach((row, index) => {
            const newRow = worksheet.addRow(row);

            worksheet.mergeCells(`A${newRow.number}:Z${newRow.number}`);
            newRow.font = { bold: index === 0, size: 13 };
            newRow.alignment = { horizontal: 'center' };
        });

        worksheet.addRow([]);

        // 🔹 Obtener lista única de sucursales ordenadas
        const branches = [...new Set(data.map(d => d.branch))].sort();

        // 🔹 Agrupar por producto y código
        const groupedMap = new Map<
            string,
            {
                producto: string;
                code: string;
                stocks: Record<string, string>;
            }
        >();

        data.forEach(({ producto, code, branch, stock }) => {
            const key = `${producto}||${code}`;

            if (!groupedMap.has(key)) {
                groupedMap.set(key, {
                    producto,
                    code,
                    stocks: {},
                });
            }

            const item = groupedMap.get(key)!;

            item.stocks[branch] = stock;
        });

        // 🔹 Encabezados: Producto | Código | Sucursal A | Sucursal B | ...
        const headers = ['Producto', 'Código', ...branches];

        worksheet.columns = [
            { key: 'producto', width: 35 },
            { key: 'code', width: 20 },
            ...branches.map(branch => ({ key: branch, width: 30 })), // ✅ Más espacio para sucursales
        ];

        const headerRow = worksheet.addRow(headers);

        // 🔹 Estilos para encabezados
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF71A3' },
            };
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true, // ✅ Texto en varias líneas si es necesario
            };
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

        groupedMap.forEach(({ producto, code, stocks }) => {
            const row = [
                producto,
                code,
                ...branches.map(branch => stocks[branch] || '0')
            ];

            const newRow = worksheet.addRow(row);

            newRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
                if (colNumber > 1) {
                    cell.alignment = {
                        vertical: 'middle',
                        horizontal: 'center',
                    };
                }
            });
        });

        // 🔹 Exportar Excel
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
