import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

import { getElSalvadorDateTime, getElSalvadorDateTimeText } from '@/utils/dates';
import { ITransmitter } from '@/types/transmitter.types';

export interface Daum {
  branchProductId: number;
  producto: string;
  code: string;
  branch: string;
  stock: string;
}

export const exportToPDFBranchProductReport = async (
  data: Daum[],
  transmitter: ITransmitter
) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
    });

    const startY = 5;

    // Header
    autoTable(doc, {
      showHead: false,
      body: [
        [{ content: transmitter.nombreComercial, styles: { halign: 'center', fontStyle: 'bold' } }],
        [{ content: `Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`, styles: { halign: 'center' } }],
        [{ content: `Reporte de existencias por sucursal`, styles: { halign: 'center' } }],
      ],
      theme: 'plain',
      startY,
      bodyStyles: { cellPadding: 1 },
      margin: { top: 10, left: 30, right: 30 },
    });

    const headers = ['ID', 'Nombre del Producto', 'Código', 'Sucursal', 'Stock'];

    const body = data.map(item => [
      item.branchProductId,
      item.producto,
      item.code,
      item.branch,
      item.stock === '0' ? '' : item.stock, // puedes ajustar aquí si quieres mostrar ceros o no
    ]);

    (doc as any).autoTable({
      head: [headers],
      body: body,
      startY: 30,
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
        cellPadding: 2,
      },
      margin: { left: 6, right: 6 },
    });

    doc.save(`Reporte_Existencias_${getElSalvadorDateTimeText().fecEmi}.pdf`);
  } catch (error) {
    toast.error('Error al generar PDF');
  }
};
