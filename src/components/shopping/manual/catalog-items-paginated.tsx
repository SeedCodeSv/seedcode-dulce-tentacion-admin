import Pagination from '@/components/global/Pagination';
import { Items } from '@/pages/contablilidad/types/types';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import ThGlobal from '@/themes/ui/th-global';
import { AccountCatalog } from '@/types/accountCatalogs.types';
import { Input, ModalBody, ModalFooter, ModalHeader } from '@heroui/react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface PropsItems {
  items: Items[];
  setItems: Dispatch<SetStateAction<Items[]>>;
  index: number;
  onClose: () => void;
}

function CatalogItemsPaginated(props: PropsItems) {
  const { account_catalog_pagination } = useAccountCatalogsStore();

  const ITEMS_PER_PAGE = 15;

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return account_catalog_pagination.accountCatalogs.filter((item) =>
      item.code.toLowerCase().startsWith(search.toLowerCase())
    );
  }, [search, account_catalog_pagination]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  }, [filteredData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectItem = (item: AccountCatalog) => {
    if (item.subAccount) {
      toast.error('No se puede agregar una cuenta con sub-cuentas');
      return;
    }
    const items = [...props.items];
    items[props.index].codCuenta = item.code;
    props.setItems([...items]);
    props.onClose();
  };

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Catalogo de cuentas</ModalHeader>
      <ModalBody>
        <div>
          <Input
            classNames={{ base: 'font-semibold' }}
            labelPlacement="outside"
            variant="bordered"
            label="Buscar por código"
            placeholder="Escribe para buscar..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="overflow-x-auto flex flex-col h-full custom-scrollbar mt-4">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <ThGlobal className="text-left p-3">Código</ThGlobal>
                  <ThGlobal className="text-left p-3">Nombre</ThGlobal>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={item.code}
                    className="cursor-pointer"
                    onClick={() => handleSelectItem(item)}
                  >
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{item.code}</td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="w-full">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          nextPage={currentPage + 1}
          previousPage={currentPage - 1}
        />
      </ModalFooter>
    </>
  );
}

export default CatalogItemsPaginated;
