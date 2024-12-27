import { useAccountingItemsStore } from '@/store/accounting-items.store';
import { formatDate } from '@/utils/dates';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import useGlobalStyles from '../global/global.styles';
import { formatCurrency } from '@/utils/dte';
import Pagination from '../global/Pagination';
import { limit_options } from '@/utils/constants';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

function List() {
  const { accounting_items, loading, accounting_items_pagination, getAccountingItems } =
    useAccountingItemsStore();

  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());

  const [limit, setLimit] = useState(5);

  const styles = useGlobalStyles();

  useEffect(() => {
    getAccountingItems(1, limit, startDate, endDate);
  }, [limit, startDate, endDate]);

  const navigate = useNavigate();

  return (
    <div className=" w-full h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="w-full h-full flex flex-col border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
        <div className="w-full grid grid-cols-2 gap-5">
          <Input
            classNames={{ label: 'font-semibold' }}
            label="Fecha inicial"
            type="date"
            variant="bordered"
            labelPlacement="outside"
            onChange={(e) => setStartDate(e.target.value)}
            value={startDate}
          ></Input>
          <Input
            classNames={{ label: 'font-semibold' }}
            label="Fecha final"
            type="date"
            variant="bordered"
            labelPlacement="outside"
            onChange={(e) => setEndDate(e.target.value)}
            value={endDate}
          ></Input>
        </div>
        <div className="w-full flex justify-between items-end mt-2">
          <Select
            variant="bordered"
            className='w-64'
            classNames={{ base: 'font-semibold' }}
            label="Cantidad a mostrar"
            placeholder="Selecciona un limite"
            labelPlacement="outside"
            selectedKeys={[limit.toString()]}
            onSelectionChange={(key) => {
              if (key) {
                setLimit(Number(key.currentKey));
              }
            }}
          >
            {limit_options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
          <Button isIconOnly style={styles.secondaryStyle} onPress={() => navigate("/add-accounting-items")}>
            <Plus />
          </Button>
        </div>
        <div className="overflow-x-auto flex flex-col h-full custom-scrollbar mt-4">
          <table className="w-full">
            <thead className="sticky top-0 z-20 bg-white">
              <tr>
                <th style={styles.darkStyle} className="p-3 text-sm font-semibold text-left">
                  No. de partida
                </th>
                <th style={styles.darkStyle} className="p-3 text-sm font-semibold text-left">
                  Fecha
                </th>
                <th style={styles.darkStyle} className="p-3 text-sm font-semibold text-left">
                  Tipo de partida
                </th>
                <th style={styles.darkStyle} className="p-3 text-sm font-semibold text-left">
                  Concepto
                </th>
                <th style={styles.darkStyle} className="p-3 text-sm font-semibold text-left">
                  Debe
                </th>
                <th style={styles.darkStyle} className="p-3 text-sm font-semibold text-left">
                  Haber
                </th>
              </tr>
            </thead>
            <tbody className="max-h-[600px] w-full overflow-y-auto">
              {loading ? (
                <>
                  <tr>
                    <td colSpan={6} className="p-3 text-sm text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center w-full h-64">
                        <div className="loader"></div>
                        <p className="mt-3 text-xl font-semibold">Cargando...</p>
                      </div>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {accounting_items.map((type, index) => (
                    <tr className="border-b border-slate-200" key={index}>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {type.noPartida}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {type.date}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {type.typeOfAccount.name}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {type.concepOfTheItem}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {formatCurrency(Number(type.totalDebe))}
                      </td>
                      <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                        {formatCurrency(Number(type.totalHaber))}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        {accounting_items_pagination.totalPag > 1 && (
          <>
            <div className="hidden w-full mt-5 md:flex">
              <Pagination
                previousPage={accounting_items_pagination.prevPag}
                nextPage={accounting_items_pagination.nextPag}
                currentPage={accounting_items_pagination.currentPag}
                totalPages={accounting_items_pagination.totalPag}
                onPageChange={(page) => {
                  getAccountingItems(page, limit, startDate, endDate);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default List;
