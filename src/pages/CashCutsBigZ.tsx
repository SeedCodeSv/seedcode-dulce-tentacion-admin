import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, AutocompleteItem, Input } from '@heroui/react';
import { saveAs } from 'file-saver';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { IoPrintSharp } from 'react-icons/io5';
import { toast } from 'sonner';

import { DataBox } from '../types/cashCuts.types';
import { useBranchesStore } from '../store/branches.store';
import { getElSalvadorDateTime } from '../utils/dates';
import { formatCurrency } from '../utils/dte';

import { useViewsStore } from '@/store/views.store';
import DivGlobal from '@/themes/ui/div-global';
import CashCutComponent from '@/components/cash-cuts/CashCutComponent';
import { Branches } from '@/types/branches.types';
import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';
import { exportToExcel } from '@/components/cash-cuts/CashCutsExcellExport';
import { useTransmitterStore } from '@/store/transmitter.store';
import { useCutReportStore } from '@/store/reports/cashCuts.store';
import { hexToARGB } from '@/utils/utils';
import useGlobalStyles from '@/components/global/global.styles';
import { ResponsiveFilterWrapper } from '@/components/global/ResposiveFilters';

const CushCatsBigZ = () => {
  const { actions } = useViewsStore();
  const { transmitter, gettransmitter } = useTransmitterStore();
  const [selectedBranch, setSelectedBranch] = useState<Branches>();
  const bigz = actions.find((view) => view.view.name === 'Corte Gran Z');
  const actionsView = bigz?.actions?.name || [];
  const { onGetDataBox, dataBox } = useCutReportStore();
  const [selectedBox, setSelectedBox] = useState<DataBox | null>();
  const styles = useGlobalStyles();

  const fillColor = hexToARGB(styles.dangerStyles.backgroundColor || '#4CAF50');
  const fontColor = hexToARGB(styles.darkStyle.color);

  const [params, setParams] = useState({
    date: getElSalvadorDateTime().fecEmi,
    branch: {} as Branches,
    dateEnd: getElSalvadorDateTime().fecEmi,
  });

  const calcTotal = (...numbers: number[]) => {
    return numbers.reduce((acc, num) => acc + Number(num ?? 0), 0);
  };

  const totalGeneral = useMemo(() => {
    const total =
      calcTotal(selectedBox?.totalSales01Card ?? 0, selectedBox?.totalSales03Card ?? 0) +
      calcTotal(selectedBox?.totalSales01Cash ?? 0, selectedBox?.totalSales03Cash ?? 0);

    return total ?? 0;
  }, [selectedBox]);

  const { getBranchesList, branch_list } = useBranchesStore();

  useEffect(() => {
    getBranchesList();
    gettransmitter();
  }, []);

  const printBigZ = () => {
    if (!selectedBranch) {
      toast.warning('Debes seleccionar una sucursal');

      return;
    }

    const iframe = document.createElement('iframe');

    iframe.style.height = '0';
    iframe.style.visibility = 'hidden';
    iframe.style.width = '0';
    iframe.setAttribute('srcdoc', '<html><body></body></html>');
    document.body.appendChild(iframe);
    iframe.contentWindow?.addEventListener('afterprint', () => {
      iframe.parentNode?.removeChild(iframe);
    });
    iframe.addEventListener('load', () => {
      const body = iframe.contentDocument?.body;

      if (!body) return;
      const style = document.createElement('style');

      style.innerHTML = `
          @page {
              margin: 0;
          }
          body {
              -webkit-print-color-adjust: exact;
              margin: 0;
          }
      `;
      iframe.contentDocument?.head.appendChild(style);
      body.style.textAlign = 'center';
      body.style.fontFamily = 'Arial, sans-serif';
      body.style.textAlign = 'center';
      const otherParent = document.createElement('div');

      otherParent.style.display = 'flex';
      otherParent.style.justifyContent = 'center';
      otherParent.style.alignItems = 'center';
      otherParent.style.width = '200%';
      otherParent.style.height = '200%';
      otherParent.style.padding = '5px';

      body.appendChild(otherParent);
      body.style.fontFamily = 'Arial, sans-serif';
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();
      const Am = now.getHours() < 12 ? 'AM' : 'PM';
      const customContent = `
      <div style="text-align: center; font-family: sans-serif; margin-left: 60px; margin-right: 60px;">
          <div>
            <div><strong>${transmitter.nombreComercial}</strong></div>
            <div>Sucursal: ${selectedBranch?.name ?? ''}</div>
            <div>Dirección: ${selectedBranch?.address ?? ''}</div>
            <div>Actividad Económica: ${transmitter?.descActividad ?? ''}</div>
            <div>Fecha: ${date} - ${time} ${Am}</div>
          </div>
      
          <br />
              <div style="border-top: 1px dashed black; border-bottom: 1px dashed black; height: 0.25rem; margin-top: 0.75rem; margin-bottom: 0.75rem; width: 100%;"></div>
         <table style="width: 100%; font-family: sans-serif;">
        <tbody>
          <tr>
            <td colspan="3" style="text-align: center; font-weight: bold;">
              FORMAS DE PAGO
            </td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: center; width: 100%;">
            <div style="border-top: 1px dashed black; border-bottom: 1px dashed black; height: 0.25rem; margin-top: 0.75rem; margin-bottom: 0.75rem; width: 100%;"></div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: left;">TOTAL TARJETA</td>
            <td style="text-align: right;">${formatCurrency(0)}</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: left;">TOTAL EFECTIVO</td>
            <td style="text-align: right;">${formatCurrency(0)}</td>
          </tr>
          <tr>
           <td colspan="3" style="text-align: center;">
              <div style=" border-top: 1.5px dashed black;  height: 1px;  width: 100%; margin-top: 10px; margin-bottom: 10px"></div>
           </td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: left;">SUB TOTAL GENERAL</td>
            <td style="text-align: right;">${formatCurrency(0)}</td>
          </tr>
           <tr>
            <td colspan="3" style="text-align: center; width: 100%;">
              <div style="border-top: 1px dashed black; border-bottom: 1px dashed black; height: 0.75rem; margin-top: 0.75rem; margin-bottom: 0.75rem; width: 100%;"></div>
            </td>
          </tr>
        </tbody>
      </table>
          <div>
          <br />
            <strong style="text-align: center; margin: 10px">DETALLE DE VENTAS</strong><br />
            <div style=" border-top: 1px dashed black;  height: 1px;  width: 100%; margin-top: 10px; "></div>
       <br />
            <strong style="text-align: center; margin: 10px">FACTURA CONSUMIDOR FIINAL</strong><br />
        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
          <span>N. INICIAL:</span>
          <span>${selectedBox?.firtsSale}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>N. FINAL:</span>
        <span>${selectedBox?.lastSale}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>GRAVADAS:</span>
        <span> ${formatCurrency(
        Number(selectedBox?.totalSales01Card ?? 0) + Number(selectedBox?.totalSales01Cash ?? 0)
      )}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>EXENTAS:</span>
        <span>  $0.00</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>NO SUJETAS:</span>
        <span>  $0.00</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span><strong>TOTAL:</strong></span>
        <span><strong>  ${formatCurrency(
        Number(selectedBox?.totalSales01Card ?? 0) + Number(selectedBox?.totalSales01Cash ?? 0)
      )}</strong></span>
      </div>
          </div>
            <div style=" border-top: 1px dashed black;  height: 1px;  width: 100%; margin-top: 10px; "></div>
           <br />
          <div>
            <strong>COMPROBANTE DE CRÉDITO FISCAL</strong><br />
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
          <span>N. INICIAL:</span>
          <span>${selectedBox?.firtsSale03}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>N. FINAL:</span>
        <span>${selectedBox?.lastSale03}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>GRAVADAS:</span>
        <span> ${formatCurrency(
        Number(selectedBox?.totalSales03Card ?? 0) + Number(selectedBox?.totalSales03Cash ?? 0)
      )}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>EXENTAS:</span>
        <span>  $0.00</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>NO SUJETAS:</span>
        <span>  $0.00</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span><strong>TOTAL:</strong></span>
        <span><strong>  ${formatCurrency(
        Number(selectedBox?.totalSales03Card ?? 0) + Number(selectedBox?.totalSales03Cash ?? 0)
      )}</strong></span>
      </div>
          </div>
            <div style=" border-top: 1px dashed black;  height: 1px;  width: 100%; margin-top: 10px; "></div>
             <br />
          <div>
            <strong>TOTAL GENERAL</strong><br />
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>GRAVADAS:</span>
        <span> ${formatCurrency(totalGeneral / 1.13)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>SUB_TOTAL</span>
        <span>   ${formatCurrency(totalGeneral)}</span>
      </div>
          <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>EXENTAS:</span>
        <span>  $0.00</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>NO SUJETAS:</span>
        <span>  $0.00</span>
      </div>
           <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span><strong>TOTAL:</strong></span>
        <span><strong>  ${formatCurrency(totalGeneral)}</strong></span>
      </div>
          </div>
        </div>
      `;
      const div = document.createElement('div');

      div.innerHTML = customContent;
      body.appendChild(div);

      iframe.contentWindow?.print();
    });
  };

  const exportDataToExcel = async () => {
    if (!selectedBranch) {
      toast.warning('Debes seleccionar una sucursal');

      return;
    }

    const blob = await exportToExcel({
      branch: selectedBranch,
      params: { date: params.date },
      data: selectedBox!,
      totalGeneral,
      transmitter,
      bgHeader: fillColor,
      fontColor: fontColor,
    });

    saveAs(blob, `Corte_bigZ_${selectedBranch?.name ?? ''}_${Date.now()}.xlsx`);
  };

  useEffect(() => {
    if (dataBox.length > 0) {
      setSelectedBox(dataBox[0]);
    }
  }, [dataBox]);

  const handleSearch = async () => {
    if (!params.branch.id) {
      toast.warning('Selecciona una sucursal');

      return;
    }
    setSelectedBranch(params.branch);
    onGetDataBox(params.branch.id ?? 0, params.date);
  };

  return (
    <>
      <DivGlobal className="flex flex-col items-center w-full p-4 mt-4">
        <div className="flex w-full items-end max-w-4xl gap-4">
          {/* <Input
              className="mt-4"
              defaultValue={fechaActualString}
              label="Fecha Inicio"
              labelPlacement="outside"
              type="date"
              variant="bordered"
              onChange={(e) => setParams({ ...params, date: e.target.value })}
            />
            <Input
              className="mt-4"
              defaultValue={fechaActualString}
              label="Fecha Final"
              labelPlacement="outside"
              type="date"
              variant="bordered"
              onChange={(e) => setParams({ ...params, dateEnd: e.target.value })}
            /> */}
          <ResponsiveFilterWrapper
            onApply={() => {
              handleSearch()
            }}
          >
            <Input
              className="dark:text-white"
              classNames={{ base: 'font-semibold' }}
              label="Fecha"
              labelPlacement="outside"
              type="date"
              value={params.date}
              variant="bordered"
              onChange={(e) => {
                setParams({ ...params, date: e.target.value });
              }}
            />
            <Autocomplete
              label="Sucursal"
              labelPlacement="outside"
              placeholder="Selecciona la sucursal"
              variant="bordered"
            >
              {branch_list.map((item) => (
                <AutocompleteItem
                  key={item.id}
                  onPress={() => {
                    setParams({ ...params, branch: item });
                  }}
                >
                  {item.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            {/* <ButtonUi theme={Colors.Info} onPress={handleSearch}>
              Buscar
            </ButtonUi> */}
          </ResponsiveFilterWrapper>

        </div>

        <CashCutComponent
          branch={selectedBranch}
          buttons={
            <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4 w-full">
              {actionsView.includes('Exportar Excel') && (
                <ButtonUi
                  className="w-full"
                  startContent={<PiMicrosoftExcelLogoBold size={25} />}
                  theme={Colors.Success}
                  onPress={exportDataToExcel}
                >
                  <p> Exportar a excel</p>{' '}
                </ButtonUi>
              )}
              {actionsView.includes('Imprimir') && (
                <ButtonUi
                  className="w-full"
                  startContent={<IoPrintSharp size={25} />}
                  theme={Colors.Secondary}
                  onPress={() => printBigZ()}
                >
                  Imprimir y cerrar
                </ButtonUi>
              )}
            </div>
          }
          cutType="Corte Big Z"
          data={selectedBox!}
          params={{ date: params.date }}
          totalGeneral={totalGeneral}
        />
      </DivGlobal>
    </>
  );
};

export default CushCatsBigZ;
