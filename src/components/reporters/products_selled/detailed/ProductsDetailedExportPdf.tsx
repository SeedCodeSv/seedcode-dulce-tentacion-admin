import jsPDF from "jspdf";
import autoTable, { ThemeType } from "jspdf-autotable";
import { useEffect, useState } from "react";
import { AiOutlineFilePdf } from "react-icons/ai";
import { toast } from "sonner";

import useGlobalStyles from "@/components/global/global.styles";
import { useConfigurationStore } from "@/store/perzonalitation.store";
import ButtonUi from "@/themes/ui/button-ui";
import { SearchCutReport } from "@/types/cashCuts.types";
import { Colors } from "@/types/themes.types";
import { formatDateSimple, getElSalvadorDateTime, getElSalvadorDateTimeText } from "@/utils/dates";
import { hexToRgb } from "@/utils/utils";
import { formatCurrency } from "@/utils/dte";
import { useProductsOrdersReportStore } from "@/store/reports/productsSelled_report.store";

interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable: {
        finalY: number;
    };
}

interface Props {
    params: SearchCutReport
    comercialName: string
}

export default function ProductsDetailedExportPdf({ params, comercialName }: Props) {
    const { products_selled } = useProductsOrdersReportStore()


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
            if (!products_selled.products_sellled || products_selled.products_sellled.length === 0) {
                toast.error('No hay datos disponibles para generar el PDF.');

                return;
            }

            const doc = new jsPDF();

            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');

            let startY = 5
            const createHeader = (doc: jsPDF) => {

                logoUrl && doc.addImage(logoUrl, 'PNG', 10, 5, 25, 25, 'logo', 'FAST');
                autoTable(doc, {
                    showHead: false,
                    body: [
                        [{ content: comercialName, styles: { halign: 'center', fontStyle: 'bold' } }],
                        [{ content: 'Fecha: ' + `${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`, styles: { halign: 'center' } }],
                        [{ content: `Reporte desde ${params.dateFrom} hasta ${params.dateTo}`, styles: { halign: 'center' } }],
                        [{ content: '(Resumen)', styles: { halign: 'center' } }],
                    ],
                    theme: 'plain',
                    startY,
                    bodyStyles: {
                        cellPadding: 1,
                    },
                    margin: { top: 10, left: 40, right: 50 },
                });
            };

            const headers = ['Fecha', 'Sucursal', 'Código', 'Descripción', 'Unidad de Medida', 'Cantidad', 'Precio', 'Total', 'Categoría'];

            const rows = products_selled.products_sellled.map((item) => [
                formatDateSimple(item.date),
                item.branchName ?? '',
                item.code ?? '',
                item.productName ?? '',
                item.unitMessure ?? '',
                formatCurrency(Number(item.quantity ?? 0)),
                formatCurrency(Number(item.price ?? 0)),
                formatCurrency(Number(item.total ?? 0)),
                item.category ?? ''
            ]);

            createHeader(doc)
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
                    textColor: backgroundColorRGB,
                    overflow: 'linebreak',
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
                        const textLines = doc.splitTextToSize(String(cell.raw), cell.width); // 👈 divide el texto según el ancho de la celda

                        doc.setTextColor(...textColorRGB);
                        doc.setFontSize(7);
                        doc.text(
                            textLines,
                            cell.x + cell.width / 2,
                            cell.y + cell.height / 2,
                            {
                                align: 'center',
                                baseline: 'middle',
                            }
                        );
                    }

                    if (row.section === 'body' && column.index < headers.length - 1) {
                        doc.setLineWidth(0.2);
                        doc.setDrawColor('#b3b8bd');
                        doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height);
                    }
                },
            });

            doc.save(`DETALLE_PRODUCTOS_${getElSalvadorDateTime().fecEmi}.pdf`);
        } catch {
            toast.error('Ocurrió un error al descargar el PDF.');
        }
    };

    return (
        <>
            <ButtonUi
                isDisabled={products_selled.products_sellled.length === 0}
                startContent={<AiOutlineFilePdf className="" size={25} />}
                theme={Colors.Primary}
                onPress={handleDownloadPDF}
            >
                <p className="font-medium hidden lg:flex"> Descargar PDF</p>
            </ButtonUi>
        </>
    );
}