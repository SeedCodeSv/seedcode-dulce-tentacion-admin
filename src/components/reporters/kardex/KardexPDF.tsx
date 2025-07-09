import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable, { ThemeType, HAlignType } from 'jspdf-autotable';
import { toast } from 'sonner';
import moment from 'moment';
import { AiOutlineFilePdf } from "react-icons/ai";
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

import { ITransmitter } from '@/types/transmitter.types';
import { hexToRgb } from '@/utils/utils';
import useGlobalStyles from '@/components/global/global.styles';
import { useConfigurationStore } from '@/store/perzonalitation.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from '@/utils/dates';
import { useReportKardex } from '@/store/reports/reportKardex.store';
import { SearchReport } from '@/types/reports/productsSelled.report.types';
import { IReportKardexGeneral } from '@/types/reports/reportKardex.types';



interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const DownloadPDFButton = ({ transmitter, branch, params }: { sorted: string; transmitter: ITransmitter, branch: string[], params: SearchReport }) => {
  const date = moment().tz('America/El_Salvador').format('YYYY-MM-DD');
  const styles = useGlobalStyles();

  const backgroundColorRGB = styles.darkStyle.backgroundColor || '#0d83ac';
  const textColorRGB = hexToRgb(styles.secondaryStyle.color || '#FFFFFF');

  const { personalization } = useConfigurationStore();
  const { pagination_kardex, kardexGeneral, getReportKardexGeneralExport } = useReportKardex();
  const [logoUrl, setLogoUrl] = useState<string | undefined>();


  const [loading_data, setLoadingData] = useState(false)

  const handle = async () => {
    setLoadingData(true)
    const res = await getReportKardexGeneralExport({ ...params, limit: pagination_kardex.total })

    if (res) {
      await handleDownloadPDF(res.kardexGeneral)
      setLoadingData(false)
    }
  }

  useEffect(() => {
    const logoUrl =
      personalization[0]?.logo?.trim() !== ''
        ? personalization[0]?.logo
        : undefined;

    setLogoUrl(logoUrl);
  }, []);


  const handleDownloadPDF = async (kardexGeneral: IReportKardexGeneral) => {
    try {
      if (!kardexGeneral || kardexGeneral.data.length === 0) {
        toast.warning('No hay datos disponibles para generar el PDF.');

        return;
      }

      const doc = new jsPDF();

      const createHeader = (doc: jsPDF) => {

        logoUrl && doc.addImage(logoUrl, 'PNG', 10, 5, 25, 25, 'logo', 'FAST');
        autoTable(doc, {
          showHead: false,
          body: [
            [{ content: transmitter.nombre, styles: { halign: 'left', fontStyle: 'bold' } }],
            [{ content: transmitter.nombreComercial, styles: { halign: 'left' } }],
            [{ content: `${branch.length > 0 ? `Sucursal: ${branch}` : 'Todas las sucursales'}`, styles: { halign: 'center' } }],
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

      const rows = kardexGeneral.data.map((item, index) => [
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
      isDisabled={loading_data || kardexGeneral.length === 0}
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
  );
};

export default DownloadPDFButton;
