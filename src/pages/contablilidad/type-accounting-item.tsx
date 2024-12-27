import useGlobalStyles from '@/components/global/global.styles';
import Pagination from '@/components/global/Pagination';
import AddTypeAccounting from '@/components/type-accounting/AddTypeAccounting';
import DeleteModal from '@/components/type-accounting/DeleteModal';
import UpdateTypeAccounting from '@/components/type-accounting/UpdateTypeAccounting';
import Layout from '@/layout/Layout';
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import { TypeOfAccount } from '@/types/type-of-account.types';
import { limit_options } from '@/utils/constants';
import { Button, Input, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { Pencil, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

function TypeAccountingItem() {
  const { getTypeOfAccounts, type_of_account, loading, type_of_account_pagination } =
    useTypeOfAccountStore();

  const [name, setName] = useState('');

  const [limit, setLimit] = useState(5);
  useEffect(() => {
    getTypeOfAccounts(1, limit, name);
  }, [name]);

  const styles = useGlobalStyles();

  const updateModal = useDisclosure();
  const deleteModal = useDisclosure();
  const [selectedType, setSelectedType] = useState<TypeOfAccount>();
  const [selectedId, setSelectedId] = useState<number>(0);

  const handleEdit = (type: TypeOfAccount) => {
    setSelectedType(undefined);
    setSelectedType(type);
    updateModal.onOpen();
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    deleteModal.onOpen();
  };

  return (
    <Layout title="Tipos de Partida">
      <>
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
                placeholder="Ingresa el nombre del tipo de partida"
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
                onSelectionChange={(key) => {
                  if (key) {
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
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100 flex    gap-5">
                            <Button
                              isIconOnly
                              style={styles.secondaryStyle}
                              onPress={() => handleEdit(type)}
                            >
                              <Pencil size={20} />
                            </Button>
                            <Button
                              isIconOnly
                              style={styles.dangerStyles}
                              onPress={() => handleDelete(type.id)}
                            >
                              <Trash size={20} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            {type_of_account_pagination.totalPag > 1 && (
              <>
                <div className="hidden w-full mt-5 md:flex">
                  <Pagination
                    previousPage={type_of_account_pagination.prevPag}
                    nextPage={type_of_account_pagination.nextPag}
                    currentPage={type_of_account_pagination.currentPag}
                    totalPages={type_of_account_pagination.totalPag}
                    onPageChange={(page) => {
                      getTypeOfAccounts(page, limit, name);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {selectedType && (
          <UpdateTypeAccounting
            isOpen={updateModal.isOpen}
            onClose={() => {
              setSelectedType(undefined);
              updateModal.onClose();
            }}
            type={selectedType}
          />
        )}
        {selectedId > 0 && (
          <DeleteModal
            isOpen={deleteModal.isOpen}
            onClose={() => {
              setSelectedType(undefined);
              deleteModal.onClose();
            }}
            id={selectedId}
          />
        )}
      </>
    </Layout>
  );
}

export default TypeAccountingItem;
