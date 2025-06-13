import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { saveAs } from 'file-saver';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { IoPrintSharp } from 'react-icons/io5';
import { toast } from 'sonner';

import { ZCashCutsResponse } from '../types/cashCuts.types';
import { get_cashCuts } from '../services/facturation/cashCuts.service';
import { useBranchesStore } from '../store/branches.store';
import { fechaActualString } from '../utils/dates';
import { formatCurrency } from '../utils/dte';
import { Correlatives } from '../types/correlatives.types';
import { get_correlatives } from '../services/correlatives.service';

import Layout from '@/layout/Layout';
import { useViewsStore } from '@/store/views.store';
import DivGlobal from '@/themes/ui/div-global';
import CashCutComponent from '@/components/cash-cuts/CashCutComponent';
import { Branches } from '@/types/branches.types';
import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';
import { exportToExcel } from '@/components/cash-cuts/CashCutsExcellExport';
import { useTransmitterStore } from '@/store/transmitter.store';

const CushCatsBigZ = () => {
  const { actions } = useViewsStore();

  const bigZ = actions.find((view) => view.view.name === 'Corte Gran Z');
  const [branch, setBranch] = useState<Branches>()
  const { transmitter, gettransmitter } = useTransmitterStore();

  const actionsView = bigZ?.actions?.name || [];
  const [data, setData] = useState<ZCashCutsResponse | null>(null);
  const [dateInitial, setInitial] = useState(fechaActualString);
  const [dateEnd, setEnd] = useState(fechaActualString);
  const [branchId, setBranchId] = useState(0);
  const [codeSale, setCodeSale] = useState<Correlatives[]>([]);
  const [codeSelected, setCodeSelected] = useState('');

  useEffect(() => {
    const getIdBranch = async () => {
      try {
        const response = await get_cashCuts(branchId, dateInitial, dateEnd, codeSelected);

        setData(response.data.data);
      } catch (error) {
        toast.error('Error al cargar los cortes de caja');
      }
      if (branchId > 0) {
        const data = await get_correlatives(branchId);

        setCodeSale(data.data.pointOfSales);
      }
    };

    getIdBranch();
  }, [dateInitial, dateEnd, branchId, codeSelected]);

  const { getBranchesList, branch_list } = useBranchesStore();

  useEffect(() => {
    gettransmitter()
    getBranchesList();
  }, []);

  const totalGeneral = useMemo(() => {
    const totalTicket = Number(data?.Ticket?.total ?? 0);
    const totalFactura = Number(data?.Factura?.total ?? 0);
    const totalCreditoFiscal = Number(data?.CreditoFiscal?.total ?? 0);
    const totalDevolucionNC = Number(data?.DevolucionNC?.total ?? 0);
    const totalDevolucionT = Number(data?.DevolucionT?.total ?? 0);

    return totalTicket + totalFactura + totalCreditoFiscal + totalDevolucionNC + totalDevolucionT;
  }, [data]);

  const printBigZ = () => {
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
      const otherParent = document.createElement('div');

      otherParent.style.display = 'flex';
      otherParent.style.justifyContent = 'center';
      otherParent.style.alignItems = 'center';
      otherParent.style.width = '200%';
      otherParent.style.height = '200%';
      otherParent.style.padding = '5px';

      body.appendChild(otherParent);
      body.style.fontFamily = 'Arial, sans-serif';

      const customContent = `
      <div style="text-align: center; font-family: sans-serif; margin-left: 60px; margin-right: 60px;">
          <div>
            <div><strong>${transmitter.nombreComercial}</strong></div>
            <div>Sucursal: ${branch?.name ?? ''}</div>
            <div>Dirección: ${branch?.address ?? ''}</div>
            <div>Actividad Económica: ${transmitter?.descActividad ?? ''}</div>
            <div>Fecha: ${dateInitial} - ${dateEnd}</div>
            <div>Punto de venta: ${codeSelected || 'GENERAL'}</div>
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
          <span>${data?.Factura?.inicio}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>N. FINAL:</span>
        <span>${data?.Factura?.fin}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>GRAVADAS:</span>
        <span> ${formatCurrency(Number(data?.Factura?.total))}</span>
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
        <span><strong>  ${formatCurrency(Number(data?.Factura?.total))}</strong></span>
      </div>
          </div>
            <div style=" border-top: 1px dashed black;  height: 1px;  width: 100%; margin-top: 10px; "></div>
           <br />
          <div>
            <strong>COMPROBANTE DE CRÉDITO FISCAL</strong><br />
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
          <span>N. INICIAL:</span>
          <span>${data?.CreditoFiscal?.inicio}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>N. FINAL:</span>
        <span>${data?.CreditoFiscal?.fin}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <span>GRAVADAS:</span>
        <span> ${formatCurrency(Number(data?.CreditoFiscal?.total))}</span>
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
        <span><strong>  ${formatCurrency(Number(data?.CreditoFiscal?.total))}</strong></span>
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
    if (!branch) {
      toast.warning("Debes seleccionar una sucursal")

      return
    }

    const blob = await exportToExcel({
      branch,
      params: { startDate: dateInitial, endDate: dateEnd, pointCode: codeSelected },
      data: data!,
      totalGeneral,
      transmitter
    })

    saveAs(blob, `Corte_gran_z_${branch?.name ?? ''}_${Date.now()}.xlsx`);
  };

  return (
    <Layout title="Corte Gran Z">
      <DivGlobal>
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-4  gap-4 w-full">
            <Input
              className="mt-4"
              defaultValue={fechaActualString}
              label="Fecha Inicio"
              labelPlacement="outside"
              type="date"
              variant="bordered"
              onChange={(e) => setInitial(e.target.value)}
            />
            <Input
              className="mt-4"
              defaultValue={fechaActualString}
              label="Fecha Final"
              labelPlacement="outside"
              type="date"
              variant="bordered"
              onChange={(e) => setEnd(e.target.value)}
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
                    setBranchId(item.id);
                    setBranch(item)
                  }}
                >
                  {item.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Autocomplete
              label="Punto de Venta"
              labelPlacement="outside"
              placeholder="Selecciona el punto de venta"
              variant="bordered"
            >
              {codeSale
                .filter((item) => item.typeVoucher === 'FE')
                .map((item) => (
                  <AutocompleteItem key={item.code} onPress={() => setCodeSelected(item.code)}>
                    {item.code}
                  </AutocompleteItem>
                ))}
            </Autocomplete>
          </div>

          <CashCutComponent
            branch={branch}
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
            data={data!}
            params={{ startDate: dateInitial, endDate: dateEnd, pointCode: codeSelected }}
            totalGeneral={totalGeneral}
          />
        </div>
      </DivGlobal>

    </Layout>
  );
};

export default CushCatsBigZ;
