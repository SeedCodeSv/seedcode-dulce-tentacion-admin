
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';
import autoTable from 'jspdf-autotable';

import { ITransmitter } from '@/types/transmitter.types';
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from '@/utils/dates';
export interface IOrderProduct {
  producto: string;
  [key: string]: string | number;
}

export const exportToPDFOrderProduct = async (
  data: IOrderProduct[],
  startDate: string,
  endDate: string,
  transmitter: ITransmitter
) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
    });

    const startY = 5;
    const createHeader = () => {

      autoTable(doc, {
        showHead: false,
        body: [
          [{ content: transmitter.nombreComercial, styles: { halign: 'center', fontStyle: 'bold' } }],
          [{ content: `Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`, styles: { halign: 'center' } }],
          [{ content: `Reporte desde ${startDate} hasta ${endDate}`, styles: { halign: 'center' } }],
        ],
        theme: 'plain',
        startY,
        bodyStyles: { cellPadding: 1 },
        margin: { top: 10, left: 40, right: 50 },
      });
    };

    createHeader();

    const keys = data.length > 0 ? Object.keys(data[0]) : [];

    const headers = keys.map(key => {
      if (key.toLowerCase() === 'producto') return 'Nombre del Producto';

      return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    });

    const body = data.map(item =>
      keys.map(key => String(item[key as keyof IOrderProduct] ?? 0))
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(40);

    (doc as any).autoTable({
      head: [headers],
      body: body,
      startY: 25,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 113, 163],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 8,
      },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.3,
      },
      margin: { left: 6, right: 6 },
    });

    doc.save(`Ordenes_de_productos_${startDate}_a_${endDate}.pdf`);
  } catch (error) {
    toast.error('Error al generar PDF');
  }
};
