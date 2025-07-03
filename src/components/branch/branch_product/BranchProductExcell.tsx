import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from 'exceljs';
import { useState } from "react";

import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { getElSalvadorDateTime } from "@/utils/dates";
import useGlobalStyles from "@/components/global/global.styles";
import { hexToARGB } from "@/utils/utils";
import { useBranchProductStore } from "@/store/branch_product.store";
import { ITransmitter } from "@/types/transmitter.types";
import { Branches } from "@/types/branches.types";
import { BranchProduct } from "@/types/branch_products.types";



export default function BranchProductExcell({ branch, transmitter }: { branch: Branches, transmitter: ITransmitter, }) {
    const styles = useGlobalStyles();
    const { getBranchProductsFilteredList } = useBranchProductStore()
    const [loading_data, setLoadingData] = useState(false)
    const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');
    const fontColor = hexToARGB(styles.darkStyle.color);


    const handle = async () => {
        setLoadingData(true)
        const res = await getBranchProductsFilteredList({ branchId: branch.id })

        if (res) {
            await exportToExcel(res.branchPrd)
            setLoadingData(false)
        }
    }


    const exportToExcel = async (branchProducts: BranchProduct[]) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Kardex');

        const DATE = getElSalvadorDateTime().fecEmi
        const time = getElSalvadorDateTime().horEmi

        const extraInfo = [
            [`${transmitter.nombreComercial}`],
            [`Sucursal: ${branch.name}`],
            [`Fecha: ${DATE}`],
            [`Hora: ${time}`],
        ];

        extraInfo.forEach((row, index) => {
            const newRow = worksheet.addRow(row);

            newRow.font = { bold: index === 0 };
        });

        worksheet.addRow([]);

        const headers = ["Nº", "Nombre", "Codigo", "Precio de venta", 'Stock', 'Reservado']
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

        worksheet.columns = [
            { width: 6 },
            { width: 40 },
            { width: 25 },
            { width: 10 },
            { width: 20 },
            { width: 12 },
            { width: 15 },
            { width: 20 }
        ];

        branchProducts.forEach((item, index) => {
            worksheet.addRow([
                index + 1,
                item.product.name,
                item.product.code,
                 Number(item.price) || 0.00,
    Number(item.stock) || 0,
    Number(item.reserved) || 0,
            ]);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = `Productos_Sucursal_${branch.name}_${DATE}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <ButtonUi
            isDisabled={loading_data}
            startContent={<PiMicrosoftExcelLogo className="" size={25} />}
            theme={Colors.Success}
            onPress={handle}
        >
            <p className="font-medium hidden lg:flex"> Exportar a excel</p>
        </ButtonUi>
    );
}