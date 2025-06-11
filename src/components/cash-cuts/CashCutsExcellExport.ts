import ExcelJS from 'exceljs';

import { ZCashCutsResponse } from "@/types/cashCuts.types";
import { Branches } from "@/types/branches.types";
import { ITransmitter } from '@/types/transmitter.types';

interface PropsCashCut {
    branch: Branches | undefined
    params: {
        startDate: string,
        endDate: string,
        pointCode: string
    }
    totalGeneral: number
    data: ZCashCutsResponse
    transmitter: ITransmitter
}

export const exportToExcel = async ({ branch, params, totalGeneral, data, transmitter }: PropsCashCut) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Corte');

    // Insertar información extra como encabezado
    const extraInfo = [
        `${transmitter.nombre}`,
         `${transmitter.nombreComercial}`,
        `${branch?.name ?? ''}`,
        `Fecha: ${params.startDate}`,
    ];

    const columns = [
        { key: 'descripcion', width: 25 },
        { key: 'cantidad', width: 25 },
        { key: 'total', width: 25 },
    ];

    worksheet.columns = columns;

    const lastColumnLetter = worksheet.getColumn(columns.length).letter;


    extraInfo.forEach((text) => {
        const rowIndex = worksheet.rowCount + 1;

        worksheet.mergeCells(`A${rowIndex}:${lastColumnLetter}${rowIndex}`);
        const row = worksheet.getRow(rowIndex);

        row.getCell(1).value = text;
        row.font = { bold: true };
        row.alignment = { vertical: 'middle', horizontal: 'center' };
        row.commit();
    });

    // Agrega una fila vacía
    worksheet.addRow([]);

    const headerRow = worksheet.addRow(['Descripción', 'Cantidad', 'Total']);

    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };
    worksheet.columns = [
        { key: 'descripcion', width: 25 },
        { key: 'cantidad', width: 25 },
        { key: 'total', width: 25 },
    ];

    // Agrega tus datos
    const data_convert = [
        {
            descripcion: '',
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: '==============================================',
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: 'DETALLE VENTAS POR COMPROBANTE',
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: '==============================================',
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: 'VENTAS CON FACTURA',
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `No. INICIAL: ${data?.Factura.inicio}`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `No. FINAL: ${data?.Factura.fin}`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `GRAVADAS:`,
            cantidad: 0,
            total: Number(data?.Factura.total) - Number(data?.Factura.total) * 0.13,
        },
        {
            descripcion: `IVA:`,
            cantidad: 0,
            total: Number(data?.Factura.total) * 0.13,
        },
        {
            descripcion: `SUB-TOTAL:`,
            cantidad: 0,
            total: Number(data?.Factura.total),
        },
        {
            descripcion: `EXENTAS:`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `NO-SUJETAS:`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `TOTAL:`,
            cantidad: 0,
            total: data?.Factura.total,
        },
        {
            descripcion: '',
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: 'VENTAS CON CRÉDITO FISCAL',
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `No. INICIAL: ${data?.CreditoFiscal.inicio}`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `No. FINAL: ${data?.CreditoFiscal.fin}`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `GRAVADAS:`,
            cantidad: 0,
            total: Number(data?.CreditoFiscal.total) - Number(data?.CreditoFiscal.total) * 0.13,
        },
        {
            descripcion: `IVA:`,
            cantidad: 0,
            total: Number(data?.CreditoFiscal.total) * 0.13,
        },
        {
            descripcion: `SUB-TOTAL:`,
            cantidad: 0,
            total: Number(data?.CreditoFiscal.total),
        },
        {
            descripcion: `EXENTAS:`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `NO-SUJETAS:`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `TOTAL:`,
            cantidad: 0,
            total: data?.CreditoFiscal.total,
        },
        {
            descripcion: '',
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: 'DEVOLUCIONES CON NOTA DE CRÉDITO',
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `No. INICIAL: ${data?.DevolucionNC.inicio}`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `No. FINAL: ${data?.DevolucionNC.fin}`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `GRAVADAS:`,
            cantidad: 0,
            total: Number(data?.DevolucionNC.total) - Number(data?.DevolucionNC.total) * 0.13,
        },
        {
            descripcion: `IVA:`,
            cantidad: 0,
            total: Number(data?.DevolucionNC.total) * 0.13,
        },
        {
            descripcion: `SUB-TOTAL:`,
            cantidad: 0,
            total: Number(data?.DevolucionNC.total),
        },
        {
            descripcion: `EXENTAS:`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `NO-SUJETAS:`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `TOTAL:`,
            cantidad: 0,
            total: data?.DevolucionNC.total,
        },
        {
            descripcion: '',
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `TOTAL GENERAL:`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `EXENTAS:`,
            cantidad: 0,
            total: 0,
        },
        {
            descripcion: `NO SUJETAS:`,
            cantidad: 0,
            total: 0,
        },

        {
            descripcion: `TOTAL:`,
            cantidad: 0,
            total: totalGeneral,
        },
    ];

    data_convert.forEach((row) => {
        worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
};
