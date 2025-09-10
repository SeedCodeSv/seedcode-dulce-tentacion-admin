import * as ExcelJS from 'exceljs';
import { toast } from 'sonner';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { PiMicrosoftExcelLogo } from 'react-icons/pi';

import { IReportKardexByProduct, TypeOfMovements } from '@/types/reports/reportKardex.types';
import { formatSimpleDate, getElSalvadorDateTime, getElSalvadorDateTimeText } from '@/utils/dates';
import { useAuthStore } from '@/store/auth.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors, Styles } from '@/types/themes.types';
import { hexToARGB } from '@/utils/utils';
import useGlobalStyles from '@/components/global/global.styles';
import { useReportKardex } from '@/store/reports/reportKardex.store';
import { SearchReport } from '@/types/reports/productsSelled.report.types';


export const DownloadKardexProductExcelButton = ({ search, branchName }: {
  search: SearchReport, branchName: string
}) => {
  const { user } = useAuthStore();
  const styles = useGlobalStyles();
  const { transmitter, getTransmitter } = useTransmitterStore();
  const date = moment().tz('America/El_Salvador').format('YYYY-MM-DD');
  const [loading_data, setLoadingData] = useState(false)
  const { getReportKardexByProductExport, paginationKardexProduct, KardexProduct } = useReportKardex();

  const handle = async () => {
    setLoadingData(true)
    const res = await getReportKardexByProductExport({ ...search, limit: paginationKardexProduct.total })

    if (res) {
      await handleDownloadSelectedProductExcel(res.KardexProduct)
      setLoadingData(false)
    }
  }

  const handleDownloadSelectedProductExcel = async (KardexByProduct: IReportKardexByProduct) => {

    try {
      if (!KardexByProduct.movements || KardexByProduct.movements.length === 0) {
        toast.error('No hay datos disponibles para generar el Excel.');

        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Kardex');

      const headers = [
        'No.',
        'Fecha',
        'Descripción',
        'Stock Inicial',
        'Entrada',
        'Salida',
        'Stock Final',
        'Costo Unitario',
        'Total Movimiento',
      ];

      addHeader(worksheet, transmitter?.nombreComercial ?? '', search, branchName);

      const totalEntries = KardexByProduct.totalEntradas

      const totalExits = KardexByProduct.totalSalidas

      const rows = KardexByProduct.movements.map((item, index) => [
        index + 1,
        formatSimpleDate(`${item.date}|${item.time}`),
        item.typeOfInventory || '',
        item.initialStock || 0,
        item.typeOfMovement === TypeOfMovements.Entries ? Number(item.quantity) : 0,
        item.typeOfMovement === TypeOfMovements.Exits ? Number(item.quantity) : 0,
        item.finalStock || 0,
        `$ ${Number(item.branchProduct.costoUnitario ?? 0).toFixed(2)}`,
        `$ ${Number(item.totalMovement ?? 0).toFixed(2)}`,
      ]);

      const productName = KardexByProduct.productName

      addBody(styles, worksheet, headers, rows, { totalEntries, totalExits, productName });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `REPORTE_KARDEX_${productName.replace(/ /g, '-')}_${date}.xlsx`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Ocurrió un error al descargar el Excel.');
    }
  };

  useEffect(() => {
    getTransmitter(user?.transmitterId ?? 0);
  }, [user?.transmitterId]);

  return (
    <>
      <ButtonUi
        isDisabled={loading_data || KardexProduct.length === 0}
        startContent={<PiMicrosoftExcelLogo className="" size={25} />}
        theme={Colors.Success}
        onPress={handle}
      >
        <p className="font-medium hidden lg:flex"> Exportar a excel</p>
      </ButtonUi>
    </>
  );
};

function addBody(styles: Styles, worksheet: ExcelJS.Worksheet, headers: string[], data: (string | number)[][],
  { totalEntries, totalExits, productName }: { totalEntries: number, totalExits: number, productName: string }) {

  const fontColor = hexToARGB(styles.darkStyle.color);
  const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');

  worksheet.addRow(['Producto:', productName]);
  worksheet.addRow([`Total de entradas: ${totalEntries}`]);
  worksheet.addRow([`Total de salidas: ${totalExits}`]);
  worksheet.addRow([]);

  const tableStartRow = worksheet.rowCount + 1;
  const startCell = `A${tableStartRow}`;

  worksheet.addTable({
    columns: headers.map(header => ({ name: header })),
    rows: data,
    name: 'Table1',
    ref: startCell,
    headerRow: true,
    totalsRow: false,
  });

  const headerRow = worksheet.getRow(tableStartRow);

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

  // Formatear las columnas
  worksheet.getColumn(1).width = 10; // "No."
  worksheet.getColumn(2).width = 25; // "Fecha"
  worksheet.getColumn(3).width = 25; // "Descripción"
  worksheet.getColumn(6).width = 13; // "Precio"
  worksheet.getColumn(7).width = 18; // "Costo promedio"
}

function addHeader(worksheet: ExcelJS.Worksheet,
  commercialName: string,
  search: SearchReport,
  branchName: string
) {

  worksheet.mergeCells('A1:H1');
  worksheet.getCell('A1').value = 'Kardex por Producto';
  worksheet.getCell('A1').font = { bold: true, size: 12 };
  worksheet.getCell('A1').alignment = { horizontal: 'left' };

  worksheet.mergeCells('A2:H2');
  worksheet.getCell('A2').value = commercialName;
  worksheet.getCell('A2').font = { bold: true, size: 14 };
  worksheet.getCell('A2').alignment = { horizontal: 'center' };

  worksheet.mergeCells('A3:H3');
  worksheet.getCell('A3').value = `Sucursal: ${branchName}`;
  worksheet.getCell('A3').font = { bold: true, size: 14 };
  worksheet.getCell('A3').alignment = { horizontal: 'center' };

  worksheet.mergeCells('A4:H4');
  worksheet.getCell('A4').value = `Fecha: ${getElSalvadorDateTimeText().fecEmi} - ${getElSalvadorDateTime().horEmi}`;
  worksheet.getCell('A4').font = { bold: true, size: 13 };
  worksheet.getCell('A4').alignment = { horizontal: 'center' };

  worksheet.mergeCells('A5:H5');
  worksheet.getCell('A5').value = `Reporte desde ${search.startDate} hasta ${search.endDate}`;
  worksheet.getCell('A5').font = { bold: true, size: 13 };
  worksheet.getCell('A5').alignment = { horizontal: 'center' };

  worksheet.addRow([]);
}