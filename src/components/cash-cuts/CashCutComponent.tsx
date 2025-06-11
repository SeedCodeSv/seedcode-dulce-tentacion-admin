
import { ReactNode } from "react";

import { useTransmitterStore } from "@/store/transmitter.store";
import { Branches } from "@/types/branches.types";
import { formatCurrency } from "@/utils/dte";
import { ZCashCutsResponse } from "@/types/cashCuts.types";

interface PropsCashCut {
  branch: Branches | undefined
  params: {
    startDate: string,
    endDate: string,
    pointCode: string
  }
  totalGeneral: number
  data: ZCashCutsResponse
  buttons: ReactNode
}

export default function CashCutComponent({ branch, params, totalGeneral, data, buttons }: PropsCashCut) {
  const { transmitter } = useTransmitterStore()

  return (
    <div className="flex flex-col items-center w-full h-full p-4 mt-4  rounded-md">
      <div className="mt-4 bg-white border border-gray-200 dark:bg-gray-800 w-full max-w-lg h-full overflow-y-auto flex flex-col items-center p-5 rounded-2xl">
        <h1 className="text-black dark:text-white">{transmitter.nombre}</h1>
        <h1 className="text-black dark:text-white">{transmitter.nombreComercial}</h1>
        <h1 className="text-black dark:text-white">{branch?.name}</h1>
        <h1 className="text-black dark:text-white max-w-[20vw] text-center">{branch?.address}</h1>
        <h1 className="text-black dark:text-white">
          FECHA: {params.startDate} - {params.endDate}
        </h1>
        <h1 className="text-black dark:text-white">
          PUNTO DE VENTA: {params.pointCode ? params.pointCode : 'GENERAL'}
        </h1>
        <div className="border-dashed h-3 border-black dark:border-white border-t border-b my-3 w-full" />
        <table >
        <tbody>
          <tr>
            <td className="text-center font-bold" colSpan={3}>
              FORMAS DE PAGO
            </td>
          </tr>
          <tr>
            <td className="text-center w-full" colSpan={2}>
        <div className="border-dashed h-3 border-black dark:border-white border-t border-b my-3 w-full" />
            </td>
          </tr>
          <tr>
            <td className="text-left" colSpan={2}>TOTAL TARJETA</td>
            <td className="text-right">{formatCurrency(0)}</td>
          </tr>
          <tr>
            <td className="text-left" colSpan={2}>TOTAL EFECTIVO</td>
            <td className="text-right">{formatCurrency(0)}</td>
          </tr>
          <tr>
           <td className="text-center" colSpan={3}>
              <div className="border-dashed h-1 border-black dark:border-white border-t w-full" />
           </td>
          </tr>
          <tr>
            <td className="text-left" colSpan={2}>SUB TOTAL GENERAL</td>
            <td className="text-right">{formatCurrency(0)}</td>
          </tr>
        </tbody>
      </table>
        <div className="border-dashed h-3 border-black dark:border-white border-t border-b my-3 w-full" />
        <div className="w-full">
          <h1 className="text-black dark:text-white">VENTAS CON FACTURA</h1>
          <h1 className="text-black dark:text-white">
            N. INICIAL: {data?.Factura?.inicio}
          </h1>
          <h1 className="text-black dark:text-white">N. FINAL: {data?.Factura?.fin}</h1>
          <h1 className="text-black dark:text-white">
            GRAVADAS: {formatCurrency(Number(data?.Factura?.total) / 1.13)}
          </h1>
          <h1 className="text-black dark:text-white">
            IVA:{' '}
            {formatCurrency(
              Number(data?.Factura?.total) - Number(data?.Factura?.total) / 1.13
            )}
          </h1>
          <h1 className="text-black dark:text-white">
            SUB_TOTAL: {formatCurrency(Number(data?.Factura?.total))}
          </h1>
          <h1 className="text-black dark:text-white">EXENTAS: $0.00</h1>
          <h1 className="text-black dark:text-white">NO SUJETAS: $0.00</h1>
          <h1 className="text-black dark:text-white">
            TOTAL: {formatCurrency(Number(data?.Factura?.total.toFixed(2)))}
          </h1>
        </div>
        <br />
        <div className="border-dashed h-3 border-black dark:border-white border-t border-b my-3 w-full" />
        <div className="w-full">
          <h1 className="text-black dark:text-white">COMPROBANTE DE CRÉDITO FISCAL</h1>
          <h1 className="text-black dark:text-white">
            N. INICIAL: {data?.CreditoFiscal?.inicio}
          </h1>
          <h1 className="text-black dark:text-white">
            N. FINAL: {data?.CreditoFiscal?.fin}
          </h1>
          <h1 className="text-black dark:text-white">
            GRAVADAS: {formatCurrency(Number(data?.CreditoFiscal?.total) / 1.13)}
          </h1>
          <h1 className="text-black dark:text-white">
            IVA:{' '}
            {formatCurrency(
              Number(data?.CreditoFiscal?.total) - Number(data?.CreditoFiscal?.total) / 1.13
            )}
          </h1>
          <h1 className="text-black dark:text-white">
            SUB_TOTAL: {formatCurrency(Number(data?.CreditoFiscal?.total))}
          </h1>
          <h1 className="text-black dark:text-white">EXENTAS: $0.00</h1>
          <h1 className="text-black dark:text-white">NO SUJETAS: $0.00</h1>
          <h1 className="text-black dark:text-white">
            TOTAL: {formatCurrency(Number(data?.CreditoFiscal?.total))}
          </h1>
        </div>
        <br />
        <div className="border-dashed h-1 border-black dark:border-white border-t w-full" />
        <br />
        {(() => {
          const ivaFactura = Number(data?.Factura?.total) - Number(data?.Factura?.total) / 1.13;
          const ivaCreditoFiscal =
            Number(data?.CreditoFiscal?.total) - Number(data?.CreditoFiscal?.total) / 1.13;
          const ivaDevolucionNC =
            Number(data?.DevolucionNC?.total) - Number(data?.DevolucionNC?.total) / 1.13;
          const ivaDevolucionT =
            Number(data?.DevolucionT?.total) - Number(data?.DevolucionT?.total) / 1.13;

          const totalIVA =
            ivaFactura + ivaCreditoFiscal + ivaDevolucionNC + ivaDevolucionT;

          return (
            <>
              <div className="w-full">
                <h1 className="text-black dark:text-white">TOTAL GENERAL</h1>
                <h1 className="text-black dark:text-white">
                  GRAVADAS: {formatCurrency(totalGeneral / 1.13)}
                </h1>
                <h1 className="text-black dark:text-white">
                  IVA: {formatCurrency(totalIVA)}
                </h1>
                <h1 className="text-black dark:text-white">
                  SUB-TOTAL: {formatCurrency(totalGeneral)}
                </h1>
                <h1 className="text-black dark:text-white">EXENTAS: $0.00</h1>
                <h1 className="text-black dark:text-white">NO SUJETAS: $0.00</h1>
                <h1 className="text-black dark:text-white">RETENCIONES: $0.00</h1>
                <h1 className="text-black dark:text-white">
                  TOTAL: {formatCurrency(totalGeneral)}
                </h1>
              </div>
            </>
          );
        })()}
        {buttons}
      </div>
    </div>
  )
}