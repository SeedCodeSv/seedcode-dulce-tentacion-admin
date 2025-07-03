import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable, { ThemeType, HAlignType } from 'jspdf-autotable';
import { toast } from 'sonner';
import moment from 'moment';
import { AiOutlineFilePdf } from "react-icons/ai";
import { Loader } from 'lucide-react';
import { useState } from 'react';

import { ITransmitter } from '@/types/transmitter.types';
import { hexToRgb } from '@/utils/utils';
import useGlobalStyles from '@/components/global/global.styles';
import DEFAULT_LOGO from '@/assets/dulce-logo.png';
import { useConfigurationStore } from '@/store/perzonalitation.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from '@/utils/dates';
import { useBranchProductStore } from '@/store/branch_product.store';
import { Branches } from '@/types/branches.types';
import { BranchProduct } from '@/types/branch_products.types';


interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const DownloadPDFButton = ({ branch, transmitter }: { branch: Branches, transmitter: ITransmitter, }) => {
  const date = moment().tz('America/El_Salvador').format('YYYY-MM-DD');
  const { getBranchProductsFilteredList } = useBranchProductStore()
  const [loading_data, setLoadingData] = useState(false)

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

  const handle = async () => {
    setLoadingData(true)
    const res = await getBranchProductsFilteredList({ branchId: branch.id })

    if (res) {
      await handleDownloadPDF(res.branchPrd)
      setLoadingData(false)
    }
  }

  const handleDownloadPDF = async (branchProducts: BranchProduct[]) => {
    try {


      if (!branchProducts || branchProducts.length === 0) {
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

      const headers = ["Nº", "Nombre", "Codigo", "Precio de venta", 'Stock', 'Reservado']

      const rows = branchProducts.map((item, index) => [
        index + 1,
        item.product.name,
        item.product.code,
        item.price || '',
        item.stock || '',
        item.reserved || 0,
      ]);

      createHeader(doc);
      const lastY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY;

      autoTable(doc, {
        body: rows,
        startY: lastY + 5,
        theme: 'plain' as ThemeType,
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' as HAlignType },
          1: { cellWidth: 50 },
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

      doc.save(`Productos_Sucursal_${branch.name}_${date}.pdf`);
    } catch {
      toast.error('Ocurrió un error al descargar el PDF. Intente de nuevo más tarde.');
    }
  };

  return (
    <ButtonUi
      isDisabled={loading_data}
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
