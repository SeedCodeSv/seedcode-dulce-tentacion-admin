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
      orientation: 'landscape', 
      unit: 'mm',
      format: 'a4',
    });

    const startY = 5;

    autoTable(doc, {
      showHead: false,
      body: [
        [
          {
            content: transmitter.nombreComercial,
            styles: { halign: 'center', fontStyle: 'bold', fontSize: 10 },
          },
        ],
        [
          {
            content: `Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`,
            styles: { halign: 'center', fontSize: 8 },
          },
        ],
        [
          {
            content: `Reporte de existencias por sucursal`,
            styles: { halign: 'center', fontSize: 9 },
          },
        ],
      ],
      theme: 'plain',
      startY,
      bodyStyles: { cellPadding: 0.5 },
      margin: { top: 8, left: 10, right: 10 },
    });

    const branches = [...new Set(data.map(d => d.branch))].sort();

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

    const headers = ['Producto', 'Código', ...branches];

    const body = Array.from(groupedMap.values()).map(({ producto, code, stocks }) => [
      producto,
      code,
      ...branches.map(branch => stocks[branch] || '0'),
    ]);

    (doc as any).autoTable({
      head: [headers],
      body,
      startY: 30,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 113, 163],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 6,
      },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.2,
        cellPadding: 1,
        halign: 'center',
        valign: 'middle',
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 40 }, 
        1: { cellWidth: 25 },                  
      },
      margin: { left: 5, right: 5 },
    });

    doc.save(`Reporte_Existencias_${getElSalvadorDateTimeText().fecEmi}.pdf`);
  } catch (error) {
    toast.error('Error al generar PDF');
  }
};
