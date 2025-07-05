import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

import { useAuthStore } from '@/store/auth.store';
import { useSettlementDocumentStore } from '@/store/settlement-document.store';
import { limit_options } from '@/utils/constants';
import { formatCurrency } from '@/utils/dte';
import NO_DATA from '@/assets/svg/no_data.svg';
import useGlobalStyles from '@/components/global/global.styles';


function SettlementDocument() {
  const {
    settlementDocuments,
    searchParams,
    loadingSettlementDocuments,
    onGetSettlementDocuments,
  } = useSettlementDocumentStore();

  const [startDate, setStartDate] = useState(searchParams.startDate);
  const [endDate, setEndDate] = useState(searchParams.endDate);
  const [limit, setLimit] = useState(searchParams.limit);

  const { user } = useAuthStore();

  useEffect(() => {
    const transmitter = user?.pointOfSale.branch.transmitter.id;

    onGetSettlementDocuments(searchParams.page, limit, transmitter ?? 0, startDate, endDate, 0);
  }, [startDate, endDate, limit]);

  const styles = useGlobalStyles()

  const navigate = useNavigate()

  return (
    <>
      <div className="w-full h-full bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full flex flex-col p-3 pt-10 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex gap-5">
            <Input
              classNames={{ label: 'font-semibold' }}
              label="Fecha inicial"
              labelPlacement="outside"
              type="date"
              value={startDate}
              variant="bordered"
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              classNames={{ label: 'font-semibold' }}
              label="Fecha final"
              labelPlacement="outside"
              type="date"
              value={endDate}
              variant="bordered"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className='flex justify-between items-end mt-4'>
            <Select
              className='w-64'
              classNames={{ label: 'font-semibold' }}
              label="Cantidad a mostrar"
              labelPlacement="outside"
              placeholder="Selecciona la cantidad"
              selectedKeys={[limit.toString()]}
              variant="bordered"
              onSelectionChange={(key) => {
                if (key) setLimit(Number(key.currentKey));
                else setLimit(Number(limit_options[0]));
              }}
            >
              {limit_options.map((limit) => (
                <SelectItem key={limit}>
                  {limit}
                </SelectItem>
              ))}
            </Select>
            <Button isIconOnly style={styles.thirdStyle} onPress={() => navigate('/add-settlement-document')}>
              <Plus />
            </Button>
          </div>
          <div className="overflow-x-auto flex flex-col h-full custom-scrollbar mt-4">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    No.
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Fecha - Hora
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Número de control
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Código generación
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Sello recibido
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Valor operaciones
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="max-h-[600px] w-full overflow-y-auto">
                {loadingSettlementDocuments ? (
                  <tr>
                    <td className="p-3 text-sm text-center text-slate-500" colSpan={7}>
                      <div className="flex flex-col items-center justify-center w-full h-64">
                        <div className="loader" />
                        <p className="mt-3 text-xl font-semibold">Cargando...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {settlementDocuments.length > 0 ? (
                      <>
                        {settlementDocuments.map((sale, index) => (
                          <tr key={index} className="border-b border-slate-200">
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {sale.id}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {sale.fecEmi + ' - ' + sale.horEmi}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {sale.numeroControl}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {sale.codigoGeneracion}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {sale.sello}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {formatCurrency(Number(sale.valorOperaciones))}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100" />
                          </tr>
                        ))}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={7}>
                          <div className="flex flex-col items-center justify-center w-full">
                            <img alt="X" className="w-32 h-32" src={NO_DATA} />
                            <p className="mt-3 text-xl dark:text-white">
                              No se encontraron resultados
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettlementDocument;
