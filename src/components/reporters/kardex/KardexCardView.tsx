import { Button } from '@heroui/react';
import { ArrowDown, ArrowDownCircle, ArrowDownUp, ArrowUp, ArrowUpCircle, Box, ChevronDown, ChevronUp, CreditCard } from 'lucide-react';
import { useState } from 'react';

import DownloadPDFButton from './KardexPDF';
import KardexExportExcell from './kardexExcell';

import { global_styles } from '@/styles/global.styles';
import { useReportKardex } from '@/store/reports/reportKardex.store';
import { Branches } from '@/types/branches.types';
import { ITransmitter } from '@/types/transmitter.types';


export default function ViewKardexList({ view, branch, transmitter, actions }: { view: string; transmitter: ITransmitter, branch: Branches, actions: string[] }) {
  const { kardexGeneral } = useReportKardex();

  const [sortBy, setSortBy] = useState<keyof typeof kardexGeneral[0] | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


  const sortedProducts = [...kardexGeneral].sort((a, b) => {
    if (!sortBy) return 0;
    const order = sortDirection === 'asc' ? 1 : -1;

    return a[sortBy] > b[sortBy] ? order : -order;
  });

  const handleSort = (property: keyof typeof kardexGeneral[0]) => {
    if (sortBy === property) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(property);
      setSortDirection('asc');
    }
  };

  return (
    <div>
      <div className="flex gap-2 md:justify-between mt-2 overflow-auto">
        <div className='flex gap-4'>
          {actions.includes('Descargar PDF') && (
            <DownloadPDFButton branch={branch} tableData={sortedProducts} transmitter={transmitter} />
          )}
          {actions.includes('Exportar Excel') && (
            <KardexExportExcell branch={branch!} tableData={sortedProducts} transmitter={transmitter} />
          )}
        </div>
        <div className="flex justify-start md:justify-end gap-2">
          <Button style={global_styles().thirdStyle} onPress={() => handleSort('unitCost')} >
            <ArrowDownUp size={15} />
            CostUnitario {sortBy === 'unitCost' && (sortDirection === 'asc' ? <ChevronUp size={24} /> : <ChevronDown size={24} />)}
          </Button>
          <Button style={global_styles().thirdStyle} onPress={() => handleSort('quantity')} >
            <ArrowDownUp size={15} />
            Cantidad  {sortBy === 'quantity' && (sortDirection === 'asc' ? <ChevronUp size={24} /> : <ChevronDown size={24} />)}
          </Button>
        </div>
      </div>
      {view === 'grid' && (
        <div className="grid pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5">
          {sortedProducts.map((item, index) => (
            <div
              key={index}
              className="w-full shadow dark:border border-gray-600 hover:shadow-lg p-5 rounded-2xl bg-white dark:bg-transparent dark:text-white"
            >
              <div className="flex items-center gap-3">
                {item.movementType === 'Entradas' ? (
                  <span className='flex'>
                    <ArrowDownCircle className="text-green-600" size={20} />
                  </span>
                ) : (
                  <span className='flex'>
                    <ArrowUpCircle className="text-red-600" size={20} />
                    {item.movementType}
                  </span>
                )}
                <div>
                  <p className="font-medium text-[15px] uppercase">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    {item.movementType} • {item.inventoryType}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.date} • {item.time}
                  </p>
                </div>
              </div>

              <div className="mt-4 w-full flex gap-2 flex-col">
                <p className="justify-between flex text-sm">
                  Cantidad: <span className="font-semibold">{item.quantity}</span>
                </p>
                <p className="justify-between flex text-sm">
                  Costo unitario:{' '}
                  <span className="font-semibold">${item.unitCost.toFixed(2)}</span>
                </p>
                <p className="justify-between flex text-sm">
                  Total:{' '}
                  <span className="font-semibold">${item.totalMovement.toFixed(2)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {view === 'list' && (
        <div className="grid pb-10 grid-cols-1 gap-5 h-full mt-5 dark:text-white">
          {sortedProducts.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row w-full border dark:border-gray-600 rounded-2xl shadow p-5 bg-white dark:bg-transparent"
            >
              {/* Columna izquierda */}
              <div className="flex-grow">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {item.movementType === 'Entradas' ? (
                      <ArrowDownCircle className="text-green-600" size={20} />
                    ) : (
                      <ArrowUpCircle className="text-red-600" size={20} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold uppercase">{item.productName}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.movementType} • {item.inventoryType}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.date} • {item.time}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Existencias: {item.quantity}
                    </p>
                  </div>
                </div>

                {/* Detalles */}
                <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-y-2 md:gap-x-6 font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Box className="text-gray-500" size={16} />
                    <span>
                      Costo unitario: <span className="text-gray-800 dark:text-gray-200">${item.unitCost.toFixed(2)}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.movementType === 'Entradas' ?
                      <ArrowUp className="text-blue-500" size={18} />
                      :
                      <ArrowDown className="text-red-500" size={18} />
                    }
                    <span>
                      Cantidad: <span className="text-gray-800 dark:text-gray-200">{item.quantity}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-purple-500" size={16} />
                    <span>
                      Total movimiento: <span className="text-gray-800 dark:text-gray-200">${item.totalMovement.toFixed(2)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
