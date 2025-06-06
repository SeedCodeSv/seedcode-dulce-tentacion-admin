import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'

import { SaleByProduct } from "./types/sales_by_periods.types";

export async function salesByProductsExports(item: SaleByProduct[], startDate: string, endDate: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Productos');

    worksheet.columns = [
        { header: 'Fecha', key: 'saleDate', width: 15 },
        { header: 'Nombre producto', key: 'productName', width: 40 },
        { header: 'Categoría', key: 'categoryName', width: 30 },
        { header: 'Sub-categoría', key: 'subCategoryName', width: 35 },
        { header: 'Total Cantidad', key: 'totalQuantity', width: 20 },
        { header: 'Total Vendido', key: 'totalItemSum', width: 20 },
        { header: 'Precio Unitario', key: 'unitPrice', width: 20 },
        { header: 'Sucursal', key: 'branchName', width: 40 },
    ];

    const lastColLetter = worksheet.getColumn(worksheet.columns.length).letter;

    worksheet.mergeCells(`A1:${lastColLetter}1`);
    const titleCell = worksheet.getCell('A1');

    titleCell.value = 'Reporte de Ventas por Producto';
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

    item.forEach((product) => {
        worksheet.insertRow(rowIndex++, {
            saleDate: product.saleDate,
            productName: product.productName,
            categoryName: product.categoryName,
            subCategoryName: product.subCategoryName,
            totalQuantity: Number(product.totalQuantity),
            totalItemSum: Number(product.totalItemSum),
            unitPrice: Number(product.unitPrice),
            branchName: product.branchName,
        });
    });

    ['F', 'G'].forEach((col) => {
        worksheet.getColumn(col).numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
    });

    const totalRowNumber = worksheet.rowCount + 1;

    const totalRow = worksheet.addRow([
        'TOTAL GENERAL:', '', '', '',
        { formula: `SUBTOTAL(9,E4:E${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,F4:F${totalRowNumber - 1})` },
        { formula: `SUBTOTAL(9,G4:G${totalRowNumber - 1})` }
        , ''
    ]);

    const moneyColumns = [7, 8];

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

    saveAs(new Blob([buffer]), `Ventas_Por_Producto_${date}.xlsx`);
}
