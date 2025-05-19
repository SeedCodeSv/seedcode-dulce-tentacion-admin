import { Button } from '@heroui/react';
import { ArrowDown, ArrowDownUp, ArrowUp, Box, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import DownloadPDFButton from './KardexPDF';
import KardexExportExcell from './kardexExcell';

import { global_styles } from '@/styles/global.styles';
import { useReportKardex } from '@/store/reports/reportKardex.store';
import { Branches } from '@/types/branches.types';
import { ITransmitter } from '@/types/transmitter.types';


export default function ViewKardexList({ view, branch, transmitter, actions }: { view: string; transmitter: ITransmitter, branch: Branches, actions: string[] }) {
  const { kardex } = useReportKardex();

  const [sortBy, setSortBy] = useState<keyof typeof kardex[0] | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


  const sortedProducts = [...kardex].sort((a, b) => {
    if (!sortBy) return 0;
    const order = sortDirection === 'asc' ? 1 : -1;

    return a[sortBy] > b[sortBy] ? order : -order;
  });

  const handleSort = (property: keyof typeof kardex[0]) => {
    if (sortBy === property) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(property);
      setSortDirection('asc');
    }
  };

  return (
    <div>
      <div className="flex gap-2 md:justify-between mt-2">
        <div className='flex gap-4'>
          {actions.includes('Descargar PDF') && (
            <DownloadPDFButton branch={branch} tableData={sortedProducts} transmitter={transmitter} />
          )}
          {actions.includes('Exportar Excel') && (
            <KardexExportExcell branch={branch!} tableData={sortedProducts} transmitter={transmitter} />
          )}
        </div>
        <div className="flex justify-start md:justify-end gap-2">
          <Button style={global_styles().thirdStyle} onPress={() => handleSort('price')} >
            <ArrowDownUp size={15} />
            Precio {sortBy === 'price' && (sortDirection === 'asc' ? <ChevronUp size={24} /> : <ChevronDown size={24} />)}
          </Button>
          <Button style={global_styles().thirdStyle} onPress={() => handleSort('quantity')} >
            <ArrowDownUp size={15} />
            Stock  {sortBy === 'quantity' && (sortDirection === 'asc' ? <ChevronUp size={24} /> : <ChevronDown size={24} />)}
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
              <span className="flex gap-2">
                <Box className="text-blue-500" size={24} />
                <h2 className="text-lg font-bold">{item.productName}</h2></span>
              <p className="text-sm text-gray-500 dark:text-gray-300">Existencias: {item.quantity}</p>
              <div className="mt-3 grid grid-cols-2 gap-4 font-semibold dark:text-white text-gray-800">
                <span >Costo unitario:<p className="ml-1 font-normal text-gray-950 dark:text-white">${item.cost}</p></span>
                <span className="flex flex-col">Precio:<p className="ml-1 font-normal text-gray-950 dark:text-white">${item.price}</p></span>
                <span className="flex ">Entrada:<p className="ml-1 font-normal text-gray-950 dark:text-white">{item.entries}</p></span>
                <span className="flex ">Salida:<p className="ml-1 font-normal text-gray-950 dark:text-white">{item.exits}</p></span>
              </div>
              <div className="mt-3 flex justify-between font-semibold text-gray-800 dark:text-white">
                <span className="flex">Utilidad:<p className="ml-1 font-normal text-gray-950 dark:text-white">${(item.utility ? item.utility.toFixed(2) : 0)}</p></span>
                <span className="flex items-center  dark:text-gray-300">
                  <TrendingUp className="text-green-500" size={18} />
                  Rentabilidad: <p className="ml-1 font-normal text-gray-950 dark:text-white ">{item.profitability ? item.profitability.toFixed(2) : 0}%</p>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {view === 'list' && (
        <div className="grid pb-10 grid-cols-1 gap-5 mt-5 dark:text-white">
          {sortedProducts.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row w-full border dark:border-gray-600 rounded-2xl shadow p-5">
              <div className="flex-grow">
                <span className="flex gap-2">
                  <Box className="text-blue-500" size={24} />
                  <h2 className="text-lg font-bold">{item.productName}</h2></span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Existencias: {item.quantity}</p>

                <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-y-2 md:gap-x-6 font-medium text-gray-700 dark:text-gray-300">

                  <div className="flex items-center gap-2">
                    <p className="flex items-center gap-1">
                      <Box className="text-gray-500" size={16} /> Costo unitario: <span className="text-gray-800 dark:text-gray-200">${item.cost}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">

                    <span className="flex items-center">
                      Precio: <span className="ml-1 text-green-500">${item.price}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUp className="text-blue-500" size={18} />
                    <span>Entrada: <span className="text-gray-800 dark:text-gray-200">{item.entries}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDown className="text-red-500" size={18} />
                    <span>Salida: <span className="text-gray-800 dark:text-gray-200">{item.exits}</span></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-end ml-5 text-sm font-medium text-gray-700 dark:text-gray-300">

                <p className="flex items-center gap-1 mt-2">
                  <TrendingUp className="text-blue-500" size={16} /> Utilidad: <span className="text-blue-500">${(item.utility ? item.utility.toFixed(2) : 0)}</span>
                </p>
                <p className="flex items-center gap-1 mt-2">
                  <TrendingUp className="text-green-500" size={16} /> Rentabilidad: <span className="text-green-500">{item.profitability ? item.profitability.toFixed(2) : 0}%</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
