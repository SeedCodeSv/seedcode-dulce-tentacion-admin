import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import autoTable, { HAlignType, ThemeType } from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import { useEffect, useState } from 'react';
import { AiOutlineFilePdf } from 'react-icons/ai';

import { IReportKardexByProduct, TypeOfMovements } from '@/types/reports/reportKardex.types';
import { formatSimpleDate, getElSalvadorDateTime, getElSalvadorDateTimeText } from '@/utils/dates';
import { useAuthStore } from '@/store/auth.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { useConfigurationStore } from '@/store/perzonalitation.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { hexToRgb } from '@/utils/utils';
import useGlobalStyles from '@/components/global/global.styles';
import { wrapText } from '@/utils/pdf-utils';
import { useReportKardex } from '@/store/reports/reportKardex.store';
import { SearchReport } from '@/types/reports/productsSelled.report.types';
import DEFAULT_LOGO from '@/assets/dulce-logo.png';

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export const DownloadKardexProductPDFButton = ({ search, branchName}: {
  search: SearchReport, branchName: string
}) => {
  const { user } = useAuthStore();
  const { transmitter, getTransmitter } = useTransmitterStore();
  const date = moment().tz('America/El_Salvador').format('YYYY-MM-DD');
  const [logoUrl, setLogoUrl] = useState<string | undefined>();
  const styles = useGlobalStyles();
  const { getReportKardexByProductExport, paginationKardexProduct, KardexProduct } = useReportKardex();
  const [loading_data, setLoadingData] = useState(false)

  const backgroundColorRGB = styles.darkStyle.backgroundColor || '#0d83ac';
  const textColorRGB = hexToRgb(styles.secondaryStyle.color || '#FFFFFF');

  const { personalization } = useConfigurationStore()

  useEffect(() => {
    const logoUrl =
      personalization[0]?.logo?.trim() !== ''
        ? personalization[0]?.logo
        : DEFAULT_LOGO;

    setLogoUrl(logoUrl);
  }, []);

   const handle = async () => {
    setLoadingData(true)
    const res = await getReportKardexByProductExport({ ...search, limit: paginationKardexProduct.total })

    if (res) {
      await handleDownloadSelectedProductPDF(res.KardexProduct)
      setLoadingData(false)
    }
  }

  const handleDownloadSelectedProductPDF = (KardexProduct: IReportKardexByProduct) => {

    try {
      if (!KardexProduct.movements || KardexProduct.movements.length === 0) {
        toast.error('No hay datos disponibles para generar el PDF.');

        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');

      const totalEntries = KardexProduct.totalEntradas
      const totalExits = KardexProduct.totalSalidas

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
                content: 'Sucursal: ' + branchName,
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

        const productName = KardexProduct.productName;
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

      const headers =[
        'No.',
        'Fecha',
        'Descripción',
        'Stock Inicial',
        'Entrada',
        'Salida',
        'Stock Final',
        'Costo Unitario',
        'Total Movimiento',
      ]

      const rows = KardexProduct.movements.map((item, index) => [
        index + 1,
        formatSimpleDate(`${item.date}|${item.time}`),
        item.typeOfInventory || '',
        item.initialStock,
        item.typeOfMovement === TypeOfMovements.Entries ? item.quantity : 0,
        item.typeOfMovement === TypeOfMovements.Exits ? item.quantity : 0,
        Number(item.finalStock),
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

      const name = KardexProduct.productName.replace(/ /g, '-');
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
        isDisabled={loading_data || KardexProduct.length === 0}
        theme={Colors.Primary}
        onPress={() => {
          if (!loading_data) {
            handle()
          }
          else return
        }}
      >
        {loading_data ?
          <Loader className='animate-spin' /> :
          <>
            <AiOutlineFilePdf className="" size={25} /> <p className="font-medium hidden lg:flex"> Descargar PDF</p>
          </>
        }
      </ButtonUi>
    </>
  );
};
