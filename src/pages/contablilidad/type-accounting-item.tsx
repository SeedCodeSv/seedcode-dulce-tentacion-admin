import useGlobalStyles from '@/components/global/global.styles';
import AddTypeAccounting from '@/components/type-accounting/AddTypeAccounting';
import Layout from '@/layout/Layout';
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import { limit_options } from '@/utils/constants';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';

function TypeAccountingItem() {
  const { getTypeOfAccounts, type_of_account, loading } =
    useTypeOfAccountStore();

  const [name, setName] = useState('');

  const [limit, setLimit] = useState(5);
  useEffect(() => {
    getTypeOfAccounts(1, limit, name);
  }, [name]);

  const styles = useGlobalStyles();

  return (
    <Layout title="Tipos de Partida">
      <div className="w-full h-full bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full flex flex-col p-5 pt-8 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex gap-3 md:gap-10 items-end">
            <Input
              label="Buscar por nombre"
              className="w-full"
              variant="bordered"
              onChange={(e) => setName(e.target.value)}
              classNames={{
                base: 'font-semibold',
              }}
              placeholder='Ingresa el nombre del tipo de partida'
              labelPlacement="outside"
            />
            <Select
              labelPlacement="outside"
              label="Cantidad a mostrar"
              classNames={{
                base: 'font-semibold',
              }}
              placeholder="Selecciona un limite"
              className="w-64"
              variant="bordered"
              onSelectionChange={(key)=>{
                if(key){
                  setLimit(Number(key.currentKey));
                }
              }}
            >
              {limit_options.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </Select>
            <AddTypeAccounting />
          </div>

          <div className="overflow-x-auto flex flex-col h-full custom-scrollbar mt-4">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <th style={styles.darkStyle} className="p-3 text-sm font-semibold text-left">
                    No.
                  </th>
                  <th style={styles.darkStyle} className="p-3 text-sm font-semibold text-left">
                    Nombre
                  </th>
                  <th style={styles.darkStyle} className="p-3 text-sm font-semibold text-left">
                    Descripción
                  </th>
                  <th style={styles.darkStyle} className="p-3 text-sm font-semibold text-left">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="max-h-[600px] w-full overflow-y-auto">
                {loading ? (
                  <>
                    <tr>
                      <td colSpan={4} className="p-3 text-sm text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center w-full h-64">
                          <div className="loader"></div>
                          <p className="mt-3 text-xl font-semibold">Cargando...</p>
                        </div>
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {type_of_account.map((type, index) => (
                      <tr className="border-b border-slate-200" key={index}>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {type.id}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {type.name}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {type.description}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100"></td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default TypeAccountingItem;
