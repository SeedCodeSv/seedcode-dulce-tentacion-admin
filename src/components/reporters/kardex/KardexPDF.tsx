import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable, { ThemeType, HAlignType } from 'jspdf-autotable';
import { toast } from 'sonner';
import moment from 'moment';
import { AiOutlineFilePdf } from "react-icons/ai";

import { DataKardex } from '@/types/reports/reportKardex.types';
import { Branches } from '@/types/branches.types';
import { ITransmitter } from '@/types/transmitter.types';
import { hexToRgb } from '@/utils/utils';
import useGlobalStyles from '@/components/global/global.styles';
import DEFAULT_LOGO from '@/assets/dulce-logo.png';
import { useConfigurationStore } from '@/store/perzonalitation.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from '@/utils/dates';


interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const DownloadPDFButton = ({ tableData, transmitter, branch }: { tableData: DataKardex[]; transmitter: ITransmitter, branch: Branches }) => {
  const date = moment().tz('America/El_Salvador').format('YYYY-MM-DD');
  const styles = useGlobalStyles();

  const backgroundColorRGB = styles.darkStyle.backgroundColor || '#0d83ac';
  const textColorRGB = hexToRgb(styles.secondaryStyle.color || '#FFFFFF');

  const { personalization } = useConfigurationStore();

  const convertImageToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');

        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleDownloadPDF = async () => {
    try {
      if (!tableData || tableData.length === 0) {
        toast.warning('No hay datos disponibles para generar el PDF.');

        return;
      }

      const doc = new jsPDF();
      const logo = personalization && personalization[0]?.logo ? personalization[0].logo : DEFAULT_LOGO;

      const logoBase64 = await convertImageToBase64(logo);

      const createHeader = (doc: jsPDF) => {

        doc.addImage(logoBase64, 'PNG', 13, 5, 25, 25, 'logo', 'FAST');
        autoTable(doc, {
          showHead: false,
          body: [
            [{ content: transmitter.nombre, styles: { halign: 'left', fontStyle: 'bold' } }],
            [{ content: transmitter.nombreComercial, styles: { halign: 'left' } }],
            [
              {
                content: 'Sucursal: ' + branch.name,
                styles: { halign: 'left' },
              },
            ],
            [{ content: 'Fecha: ' + `${getElSalvadorDateTimeText().fecEmi}`, styles: { halign: 'left' } }],
            [{ content: 'Hora: ' + `${getElSalvadorDateTime().horEmi}`, styles: { halign: 'left' } }],
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
        'Fecha/Hora',
        'Movimiento/Tipo',
        'Código',
        'Descripción',
        'Cantidad',
        'Costo unitario',
        'Total Movimiento',
      ];

      const rows = tableData.map((item, index) => [
        index + 1,
        `${item.date} - ${item.time}`,
        `${item.movementType} - ${item.inventoryType}`,
        item.productCode || '',
        item.productName || '',
        item.quantity || 0,
        `$ ${Number(item.unitCost ?? 0).toFixed(2)}`,
        `$ ${(item.totalMovement ?? 0).toFixed(2)}`,
      ]);

      createHeader(doc);
      const lastY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY;

      autoTable(doc, {
        body: rows,
        startY: lastY + 5,
        theme: 'plain' as ThemeType,
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' as HAlignType },
          1: { cellWidth: 20, halign: 'center' as HAlignType },
          3: { cellWidth: 20, halign: 'center' as HAlignType },
          4: { cellWidth: 50, halign: 'center' as HAlignType },
          5: { cellWidth: 15, halign: 'center' as HAlignType },
          6: { cellWidth: 20, halign: 'center' as HAlignType },
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

          // Borde vertical de celdas
          if (row.section === 'body' && column.index < headers.length - 1) {
            doc.setLineWidth(0.2);
            doc.setDrawColor('#b3b8bd');
            doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height);
          }
        },
      });

      doc.save(`REPORTE_KARDEX_${date}.pdf`);
    } catch {
      toast.error('Ocurrió un error al descargar el PDF. Intente de nuevo más tarde.');
    }
  };

  return (
    <ButtonUi
      isDisabled={tableData.length === 0}
      startContent={<AiOutlineFilePdf className="" size={25} />}
      theme={Colors.Primary}
      onPress={handleDownloadPDF}
    >
      <p className="font-medium hidden lg:flex"> Descargar PDF</p>
    </ButtonUi>
  );
};

export default DownloadPDFButton;
