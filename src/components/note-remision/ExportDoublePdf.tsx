import { Loader } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import autoTable from "jspdf-autotable";
import { useState } from "react";
import { AiOutlineFilePdf } from "react-icons/ai";

import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { convertImageToBase64 } from "@/utils/utils";
import { useConfigurationStore } from "@/store/perzonalitation.store";
import DEFAULT_LOGO from '@/assets/dulce-logo.png';
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from "@/utils/dates";
import { ITransmitter } from "@/types/transmitter.types";
import { DetailNote, ReferalNote } from "@/types/referal-note.types";
import { useReferalNote } from "@/store/referal-notes";
import { formatCurrency } from "@/utils/dte";

interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable: {
        finalY: number;
    };
}

export default function DoublePdfExport({ note, transmitter }: { note: ReferalNote, transmitter: ITransmitter }) {
    const { personalization } = useConfigurationStore();
    const [loading_data, setLoadingData] = useState(false)
    const { getDetailNote } = useReferalNote()


    const handle = async () => {
        setLoadingData(true)
        const res = await getDetailNote(note?.id ?? 0)

        if (res) {
            await handleDownloadSelectedPDF(res.note)
            setLoadingData(false)
        }
    }
    const handleDownloadSelectedPDF = async (detailNoteReferal: DetailNote[]) => {
        try {
            if (!detailNoteReferal || detailNoteReferal.length === 0) {
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
            const pageHeight = doc.internal.pageSize.getHeight();
            const headers = ['No.', 'Detalles', 'Cantidad', 'Precio Venta', 'Total'];
            const rows = detailNoteReferal.map((item, index) => {
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

            doc.setDrawColor(180);
            doc.setLineWidth(0.1);
            doc.setLineDashPattern([2, 2], 0);

            doc.line(centerX, 0, centerX, pageHeight);

            doc.setLineDashPattern([], 0);

            const renderSide = (first: boolean = false, offsetX: number, offsetY: number = 5) => {
                // Logo
                doc.addImage(logoBase64, 'PNG', offsetX + 10, offsetY, 17, 17, '', 'SLOW');

                // Header info
                autoTable(doc, {
                    showHead: false,
                    body: [
                        [{ content: transmitter.nombreComercial, styles: { halign: 'right', fontStyle: 'bold' } }],
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
                const numberNoteY = lastY + 10 + 6; // Ajusta este valor para que quede centrado verticalmente

                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text(`#: ${note.id}`, numberNoteX, numberNoteY);

                // Tabla principal
                const startTableY = (doc as jsPDFWithAutoTable).lastAutoTable?.finalY ?? offsetY + 30;

                autoTable(doc, {
                    head: [headers],
                    body: rows,
                    startY: startTableY + 5,
                    margin: { left: 5 + offsetX, right: first ? halfWidth + 15 : 5 },
                    theme: 'grid',
                    styles: { cellPadding: 2.5 },
                    headStyles: {
                        fontSize: 7,
                        fillColor: [255, 255, 255],
                        textColor: [0, 0, 0],
                        fontStyle: 'bold',
                        lineWidth: 0.2,             // ✅ Bordes visibles
                        lineColor: [179, 184, 189],
                    },
                    bodyStyles: { fontSize: 8 },
                    columnStyles: {
                        0: { cellWidth: 10, halign: 'center' },
                        1: { cellWidth: 50, halign: 'left' },
                    },
                });
            };

            renderSide(true, 0);

            renderSide(false, centerX);

            const date = getElSalvadorDateTimeText().fecEmi;

            doc.save(`Orden_de_entrega_${date}_${note?.id ?? 0}.pdf`);
        } catch {
            toast.error('Ocurrió un error al descargar el PDF. Intente de nuevo más tarde.');
        }
    };


    return (
        <ButtonUi
            isIconOnly
            isDisabled={loading_data}
            theme={Colors.Info}
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
                    <AiOutlineFilePdf className="" size={25} />
                </>
            }
        </ButtonUi>
    )
}