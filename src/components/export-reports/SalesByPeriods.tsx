import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { SaleDetailsReport } from './types/sales_by_periods.types';

export async function exportSalesExcel(sales: SaleDetailsReport[], startDate: string, endDate: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');

    worksheet.columns = [
        { header: 'Fecha', key: 'fecEmi', width: 15 },
        { header: 'Hora', key: 'horEmi', width: 10 },
        { header: 'Total No Sujeto', key: 'totalNoSuj', width: 15 },
        { header: 'Total Exenta', key: 'totalExenta', width: 15 },
        { header: 'Total Gravada', key: 'totalGravada', width: 15 },
        { header: 'Subtotal Ventas', key: 'subTotalVentas', width: 15 },
        { header: 'Desc. No Suj', key: 'descuNoSuj', width: 15 },
        { header: 'Desc. Exenta', key: 'descuExenta', width: 15 },
        { header: 'Desc. Gravada', key: 'descuGravada', width: 15 },
        { header: '% Descuento', key: 'porcentajeDescuento', width: 12 },
        { header: 'Total Descuento', key: 'totalDescu', width: 15 },
        { header: 'Subtotal', key: 'subTotal', width: 15 },
        { header: 'Total IVA', key: 'totalIva', width: 15 },
        { header: 'Monto Total Op.', key: 'montoTotalOperacion', width: 18 },
        { header: 'Total a Pagar', key: 'totalPagar', width: 15 },
        { header: 'Total en Letras', key: 'totalLetras', width: 30 },
        { header: 'Código Punto de Venta', key: 'codePOS', width: 20 },
        { header: 'Tipo Comprobante', key: 'typeVoucher', width: 20 },
        { header: 'Descripción', key: 'description', width: 30 },
        { header: 'Sucursal', key: 'branch', width: 30 },
    ];

    const lastColLetter = worksheet.getColumn(worksheet.columns.length).letter;

    worksheet.mergeCells(`A1:${lastColLetter}1`);
    const titleCell = worksheet.getCell('A1');

    titleCell.value = 'Ventas por Periodos';
    titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4682B4' },
    };

    worksheet.mergeCells(`A2:${lastColLetter}2`);
    const subtitleCell = worksheet.getCell('A2');

    subtitleCell.value = `Desde el ${startDate} hasta el ${endDate}`;
    subtitleCell.font = { italic: true, color: { argb: 'FFFFFFFF' } };
    subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    subtitleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4682B4' },
    };

    worksheet.insertRow(3, worksheet.columns.map(col => col.header));
    const headerRow = worksheet.getRow(3);

    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4682B4' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.autoFilter = {
        from: { row: 3, column: 1 },
        to: { row: 3, column: worksheet.columns.length },
    };

    let rowIndex = 4;

    sales.forEach((saleData) => {
        const sale = saleData.sale;
        const pointOfSale = sale?.box?.pointOfSale;

        worksheet.insertRow(rowIndex++, {
            fecEmi: sale.fecEmi,
            horEmi: sale.horEmi,
            totalNoSuj: Number(sale.totalNoSuj),
            totalExenta: Number(sale.totalExenta),
            totalGravada: Number(sale.totalGravada),
            subTotalVentas: Number(sale.subTotalVentas),
            descuNoSuj: Number(sale.descuNoSuj),
            descuExenta: Number(sale.descuExenta),
            descuGravada: Number(sale.descuGravada),
            porcentajeDescuento: Number(sale.porcentajeDescuento),
            totalDescu: Number(sale.totalDescu),
            subTotal: Number(sale.subTotal),
            totalIva: Number(sale.totalIva),
            montoTotalOperacion: Number(sale.montoTotalOperacion),
            totalPagar: Number(sale.totalPagar),
            totalLetras: sale.totalLetras,
            codePOS: pointOfSale?.code || 'N/D',
            typeVoucher: pointOfSale?.typeVoucher || 'N/D',
            description: pointOfSale?.description || 'N/D',
            branch: saleData.branch,
        });
    });

    ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'].forEach((col) => {
        worksheet.getColumn(col).numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
    });

    const totalRowNumber = worksheet.rowCount + 1;

    const totalRow = worksheet.addRow([
        'Total General:', '',

        { formula: `SUBTOTAL(9,C4:C${totalRowNumber - 1})` }, 
        { formula: `SUBTOTAL(9,D4:D${totalRowNumber - 1})` }, 
        { formula: `SUBTOTAL(9,E4:E${totalRowNumber - 1})` }, 
        { formula: `SUBTOTAL(9,F4:F${totalRowNumber - 1})` }, 
        { formula: `SUBTOTAL(9,G4:G${totalRowNumber - 1})` }, 
        { formula: `SUBTOTAL(9,H4:H${totalRowNumber - 1})` }, 
        { formula: `SUBTOTAL(9,I4:I${totalRowNumber - 1})` }, 
        { formula: `SUBTOTAL(9,J4:J${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,K4:K${totalRowNumber - 1})` }, 
        { formula: `SUBTOTAL(9,L4:L${totalRowNumber - 1})` }, 
        { formula: `SUBTOTAL(9,M4:M${totalRowNumber - 1})` }, 
        { formula: `SUBTOTAL(9,N4:N${totalRowNumber - 1})` }, 
        { formula: `SUBTOTAL(9,O4:O${totalRowNumber - 1})` }, 
        '', '', '', '',''
    ]);

    const moneyColumns = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    totalRow.eachCell((cell, colNumber) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4682B4' },
        };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };

        if (moneyColumns.includes(colNumber)) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
        }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const date = new Date().toISOString().slice(0, 10);

    saveAs(new Blob([buffer]), `Ventas_Por_Periodos_${date}.xlsx`);
}
