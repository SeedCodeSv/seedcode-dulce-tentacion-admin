import { AiOutlineFilePdf } from "react-icons/ai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import moment from "moment";
import { Loader } from "lucide-react";
import autoTable, { ThemeType } from "jspdf-autotable";

import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import useGlobalStyles from "@/components/global/global.styles";
import { hexToRgb } from "@/utils/utils";
import { useConfigurationStore } from "@/store/perzonalitation.store";
import { SearchReport } from "@/types/reports/productsSelled.report.types";
import { useBranchProductReportStore } from "@/store/reports/branch_product.store";
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from "@/utils/dates";
import { useAuthStore } from "@/store/auth.store";
import { IGetProductLoss } from "@/types/reports/branch_product.reports";

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}
export default function ExportPdfProductLoss({ filters, branch }: { filters: SearchReport, branch: string }) {
  const date = moment().tz('America/El_Salvador').format('YYYY-MM-DD');
  const styles = useGlobalStyles();
  const [logoUrl, setLogoUrl] = useState<string | undefined>();
  const { personalization } = useConfigurationStore();
  const { getProductsLossExport, productsLoss } = useBranchProductReportStore()
  const user = useAuthStore()

  const backgroundColorRGB = styles.darkStyle.backgroundColor || '#0d83ac';
  const textColorRGB = hexToRgb(styles.secondaryStyle.color || '#FFFFFF');
  const [loading_data, setLoadingData] = useState(false)

  useEffect(() => {
    const logoUrl =
      personalization[0]?.logo?.trim() !== ''
        ? personalization[0]?.logo
        : undefined;

    setLogoUrl(logoUrl);
  }, []);


  const handle = async () => {
    setLoadingData(true)
    try {
      const res = await getProductsLossExport({...filters, limit: productsLoss.total});

      if (res && res.ok) {
        await handleDownloadPDF(res.productsLoss)
        setLoadingData(false)
      } else {
        toast.error('Error al obtener datos');
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado');
    } finally {
      setLoadingData(false);
    }
  }

  const handleDownloadPDF = async (productLoss: IGetProductLoss) => {
    try {
      if (!productLoss.productLoss || productLoss.productLoss.length === 0) {
        toast.warning('No hay datos disponibles para generar el PDF.');

        return;
      }

      const doc = new jsPDF();

      const createHeader = (doc: jsPDF) => {

       logoUrl && doc.addImage(logoUrl, 'PNG', 10, 5, 25, 25, 'logo', 'FAST');
        autoTable(doc, {
          showHead: false,
          body: [
            [{ content: user.transmitter?.nombreComercial, styles: { halign: 'left' } }],
            [{ content: `${branch !== '' ? `Sucursal: ${branch}` : 'Todas las sucursales'}`, styles: { halign: 'left' } }],
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

      const headers = ['Fecha', 'Fuente', 'Producto', 'Cantidad', 'Sucursal', 'Información'];

      const rows = productLoss.productLoss.map((item) => [
        item.date,
        item.source,
        item?.branchProduct?.product?.name || '',
        item?.quantity || '',
        item?.branchProduct?.branch?.name || '',
        item?.observation,
      ]);

      createHeader(doc);
      const lastY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY;

      autoTable(doc, {
        body: rows,
        startY: lastY + 5,
        theme: 'plain' as ThemeType,
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

      doc.save(`Productos_Perdidos_${date}.pdf`);
    } catch {
      toast.error('Ocurrió un error al descargar el PDF. Intente de nuevo más tarde.');
    }
  };

  return (
    <ButtonUi
      isDisabled={loading_data || productsLoss.productLoss.length === 0}
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
  )
}