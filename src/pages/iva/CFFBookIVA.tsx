import { Button, Select, SelectItem } from '@heroui/react';
import { useEffect, useState } from 'react';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import saveAs from 'file-saver';

import { export_excel_facturacion_ccfe } from '../excel/generate_excel';

import FacturacionCcfeItem from './CCFE/FacturacionCcfe';
import CcfeFilters from './CCFE/ccfe-filters';

import useGlobalStyles from '@/components/global/global.styles';
import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useSalesStore } from '@/store/sales.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { months } from '@/utils/constants';
import { useViewsStore } from '@/store/views.store';
import DivGlobal from '@/themes/ui/div-global';

function CFFBookIVA() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const [branchId, setBranchId] = useState(0);
  const [branchName, setBranchName] = useState('');
  const { transmitter, gettransmitter } = useTransmitterStore();
  const { branch_list, getBranchesList } = useBranchesStore();

  const [year, setYear] = useState<string>(new Date().getFullYear().toString())

  useEffect(() => {
    gettransmitter();
    getBranchesList();
  }, []);

  const { getCffMonth, creditos_by_month, factura_totals } =
    useSalesStore();

  useEffect(() => {
    getCffMonth(
      branchId,
      monthSelected > 9 ? `${monthSelected}` : `0${monthSelected}`,
      Number(year)
    );
  }, [monthSelected, branchId, year]);

  const styles = useGlobalStyles();

  const handleExportExcel = async () => {

    const items = [
      {
        name: `CRÉDITOS FISCALES ELECTRÓNICOS`,
        sales: creditos_by_month.map((cre, index) => [
          index + 1,
          cre.fecEmi,
          cre.codigoGeneracion,
          cre.numeroControl,
          cre.selloRecibido,
          cre.customer.nrc !== '0' ? cre.customer.nrc : '',
          cre.customer.nombre,
          Number(cre.totalExenta),
          Number(cre.totalGravada),
          Number(cre.totalIva),
          0,
          0,
          0,
          Number(cre.montoTotalOperacion),
        ]),
        totals: {
          exenta: factura_totals.sales_exentas + factura_totals.sales_no_sujetas,
          gravada: factura_totals.sales_gravadas / 1.13,
          iva: factura_totals.sales_gravadas - factura_totals.sales_gravadas / 1.13,
          retencion: 0,
          total: Number(
            factura_totals.sales_exentas +
            factura_totals.sales_gravadas +
            factura_totals.sales_no_sujetas
          ),
        },
      }
    ];

    const month = months.find((month) => month.value === monthSelected)?.name || '';

    const blob = await export_excel_facturacion_ccfe({
      items,
      month,
      transmitter,
      branch: branchName,
      yeatSelected: Number(year),
    });

    saveAs(blob, `Libro_Ventas_CCF_${month}.xlsx`);
  };

  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'IVA de CCF');
  const actionView = viewName?.actions.name || [];

  return (
    <Layout title="IVA - CFFE">
      <DivGlobal>
        <div className="w-full flex flex-col lg:flex-row gap-5">
          <div className='w-full'>
            <CcfeFilters
              monthSelected={monthSelected}
              setMonthSelected={setMonthSelected}
              setYear={setYear}
              year={year}
            />
          </div>
          <div className="w-full">
            <Select
              className="w-full"
              classNames={{ label: 'font-semibold' }}
              defaultSelectedKeys={`${branchId}`}
              label="Sucursal"
              labelPlacement="outside"
              placeholder="Selecciona la sucursal"
              variant="bordered"
              onSelectionChange={(key) => {
                if (key) {
                  const id = Number(new Set(key).values().next().value);

                  setBranchId(id);
                  const branch = branch_list.find((branch) => branch.id == id);

                  if (branch) setBranchName(branch.name);
                }
              }}
            >
              {branch_list.map((branch) => (
                <SelectItem key={branch.id}>{branch.name}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex justify-end items-end mt-3 md:mt-0">
            {actionView.includes('Exportar Excel') && (
              <Button
                className="text-white font-semibold"
                color="success"
                style={styles.thirdStyle}
                onPress={handleExportExcel}
              >
                Exportar a excel
                <PiMicrosoftExcelLogoBold size={25} />
              </Button>
            )}
            {/* <Button
                className="px-1O"
                endContent={<PiFilePdfDuotone size={20} />}
                onClick={() => makePdf("download")}
                color="danger"
              >
                Exportar a PDF
              </Button> */}
          </div>
        </div>
        <div className="overflow-y-auto">
          <div className="mt-4">
            <FacturacionCcfeItem />
          </div>
        </div>
      </DivGlobal>
    </Layout>
  );
}

export default CFFBookIVA;
