import { Button, Input } from '@heroui/react';
import { useEffect, useState } from 'react';
import { MdPictureAsPdf } from 'react-icons/md';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';

import EmptyTable from '@/components/global/EmptyTable';
import useGlobalStyles from '@/components/global/global.styles';
import LoadingTable from '@/components/global/LoadingTable';
import { useShippingStore } from '@/store/reports/shipping_report_store';
import { useViewsStore } from '@/store/views.store';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';
import { formatDate } from '@/utils/dates';
import { exportToExcel } from './exportExcell';

const ShippingReport = () => {
  const { actions } = useViewsStore();
  const branchView = actions.find((view) => view.view.name === 'Reporte de envios');
  const actionsView = branchView?.actions?.name || [];

  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const { dataReport, loading, getShippingReport } = useShippingStore();

  useEffect(() => {
    getShippingReport(startDate, endDate);
  }, [startDate, endDate]);

  const styles = useGlobalStyles();

  return (
    <DivGlobal>
      <div className="flex gap-4">
        <Input
          className="z-0"
          classNames={{
            input: 'dark:text-white dark:border-gray-600',
            label: 'text-sm font-semibold dark:text-white',
          }}
          label="Fecha Inicial"
          labelPlacement="outside"
          placeholder="Buscar por nombre..."
          type="date"
          value={startDate}
          variant="bordered"
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          className="z-0"
          classNames={{
            input: 'dark:text-white dark:border-gray-600',
            label: 'text-sm font-semibold dark:text-white',
          }}
          label="Fecha Final"
          labelPlacement="outside"
          placeholder="Buscar por nombre..."
          type="date"
          value={endDate}
          variant="bordered"
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="mt-5">
        <div className="flex gap-5">
          {actionsView.includes('Exportar Excel') && (
            <Button
              className="text-white font-semibold"
              color="success"
              style={styles.warningStyles}
              onPress={() => exportToExcel(dataReport, startDate, endDate)}
            >
              Exportar a excel
              <PiMicrosoftExcelLogoBold size={25} />
            </Button>
          )}
          {actionsView.includes('Exportar PDF') && (
            <Button
              className="text-white font-semibold"
              color="success"
              style={styles.dangerStyles}
              // onPress={() => exportPdf(dataReport, branch, date)}
            >
              Exportar a pdf
              <MdPictureAsPdf size={25} />
            </Button>
          )}
        </div>
        <TableComponent
          headers={[
            'Nº',
            'PRODUCTO',
            'PRODUCCCIN',
            'SUCURSAL-CENTRO',
            'SUCURSAL-ISS',
            'SUCURSAL-SONZACATE',
            'SUCURSAL-NAHUIZALCO',
            'ADMINISTRACION',
            'PRODUCTO TERMINADO',
            'BODEGA DE MATERIA PRIMA',
          ]}
        >
          {loading ? (
            <tr>
              <td className="p-3 text-sm text-slate-500" colSpan={10}>
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
                      <td className="p-3 text-sm">{item.producto}</td>
                      <td className="p-3 text-sm">{item.produccion}</td>
                      <td className="p-3 text-sm">{item['SUCURSAL-CENTRO']}</td>
                      <td className="p-3 text-sm">{item['SUCURSAL-ISSS']}</td>
                      <td className="p-3 text-sm">{item['SUCURSAL-SONZACATE']}</td>
                      <td className="p-3 text-sm">{item['SUCURSAL-NAHUIZALCO']}</td>
                      <td className="p-3 text-sm">{item.ADMINISTRACION}</td>
                      <td className="p-3 text-sm">{item['PRODUCTO TERMINADO']}</td>
                      <td className="p-3 text-sm">{item['BODEGA DE MATERIA PRIMA']}</td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan={10}>
                    <EmptyTable />
                  </td>
                </tr>
              )}
            </>
          )}
        </TableComponent>
      </div>
    </DivGlobal>
  );
};

export default ShippingReport;
