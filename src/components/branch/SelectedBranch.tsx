import { useState, useEffect, useMemo } from 'react';
import { useBranchesStore } from '../../store/branches.store';
import { Button, Input, Select, SelectItem, Switch, useDisclosure } from '@nextui-org/react';
import { PhoneIcon, User, MapPinIcon, Filter } from 'lucide-react';

import AddButton from '../global/AddButton';
import { Drawer } from 'vaul';
import Pagination from '../global/Pagination';
import { Paginator } from 'primereact/paginator';
import { paginator_styles } from '../../styles/paginator.styles';
import ModalGlobal from '../global/ModalGlobal';
import AddBranch from './AddBranch';
import { global_styles } from '../../styles/global.styles';
import { limit_options } from '../../utils/constants';
import { Branches } from '../../types/branches.types';
import classNames from 'classnames';
import useWindowSize from '../../hooks/useWindowSize';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
function ListBranch() {
  const { getBranchesPaginated, branches_paginated } = useBranchesStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [limit, setLimit] = useState(5);
  const [active, setActive] = useState<1 | 0>(1);
  useEffect(() => {
    getBranchesPaginated(1, limit, name, phone, address, active);
  }, [limit, active]);
  const changePage = (page: number) => {
    getBranchesPaginated(page, limit, name, phone, address, active);
  };
  const modalAdd = useDisclosure();
  const filters = useMemo(() => {
    return (
      <>
        <div>
          <Input
            startContent={<User />}
            className="w-full dark:text-white"
            variant="bordered"
            labelPlacement="outside"
            label="Nombre"
            classNames={{
              label: 'font-semibold text-gray-700',
              inputWrapper: 'pr-0',
            }}
            isClearable
            value={name}
            placeholder="Escribe para buscar..."
            onChange={(e) => setName(e.target.value)}
            onClear={() => {
              setName('');
              getBranchesPaginated(1, limit, '', phone, address, active);
            }}
          />
        </div>
        <div>
          <Input
            labelPlacement="outside"
            label="Teléfono"
            placeholder="Escribe para buscar..."
            startContent={<PhoneIcon />}
            className="w-full dark:text-white"
            classNames={{
              label: 'font-semibold text-gray-700',
              inputWrapper: 'pr-0',
            }}
            variant="bordered"
            isClearable
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onClear={() => {
              setPhone('');
              getBranchesPaginated(1, limit, name, '', address, active);
            }}
          />
        </div>
        <div>
          <Input
            placeholder="Escribe para buscar..."
            startContent={<MapPinIcon />}
            className="w-full dark:text-white"
            variant="bordered"
            isClearable
            labelPlacement="outside"
            label="Dirección"
            classNames={{
              label: 'font-semibold text-gray-700',
              inputWrapper: 'pr-0',
            }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onClear={() => {
              setAddress('');
              getBranchesPaginated(1, limit, name, phone, '', active);
            }}
          />
        </div>
      </>
    );
  }, [name, setName, phone, setPhone, address, setAddress]);
  const [openVaul, setOpenVaul] = useState(false);
  const handleSearch = () => {
    getBranchesPaginated(1, limit, name, phone, address);
  };
  const [selectedBranch, setSelectedBranch] = useState<Branches>();
  const { windowSize } = useWindowSize();
  return (
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
        <div className="hidden w-full grid-cols-3 gap-5 mb-4 md:grid ">{filters}</div>
        <div className="grid md:flex md:justify-between w-full grid-cols-1 gap-5 mb-4 lg:grid-cols-2">
          <div className="flex items-end justify-between gap-10 mt lg:justify-end">
            <div className="flex items-center gap-5">
              <div className="block md:hidden">
                <Drawer.Root
                  shouldScaleBackground
                  open={openVaul}
                  onClose={() => setOpenVaul(false)}
                >
                  <Drawer.Trigger asChild>
                    <Button
                      style={global_styles().thirdStyle}
                      isIconOnly
                      onClick={() => setOpenVaul(true)}
                      type="button"
                    >
                      <Filter />
                    </Button>
                  </Drawer.Trigger>
                  <Drawer.Portal>
                    <Drawer.Overlay
                      className="fixed inset-0 bg-black/40 z-[60]"
                      onClick={() => setOpenVaul(false)}
                    />
                    <Drawer.Content
                      className={classNames(
                        'bg-gray-100 z-[60] flex flex-col rounded-t-[10px] h-auto mt-24 max-h-[80%] fixed bottom-0 left-0 right-0'
                      )}
                    >
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-t-[10px] flex-1">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-400 mb-8" />
                        <Drawer.Title className="mb-4 dark:text-white font-medium">
                          Filtros disponibles
                        </Drawer.Title>
                        <div className="flex flex-col gap-3">
                          {filters}
                          <Button
                            style={global_styles().secondaryStyle}
                            className="mb-10 font-semibold"
                            onClick={() => {
                              handleSearch();
                              setOpenVaul(false);
                            }}
                            type="button"
                          >
                            Aplicar
                          </Button>
                        </div>
                      </div>
                    </Drawer.Content>
                  </Drawer.Portal>
                </Drawer.Root>
              </div>
              <AddButton onClick={() => modalAdd.onOpen()} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center justify-between w-full mb-5">
          <Switch
            defaultSelected
            classNames={{
              label: 'font-semibold text-sm',
            }}
            onValueChange={(isSelected) => setActive(isSelected ? 1 : 0)}
          >
            {active === 1 ? 'Mostrar inactivos' : 'Mostrar activos'}
          </Switch>
          <Select
            className="w-44 dark:text-white"
            variant="bordered"
            label="Mostrar"
            labelPlacement="outside"
            classNames={{
              label: 'font-semibold',
            }}
            defaultSelectedKeys={['5']}
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
            }}
          >
            {limit_options.map((option) => (
              <SelectItem className="w-full dark:text-white" key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
        </div>
        <DataTable
          className="shadow"
          emptyMessage="No se encontraron resultados"
          value={branches_paginated.branches}
          tableStyle={{ minWidth: windowSize.width < 768 ? '50rem' : '100%' }}
        >
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={{
              ...global_styles().darkStyle,
              borderTopLeftRadius: '10px',
            }}
            field="id"
            header="No."
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={global_styles().darkStyle}
            field="name"
            header="Nombre"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={global_styles().darkStyle}
            field="phone"
            header="Teléfono"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={global_styles().darkStyle}
            field="address"
            header="Dirección"
          />
        </DataTable>
        {branches_paginated.totalPag > 1 && (
          <>
            <div className="hidden w-full mt-5 md:flex">
              <Pagination
                previousPage={branches_paginated.prevPag}
                nextPage={branches_paginated.nextPag}
                currentPage={branches_paginated.currentPag}
                totalPages={branches_paginated.totalPag}
                onPageChange={(page) => {
                  changePage(page);
                }}
              />
            </div>
            <div className="flex w-full mt-5 md:hidden">
              <Paginator
                pt={paginator_styles(1)}
                className="flex justify-between w-full"
                first={branches_paginated.currentPag}
                rows={limit}
                totalRecords={branches_paginated.total}
                template={{
                  layout: 'PrevPageLink CurrentPageReport NextPageLink',
                }}
                currentPageReportTemplate="{currentPage} de {totalPages}"
                onPageChange={(e) => {
                  changePage(e.page + 1);
                }}
              />
            </div>
          </>
        )}
      </div>
      <ModalGlobal
        isOpen={modalAdd.isOpen}
        onClose={() => {
          modalAdd.onClose();
          setSelectedBranch(undefined);
        }}
        title={selectedBranch ? 'Editar sucursal' : 'Nueva sucursal'}
        size="w-full md:w-[500px]"
      >
        <AddBranch branch={selectedBranch} closeModal={modalAdd.onClose} />
      </ModalGlobal>
    </div>
  );
}

export default ListBranch;
