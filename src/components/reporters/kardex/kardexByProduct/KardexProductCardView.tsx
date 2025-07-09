import {
  ArrowDown,
  ArrowUp,
  Box,
} from 'lucide-react';

import { useReportKardex } from '@/store/reports/reportKardex.store';
import { TypeOfMovements } from '@/types/reports/reportKardex.types';

export default function KardexProductCardView({ view }: { view: string }) {
  const { KardexProduct: kardex, totales } = useReportKardex();

  return (
    <div className='h-full min-h-[500px] w-full overflow-y-auto custom-scrollbar'>
      {view === 'grid' && (
        <div className="grid pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5">
          {kardex.map((item, index) => (
            <div
              key={index}
              className="w-full shadow dark:border border-gray-600 hover:shadow-lg p-5 rounded-2xl bg-white dark:bg-transparent dark:text-white"
            >
              <span className="flex gap-2">
                <Box className="text-blue-500" size={24} />
                <h2 className="text-lg font-bold">{totales.productName}</h2>
              </span>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-300">
                Fecha: {item.date}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4 font-semibold dark:text-white text-gray-800">
                <span>
                  Costo Unitario:
                  <p className="ml-1 font-normal text-gray-950 dark:text-white">
                    ${item.branchProduct.costoUnitario}
                  </p>
                </span>
                <span className="flex flex-col">
                  total Movimiento:
                  <p className="ml-1 font-normal text-gray-950 dark:text-white">
                    ${item.totalMovement}
                  </p>
                </span>
                <span className="flex ">
                  Entrada:
                  <p className="ml-1 font-normal text-gray-950 dark:text-white">
                    {item.typeOfMovement === TypeOfMovements.Entries ? item.quantity : 0}
                  </p>
                </span>
                <span className="flex ">
                  Salida:
                  <p className="ml-1 font-normal text-gray-950 dark:text-white">
                    {' '}
                    {item.typeOfMovement === TypeOfMovements.Exits ? item.quantity : 0}
                  </p>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'list' && (
        <div className="grid pb-10 grid-cols-1 gap-5 mt-5 dark:text-white">
          {kardex.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row w-full border dark:border-gray-600 rounded-2xl shadow p-5"
            >
              <div className="flex-grow">
                <span className="flex gap-2">
                  <Box className="text-blue-500" size={24} />
                  <h2 className="text-lg font-bold">{totales.productName}</h2>
                </span>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Fecha: {item.date}
                </p>

                <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-y-2 md:gap-x-6 font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <p className="flex items-center gap-1">
                      <Box className="text-gray-500" size={16} /> Costo Unitario:{' '}
                      <span className="text-gray-800 dark:text-gray-200">
                        ${item.branchProduct.costoUnitario}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center">
                      Total Movimiento:{' '}
                      <span className="ml-1 text-green-500">${item.totalMovement}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUp className="text-blue-500" size={18} />
                    <span>
                      Entrada:{' '}
                      <span className="text-gray-800 dark:text-gray-200">
                        {item.typeOfMovement === TypeOfMovements.Entries ? item.quantity : 0}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDown className="text-red-500" size={18} />
                    <span>
                      Salida:{' '}
                      <span className="text-gray-800 dark:text-gray-200">
                        {item.typeOfMovement === TypeOfMovements.Exits ? item.quantity : 0}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
