import { useCorrelativesStore } from '@/store/correlatives-store/correlatives.store';
import { useEffect, useState } from 'react';
import Pagination from '../global/Pagination';
import SmPagination from '../global/SmPagination';
import { Autocomplete, AutocompleteItem, ButtonGroup } from '@heroui/react';
import { correlativesTypes } from '@/types/correlatives/correlatives_data.types';
import { useBranchesStore } from '@/store/branches.store';
import HeadlessModal from '../global/HeadlessModal';
import UpdateCorrelative from './UpdateCorrelative';
import { Correlatives } from '@/types/correlatives/correlatives_types';
import { CreditCard, EditIcon, Table as ITable, Search } from 'lucide-react';
import CreateCorrelative from './CreateCorrelatives';
import AddButton from '../global/AddButton';
import useWindowSize from '@/hooks/useWindowSize';
import MobileView from './mode_correlative/MobileView';
import SearchCorrelative from './search_correlative/SearchCorrelative';
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
          ></SearchCorrelative>
          {actions.includes('Agregar') && (
            <AddButton onClick={() => setModalOpenCreate(true)} />
          )}
        </div>

        <div className="grid grid-cols-3 gap-5  mb-3 hidden md:grid">
          <div className="w-full">
            <label className="dark:text-white font-semibold text-sm">Sucursal</label>
            <Autocomplete
              onSelectionChange={(e) => {
                const selectNameBranch = branch_list.find(
                  (bra) => bra.name === new Set([e]).values().next().value
                );
                setFilter({ ...filter, branchName: selectNameBranch?.name || '' });
              }}
              placeholder="Selecciona la sucursal"
              variant="bordered"
              className="dark:text-white border border-white rounded-xl"
              onClear={() => {
                setFilter({ ...filter, branchName: '' });
              }}
              classNames={{
                base: 'font-semibold text-sm',
              }}
            >
              {branch_list.map((bra) => (
                <AutocompleteItem className="dark:text-white" key={bra.name}>
                  {bra.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>

          <div className="w-full">
            <label className="dark:text-white font-semibold text-sm">Tipo de Factura</label>
            <Autocomplete
              onSelectionChange={(e) => {
                const selectCorrelativeType = correlativesTypes.find(
                  (dep) => dep.value === new Set([e]).values().next().value
                );
                setFilter({ ...filter, correlativeType: selectCorrelativeType?.value || '' });
              }}
              labelPlacement="outside"
              placeholder="Selecciona el Tipo de Factura"
              variant="bordered"
              className="dark:text-white border border-white rounded-xl"
              classNames={{
                base: 'text-gray-500 text-sm',
              }}
            >
              {correlativesTypes.map((dep) => (
                <AutocompleteItem className="dark:text-white" key={dep.value}>
                  {dep.value + ' - ' + dep.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>

          <ButtonUi
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
            className="w-full mt-5 border border-white rounded-xl"
          >
            Buscar
          </ButtonUi>
        </div>

        <div className="flex items-end justify-end gap-10 mt-3   lg:justify-end">
          <ButtonGroup className="mt-4">
            <ButtonUi
              theme={view === 'table' ? Colors.Primary : Colors.Default}
              isIconOnly
              onPress={() => setView('table')}
            >
              <ITable />
            </ButtonUi>
            <ButtonUi
              theme={view === 'grid' ? Colors.Primary : Colors.Default}
              isIconOnly
              onPress={() => setView('grid')}
            >
              <CreditCard />
            </ButtonUi>
          </ButtonGroup>
        </div>

        <div className="flex flex-col justify-between  xl:mt-5 w-full gap-5 lg:flex-row lg:gap-0">
          {(view === 'grid' || view === 'list') && (
            <MobileView
              openEditModal={(correlative) => handleUpdate(correlative)}
              actions={actions}
              layout={view}
            ></MobileView>
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
                  previousPage={pagination_correlatives.prevPag}
                  nextPage={pagination_correlatives.nextPag}
                  currentPage={pagination_correlatives.currentPag}
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
                  currentPage={pagination_correlatives.currentPag}
                  totalPages={pagination_correlatives.totalPag}
                />
              </div>
            </>
          )}
        </div>
        <HeadlessModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
          children={
            <UpdateCorrelative
              onClose={() => {
                setModalOpen(false);
              }}
              reload={() =>
                OnGetByBranchAndTypeVoucherCorrelatives(
                  1,
                  5,
                  filter.branchName,
                  filter.correlativeType
                )
              }
              id={selectedCorrelativeId}
              correlative={correlative as Correlatives}
            />
          }
          title="Editar Correlativo"
          size="w-full h-full"
        ></HeadlessModal>
        <HeadlessModal
          isOpen={modalOpenCreate}
          onClose={() => {
            setModalOpenCreate(false);
          }}
          children={
            <CreateCorrelative
              onClose={() => {
                setModalOpenCreate(false);
              }}
              reload={() =>
                OnGetByBranchAndTypeVoucherCorrelatives(
                  1,
                  5,
                  filter.branchName,
                  filter.correlativeType
                )
              }
            />
          }
          title="Crear Correlativo"
          size="w-full h-full"
        ></HeadlessModal>
      </div>
    </div>
  );
}

export default CorrelativesList;
