import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';

export interface IOrderProduct {
  producto: string;
  ADMINISTRACION: number;
  'SUCURSAL-CENTRO': number;
  'SUCURSAL-ISSS': number;
  'SUCURSAL-SONZACATE': number;
  'SUCURSAL-NAHUIZALCO': number;
  'PRODUCTO TERMINADO': number;
  'BODEGA DE MATERIA PRIMA': number;
}

export const exportToPDFOrderProduct = async (data: IOrderProduct[], startDate: string, endDate: string) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
    });

    // 1. Configuración inicial
    const title = `Ordenes de productos del ${startDate} al ${endDate}`;
    const headers = [
      'Nombre del Producto',
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
        1: { cellWidth: 24, halign: 'center' }, // Sucursal Centro
        2: { cellWidth: 24, halign: 'center' }, // Sucursal ISSS
        3: { cellWidth: 24, halign: 'center' }, // Sucursal Nahulzalco
        4: { cellWidth: 24, halign: 'center' }, // Sucursal Sonzacate
        5: { cellWidth: 24, halign: 'center' }, // Administracion
        6: { cellWidth: 24, halign: 'center' }, // Producto Terminado
        7: { cellWidth: 24, halign: 'center' }, // Bodega de materia prima
      },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.3,
      },
      margin: { left: 6, right: 0 } // Añadimos márgenes laterales pequeños
    });

    // 5. Guardar PDF
    doc.save(`Ordenes_de_productos${startDate}_a_${endDate}.pdf`);
    toast.success('PDF generado exitosamente');
  } catch (error) {
    toast.error('Error al generar PDF');
  }
};