import ExcelJS from 'exceljs';
import { toast } from 'sonner';

import { ShippingReport } from '@/services/reports/shipping_report.service';

export const exportToExcel = async (data: ShippingReport[], startDate: string, endDate: string) => {
  try {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Mi Aplicación';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Reporte de envios');

    // 1. Título principal (fila 1)
    const titleRow = worksheet.addRow([`Reporte de Envíos del ${startDate} al ${endDate}`]);

    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A1:F1`); // Cambiado a F1 ya que ahora son 6 columnas

    // 2. Fila vacía de separación (fila 2)
    worksheet.addRow([]);

    // 3. Configurar columnas (sin Sucursal Terminal)
    worksheet.columns = [
      { key: 'nombre', width: 30 },
      { key: 'produccion', width: 12 },
      { key: 'sucursalCentro', width: 15 },
      { key: 'sucursalISSS', width: 15 },
      { key: 'sucursalNahulzalco', width: 18 },
      { key: 'sucursalSonzacate', width: 18 },
    ];

    // 4. Añadir ENCABEZADOS MANUALMENTE (fila 3)
    const headerRow = worksheet.addRow([
      'Nombre del Producto',
      'Producción',
      'Sucursal Centro',
      'Sucursal ISSS',
      'Sucursal Nahulzalco',
      'Sucursal Sonzacate',
    ]);

    // Estilo para encabezados
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ff71a3' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // 5. Añadir datos (fila 4 en adelante)
    data.forEach((item) => {
      const rowData = [
        item.producto,
        item.produccion,
        item['SUCURSAL-CENTRO'],
        item['SUCURSAL-ISSS'],
        item['SUCURSAL-NAHUIZALCO'],
        item['SUCURSAL-SONZACATE'],
      ];

      const row = worksheet.addRow(rowData);

      // Aplicar estilos
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

    // 6. Generar y descargar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `Reporte_Envios_${startDate}_a_${endDate}.xlsx`;
    link.click();
    toast.success('Archivo generado exitosamente.');
    setTimeout(() => {
      URL.revokeObjectURL(url);
      link.remove();
    }, 100);
  } catch (error) {
    toast.error('Error al generar el archivo Excel.');
  }
};
