import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

import Pagination from '../global/Pagination';

import { AccountCatalog } from '@/types/accountCatalogs.types';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';

interface PropsItems {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
}

export const SelectedItem = (props: PropsItems) => {
  const { account_catalog_pagination } = useAccountCatalogsStore();

  const ITEMS_PER_PAGE = 15;

  const modalCatalog = useDisclosure();

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
    props.setCode(item.code);
    modalCatalog.onClose();
  };

  return (
    <>
      <ButtonUi isIconOnly theme={Colors.Info} onPress={modalCatalog.onOpen}>
        <Search />
      </ButtonUi>
      <Modal
        isOpen={modalCatalog.isOpen}
        scrollBehavior="inside"
        size="3xl"
        onClose={modalCatalog.onClose}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">Catalogo de cuentas</ModalHeader>
            <ModalBody>
              <div>
                <Input
                  classNames={{ base: 'font-semibold' }}
                  label="Buscar por código"
                  labelPlacement="outside"
                  placeholder="Escribe para buscar..."
                  value={search}
                  variant="bordered"
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
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {item.code}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {item.name}
                          </td>
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
                nextPage={currentPage + 1}
                previousPage={currentPage - 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};
