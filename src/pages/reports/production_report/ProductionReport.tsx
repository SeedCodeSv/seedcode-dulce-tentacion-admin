import { Button, Input, Select, SelectItem } from '@heroui/react';
import { MdPictureAsPdf } from 'react-icons/md';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { useEffect, useState } from 'react';

import { handleExportExcel } from './exportExcel';
import { exportPdf } from './exportPdf';

import { useBranchesStore } from '@/store/branches.store';
import { useViewsStore } from '@/store/views.store';
import DivGlobal from '@/themes/ui/div-global';
import { formatDate } from '@/utils/dates';
import { Branches } from '@/types/branches.types';
import { useProductionReport } from '@/store/reports/production_report_store';
import { TableComponent } from '@/themes/ui/table-ui';
import LoadingTable from '@/components/global/LoadingTable';
import EmptyTable from '@/components/global/EmptyTable';
import useGlobalStyles from '@/components/global/global.styles';;

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

  const styles = useGlobalStyles();

  return (
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
        <div className="flex gap-5">
          {actionsView.includes('Exportar Excel') && (
            <Button
              className="text-white font-semibold"
              color="success"
              isDisabled={dataReport.length === 0}
              style={styles.warningStyles}
              onPress={() => handleExportExcel(dataReport, branch, date)}
            >
              Exportar a excel
              <PiMicrosoftExcelLogoBold size={25} />
            </Button>
          )}
          {actionsView.includes('Exportar PDF') && (
            <Button
              className="text-white font-semibold"
              color="success"
              isDisabled={dataReport.length === 0}
              style={styles.dangerStyles}
              onPress={() => exportPdf(dataReport, branch, date)}
            >
              Exportar a pdf
              <MdPictureAsPdf size={25} />
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
  );
};

export default ProductionReport;
