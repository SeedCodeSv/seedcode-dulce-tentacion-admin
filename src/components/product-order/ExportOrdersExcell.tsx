import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from 'exceljs';
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import useGlobalStyles from "../global/global.styles";

import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { ITransmitter } from "@/types/transmitter.types";
import { getElSalvadorDateTime, getElSalvadorDateTimeText } from "@/utils/dates";
import { useOrderProductStore } from "@/store/order-product.store";
import { IGroupedOrderData } from "@/types/order-products.types";
import { hexToARGB } from "@/utils/utils";
import { SearchGlobal } from "@/types/global.types";


interface Props {
    orders: number[]
    filters: SearchGlobal
    transmitter: ITransmitter
}

export default function ExportOrdersExcell({ orders, filters, transmitter }: Props) {
    const styles = useGlobalStyles();
    const { getGroupedOrdersExport, ordersProducts } = useOrderProductStore()

    const [loading_data, setLoadingData] = useState(false)


    const handle = async () => {
        setLoadingData(true)
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
                await exportToExcel(res.orders)
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

    const fillColor = hexToARGB(styles.thirdStyle.backgroundColor || '#4CAF50');
    const fontColor = hexToARGB(styles.thirdStyle.color);

    const exportToExcel = async (orders: IGroupedOrderData) => {
        if (!orders.data || orders.data.length === 0) {
            toast.error('No hay datos disponibles para exportar.');

            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Resumen');

            const DATE = getElSalvadorDateTime().fecEmi;
            const time = getElSalvadorDateTime().horEmi;

            const branchNames = Object.keys(orders.data[0]).filter(k => k !== 'productName' && k !== 'totalGeneral');
            const headers = ['Producto', ...branchNames, 'Total General'];

            const extraInfo = [
                [`${transmitter.nombreComercial}`],
                [`Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${time}`],
                [`Reporte desde ${filters.startDate} hasta ${filters.endDate}`],
            ];

            extraInfo.forEach((row, index) => {
                const newRow = worksheet.addRow(row);
                const lastColLetter = worksheet.getColumn(headers.length).letter;

                worksheet.mergeCells(`A${newRow.number}:${lastColLetter}${newRow.number}`);
                newRow.font = { bold: index === 0, size: 13 };
                newRow.alignment = { horizontal: 'center' };
            });

            worksheet.addRow([]); // Espacio

            worksheet.columns = headers.map(h => ({
                width: h === 'Producto' ? 40 : 25,
            }));

            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell(cell => {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
                cell.font = { bold: true, color: { argb: fontColor } };
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            });

            orders.data.forEach(row => {
                const rowData = headers.map(header => {
                    if (header === 'Producto') return row.productName;
                    if (header === 'Total General') return row.totalGeneral ?? 0;

                    return row[header] ?? 0;
                });

                worksheet.addRow(rowData);
            });

            const totalRowData = headers.map(header => {
                if (header === 'Producto') return 'Totales';
                if (header === 'Total General') return orders.branchTotals.totalGeneral ?? 0;

                return orders.branchTotals[header] ?? 0;
            });

            const totalRow = worksheet.addRow(totalRowData);

            totalRow.font = { bold: true };

            worksheet.columns.forEach((col, idx) => {
                if (headers[idx] !== 'Producto') {
                    col.alignment = { horizontal: 'right' };
                } else {
                    col.alignment = { horizontal: 'left' };
                }
            });

            // Exportar
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');

            link.href = URL.createObjectURL(blob);
            link.download = `Ordenes_De_Productos_Entregados_${DATE}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            toast.error('Ocurrió un error al generar el Excel.');
        }
    };


    return (
        <ButtonUi
            isDisabled={loading_data || ordersProducts.order_products.length === 0}
            startContent={
                loading_data ? (
                    <Loader className="animate-spin" />
                ) : (
                    <PiMicrosoftExcelLogo size={25} />
                )
            }
            theme={Colors.Success}
            onPress={handle}
        >
            <p className="font-medium hidden lg:flex">
                {loading_data ? 'Generando...' : 'Exportar a excel'}
            </p>
        </ButtonUi>
    );
}