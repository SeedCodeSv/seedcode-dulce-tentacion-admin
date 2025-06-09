import jsPDF from "jspdf";
import autoTable, { ThemeType } from "jspdf-autotable";
import { useEffect, useState } from "react";
import { AiOutlineFilePdf } from "react-icons/ai";
import { toast } from "sonner";

import useGlobalStyles from "@/components/global/global.styles";
import { useConfigurationStore } from "@/store/perzonalitation.store";
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from "@/utils/dates";
import { hexToRgb } from "@/utils/utils";
import { useProductsOrdersReportStore } from "@/store/reports/productsSelled_report.store";
import { SearchReport } from "@/types/reports/productsSelled.report.types";

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

interface Props {
  params: SearchReport
  comercialName: string
  headers: string[]
}

export default function ProductsExportPdf({headers, params, comercialName }: Props) {
     const { summary_products_selled } = useProductsOrdersReportStore();
 
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

  const handleDownloadPDF = () => {
  try {
    if (!summary_products_selled.summary || summary_products_selled.summary.length === 0) {
      toast.error('No hay datos disponibles para generar el PDF.');

      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    const startY = 5;

    const createHeader = () => {
      logoUrl && doc.addImage(logoUrl, 'PNG', 10, 5, 25, 25, 'logo', 'FAST');

      autoTable(doc, {
        showHead: false,
        body: [
          [{ content: comercialName, styles: { halign: 'center', fontStyle: 'bold' } }],
          [{ content: `Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`, styles: { halign: 'center' } }],
          [{ content: `Reporte desde ${params.startDate} hasta ${params.endDate}`, styles: { halign: 'center' } }],
          [{ content: '(Resumen)', styles: { halign: 'center' } }],
        ],
        theme: 'plain',
        startY,
        bodyStyles: { cellPadding: 1 },
        margin: { top: 10, left: 40, right: 50 },
      });
    };

    createHeader();

    // Prepara filas del cuerpo
    const bodyRows = summary_products_selled.summary.map(row => {
      return headers.map(header => {
        if (header === 'Fecha') return row.date;
        if (header === 'Total General') return row.totalGeneral;

        return row[header] ?? 0;
      });
    });

    // Agrega fila de totales
    const totalRow = headers.map(header => {
      if (header === 'Fecha') return 'Totales';
      if (header === 'Total General') return summary_products_selled.totals.totalGeneral;

      return summary_products_selled.totals[header] ?? 0;
    });

    bodyRows.push(totalRow);

    const lastY = (doc as jsPDFWithAutoTable).lastAutoTable?.finalY ?? startY + 5;

    autoTable(doc, {
      head: [headers],
      body: bodyRows,
      startY: lastY + 5,
      theme: 'plain' as ThemeType,
      margin: { horizontal: 5 },
      styles: { cellPadding: 2.5 },
      headStyles: {
        fontSize: 7,
        textColor: backgroundColorRGB,
        overflow: 'linebreak',
      },
      bodyStyles: {
        fontSize: 8,
      },
      didDrawPage: ({ table, cursor }) => {
        const endY = cursor?.y;
        const marginX = 5;
        const tableWidth = table.getWidth(doc.internal.pageSize.getWidth());

        const startY = table.pageNumber === 1
          ? (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 5
          : table.settings.margin.top;

        doc.setDrawColor('#b3b8bd');
        doc.setLineWidth(0.2);
        doc.roundedRect(marginX, startY, tableWidth, endY! - startY, 3, 3);
      },
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
          const textLines = doc.splitTextToSize(String(cell.raw), cell.width);

          doc.setTextColor(...textColorRGB);
          doc.setFontSize(7);
          doc.text(
            textLines,
            cell.x + cell.width / 2,
            cell.y + cell.height / 2,
            { align: 'center', baseline: 'middle' }
          );
        }

        if (row.section === 'body' && column.index < headers.length - 1) {
          doc.setLineWidth(0.2);
          doc.setDrawColor('#b3b8bd');
          doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height);
        }
      },
    });

    doc.save(`RESUMEN_PRODUCTOS_${getElSalvadorDateTime().fecEmi}.pdf`);
  } catch {
    toast.error('Ocurrió un error al generar el PDF.');
  }
};


  return (
    <>
      <ButtonUi
        isDisabled={summary_products_selled.summary.length === 0}
        startContent={<AiOutlineFilePdf className="" size={25} />}
        theme={Colors.Primary}
        onPress={handleDownloadPDF}
      >
        <p className="font-medium hidden lg:flex"> Descargar PDF</p>
      </ButtonUi>
    </>
  );
}