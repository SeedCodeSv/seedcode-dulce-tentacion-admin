import { useEffect, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';
import { Button } from '@heroui/react';
import { DownloadIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router';

import { convertImageToBase64 } from '@/utils/utils';
import { useConfigurationStore } from '@/store/perzonalitation.store';
import { NoteResponse } from '@/shopping-branch-product/types/notes_of_remision.types';
import { formatCurrency } from '@/utils/dte';
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from '@/utils/dates';
import DEFAULT_LOGO from '@/assets/dulce-logo.png';
import { get_pdf_nre } from '@/services/referal-notes.service';
import LoadingTable from '@/components/global/LoadingTable';
import { global_styles } from '@/styles/global.styles';

// si tu lógica está ahí

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}


export default function PdfPreview() {
  const [note, setNote] = useState<NoteResponse['note'] | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { personalization } = useConfigurationStore();
  const [comprobante, setComprobante] = useState<string | null>(null);
  const [activePdf, setActivePdf] = useState<'nota' | 'comprobante'>('nota');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleShowPdf = () => {
    if (!note) {
      toast.warning('No hay datos disponibles para generar el PDF.');

      return;
    }

    get_pdf_nre(note?.codigoGeneracion)
      .then((res) => {
        setComprobante(URL.createObjectURL(res.data));
      })
      .catch(() =>
        toast.error('Error al obtener el comprobante')
      );
  };

  useEffect(() => {
    const stored = sessionStorage.getItem('lastShippingNote');

    if (stored) {
      const parsed = JSON.parse(stored);

      setNote(parsed);
    }
  }, []);

  const generatePDF = async () => {
    if (!note) {
      toast.warning('No hay datos disponibles para generar el PDF.');

      return;
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const logo = personalization?.[0]?.logo || DEFAULT_LOGO;
    const logoBase64 = await convertImageToBase64(logo);
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
    const margin = 10;
    const halfWidth = (pageWidth - margin * 2) / 2;
    const headers = ['No.', 'Detalles', 'Cantidad', 'Precio Venta', 'Total'];
    const rows = note.details.map((item, index) => {
      const price = Number(item.branchProduct.price) || 0;
      const quantity = Number(item.cantidadItem) || 0;
      const total = price * quantity;

      return [
        index + 1,
        item.branchProduct.product.name || '',
        quantity,
        formatCurrency(price),
        formatCurrency(total),
      ];
    });
    const renderSide = (first: boolean = false, offsetX: number, dataRows: string[][], offsetY: number = 5) => {
      doc.addImage(logoBase64, 'PNG', offsetX + 10, offsetY, 17, 17, '', 'SLOW');

      autoTable(doc, {
        showHead: false,
        body: [
          [{ content: note.branch.transmitter?.nombreComercial ?? '', styles: { halign: 'right', fontStyle: 'bold' } }],
          [{ content: 'ORDEN DE ENTREGA DE PRODUCTO', styles: { halign: 'right', fontStyle: 'bold' } }],
        ],
        theme: 'plain',
        startY: offsetY,
        margin: { right: offsetX + 5 },
        bodyStyles: {
          cellPadding: 1,
          fontSize: 10,
        },
      });

      const lastY = (doc as jsPDFWithAutoTable).lastAutoTable?.finalY ?? offsetY + 30;

      autoTable(doc, {
        showHead: false,
        body: [
          [{ content: `PRODUCCCION DE: ${note.branch?.name}`, styles: { halign: 'left', fontStyle: 'bold' } }],
          [{ content: `DESTINO:    ${note.receivingBranch?.name}`, styles: { halign: 'left' } }],
          [{ content: `FECHA:       ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`, styles: { halign: 'left' } }],
        ],
        theme: 'plain',
        startY: lastY + 10,
        margin: { left: offsetX + 5 },
        bodyStyles: {
          cellPadding: 1,
          fontSize: 8,
        },
      });

      const numberNoteX = first ? halfWidth - 5 : pageWidth - 15;
      const numberNoteY = lastY + 10 + 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`#: ${note.id}`, numberNoteX, numberNoteY);

      const startTableY = (doc as jsPDFWithAutoTable).lastAutoTable?.finalY ?? offsetY + 30;

      autoTable(doc, {
        head: [headers],
        body: dataRows,
        startY: startTableY + 5,
        margin: { left: 5 + offsetX, right: first ? halfWidth + 15 : 5 },
        theme: 'grid',
        styles: { cellPadding: 2.5 },
        headStyles: {
          fontSize: 7,
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineWidth: 0.2,
          lineColor: [179, 184, 189],
        },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 50, halign: 'left' },
        },
      });
    };

    const chunkSize = 15;
    const productChunks: string[][][] = [];

    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize).map(row =>
        row.map(cell => String(cell))
      );

      productChunks.push(chunk);
    }

    productChunks.forEach((chunk, index) => {
      if (index > 0) doc.addPage();

      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setDrawColor(180);
      doc.setLineWidth(0.1);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(centerX, 0, centerX, pageHeight);
      doc.setLineDashPattern([], 0);

      renderSide(true, 0, chunk);
      renderSide(false, centerX, chunk);
    });

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);

    setPdfUrl(url);
  };

  useEffect(() => {
    if (note) {
      generatePDF();
      handleShowPdf()
    }
  }, [note]);

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-bold">Vista previa de nota #{note?.id}</h1>
        <div className="flex gap-2">
          <Button
            color={activePdf === 'nota' ? 'primary' : 'default'}
            isDisabled={!pdfUrl}
            onPress={() => setActivePdf('nota')}
          >
            Orden de Entrega
          </Button>
          <Button
            color={activePdf === 'comprobante' ? 'primary' : 'default'}
            isDisabled={!comprobante}
            onPress={() => setActivePdf('comprobante')}
          >
            Comprobante
          </Button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <Button
          isIconOnly
          className="absolute bottom-6 left-6 z-10"
          color="danger"
          onPress={() => window.close()}
        >
          <X />
        </Button>

        {activePdf === 'nota' && pdfUrl && (
          <>
            <Button
              isIconOnly
              as="a"
              className="absolute bottom-20 left-6 z-10"
              download={`Orden_de_envio_#${note?.id}.pdf`}
              href={pdfUrl}
              startContent={<DownloadIcon />}
              style={global_styles().primaryStyles}
            />
            <iframe
              ref={iframeRef}
              className="w-full h-full"
              src={pdfUrl}
              title="Vista previa de la Nota"
            />
          </>
        )}

        {activePdf === 'comprobante' && comprobante && (
          <>
            <Button
              isIconOnly
              as="a"
              className="absolute bottom-20 left-6 z-10"
              download={`Comprobante_${note?.codigoGeneracion}.pdf`}
              href={comprobante}
              startContent={<DownloadIcon />}
              style={global_styles().primaryStyles}
            />
            <iframe
              className="w-full h-full"
              src={comprobante}
              title="Vista previa del Comprobante"
            />
          </>
        )}

        {!pdfUrl && !comprobante && (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <LoadingTable title="Generando PDFs..." />
          </div>
        )}
      </div>
    </div>
  );

}
