import jsPDF from "jspdf";
import autoTable, { ThemeType, HAlignType } from "jspdf-autotable";
import { useEffect, useState } from "react";
import { AiOutlineFilePdf } from "react-icons/ai";
import { toast } from "sonner";

import useGlobalStyles from "@/components/global/global.styles";
import { useConfigurationStore } from "@/store/perzonalitation.store";
import { useOrderProductionReportStore } from "@/store/reports/order-production-report.store";
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { getElSalvadorDateTimeText, getElSalvadorDateTime } from "@/utils/dates";
import { hexToRgb } from "@/utils/utils";

interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable: {
        finalY: number;
    };
}

interface Props {
    branch: string;
    params: {
        page: number,
        limit: number,
        productId: number,
        branch: number,
        startDate: string,
        endDate: string,
        productName: string,
        status: string
    }
    comercialName: string
}

export default function OPReportDetailedExportPDF({ branch, params, comercialName }: Props) {
    const [logoUrl, setLogoUrl] = useState<string | undefined>();

    const { personalization } = useConfigurationStore();

    const { po_report_detailed } = useOrderProductionReportStore()
    const styles = useGlobalStyles();

    const backgroundColorRGB = styles.darkStyle.backgroundColor || '#0d83ac';
    const textColorRGB = hexToRgb(styles.secondaryStyle.color || '#FFFFFF');

    useEffect(() => {
        const logoUrl =
            personalization[0]?.logo?.trim() !== ''
                ? personalization[0]?.logo
                : undefined;

        setLogoUrl(logoUrl);
    }, []);

    const handleDownloadPDF = async () => {
        try {
            if (!po_report_detailed || po_report_detailed.length === 0) {
                toast.warning('No hay datos disponibles para generar el PDF.');

                return;
            }

            function textoConEspaciado(texto: string, x: number, y: number, fontSize: number, espaciado: number) {
                const espacio = espaciado || 0; // Espacio por defecto en 0
                let textoAjustado = texto.replace(/./g, (letra) => { return letra + String.fromCharCode(espacio) });

                doc.setFontSize(fontSize);
                doc.text(textoAjustado, x, y);
            }

            const doc = new jsPDF();

            const createHeader = (doc: jsPDF) => {

                logoUrl && doc.addImage(logoUrl, 'PNG', 10, 5, 25, 25, 'logo', 'FAST');
                autoTable(doc, {
                    showHead: false,
                    body: [
                        [{ content: comercialName, styles: { halign: 'center', fontStyle: 'bold' } }],
                        [{ content: 'Sucursal: ' + branch, styles: { halign: 'center' } }],
                        [{ content: 'Fecha/Hora ' + `${getElSalvadorDateTimeText().fecEmi}-${getElSalvadorDateTime().horEmi}`, styles: { halign: 'center' } }],
                        [{ content: 'Reporte desde ' + `${params.startDate} hasta ${params.endDate}`, styles: { halign: 'center' } }],
                        [{ content: '(Detallado)', styles: { halign: 'center' } }],
                    ],
                    theme: 'plain',
                    startY: 5,
                    bodyStyles: {
                        cellPadding: 1,
                    },
                    margin: { top: 10, left: 50, right: 50 },
                });

            };

            const headers = ['Nº', 'Fecha/Hora de inicio', 'Fecha/Hora de fin', 'Cantidad', 'Producido', 'Dañado', 'Estado/Orden'];

            createHeader(doc);
            let lastY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY;
            let tableCount = 1;

            for (const detail of po_report_detailed) {
                const rows = detail.table.map((item, index) => [
                    index + 1,
                    `${item.date} - ${item.time}`,
                    item.endDate && item.endTime ? `${item.endDate} - ${item.endTime}` : "No definido",
                    item.quantity,
                    item.producedQuantity,
                    item.damagedQuantity,
                    item.statusOrder
                ]);

                autoTable(doc, {
                    body: rows,
                    startY: tableCount === 1 ? lastY + 12 : lastY + 5,
                    theme: 'plain' as ThemeType,
                    columnStyles: {
                        0: { cellWidth: 10, halign: 'center' as HAlignType },
                        1: { cellWidth: 65 },
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
                        if (!table || !cursor) return;

                        const marginX = 5;
                        const tableWidth = table.getWidth(doc.internal.pageSize.getWidth());

                        const endY = cursor.y;
                        const startY = endY < table.settings.startY ? table.settings.margin.top
                            : table.settings.startY;


                        doc.setDrawColor('#b3b8bd');
                        doc.setLineWidth(0.2);
                        doc.roundedRect(marginX, startY, tableWidth, endY - startY, 3, 3);
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

                        if (data.section === 'head') {
                            doc.setTextColor(60, 60, 60);
                            doc.setFont('helvetica', 'normal');
                            textoConEspaciado(`${detail.productName}`, 5, cell.y - 5, 10, 0);
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

                lastY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;
                tableCount++
            }

            doc.save(`REPORTE_ORDEN_DE_PRODUCCION_(DETALLADO)_${getElSalvadorDateTime().fecEmi}.pdf`);
        } catch {
            toast.error('Ocurrió un error al descargar el PDF. Intente de nuevo más tarde.');
        }
    };

    return (
        <ButtonUi
            isDisabled={po_report_detailed.length === 0}
            startContent={<AiOutlineFilePdf className="" size={25} />}
            theme={Colors.Primary}
            onPress={handleDownloadPDF}
        >
            <p className="font-medium hidden lg:flex"> Descargar PDF</p>
        </ButtonUi>
    )
}