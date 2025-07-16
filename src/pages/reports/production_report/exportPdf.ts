import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

import logo from '../../../assets/dulce.webp';

import { Daum } from '@/services/reports/production_report.service';
import { Branches } from '@/types/branches.types';

const getBase64Image = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('No se pudo obtener el contexto del canvas'));

        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL('image/jpeg', 0.9);

      resolve(dataURL);
    };

    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };

    img.src = url;
  });
};

export const exportPdf = async (dataReport: Daum[], branch: Branches | undefined, date: string) => {
  try {
    const doc = new jsPDF();

    // Convertir logo a base64 con fondo blanco
    const logoBase64 = await getBase64Image(logo);

    // Configuración de estilos
    const titleFontSize = 12;
    const subtitleFontSize = 11;
    const normalFontSize = 10;
    const margin = 20;
    const lineHeight = 7;
    let yPos = 20;

    // Agregar el logo
    doc.addImage(logoBase64, 'JPEG', margin, 10, 30, 15);

    // Título principal
    doc.setFontSize(titleFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('PASTELERIA DULCETENTACION', 105, yPos, { align: 'center' });
    yPos += lineHeight * 2;

    // Subtítulos
    doc.setFontSize(subtitleFontSize);
    doc.text('REPORTE DE PRODUCCION', 105, yPos, { align: 'center' });
    yPos += lineHeight;
    doc.text(`${branch?.name}`, 105, yPos, { align: 'center' });
    yPos += lineHeight * 2;

    // Fecha
    doc.setFontSize(normalFontSize);
    doc.setFont('helvetica', 'normal');
    doc.text(`FECHA: ${date}`, margin, yPos);
    yPos += lineHeight * 2;

    // Configuración de la tabla
    const tableMargin = margin;
    const tableWidth = 170;
    const column1Width = 100; // Ancho columna Detalles
    const column2Width = 40; // Ancho columna Unidad
    const rowHeight = 8;
    const cellPadding = 2;

    // Encabezado de la tabla
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 240); // Color de fondo gris claro
    doc.rect(tableMargin, yPos, tableWidth, rowHeight, 'F'); // Fondo del encabezado

    // Texto del encabezado centrado verticalmente
    doc.text('Detalles', tableMargin + cellPadding, yPos + rowHeight / 2 + cellPadding);
    doc.text(
      'UNIDAD',
      tableMargin + column1Width + cellPadding,
      yPos + rowHeight / 2 + cellPadding,
      { align: 'center' }
    );
    doc.text(
      'Cant.',
      tableMargin + column1Width + column2Width + cellPadding,
      yPos + rowHeight / 2 + cellPadding,
      { align: 'right' }
    );

    yPos += rowHeight;

    // Línea divisoria del encabezado
    doc.setDrawColor(200, 200, 200);
    doc.line(tableMargin, yPos, tableMargin + tableWidth, yPos);
    yPos += 2;

    // Datos de la tabla
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(normalFontSize);

    dataReport.forEach((item) => {
      // Verificar si necesitamos una nueva página
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      // Dibujar fondo de la fila (alternar colores para mejor legibilidad)
      const fillColor = dataReport.indexOf(item) % 2 === 0 ? [255, 255, 255] : [248, 248, 248];

      doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
      doc.rect(tableMargin, yPos, tableWidth, rowHeight, 'F');

      // Texto de la fila
      doc.text(item.detalle, tableMargin + cellPadding, yPos + rowHeight / 2 + cellPadding);
      doc.text(
        item.unidad,
        tableMargin + column1Width + cellPadding,
        yPos + rowHeight / 2 + cellPadding,
        { align: 'center' }
      );
      doc.text(
        item.cantidad.toString(),
        tableMargin + column1Width + column2Width + cellPadding,
        yPos + rowHeight / 2 + cellPadding,
        { align: 'right' }
      );

      // Línea divisoria inferior
      doc.setDrawColor(200, 200, 200);
      doc.line(tableMargin, yPos + rowHeight, tableMargin + tableWidth, yPos + rowHeight);

      yPos += rowHeight;
    });

    // Guardar el PDF
    doc.save(`reporte_produccion_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF generado con éxito');
  } catch (error) {
    toast.error('Error al generar el PDF');
    throw error;
  }
};
