import { toast } from 'sonner';
import autoTable, { HAlignType, ThemeType } from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import { useEffect, useState } from 'react';
import { AiOutlineFilePdf } from 'react-icons/ai';

import { getElSalvadorDateTime, getElSalvadorDateTimeText } from '@/utils/dates';
import { useConfigurationStore } from '@/store/perzonalitation.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { hexToRgb } from '@/utils/utils';
import useGlobalStyles from '@/components/global/global.styles';
import { useOrderProductionReportStore } from '@/store/reports/order-production-report.store';


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

export const OPReportExportPDF = ({ branch, params, comercialName }: Props) => {
    const { production_orders_report, statusTotals } = useOrderProductionReportStore()

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
            if (!production_orders_report || production_orders_report.length === 0) {
                toast.error('No hay datos disponibles para generar el PDF.');

                return;
            }

            const doc = new jsPDF();

            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');

            const totalPending = statusTotals.open

            const totalCompleted = statusTotals.completed

            let startY = 5
            const createHeader = (doc: jsPDF) => {

                logoUrl && doc.addImage(logoUrl, 'PNG', 10, 5, 25, 25, 'logo', 'FAST');
                autoTable(doc, {
                    showHead: false,
                    body: [
                        [{ content: comercialName, styles: { halign: 'center', fontStyle:'bold' } }],
                        [{ content: 'Sucursal: ' + branch, styles: { halign: 'center' } }],
                        [{ content: 'Fecha: ' + `${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`, styles: { halign: 'center' } }],
                        [{ content: `Reporte desde ${params.startDate} hasta ${params.endDate}`, styles: { halign: 'center' } }],
                        [{ content: '(General)', styles: { halign: 'center' } }],
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
                const rectWidth = 40;
                const x = pageWidth - rectWidth - marginX;

                const lineHeight = 5;
                const paddingY = 6;

                const rectHeight = lineHeight * 5;
                const rectBottomY = startY + 30;
                const rectY = rectBottomY - rectHeight;

                doc.setFontSize(10);
                doc.roundedRect(x - 3, rectY, rectWidth, rectHeight, 2, 2);
                let currentY = rectY + paddingY;

                doc.setFontSize(9);

                doc.text(`Pendientes:    ${totalPending}`, x, currentY);
                currentY += lineHeight;
                doc.text(`Completadas: ${totalCompleted}`, x, currentY);
                currentY += lineHeight;
                doc.text(`En proceso:    ${statusTotals.inProgress}`, x, currentY);
                currentY += lineHeight;
                doc.text(`Canceladas:    ${statusTotals.canceled}`, x, currentY);
                currentY += lineHeight;
            };

            const headers = ['Nº','Producto', 'Fecha/Hora de inicio', 'Fecha/Hora de fin', 'Cantidad', 'Producido', 'Dañado', 'Estado/Orden'];

            const rows = production_orders_report.map((item, index) => [
                index + 1,
                item.branchProduct.product.name,
                `${item.date} - ${item.time}`,
                item.endDate && item.endTime ? `${item.endDate} - ${item.endTime}` : "No definido",
                item.quantity,
                item.producedQuantity,
                item.damagedQuantity,
                item.statusOrder
            ]);

            createHeader(doc)
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

                    if (row.section === 'body' && column.index < headers.length - 1) {
                        doc.setLineWidth(0.2);
                        doc.setDrawColor('#b3b8bd');
                        doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height);
                    }
                },
            });

            doc.save(`REPORTE_ORDEN_DE_PRODUCCION_(GENERAL)_${getElSalvadorDateTime().fecEmi}.pdf`);
        } catch {
            toast.error('Ocurrió un error al descargar el PDF.');
        }
    };

    return (
        <>
            <ButtonUi
                isDisabled={production_orders_report.length === 0}
                startContent={<AiOutlineFilePdf className="" size={25} />}
                theme={Colors.Primary}
                onPress={handleDownloadPDF}
            >
                <p className="font-medium hidden lg:flex"> Descargar PDF</p>
            </ButtonUi>
        </>
    );
};
