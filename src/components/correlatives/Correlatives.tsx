import { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, ButtonGroup } from '@heroui/react';
import { CreditCard, EditIcon, Table as ITable, Search } from 'lucide-react';

import Pagination from '../global/Pagination';
import SmPagination from '../global/SmPagination';
import HeadlessModal from '../global/HeadlessModal';
import AddButton from '../global/AddButton';

import UpdateCorrelative from './UpdateCorrelative';
import CreateCorrelative from './CreateCorrelatives';
import MobileView from './mode_correlative/MobileView';
import SearchCorrelative from './search_correlative/SearchCorrelative';

import { correlativesTypes } from '@/types/correlatives/correlatives_data.types';
import { useBranchesStore } from '@/store/branches.store';
import { Correlatives } from '@/types/correlatives/correlatives_types';
import useWindowSize from '@/hooks/useWindowSize';
import { useCorrelativesStore } from '@/store/correlatives-store/correlatives.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';

function CorrelativesList({ actions }: { actions: string[] }) {
  const { getBranchesList, branch_list } = useBranchesStore();
  const { correlatives, OnGetByBranchAndTypeVoucherCorrelatives, pagination_correlatives } =
    useCorrelativesStore();
  const [filter, setFilter] = useState({
    branchName: '',
    correlativeType: '',
  });

  useEffect(() => {
    getBranchesList();
    OnGetByBranchAndTypeVoucherCorrelatives(1, 5, filter.branchName, filter.correlativeType);
  }, []);
  const [correlative, setCorrelative] = useState<Correlatives>();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenCreate, setModalOpenCreate] = useState(false);
  const [selectedCorrelativeId, setSelectedCorrelativeId] = useState(0);
  const handleUpdate = (correlative: Correlatives) => {
    setCorrelative(correlative);
    setModalOpen(true);
  };
  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );

  return (
    <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
      <div className="w-full h-full border-white border p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
        <div className="flex justify-between items-end ">
          <SearchCorrelative
            branchName={(name) => {
              setFilter({ ...filter, branchName: name });
            }}
            typeVoucher={(name) => {
              setFilter({ ...filter, correlativeType: name });
            }}
          />
          {actions.includes('Agregar') && <AddButton onClick={() => setModalOpenCreate(true)} />}
        </div>

        <div className="gap-5  mb-3 hidden md:grid grid-cols-3">
          <div className="w-full">
            <span className="dark:text-white font-semibold text-sm">Sucursal</span>
            <Autocomplete
              className="dark:text-white border border-white rounded-xl"
              classNames={{
                base: 'font-semibold text-sm',
              }}
              placeholder="Selecciona la sucursal"
              variant="bordered"
              onClear={() => {
                setFilter({ ...filter, branchName: '' });
              }}
              onSelectionChange={(e) => {
                const selectNameBranch = branch_list.find(
                  (bra) => bra.name === new Set([e]).values().next().value
                );

                setFilter({ ...filter, branchName: selectNameBranch?.name || '' });
              }}
            >
              {branch_list.map((bra) => (
                <AutocompleteItem key={bra.name} className="dark:text-white">
                  {bra.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>

          <div className="w-full">
            <span className="dark:text-white font-semibold text-sm">Tipo de Factura</span>
            <Autocomplete
              className="dark:text-white border border-white rounded-xl"
              classNames={{
                base: 'text-gray-500 text-sm',
              }}
              labelPlacement="outside"
              placeholder="Selecciona el Tipo de Factura"
              variant="bordered"
              onSelectionChange={(e) => {
                const selectCorrelativeType = correlativesTypes.find(
                  (dep) => dep.value === new Set([e]).values().next().value
                );

                setFilter({ ...filter, correlativeType: selectCorrelativeType?.value || '' });
              }}
            >
              {correlativesTypes.map((dep) => (
                <AutocompleteItem key={dep.value} className="dark:text-white">
                  {dep.value + ' - ' + dep.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>

          <ButtonUi
            className="w-full mt-5 border border-white rounded-xl"
            startContent={<Search />}
            theme={Colors.Primary}
            onPress={() =>
              OnGetByBranchAndTypeVoucherCorrelatives(
                1,
                5,
                filter.branchName,
                filter.correlativeType
              )
            }
          >
            Buscar
          </ButtonUi>
        </div>

        <div className="flex items-end justify-end gap-10 mt-3   lg:justify-end">
          <ButtonGroup className="mt-4">
            <ButtonUi
              isIconOnly
              theme={view === 'table' ? Colors.Primary : Colors.Default}
              onPress={() => setView('table')}
            >
              <ITable />
            </ButtonUi>
            <ButtonUi
              isIconOnly
              theme={view === 'grid' ? Colors.Primary : Colors.Default}
              onPress={() => setView('grid')}
            >
              <CreditCard />
            </ButtonUi>
          </ButtonGroup>
        </div>

        <div className="flex flex-col justify-between  xl:mt-5 w-full gap-5 lg:flex-row lg:gap-0">
          {(view === 'grid' || view === 'list') && (
            <MobileView
              actions={actions}
              layout={view}
              openEditModal={(correlative) => handleUpdate(correlative)}
            />
          )}
          {view === 'table' && (
            <>
              <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
                <table className="w-full">
                  <thead className="sticky top-0 z-20 bg-white">
                    <tr>
                      <ThGlobal className="text-left p-3">No.</ThGlobal>
                      <ThGlobal className="text-left p-3">Código</ThGlobal>
                      <ThGlobal className="text-left p-3">Tipo de Factura</ThGlobal>
                      <ThGlobal className="text-left p-3">Resolucion</ThGlobal>
                      <ThGlobal className="text-left p-3">Serie</ThGlobal>
                      <ThGlobal className="text-left p-3">Inicio</ThGlobal>
                      <ThGlobal className="text-left p-3">Fin</ThGlobal>
                      <ThGlobal className="text-left p-3">Anterior</ThGlobal>
                      <ThGlobal className="text-left p-3">Siguiente</ThGlobal>
                      <ThGlobal className="text-left p-3">Sucursal</ThGlobal>
                      <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                    </tr>
                  </thead>
                  <tbody className="max-h-[600px] w-full overflow-y-auto">
                    <>
                      {correlatives.length > 0 ? (
                        <>
                          {correlatives.map((item, index) => (
                            <tr key={index} className="border-b border-slate-200">
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {item?.id}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                {item?.code}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {item?.typeVoucher}
                              </td>
                              <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100">
                                {item?.resolution}
                              </td>

                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {item?.serie}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                {item?.from}
                              </td>
                              <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100">
                                {item?.to}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {item?.prev}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {item?.next}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {item?.branch?.name}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                <div className="flex w-full gap-5">
                                  {actions.includes('Editar') && (
                                    <ButtonUi
                                      isIconOnly
                                      theme={Colors.Success}
                                      onPress={() => {
                                        handleUpdate(item);
                                        setSelectedCorrelativeId(item?.id ?? 0);
                                      }}
                                    >
                                      <EditIcon size={20} />
                                    </ButtonUi>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            <div className="flex flex-col items-center justify-center w-full">
                              {/* <img src={NO_DATA} alt="X" className="w-32 h-32" /> */}
                              <p className="mt-3 text-xl dark:text-white">
                                No se encontraron resultados
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        <div>
          {pagination_correlatives.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  currentPage={pagination_correlatives.currentPag}
                  nextPage={pagination_correlatives.nextPag}
                  previousPage={pagination_correlatives.prevPag}
                  totalPages={pagination_correlatives.totalPag}
                  onPageChange={(page) => {
                    OnGetByBranchAndTypeVoucherCorrelatives(
                      page,
                      5,
                      filter.branchName,
                      filter.correlativeType
                    );
                  }}
                />
              </div>
              <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
                <SmPagination
                  currentPage={pagination_correlatives.currentPag}
                  handleNext={() => {
                    OnGetByBranchAndTypeVoucherCorrelatives(
                      pagination_correlatives.nextPag,
                      5,
                      filter.branchName,
                      filter.correlativeType
                    );
                  }}
                  handlePrev={() => {
                    OnGetByBranchAndTypeVoucherCorrelatives(
                      pagination_correlatives.prevPag,
                      5,
                      filter.branchName,
                      filter.correlativeType
                    );
                  }}
                  totalPages={pagination_correlatives.totalPag}
                />
              </div>
            </>
          )}
        </div>
        <HeadlessModal
          isOpen={modalOpen}
          size="w-full h-full"
          title="Editar Correlativo"
          onClose={() => {
            setModalOpen(false);
          }}
        >
          <UpdateCorrelative
            correlative={correlative as Correlatives}
            id={selectedCorrelativeId}
            reload={() =>
              OnGetByBranchAndTypeVoucherCorrelatives(
                1,
                5,
                filter.branchName,
                filter.correlativeType
              )
            }
            onClose={() => {
              setModalOpen(false);
            }}
          />
        </HeadlessModal>
        <HeadlessModal
          isOpen={modalOpenCreate}
          size="w-full h-full"
          title="Crear Correlativo"
          onClose={() => {
            setModalOpenCreate(false);
          }}
        >
          <CreateCorrelative
            reload={() =>
              OnGetByBranchAndTypeVoucherCorrelatives(
                1,
                5,
                filter.branchName,
                filter.correlativeType
              )
            }
            onClose={() => {
              setModalOpenCreate(false);
            }}
          />
        </HeadlessModal>
      </div>
    </div>
  );
}

export default CorrelativesList;
