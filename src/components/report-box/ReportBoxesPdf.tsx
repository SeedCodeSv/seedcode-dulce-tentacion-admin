
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { toast } from 'sonner';

import { useReportBoxStore } from '@/store/report-box.store';
import { getElSalvadorDateTime } from '@/utils/dates';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { formatCurrency } from '@/utils/utils';
interface Filter {
    startDate: string,
    endDate: string,
    branches: number[]


}

export default function ReportBoxesPdf({ filters }: { filters: Filter }) {
    const { export_box_excell } = useReportBoxStore();

    const handleExportPdf = () => {
        if (!export_box_excell || export_box_excell.length === 0) {
            toast.error("No hay datos para exportar PDF.");

            return;
        }

        const doc = new jsPDF();
        const date = getElSalvadorDateTime().fecEmi;
        const startDate = filters.startDate;
        const endDate = filters.endDate;

        const backgroundColor = '#FFB6C1';
        const textColor = '#ffffff';

        doc.setFontSize(12);
        doc.setTextColor('#000000ff');
        doc.text('Reporte de Cajas', 105, 15, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Desde el ${startDate} hasta el ${endDate}`, 105, 22, { align: 'center' });

        const columns = [
            'Sucursal',
            'Fecha',
            'Hora',
            'Inicio',
            'Final',
            'Total gastos',
            'Total en ventas',
            'Total invalidadas',
            'Estado',
        ];

        const body = export_box_excell.map(item => [
            item?.pointOfSale?.branch?.name || '',
            item?.date || '',
            item?.time ?? '',
            formatCurrency(Number(Number(item?.start ?? 0).toFixed(2))),
            formatCurrency(Number((
                Number(item?.totalSalesStatus ?? 0) + Number(item?.invalidatedTotal ?? 0)
            ).toFixed(2))),
            formatCurrency(Number(Number(item?.totalExpense ?? 0).toFixed(2))),
            formatCurrency(Number(Number(item?.totalSalesStatus ?? 0).toFixed(2))),
            formatCurrency(Number(Number(item?.invalidatedTotal ?? 0).toFixed(2))),
            item?.isActive ? 'ACTIVO' : 'INACTIVO',
        ]);

        autoTable(doc, {
            startY: 30,
            head: [columns],
            body,
            styles: {
                fontSize: 8,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: backgroundColor,
                textColor: textColor,
                halign: 'center',
            },
            columnStyles: {
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
                6: { halign: 'right' },
                7: { halign: 'right' },
            },
        });

        doc.save(`Reporte_de_Cajas_${date}.pdf`);
    };

    return (
        <ButtonUi
            showTooltip
            isDisabled={export_box_excell.length > 0 ? false : true}
            startContent={<AiOutlineFilePdf size={25} />}
            theme={Colors.Primary}
            tooltipText="Exportar a PDF"
            onPress={handleExportPdf}
        />
    );
}
