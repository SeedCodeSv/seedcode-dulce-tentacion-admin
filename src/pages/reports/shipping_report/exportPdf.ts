import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';

import { ShippingReport } from '@/services/reports/shipping_report.service';

export const exportToPDF = async (data: ShippingReport[], startDate: string, endDate: string) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
    });

    // 1. Configuración inicial
    const title = `Reporte de Envíos del ${startDate} al ${endDate}`;
    const headers = [
      'Nombre del Producto',
      'Producción',
      'Sucursal Centro',
      'Sucursal ISSS',
      'Sucursal Nahulzalco',
      'Sucursal Sonzacate',
      'Administracion',
      'Producto Terminado',
      'Bodega de materia prima',
    ];

    // 2. Datos formateados
    const body = data.map((item) => [
      item.producto,
      item.produccion.toString(),
      item['SUCURSAL-CENTRO'].toString(),
      item['SUCURSAL-ISSS'].toString(),
      item['SUCURSAL-NAHUIZALCO'].toString(),
      item['SUCURSAL-SONZACATE'].toString(),
      item.ADMINISTRACION.toString(),
      item['PRODUCTO TERMINADO'].toString(),
      item['BODEGA DE MATERIA PRIMA'].toString()
    ]);

    // 3. Estilo personalizado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text(title, 105, 15, { align: 'center' }); // Centrado en 105mm (mitad de 210mm)

    // 4. Generar tabla con anchos ajustados
    (doc as any).autoTable({
      head: [headers],
      body: body,
      startY: 25,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 113, 163],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8, // Reducimos el tamaño de fuente para los headers
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 8, // Reducimos el tamaño de fuente para el cuerpo
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Nombre del Producto (reducido)
        1: { cellWidth: 21, halign: 'center' }, // Producción
        2: { cellWidth: 21, halign: 'center' }, // Sucursal Centro
        3: { cellWidth: 21, halign: 'center' }, // Sucursal ISSS
        4: { cellWidth: 21, halign: 'center' }, // Sucursal Nahulzalco
        5: { cellWidth: 21, halign: 'center' }, // Sucursal Sonzacate
        6: { cellWidth: 21, halign: 'center' }, // Administracion
        7: { cellWidth: 21, halign: 'center' }, // Producto Terminado
        8: { cellWidth: 21, halign: 'center' }, // Bodega de materia prima
      },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.3,
      },
      margin: { left: 6, right: 0 } // Añadimos márgenes laterales pequeños
    });

    // 5. Guardar PDF
    doc.save(`Reporte_Envios_${startDate}_a_${endDate}.pdf`);
    toast.success('PDF generado exitosamente');
  } catch (error) {
    toast.error('Error al generar PDF');
  }
};
