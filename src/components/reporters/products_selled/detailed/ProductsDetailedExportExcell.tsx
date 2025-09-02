import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from 'exceljs';
import { useState } from "react";

import useGlobalStyles from "@/components/global/global.styles";
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { formatDateSimple, getElSalvadorDateTime, getElSalvadorDateTimeText } from "@/utils/dates";
import { hexToARGB } from "@/utils/utils";
import { useProductsOrdersReportStore } from "@/store/reports/productsSelled_report.store";
import { IGetProductsSelled, SearchReport } from "@/types/reports/productsSelled.report.types";

interface Props {
    params: SearchReport
    comercialName: string
}


export default function ProductsDetailedExportExcell({ params, comercialName }: Props) {
    const { products_selled, getProductsSelledExport } = useProductsOrdersReportStore()
    const [loading_data, setLoadingData] = useState(false)

    const handle = async () => {
        setLoadingData(true)
        const res = await getProductsSelledExport({ ...params, limit: products_selled.total })

        if (res) {
            await exportToExcel(res.products_selled)
            setLoadingData(false)
        }
    }

    const styles = useGlobalStyles();

    const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');
    const fontColor = hexToARGB(styles.darkStyle.color);


    const exportToExcel = async (products_selled: IGetProductsSelled) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Cortes');

        const DATE = getElSalvadorDateTime().fecEmi

        const extraInfo = [
            [`${comercialName}`],
            [`Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`],
            [`Reporte desde ${params.startDate} hasta ${params.endDate}`]
        ];

        const headers = ['Fecha De Venta', 'Sucursal', 'Código', 'Descripción', 'Unidad de Medida', 'Cantidad Vendida', 'Precio Unitario', 'Total', 'Categoría'];

        extraInfo.forEach((row, index) => {
            const newRow = worksheet.addRow(row);
            const rowIndex = newRow.number;

            const lastColumnIndex = headers.length;
            const lastColumnLetter = worksheet.getColumn(lastColumnIndex).letter;

            worksheet.mergeCells(`A${rowIndex}:${lastColumnLetter}${rowIndex}`);
            newRow.font = { bold: index === 0, size: 13 };
            newRow.alignment = { horizontal: 'center' };
        });

        worksheet.addRow([]);

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
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        worksheet.autoFilter = {
            from: { row: headerRow.number, column: 1 },
            to: { row: headerRow.number + products_selled.products_sellled.length, column: headers.length }
        };

        worksheet.columns = [
            { width: 15 },
            { width: 20 },
            { width: 15 },
            { width: 25 },
            { width: 15 },
            { width: 12 },
            { width: 12 },
            { width: 12 },
            { width: 20 },
        ];


        // Copiamos el array para no mutar el original
        const sortedProducts = [...products_selled.products_sellled].sort((a, b) => {
            // 1️⃣ Ordenar por fecha ascendente
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;

            // 2️⃣ Ordenar por producto
            const productA = a.productName ?? '';
            const productB = b.productName ?? '';
            const productCompare = productA.localeCompare(productB);

            if (productCompare !== 0) return productCompare;

            // 3️⃣ Ordenar por sucursal
            const branchA = a.branchName ?? '';
            const branchB = b.branchName ?? '';

            return branchA.localeCompare(branchB);
        });

        // Luego agregamos al worksheet
        sortedProducts.forEach((item) => {
            worksheet.addRow([
                formatDateSimple(item.date),
                item.branchName ?? '',
                item.code ?? '',
                item.productName ?? '',
                item.unitMessure ?? '',
                Number(item.quantity ?? 0),
                Number(item.price ?? 0),
                Number(item.total ?? 0),
                item.category ?? ''
            ]);
        });


        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = `DETALLE_PRODUCTOS_${DATE}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <ButtonUi
            isDisabled={loading_data || products_selled.products_sellled.length === 0}
            startContent={<PiMicrosoftExcelLogo className="" size={25} />}
            theme={Colors.Success}
            onPress={handle}
        >
            <p className="font-medium hidden lg:flex"> Exportar a excel</p>
        </ButtonUi>
    )
}