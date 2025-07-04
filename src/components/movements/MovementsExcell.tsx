import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from 'exceljs';
import { useState } from "react";

import ButtonUi from "@/themes/ui/button-ui";
import { Branches } from "@/types/branches.types";
import { Colors } from "@/types/themes.types";
import { ITransmitter } from "@/types/transmitter.types";
import { getElSalvadorDateTime } from "@/utils/dates";
import useGlobalStyles from "@/components/global/global.styles";
import { hexToARGB } from "@/utils/utils";
import { InventoryMoment } from "@/types/reports/inventory_movement";
import { useInventoryMovement } from "@/store/reports/inventory_movement.store";
import { useAuthStore } from "@/store/auth.store";

interface Filter {
    startDate: string,
    endDate: string,
    branch: string,
    typeOfInventory: string,
    typeOfMoviment: string,
}

export default function MovementsExportExcell({ filters, transmitter, branch }: { filters: Filter, tableData: InventoryMoment[]; transmitter: ITransmitter, branch: Branches | undefined }) {
    const styles = useGlobalStyles();
    const { OnGetAllInventoryMovement, } = useInventoryMovement()
    const [loading_data, setLoadingData] = useState(false)
    const { user } = useAuthStore();


    const handle = async () => {
        setLoadingData(true)
        const res = await OnGetAllInventoryMovement(user?.transmitterId ?? 0,
            filters.startDate,
            filters.endDate,
            filters.branch,
            filters.typeOfMoviment)

        if (res) {
            await exportToExcel(res.movements)
            setLoadingData(false)
        }
    }

    const fillColor = hexToARGB(styles.thirdStyle.backgroundColor || '#4CAF50');
    const fontColor = hexToARGB(styles.thirdStyle.color);


    const exportToExcel = async (movements: InventoryMoment[]) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Movimientos');

        const DATE = getElSalvadorDateTime().fecEmi
        const time = getElSalvadorDateTime().horEmi

        const extraInfo = [
            [`Movimientos de inventario del ${filters.startDate} al ${filters.endDate}`],
            [`${transmitter.nombre}`],
            [`${transmitter.nombreComercial}`],
            [`Sucursal: ${branch?.name}`],
            [`Hora: ${time}`],
        ];

        extraInfo.forEach((row, index) => {
            const newRow = worksheet.addRow(row);

            newRow.font = { bold: index === 0 };
        });

        worksheet.addRow([]);

        const columns = [
            'Nombre',
            'Tipo de movimiento',
            'Tipo de inventario',
            'Cantidad',
            'Fecha',
            'Hora',
            'Total',
        ];
        const headerRow = worksheet.addRow(columns);

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
            { width: 40 },
            { width: 20 },
            { width: 35 },
            { width: 10 },
            { width: 12 },
            { width: 12 },
            { width: 15 },
            { width: 12 },
            { width: 12 },
        ];

        movements.forEach((item) => {
            worksheet.addRow([
                item?.branchProduct?.product?.name || '',
                item.typeOfMovement || '',
                item.typeOfInventory || '',
                Number(item.quantity) || 0,
                item.date ?? 0,
                item.time ?? 0,
                Number(item.totalMovement ?? 0),
            ]);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = `Movimientos_de_inventario_${DATE}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <ButtonUi
            showTooltip
            isDisabled={loading_data}
            startContent={<PiMicrosoftExcelLogo className="" size={25} />}
            theme={Colors.Success}
            tooltipText="Exportar a excel"
            onPress={() => {
                if (!loading_data) {
                    handle()
                }
                else return
            }}
        />
    );
}