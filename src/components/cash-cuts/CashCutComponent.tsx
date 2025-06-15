import { ReactNode } from 'react';
import { CiWarning } from 'react-icons/ci';

import { useTransmitterStore } from '@/store/transmitter.store';
import { Branches } from '@/types/branches.types';
import { formatCurrency } from '@/utils/dte';
import { DataBox } from '@/types/cashCuts.types';

interface PropsCashCut {
  branch: Branches | undefined;
  params: {
    startDate: string;
    endDate: string;
    date: string;
  };
  totalGeneral: number;
  data: DataBox | undefined;
  buttons: ReactNode;
  cutType: string;
}

export default function CashCutComponent({ branch, params, data, buttons, cutType }: PropsCashCut) {
  const { transmitter } = useTransmitterStore();

  const calcTotal = (...numbers: number[]) => {
    return numbers.reduce((acc, num) => acc + Number(num ?? 0), 0);
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-2 rounded-md">
      <div
        className={`mt-4 bg-white border border-gray-200 dark:bg-gray-800 w-full h-full overflow-y-auto flex flex-col items-center p-5 rounded-2xl ${
          cutType === 'Corte Big Z' ? 'max-w-4xl' : 'max-w-lg'
        }`}
      >
        {data ? (
          <>
            <h1 className="text-black dark:text-white">{transmitter.nombre}</h1>
            <h1 className="text-black dark:text-white">{transmitter.nombreComercial}</h1>
            <h1 className="text-black dark:text-white">{branch?.name}</h1>
            <h1 className="text-black dark:text-white max-w-[20vw] text-center">
              {branch?.address}
            </h1>
            <h1 className="text-black dark:text-white">
              FECHA:{' '}
              {cutType === 'Corte Big Z'
                ? ` ${params.startDate} - ${params.endDate}`
                : `${params.date}`}
            </h1>
            <h1 className="text-black dark:text-white">
              PUNTO DE VENTA: {data.box.pointOfSale.code ? data.box.pointOfSale.code : 'GENERAL'}
            </h1>
            <div className="border-dashed my-3 h-1 border-black dark:border-white border-t w-full" />
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-center font-bold" colSpan={3}>
                    FORMAS DE PAGO
                  </td>
                </tr>
                <tr>
                  <td className="text-center w-full" colSpan={3}>
                    <div className="border-dashed h-3 border-black dark:border-white border-t border-b my-3 w-full" />
                  </td>
                </tr>
                <tr>
                  <td className="text-left" colSpan={2}>
                    TOTAL TARJETA
                  </td>
                  <td className="text-right">
                    {formatCurrency(
                      calcTotal(data.totalSales01Card ?? 0, data.totalSales03Card ?? 0)
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="text-left" colSpan={2}>
                    TOTAL EFECTIVO
                  </td>
                  <td className="text-right">
                    {formatCurrency(
                      calcTotal(data.totalSales01Cash ?? 0, data.totalSales03Cash ?? 0)
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="text-center" colSpan={3}>
                    <div className="border-dashed h-1 border-black dark:border-white border-t w-full" />
                  </td>
                </tr>
                <tr>
                  <td className="text-left" colSpan={2}>
                    SUB TOTAL GENERAL
                  </td>
                  <td className="text-right">
                    {formatCurrency(
                      calcTotal(data.totalSales01Card ?? 0, data.totalSales03Card ?? 0) +
                        calcTotal(data.totalSales01Cash ?? 0, data.totalSales03Cash ?? 0)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="border-dashed my-3 h-1 border-black dark:border-white border-t w-full" />
            <h3>FACTURA CONSUMIDOR FINAL</h3>
            <table className="mt-3 w-full">
              <thead>
                <th />
                <th />
              </thead>
              <tbody>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">N. INICIAL:</td>
                  <td className="text-sm text-right">{data.firtsSale}</td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">N. FINAL:</td>
                  <td className="text-sm text-right">{data.lastSale}</td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">TOTAL EFECTIVO</td>
                  <td className="text-sm text-right">
                    {formatCurrency(Number(data.totalSales01Cash ?? 0))}
                  </td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">TOTAL TARJETA</td>
                  <td className="text-sm text-right">
                    {formatCurrency(Number(data.totalSales01Card ?? 0))}
                  </td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">GRAVADAS</td>
                  <td className="text-sm text-right">
                    {formatCurrency(
                      Number(data.totalSales01Card ?? 0) + Number(data.totalSales01Cash ?? 0)
                    )}
                  </td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">EXENTAS</td>
                  <td className="text-sm text-right">{formatCurrency(0)}</td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">NO SUJETAS</td>
                  <td className="text-sm text-right">{formatCurrency(0)}</td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">TOTAL</td>
                  <td className="text-sm text-right">
                    {formatCurrency(
                      Number(data.totalSales01Card ?? 0) + Number(data.totalSales01Cash ?? 0)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="border-dashed my-3 h-1 border-black dark:border-white border-t w-full" />
            <h3>COMPROBANTE DE CRÉDITO FISCAL</h3>
            <table className="mt-3 w-full">
              <thead>
                <th />
                <th />
              </thead>
              <tbody>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">N. INICIAL:</td>
                  <td className="text-sm text-right">{data.firtsSale03}</td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">N. FINAL:</td>
                  <td className="text-sm text-right">{data.lastSale03}</td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">TOTAL EFECTIVO</td>
                  <td className="text-sm text-right">
                    {formatCurrency(Number(data.totalSales03Cash ?? 0))}
                  </td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">TOTAL TARJETA</td>
                  <td className="text-sm text-right">
                    {formatCurrency(Number(data.totalSales03Card ?? 0))}
                  </td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">GRAVADAS</td>
                  <td className="text-sm text-right">
                    {formatCurrency(
                      Number(data.totalSales03Card ?? 0) + Number(data.totalSales03Cash ?? 0)
                    )}
                  </td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">EXENTAS</td>
                  <td className="text-sm text-right">{formatCurrency(0)}</td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">NO SUJETAS</td>
                  <td className="text-sm text-right">{formatCurrency(0)}</td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">TOTAL</td>
                  <td className="text-sm text-right">
                    {formatCurrency(
                      Number(data.totalSales03Card ?? 0) + Number(data.totalSales03Cash ?? 0)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="border-dashed my-3 h-1 border-black dark:border-white border-t w-full" />
            <h3>INVALIDACIONES - FACTURA CONSUMIDOR FINAL</h3>
            <table className="mt-3 w-full">
              <thead>
                <th />
                <th />
              </thead>
              <tbody>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">N. INICIAL:</td>
                  <td className="text-sm text-right">{data.firstInvalidation01}</td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">N. FINAL:</td>
                  <td className="text-sm text-right">{data.lastInvalidation01}</td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">TOTAL</td>
                  <td className="text-sm text-right">
                    {formatCurrency(Number(data.invalidation01 ?? 0))}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="border-dashed my-3 h-1 border-black dark:border-white border-t w-full" />
            <h3>INVALIDACIONES - COMPROBANTE DE CRÉDITO FISCAL</h3>
            <table className="mt-3 w-full">
              <thead>
                <th />
                <th />
              </thead>
              <tbody>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">N. INICIAL:</td>
                  <td className="text-sm text-right">{data.firstInvalidation03}</td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">N. FINAL:</td>
                  <td className="text-sm text-right">{data.lastInvalidation03}</td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">TOTAL</td>
                  <td className="text-sm text-right">
                    {formatCurrency(Number(data.invalidation03 ?? 0))}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="border-dashed my-3 h-1 border-black dark:border-white border-t w-full" />
            <h3>TOTAL GENERAL</h3>
            <table className="mt-3 w-full">
              <thead>
                <th />
                <th />
              </thead>
              <tbody>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">MONTO INICIAL DE CAJA</td>
                  <td className="text-sm text-right">
                    {formatCurrency(Number(data.box.start ?? 0))}
                  </td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">TOTAL INVALIDACIONES</td>
                  <td className="text-sm text-right">
                    {formatCurrency(
                      Number(data.invalidation03 ?? 0) + Number(data.invalidation01 ?? 0)
                    )}
                  </td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">GASTOS</td>
                  <td className="text-sm text-right">{formatCurrency(0)}</td>
                </tr>
                <tr className="min-h-8 h-full">
                  <td className="text-sm font-semibold">TOTAL EN VENTAS</td>
                  <td className="text-sm text-right">
                    {formatCurrency(
                      calcTotal(data.totalSales01Card ?? 0, data.totalSales03Card ?? 0) +
                        calcTotal(data.totalSales01Cash ?? 0, data.totalSales03Cash ?? 0)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            {buttons}
          </>
        ) : (
          <div className="flex flex-col items-center">
            <CiWarning className="text-4xl" />
            <p className="text-center mt-4">Por favor, selecciona una sucursal</p>
          </div>
        )}
      </div>
    </div>
  );
}
