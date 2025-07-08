import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from 'exceljs';
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { getElSalvadorDateTime } from "@/utils/dates";
import useGlobalStyles from "@/components/global/global.styles";
import { formatTipoDte, formatUnidadDeMedida, hexToARGB } from "@/utils/utils";
import { ITransmitter } from "@/types/transmitter.types";
import { get_report_shoppings } from "@/services/shopping.service";
import { DetailShopping } from "@/types/shopping.types";
import { SearchGlobal } from "@/types/global.types";

export default function ShooppingExportExcell({ params, transmitter }: { transmitter: ITransmitter, params: SearchGlobal }) {
    const { startDate, endDate } = params
    const styles = useGlobalStyles();
    const [loading_data, setLoadingData] = useState(false)
    const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');
    const fontColor = hexToARGB(styles.darkStyle.color);

    const handle = async () => {
        setLoadingData(true)
        try {
            const { data } = await get_report_shoppings({ branchId: 0, page: 0, limit: 0, startDate, endDate })


            if (data && data.ok) {
                await exportToExcel(data.detailsShopping)
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


    const exportToExcel = async (details: DetailShopping[]) => {

        if (!details || details.length === 0) {
            toast.error('No hay datos disponibles para exportar.');

            return;
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventario' ,{
           views: [{ state: "frozen", xSplit: 2 }],
        });

        const DATE = getElSalvadorDateTime().fecEmi
        const TIME = getElSalvadorDateTime().horEmi

        const extraInfo = [
            [`${transmitter.nombreComercial}`],
            [ `Fecha: ${DATE}-${TIME}`]
        ];

        extraInfo.forEach((row, index) => {
            const newRow = worksheet.addRow(row);

            newRow.font = { bold: index === 0 };
        });

        worksheet.addRow([]);

        const headers = ["Fecha", "Codigo", "Descripcióm producto", "Cantidad", 'Uni.Medida', 'Precio unidad', 'Procede de', '#', 'Concepto', '# Documento', 'Tipo Doc', 'Total Gravada']
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
            { width: 20 },
            { width: 11 },
            { width: 40 },
            { width: 11 },
            { width: 15 },
            { width: 20 },
            { width: 26 },
            { width: 7 },
            { width: 21 },
            { width: 16 },
            { width: 15 },
            { width: 20 }
        ];

        details.forEach((item) => {
            const row = worksheet.addRow([
                item.shopping.fecEmi,
                item.codigo,
                item.descripcion,
                Number(item.totalItem),
                formatUnidadDeMedida(item.uniMedida),
                Number(item.precioUni) || 0,
                item.shopping.supplier.nombre,
                1,
                'INGRESO A BODEGA',
                item.shopping.controlNumber,
                formatTipoDte(item.shopping.typeDte),
                Number(item.ventaGravada) || 0,
            ]);

            row.eachCell((cell, colNumber) => {
                const moneyColumns = [6, 9];

                if (moneyColumns.includes(colNumber))
                    cell.numFmt = '_($* #,##0.0000_);_($* (#,##0.0000);_($* "-"??_);_(@_)'
            })
        });

        worksheet.autoFilter = {
            from: { row: 4, column: 1 },
            to: { row: 4, column: worksheet.columns.length },
        };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = `Inventario_${DATE}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <ButtonUi
            isDisabled={loading_data}
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