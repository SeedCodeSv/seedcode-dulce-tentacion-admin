import jsPDF from "jspdf";
import autoTable, { ThemeType } from "jspdf-autotable";
import { useEffect, useState } from "react";
import { AiOutlineFilePdf } from "react-icons/ai";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import useGlobalStyles from "@/components/global/global.styles";
import { useConfigurationStore } from "@/store/perzonalitation.store";
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from "@/utils/dates";
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

export default function ProductsExportPdfByBranches({ headers, params, comercialName }: Props) {
  const { products_selled_by_branches } = useProductsOrdersReportStore();
  const [isGenerating, setIsGenerating] = useState(false)

  const [logoUrl, setLogoUrl] = useState<string | undefined>();
  const styles = useGlobalStyles();

  const backgroundColorRGB = styles.darkStyle.backgroundColor || '#0d83ac';

  const { personalization } = useConfigurationStore()

  useEffect(() => {
    const logoUrl =
      personalization[0]?.logo?.trim() !== ''
        ? personalization[0]?.logo
        : undefined;

    setLogoUrl(logoUrl);
  }, []);

  const handleDownloadPDF = async () => {
    if (!products_selled_by_branches.data || products_selled_by_branches.data.length === 0) {
      toast.error('No hay datos disponibles para generar el PDF.');

      return;
    }

    setIsGenerating(true);

    // 👇 Espera un tick para que React actualice el DOM y muestre el spinner
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      const doc = new jsPDF();

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');

      const startY = 5;

      const createHeader = () => {
        logoUrl && doc.addImage(logoUrl, 'PNG', 10, 5, 20, 20, 'logo', 'SLOW');

        autoTable(doc, {
          showHead: false,
          body: [
            [{ content: comercialName, styles: { halign: 'center', fontStyle: 'bold' } }],
            [{ content: `Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`, styles: { halign: 'center' } }],
            [{ content: `Reporte desde ${params.startDate} hasta ${params.endDate}`, styles: { halign: 'center' } }],
          ],
          theme: 'plain',
          startY,
          bodyStyles: { cellPadding: 1 },
          margin: { top: 10, left: 40, right: 50 },
        });
      };

      createHeader();

      const bodyRows = products_selled_by_branches.data.map(row => {
        return headers.map(header => {
          if (header === 'Producto') return row.productName;
          if (header === 'Total General') return row.totalGeneral;

          return row[header] ?? 0;
        });
      });

      const totalRow = headers.map(header => {
        if (header === 'Producto') return 'Totales';
        if (header === 'Total General') return products_selled_by_branches.branchTotals.totalGeneral;

        return products_selled_by_branches.branchTotals[header] ?? 0;
      });

      bodyRows.push(totalRow);

      const lastY = (doc as jsPDFWithAutoTable).lastAutoTable?.finalY ?? startY + 5;

      autoTable(doc, {
        head: [headers],
        body: bodyRows,
        startY: lastY + 5,
        theme: 'grid' as ThemeType,
        margin: { horizontal: 5 },
        styles: { cellPadding: 2.5 },
        headStyles: {
          fontSize: 7,
          fillColor: backgroundColorRGB,
          overflow: 'linebreak',
          fontStyle: 'bold',
          lineWidth: 0.2,
          lineColor: [179, 184, 189],
        },
        bodyStyles: {
          fontSize: 8,
        },
      });

      doc.save(`VENTAS_POR_PRODUCTOS_DETALLADO_POR_SUCURSALES_${getElSalvadorDateTime().fecEmi}.pdf`);
    } catch {
      toast.error('Ocurrió un error al generar el PDF.');
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <>
      <ButtonUi
        isDisabled={isGenerating || products_selled_by_branches.data.length === 0}
        startContent={
          isGenerating ? (
            <Loader className="animate-spin" size="sm"/>
          ) : (
            <AiOutlineFilePdf size={25} />
          )
        }
        theme={Colors.Primary}
        onPress={handleDownloadPDF}
      >
        <p className="font-medium hidden lg:flex">
          {isGenerating ? 'Generando...' : 'Descargar PDF'}
        </p>
      </ButtonUi>

    </>
  );
}