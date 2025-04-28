import { Input, Select, SelectItem, useDisclosure } from '@heroui/react';
import { Pencil, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

import Pagination from '@/components/global/Pagination';
import AddTypeAccounting from '@/components/type-accounting/add-type-account';
import DeleteModal from '@/components/type-accounting/delete-modal';
import UpdateTypeAccounting from '@/components/type-accounting/update-type-account';
import Layout from '@/layout/Layout';
import { useTypeOfAccountStore } from '@/store/type-of-aacount.store';
import ButtonUi from '@/themes/ui/button-ui';
import ThGlobal from '@/themes/ui/th-global';
import { Colors } from '@/types/themes.types';
import { TypeOfAccount } from '@/types/type-of-account.types';
import { limit_options } from '@/utils/constants';

function TypeAccountingItem() {
  const { getTypeOfAccounts, type_of_account, loading, type_of_account_pagination } =
    useTypeOfAccountStore();

  const [name, setName] = useState('');

  const [limit, setLimit] = useState(5);

  useEffect(() => {
    getTypeOfAccounts(1, limit, name);
  }, [name]);
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
                className="w-full"
                classNames={{
                  base: 'font-semibold',
                }}
                label="Buscar por nombre"
                labelPlacement="outside"
                placeholder="Ingresa el nombre del tipo de partida"
                variant="bordered"
                onChange={(e) => setName(e.target.value)}
              />
              <Select
                className="w-64"
                classNames={{
                  base: 'font-semibold',
                }}
                label="Cantidad a mostrar"
                labelPlacement="outside"
                placeholder="Selecciona un limite"
                variant="bordered"
                onSelectionChange={(key) => {
                  if (key) {
                    setLimit(Number(key.currentKey));
                  }
                }}
              >
                {limit_options.map((option, index) => (
                  <SelectItem key={index}>{option}</SelectItem>
                ))}
              </Select>
              <AddTypeAccounting />
            </div>

            <div className="overflow-x-auto flex flex-col h-full custom-scrollbar mt-4">
              <table className="w-full">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr>
                    <ThGlobal className="text-left p-3">No.</ThGlobal>
                    <ThGlobal className="text-left p-3">Nombre</ThGlobal>
                    <ThGlobal className="text-left p-3">Descripción</ThGlobal>
                    <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                  </tr>
                </thead>
                <tbody className="max-h-[600px] w-full overflow-y-auto">
                  {loading ? (
                    <>
                      <tr>
                        <td className="p-3 text-sm text-center text-slate-500" colSpan={4}>
                          <div className="flex flex-col items-center justify-center w-full h-64">
                            <div className="loader" />
                            <p className="mt-3 text-xl font-semibold">Cargando...</p>
                          </div>
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {type_of_account.map((type, index) => (
                        <tr key={index} className="border-b border-slate-200">
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
                            <ButtonUi
                              isIconOnly
                              theme={Colors.Success}
                              onPress={() => handleEdit(type)}
                            >
                              <Pencil size={20} />
                            </ButtonUi>
                            <ButtonUi
                              isIconOnly
                              theme={Colors.Error}
                              onPress={() => handleDelete(type.id)}
                            >
                              <Trash size={20} />
                            </ButtonUi>
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
                    currentPage={type_of_account_pagination.currentPag}
                    nextPage={type_of_account_pagination.nextPag}
                    previousPage={type_of_account_pagination.prevPag}
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
            type={selectedType}
            onClose={() => {
              setSelectedType(undefined);
              updateModal.onClose();
            }}
          />
        )}
        {selectedId > 0 && (
          <DeleteModal
            id={selectedId}
            isOpen={deleteModal.isOpen}
            onClose={() => {
              setSelectedType(undefined);
              deleteModal.onClose();
            }}
          />
        )}
      </>
    </Layout>
  );
}

export default TypeAccountingItem;
