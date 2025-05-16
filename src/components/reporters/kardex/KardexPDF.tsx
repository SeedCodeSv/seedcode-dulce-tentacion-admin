import { Button } from '@heroui/react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable, { ThemeType, HAlignType } from 'jspdf-autotable';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

import { global_styles } from '@/styles/global.styles';
import { Kardex } from '@/types/reports/reportKardex.types';
import { Branches } from '@/types/branches.types';
import { ITransmitter } from '@/types/transmitter.types';
import {  hexToRgb } from '@/utils/utils';
import useGlobalStyles from '@/components/global/global.styles';
 import DEFAULT_LOGO from '@/assets/dulce-logo.png';


interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const DownloadPDFButton = ({ tableData, transmitter, branch }: { tableData: Kardex[]; transmitter: ITransmitter, branch: Branches }) => {
  const date = moment().tz('America/El_Salvador').format('YYYY-MM-DD');
    const styles = useGlobalStyles();
  

  const backgroundColorRGB = hexToRgb(styles.darkStyle.backgroundColor || '#0d83ac');
  const textColorRGB = hexToRgb(styles.secondaryStyle.color || '#FFFFFF');
 
  const handleDownloadPDF = () => {
    try {
      if (!tableData || tableData.length === 0) {
        toast.warning('No hay datos disponibles para generar el PDF.');
        
        return;
      }

      const currentDate = new Date();
      const doc = new jsPDF();

      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'America/El_Salvador',
      };

      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'America/El_Salvador',
      };

      const formattedDate = new Intl.DateTimeFormat('es-ES', dateOptions).format(currentDate);
      const formattedTime = new Intl.DateTimeFormat('es-ES', timeOptions).format(currentDate);

      const createHeader = (doc: jsPDF) => {
        doc.addImage(DEFAULT_LOGO, 'PNG', 13, 5, 20, 20);
        autoTable(doc, {
          showHead: false,
          body: [
            [{ content: transmitter.nombre, styles: { halign: 'center', fontStyle: 'bold' } }],
            // [{ content: transmitter.nombreComercial, styles: { halign: 'center' } }],
            [
              {
                content: 'Sucursal: ' + branch.name,
                styles: { halign: 'center' },
              },
            ],
            [{ content: 'Fecha: ' + `${formattedDate}`, styles: { halign: 'center' } }],
            [{ content: 'Hora: ' + `${formattedTime}`, styles: { halign: 'center' } }],
          ],
          theme: 'plain',
          startY: 5,
          bodyStyles: {
            cellPadding: 1,
          },
          margin: { top: 10, left: 50, right: 50 },
        });

      };

      const headers = [
        'No.',
        'Descripción',
        'Entrada',
        'Salida',
        'Existencia',
        'Precio',
        'Costo unitario',
        'Utilidad',
        'Rentabilidad',
      ];

      const rows = tableData.map((item, index) => [
        index + 1,
        item.productName || '',
        item.entries || 0,
        item.exits || 0,
        item.quantity || 0,
        `$ ${Number(item.price ?? 0).toFixed(2)}`,
        `$ ${Number(item.cost ?? 0).toFixed(2)}`,
        `$ ${(item.utility ?? 0).toFixed(2)}`,
        `${item.profitability ? item.profitability.toFixed(2) : '0'}%`,
      ]);

      createHeader(doc);
      const lastY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY;

      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: lastY + 5,
        theme: 'grid' as ThemeType,
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' as HAlignType },
          1: { cellWidth: 65 },
        },
        margin: { horizontal: 5 },
        styles: {
          cellPadding: 2.5,
        },
        headStyles: {
        fontSize: 7,
        fillColor: backgroundColorRGB as [number, number, number],
        textColor: textColorRGB as [number, number, number],
         },
        bodyStyles: {
          fontSize: 8,
        }
      });

      doc.save(`REPORTE_KARDEX_${date}.pdf`);
    } catch {
      toast.error('Ocurrió un error al descargar el PDF. Intente de nuevo más tarde.');
    }
  };

  return (
    <Button
      isDisabled={tableData.length === 0}
      style={global_styles().dangerStyles}
      onPress={handleDownloadPDF}
    >
      <FileDown />
    </Button>
  );
};

export default DownloadPDFButton;
