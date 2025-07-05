import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import jsPDF from "jspdf";
import autoTable, { ThemeType } from "jspdf-autotable";
import { AiOutlineFilePdf } from "react-icons/ai";

import useGlobalStyles from "../global/global.styles";

import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { ITransmitter } from "@/types/transmitter.types";
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from "@/utils/dates";
import { useOrderProductStore } from "@/store/order-product.store";
import { IGroupedOrderData } from "@/types/order-products.types";
import { SearchGlobal } from "@/types/global.types";
import { useConfigurationStore } from "@/store/perzonalitation.store";

interface Props {
  orders: number[];
  filters: SearchGlobal;
  transmitter: ITransmitter;
}

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export default function ExportOrdersPdf({ orders, filters, transmitter }: Props) {
  const styles = useGlobalStyles();
  const { getGroupedOrdersExport, ordersProducts } = useOrderProductStore();
  const { personalization } = useConfigurationStore();
  const [logoUrl, setLogoUrl] = useState<string | undefined>();
  const [loading_data, setLoadingData] = useState(false);

  const backgroundColorRGB = styles.darkStyle.backgroundColor || '#0d83ac';

  useEffect(() => {
    const logoUrl = personalization[0]?.logo?.trim() !== ''
      ? personalization[0]?.logo
      : undefined;

    setLogoUrl(logoUrl);
  }, [personalization]);

  const handle = async () => {
    setLoadingData(true);
    try {
      const params: any = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        ordersId: orders,
        status: filters.status,
      };

      if (filters.branchId && filters.branchId !== 0) {
        params.branchIds = [filters.branchId];
      }

      const res = await getGroupedOrdersExport(params);

      if (res && res.ok) {
        await exportToPDF(res.orders);
      } else {
        toast.error('Error al obtener datos');
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado');
    } finally {
      setLoadingData(false);
    }
  };

  const exportToPDF = async (orders: IGroupedOrderData) => {
    if (!orders.data || orders.data.length === 0) {
      toast.error('No hay datos disponibles para exportar.');

      return;
    }

    try {
      const doc = new jsPDF();

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');

      const startY = 5;
      const branchNames = Object.keys(orders.data[0]).filter(k => k !== 'productName' && k !== 'totalGeneral');
      const headers = ['Producto', ...branchNames, 'Total General'];

      const createHeader = () => {
        if (logoUrl) {
          doc.addImage(logoUrl, 'PNG', 10, 5, 20, 20, 'logo', 'SLOW');
        }

        autoTable(doc, {
          showHead: false,
          body: [
            [{ content: transmitter.nombreComercial, styles: { halign: 'center', fontStyle: 'bold' } }],
            [{ content: `Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`, styles: { halign: 'center' } }],
            [{ content: `Reporte desde ${filters.startDate} hasta ${filters.endDate}`, styles: { halign: 'center' } }],
          ],
          theme: 'plain',
          startY,
          bodyStyles: { cellPadding: 1 },
          margin: { top: 10, left: 40, right: 50 },
        });
      };

      createHeader();

      const bodyRows = orders.data.map(row => {
        return headers.map(header => {
          if (header === 'Producto') return row.productName;
          if (header === 'Total General') return row.totalGeneral;

          return row[header] ?? 0;
        });
      });

      const totalRow = headers.map(header => {
        if (header === 'Producto') return 'Totales';
        if (header === 'Total General') return orders.branchTotals.totalGeneral;

        return orders.branchTotals[header] ?? 0;
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

      doc.save(`Ordenes_De_Productos_Entregados_${getElSalvadorDateTime().fecEmi}.pdf`);
    } catch (err) {
      toast.error('Ocurrió un error al generar el PDF.');
    }
  };

  return (
    <ButtonUi
      isDisabled={loading_data || ordersProducts.order_products.length === 0}
      startContent={
        loading_data ? (
          <Loader className="animate-spin" />
        ) : (
          <AiOutlineFilePdf size={25} />
        )
      }
      theme={Colors.Primary}
      onPress={handle}
    >
      <p className="font-medium hidden lg:flex">
        {loading_data ? 'Generando...' : 'Exportar a PDF'}
      </p>
    </ButtonUi>
  );
}
