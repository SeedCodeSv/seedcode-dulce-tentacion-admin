import { FileDown } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import autoTable, { HAlignType, ThemeType } from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import { useEffect, useState } from 'react';

import { KardexByProduct, TypeOfMovements } from '@/types/reports/reportKardex.types';
import { formatSimpleDate, getElSalvadorDateTime, getElSalvadorDateTimeText } from '@/utils/dates';
import { useAuthStore } from '@/store/auth.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { useConfigurationStore } from '@/store/perzonalitation.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { hexToRgb } from '@/utils/utils';
import useGlobalStyles from '@/components/global/global.styles';
import { wrapText } from '@/utils/pdf-utils';

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export const DownloadKardexProductPDFButton = ({ tableData, search }: {
  tableData: KardexByProduct[], search: {
    branchName: string,
    branchId: number,
    startDate: string,
    endDate: string,
  }
}) => {
  const { user } = useAuthStore();
  const { transmitter, getTransmitter } = useTransmitterStore();
  const date = moment().tz('America/El_Salvador').format('YYYY-MM-DD');
  const [logoUrl, setLogoUrl] = useState<string | undefined>();
  const styles = useGlobalStyles();

  const backgroundColorRGB = styles.darkStyle.backgroundColor || '#0d83ac';
  const textColorRGB = hexToRgb(styles.secondaryStyle.color || '#FFFFFF');

  const { personalization } = useConfigurationStore()

  useEffect(() => {
    const logoUrl =
      personalization[0]?.logo?.trim() !== ''
        ? personalization[0]?.logo
        : undefined;

    setLogoUrl(logoUrl);
  }, []);

  const handleDownloadSelectedProductPDF = () => {

    try {
      if (!tableData || tableData.length === 0) {
        toast.error('No hay datos disponibles para generar el PDF.');

        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');

      const totalEntries = tableData.reduce((acc, current) => {
        if (current.typeOfMovement === TypeOfMovements.Entries) acc += Number(current.quantity);

        return acc;
      }, 0);

      const totalExits = tableData.reduce((acc, current) => {
        if (current.typeOfMovement === TypeOfMovements.Exits) acc += Number(current.quantity);

        return acc;
      }, 0);

      let startY = 5
      const maxLineChars = 25;
      const createHeader = (doc: jsPDF) => {

        logoUrl && doc.addImage(logoUrl, 'PNG', 10, 5, 25, 25, 'logo', 'FAST');
        autoTable(doc, {
          showHead: false,
          body: [
            [{ content: transmitter.nombre, styles: { halign: 'left', fontStyle: 'bold' } }],
            [{ content: transmitter.nombreComercial, styles: { halign: 'left' } }],
            [
              {
                content: 'Sucursal: ' + tableData[0].branchProduct.branch.name,
                styles: { halign: 'left' },
              },
            ],
            [{ content: 'Fecha: ' + `${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`, styles: { halign: 'left' } }],
            [{ content: `Reporte desde ${search.startDate} hasta ${search.endDate}`, styles: { halign: 'left' } }],
          ],
          theme: 'plain',
          startY,
          bodyStyles: {
            cellPadding: 1,
          },
          margin: { top: 10, left: 40, right: 50 },
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const marginX = 5;
        const rectWidth = 62;
        const x = pageWidth - rectWidth - marginX;

        const productName = tableData[0].branchProduct.product.name;
        const lineHeight = 5;
        const paddingY = 6;

        const productLines = wrapText(productName, maxLineChars, 2);
        const rectHeight = productLines.length * lineHeight + 2 * lineHeight + 4;
        const rectBottomY = startY + 30;
        const rectY = rectBottomY - rectHeight;
        const titleY = rectY - 3;

        doc.setFontSize(10);
        doc.text("Kardex por Producto", x, titleY);
        doc.roundedRect(x - 3, rectY, rectWidth, rectHeight, 2, 2);
        let currentY = rectY + paddingY;

        doc.setFontSize(9);

        doc.text(`Nombre: ${productLines[0]}`, x, currentY);
        currentY += lineHeight;

        if (productLines.length > 1) {
          doc.text(`${productLines[1]}`, x, currentY);
          currentY += lineHeight;
        }

        doc.text(`Total de entradas: ${totalEntries}`, x, currentY);
        currentY += lineHeight;
        doc.text(`Total de salidas: ${totalExits}`, x, currentY);
      };

      const headers = [
        'No.',
        'Fecha',
        'Descripción',
        'Entrada',
        'Salida',
        'Costo Unitario',
        'Precio de venta',
        'Total Movimiento',
      ];

      const rows = tableData.map((item, index) => [
        index + 1,
        formatSimpleDate(`${item.date}|${item.time}`),
        item.typeOfInventory || '',
        item.typeOfMovement === TypeOfMovements.Entries ? item.quantity : 0,
        item.typeOfMovement === TypeOfMovements.Exits ? item.quantity : 0,
        `$ ${Number(item.branchProduct.costoUnitario ?? 0).toFixed(2)}`,
         `$ ${Number(item.branchProduct.price ?? 0).toFixed(2)}`,
        `$ ${Number(item.totalMovement ?? 0).toFixed(2)}`,
      ]);
      
      createHeader(doc)
      const lastY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY;

      autoTable(doc, {
        body: rows,
        startY: lastY + 5,
        theme: 'plain' as ThemeType,
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' as HAlignType },
          2: { cellWidth: 65 },
        },
        margin: { horizontal: 5 },
        styles: {
          cellPadding: 2.5,
        },
        headStyles: {
          fontSize: 7,
          textColor: backgroundColorRGB
        },
        bodyStyles: {
          fontSize: 8,
        },
        didDrawPage: ({ table, doc, cursor }) => {
          if (!table) return;

          const isFirstPage = table.pageNumber === 1;

          const endY = cursor?.y;
          const marginX = 5;
          const tableWidth = table.getWidth(doc.internal.pageSize.getWidth());

          const startY = isFirstPage
            ? (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 5
            : table.settings.margin.top;


          doc.setDrawColor('#b3b8bd');
          doc.setLineWidth(0.2);
          doc.roundedRect(marginX, startY, tableWidth, endY! - startY, 3, 3);

        },
        head: [headers],
        didDrawCell: (data) => {
          const { cell, row, column, table } = data;

          if (row.section === 'head' && column.index === 0) {

            const marginX = table.settings.margin.left;
            const tableWidth = table.getWidth(doc.internal.pageSize.getWidth());
            const headHeight = table.getHeadHeight(table.columns);
            const startY = cell.y;

            doc.setFillColor(backgroundColorRGB);
            doc.setDrawColor(backgroundColorRGB);
            doc.setLineWidth(0);
            doc.roundedRect(marginX, startY, tableWidth, headHeight, 2, 2, 'F');
          }

          if (row.section === 'head') {

            doc.setTextColor(...textColorRGB);
            doc.setFontSize(7);
            doc.text(
              String(cell.raw),
              cell.x + cell.width / 2,
              cell.y + cell.height / 2 + 2,
              { align: 'center' }
            );
          }

          if (row.section === 'body' && column.index < headers.length - 1) {
            doc.setLineWidth(0.2);
            doc.setDrawColor('#b3b8bd');
            doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height);
          }
        },
      });

      const name = tableData[0].branchProduct.product.name.replace(/ /g, '-');
      const productName = wrapText(name, maxLineChars, 2);

      doc.save(`REPORTE_KARDEX_${productName[0]}_${date}.pdf`);
    } catch {
      toast.error('Ocurrió un error al descargar el PDF.');
    } 
  };

  useEffect(() => {
    getTransmitter(user?.transmitterId ?? 0);
  }, [user?.transmitterId]);


  return (
    <>
      <ButtonUi
        isIconOnly
        theme={Colors.Primary}
        onPress={handleDownloadSelectedProductPDF}
      > <FileDown size={20} /></ButtonUi>
    </>
  );
};
