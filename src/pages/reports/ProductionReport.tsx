import { Button, Input, Select, SelectItem } from '@heroui/react';
import { useEffect, useState } from 'react';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
// import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

import logo from '../../assets/dulce.webp';

import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useViewsStore } from '@/store/views.store';
import DivGlobal from '@/themes/ui/div-global';
import { formatDate } from '@/utils/dates';
import { Branches } from '@/types/branches.types';
import { useProductionReport } from '@/store/reports/production_report_store';
import { TableComponent } from '@/themes/ui/table-ui';
import LoadingTable from '@/components/global/LoadingTable';
import EmptyTable from '@/components/global/EmptyTable';
import useGlobalStyles from '@/components/global/global.styles';

const ProductionReport = () => {
  const { actions } = useViewsStore();
  const branchView = actions.find((view) => view.view.name === 'Reporte de produccion');
  const actionsView = branchView?.actions?.name || [];

  const [branch, setBranch] = useState<Branches | undefined>();
  const [date, setDate] = useState(formatDate());
  const { branch_list, getBranchesList } = useBranchesStore();
  const { dataReport, loading, getProductioReport } = useProductionReport();

  useEffect(() => {
    getBranchesList();
  }, []);

  useEffect(() => {
    getProductioReport(branch?.id ?? 0, date);
  }, [branch, date, branch?.id]);

  const handleExportExcel = async () => {
    if (!dataReport || dataReport.length === 0 || !branch) return;

    try {
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte Producción');

      // --- ESTILOS ---
      // Estilo para el título principal
      const titleStyle = {
        font: { bold: true, size: 16, color: { argb: 'FF000000' } },
        alignment: { horizontal: 'center' as const, vertical: 'middle' as const },
      };

      // Estilo para los subtítulos
      const subtitleStyle = {
        font: { bold: true, size: 14, color: { argb: 'FF000000' } },
        alignment: { horizontal: 'center' as const, vertical: 'middle' as const },
      };

      // Estilo para labels (SUCURSAL, FECHA, etc.)
      const labelStyle = {
        font: { bold: true, size: 11 },
        alignment: { vertical: 'middle' as const },
      };

      // Estilo para los encabezados de la tabla
      const headerStyle = {
        font: { bold: true, size: 11, color: { argb: 'FF000000' } },
        fill: {
          type: 'pattern' as const,
          pattern: 'solid' as const,
          fgColor: { argb: 'FFD3D3D3' },
        },
        border: {
          top: { style: 'thin' as ExcelJS.BorderStyle },
          left: { style: 'thin' as ExcelJS.BorderStyle },
          bottom: { style: 'thin' as ExcelJS.BorderStyle },
          right: { style: 'thin' as ExcelJS.BorderStyle },
        },
        alignment: { horizontal: 'center' as const, vertical: 'middle' as const },
      };

      // Estilo para las celdas de datos
      const cellStyle = {
        border: {
          top: { style: 'thin' as ExcelJS.BorderStyle },
          left: { style: 'thin' as ExcelJS.BorderStyle },
          bottom: { style: 'thin' as ExcelJS.BorderStyle },
          right: { style: 'thin' as ExcelJS.BorderStyle },
        },
        alignment: { vertical: 'middle' as const },
      };

      // Estilo para números (cantidad)
      const numberStyle = {
        ...cellStyle,
        alignment: { horizontal: 'center' as const, vertical: 'middle' as const },
        numFmt: '#,##0', // Formato de número con separador de miles
      };

      let currentRow = 1;

      // Agregar logo si existe
      if (typeof logo === 'string') {
        try {
          const response = await fetch(logo);
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();

          const imageId = workbook.addImage({
            buffer: arrayBuffer,
            extension: 'png',
          });

          // Insertar la imagen específicamente en la celda A1
          worksheet.addImage(imageId, {
            tl: { col: 0, row: 0 }, // Top-left: columna A (0), fila 1 (0)
            ext: { width: 80, height: 80 }, // Tamaño de la imagen en píxeles
            editAs: 'oneCell', // La imagen se comporta como parte de la celda A1
          });

          // Ajustar el tamaño de la celda A1 para acomodar la imagen
          worksheet.getColumn('A').width = 15;
          worksheet.getRow(1).height = 60; // Altura suficiente para la imagen

          currentRow = 2; // Empezar desde la fila 2
        } catch (error) {
          toast.error("Error al cargar el logo ");
          currentRow = 1; // Si falla, empezar desde arriba
        }
      }

      // Título principal
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      const titleCell = worksheet.getCell(`A${currentRow}`);

      titleCell.value = 'PASTELERIA DULCETENTACION';
      titleCell.style = titleStyle;
      worksheet.getRow(currentRow).height = 25;
      currentRow++;

      // Subtítulo (REPORTE DE PRODUCCION)
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      const subtitleCell = worksheet.getCell(`A${currentRow}`);

      subtitleCell.value = 'REPORTE DE PRODUCCION';
      subtitleCell.style = subtitleStyle;
      worksheet.getRow(currentRow).height = 20;
      currentRow++;

      // Línea divisoria
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };
      currentRow++;

      // SUCURSAL
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      const branchCell = worksheet.getCell(`A${currentRow}`);

      branchCell.value = 'SUCURSAL';
      branchCell.value = `${branch.name}`;
      branchCell.style = subtitleStyle;
      currentRow++;

      // Número de producción
      // worksheet.getCell(`A${currentRow}`).value = 'Produccion #';
      worksheet.getCell(`A${currentRow}`).style = labelStyle;
      // worksheet.getCell(`B${currentRow}`).value = '7669';
      currentRow++;

      // Línea divisoria
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };
      currentRow++;

      // Fecha y hora
      worksheet.getCell(`A${currentRow}`).value = 'FECHA:';
      worksheet.getCell(`A${currentRow}`).style = labelStyle;
      worksheet.getCell(`B${currentRow}`).value = new Date().toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      currentRow++;

      // Línea divisoria
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };
      currentRow++;

      // Encabezados de la tabla
      worksheet.getCell(`A${currentRow}`).value = 'Detalles';
      worksheet.getCell(`B${currentRow}`).value = 'UNIDAD';
      worksheet.getCell(`C${currentRow}`).value = 'Cant.';

      // Aplicar estilo a los encabezados
      ['A', 'B', 'C'].forEach((col) => {
        worksheet.getCell(`${col}${currentRow}`).style = headerStyle;
      });
      worksheet.getRow(currentRow).height = 20;
      currentRow++;

      // Datos de la tabla
      dataReport.forEach((item) => {
        worksheet.getCell(`A${currentRow}`).value = item.detalle;
        worksheet.getCell(`B${currentRow}`).value = item.unidad;
        worksheet.getCell(`C${currentRow}`).value = item.cantidad;

        // Aplicar estilos
        worksheet.getCell(`A${currentRow}`).style = cellStyle;
        worksheet.getCell(`B${currentRow}`).style = cellStyle;
        worksheet.getCell(`C${currentRow}`).style = numberStyle;

        worksheet.getRow(currentRow).height = 18;
        currentRow++;
      });

      // Ajustar ancho de columnas
      worksheet.columns = [
        { width: 35 }, // Detalles - más ancho para mejor lectura
        { width: 18 }, // UNIDAD
        { width: 12 }, // Cant.
      ];

      // Generar nombre de archivo más descriptivo
      const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const filename = `reporte-produccion-${branch.name}-${timestamp}.xlsx`;

      // Generar el archivo Excel
      const buffer = await workbook.xlsx.writeBuffer();

      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), filename);

      toast.success("Reporte exportado exitosamente");
    } catch (error) {
      toast.error("Error al exportar el reporte");
    }
  };

  const styles = useGlobalStyles();

  return (
    <Layout title="Reporte de produccion">
      <DivGlobal>
        <div className="flex gap-4">
          <Select
            classNames={{
              label: 'text-sm font-semibold dark:text-white',
            }}
            label="Sucursal"
            labelPlacement="outside"
            placeholder="Selecciona la sucursal"
            variant="bordered"
            onSelectionChange={(key) => {
              if (key) {
                const branchId = Number(new Set(key).values().next().value);
                const selectedBranch = branch_list.find((item) => item.id === branchId);

                setBranch(selectedBranch);
              } else {
                setBranch(undefined);
              }
            }}
          >
            {branch_list.map((item) => (
              <SelectItem key={item.id}>{item.name}</SelectItem>
            ))}
          </Select>
          <Input
            className="z-0"
            classNames={{
              input: 'dark:text-white dark:border-gray-600',
              label: 'text-sm font-semibold dark:text-white',
            }}
            label="Fecha"
            labelPlacement="outside"
            placeholder="Buscar por nombre..."
            type="date"
            value={date}
            variant="bordered"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <div>
            {actionsView.includes('Exportar Excel') && (
              <Button
                className="text-white font-semibold"
                color="success"
                style={styles.warningStyles}
                onPress={handleExportExcel}
              >
                Exportar a excel
                <PiMicrosoftExcelLogoBold size={25} />
              </Button>
            )}
          </div>
          <TableComponent headers={['Nº', 'Detalle', 'Unidad', 'Cantidad']}>
            {loading ? (
              <tr>
                <td className="p-3 text-sm text-slate-500" colSpan={4}>
                  <LoadingTable />
                </td>
              </tr>
            ) : (
              <>
                {dataReport.length > 0 ? (
                  <>
                    {dataReport.map((item, index) => (
                      <tr key={index}>
                        <td className="p-3 text-sm">{index + 1}</td>
                        <td className="p-3 text-sm">{item.detalle}</td>
                        <td className="p-3 text-sm">{item.unidad}</td>
                        <td className="p-3 text-sm">{item.cantidad}</td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <EmptyTable />
                    </td>
                  </tr>
                )}
              </>
            )}
          </TableComponent>
        </div>
      </DivGlobal>
    </Layout>
  );
};

export default ProductionReport;
