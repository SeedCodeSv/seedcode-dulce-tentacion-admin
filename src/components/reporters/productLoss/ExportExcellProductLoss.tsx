import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from 'exceljs';
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { getElSalvadorDateTime } from "@/utils/dates";
import useGlobalStyles from "@/components/global/global.styles";
import { hexToARGB } from "@/utils/utils";
import { useBranchProductReportStore } from "@/store/reports/branch_product.store";
import { IGetProductLoss } from "@/types/reports/branch_product.reports";
import { SearchReport } from "@/types/reports/productsSelled.report.types";
import { useAuthStore } from "@/store/auth.store";

export default function ProductLossExportExcell({ params, branch }: { branch: string, params: SearchReport }) {
    const styles = useGlobalStyles();
    const user = useAuthStore()
    const [loading_data, setLoadingData] = useState(false)
    const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');
    const fontColor = hexToARGB(styles.darkStyle.color);
    const { getProductsLossExport, productsLoss } = useBranchProductReportStore()

    const handle = async () => {
        setLoadingData(true)
        try {
            const data = await getProductsLossExport({ ...params, limit: productsLoss.total })


            if (data && data.ok) {
                await exportToExcel(data.productsLoss)
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


    const exportToExcel = async (products: IGetProductLoss) => {

        if (!products.productLoss || products.productLoss.length === 0) {
            toast.warning('No hay datos disponibles para generar el Excell');

            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Productos Perdidos');

        const DATE = getElSalvadorDateTime().fecEmi
        const TIME = getElSalvadorDateTime().horEmi

        const extraInfo = [
            [`${user.transmitter?.nombreComercial ?? ''}`],
            [`${branch !== '' ? `Sucursal: ${branch}` : 'Todas las sucursales'}`],
            [`Fecha: ${DATE}-${TIME}`]
        ];

        extraInfo.forEach((row, index) => {
            const newRow = worksheet.addRow(row);

            newRow.font = { bold: index === 0 };
        });

        worksheet.addRow([]);

        const headers = ['Fecha', 'Fuente', 'Producto', 'Cantidad', 'Sucursal', 'Información'];
        const headerRow = worksheet.addRow(headers);

        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: fillColor },
            };
            cell.font = {
                bold: true,
                color: { argb: fontColor },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        });

        worksheet.columns = [
            { width: 15 },
            { width: 25 },
            { width: 35 },
            { width: 15 },
            { width: 30 },
            { width: 35 },
        ];

        products.productLoss.forEach((item) => {
            const row = worksheet.addRow([
                item.date,
                item.source,
                item?.branchProduct?.product?.name || '',
                item?.quantity || '',
                item?.branchProduct?.branch?.name || '',
                item?.observation,
            ]);

            row.eachCell((cell, colNumber) => {
                const moneyColumns = [6, 9];

                if (moneyColumns.includes(colNumber))
                    cell.numFmt = '_($* #,##0.0000_);_($* (#,##0.0000);_($* "-"??_);_(@_)'
            })
        });

        worksheet.autoFilter = {
            from: { row: headerRow.number, column: 1 },
            to: { row: headerRow.number, column: worksheet.columns.length },
        };

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = `Productos_Perdidos_${DATE}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <ButtonUi
            isDisabled={loading_data || productsLoss.productLoss.length === 0}
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