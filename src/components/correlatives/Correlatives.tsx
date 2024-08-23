import { ThemeContext } from '@/hooks/useTheme';
import { useCorrelativesStore } from '@/store/correlatives-store/correlatives.store';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useContext, useEffect, useState } from 'react';
import Pagination from '../global/Pagination';
import SmPagination from '../global/SmPagination';
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';
import { correlativesTypes } from '@/types/correlatives/correlatives_data.types';
import { useBranchesStore } from '@/store/branches.store';
import HeadlessModal from '../global/HeadlessModal';
import UpdateCorrelative from './UpdateCorrelative';
import { Correlatives } from '@/types/correlatives/correlatives_types';
import { EditIcon, Lock } from 'lucide-react';

function CorrelativesList({ actions }: { actions: string[] }) {
  const { theme } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

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
  }, [filter]);

  const [correlative, setCorrelative] = useState<Correlatives>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCorrelativeId, setSelectedCorrelativeId] = useState(0);
  const handleUpdate = (correlative: Correlatives) => {
    setCorrelative(correlative);
    setModalOpen(true);
  };
  return (
    <div className="w-full h-full p-5 bg-gray-100 dark:bg-gray-800">
      <div className="w-full h-full p-4 overflow-y-auto bg-white shadow custom-scrollbar md:p-8 dark:bg-gray-900">
        <div className="grid grid-cols-2 gap-5 mb-3">
          <Autocomplete
            onSelectionChange={(e) => {
              const selectNameBranch = branch_list.find(
                (bra) => bra.name === new Set([e]).values().next().value
              );
              setFilter({ ...filter, branchName: selectNameBranch?.name || '' });
            }}
            label="Sucursal"
            labelPlacement="outside"
            placeholder="Selecciona la sucursal"
            variant="bordered"
            className="dark:text-white"
            classNames={{
              base: 'font-semibold text-sm',
            }}
          >
            {branch_list.map((bra) => (
              <AutocompleteItem className="dark:text-white" value={bra.name} key={bra.name}>
                {bra.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Autocomplete
            onSelectionChange={(e) => {
              const selectCorrelativeType = correlativesTypes.find(
                (dep) => dep.value === new Set([e]).values().next().value
              );
              setFilter({ ...filter, correlativeType: selectCorrelativeType?.value || '' });
            }}
            label="Tipo de Factura"
            labelPlacement="outside"
            placeholder="Selecciona el Tipo de Factura"
            variant="bordered"
            className="dark:text-white"
            classNames={{
              base: 'text-gray-500 text-sm',
            }}
          >
            {correlativesTypes.map((dep) => (
              <AutocompleteItem className="dark:text-white" value={dep.label} key={dep.value}>
                {dep.value + ' - ' + dep.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <div className="flex flex-col justify-between w-full gap-5 lg:flex-row lg:gap-0">
          <DataTable
            emptyMessage="No se encontraron resultados"
            className="shadow dark:text-white w-full"
            value={correlatives}
            tableStyle={{ minWidth: '50rem' }}
          >
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
              field="id"
              header="No."
              className="dark:text-white"
            />

            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              body={(rowData) => <>{rowData.code?.trim() !== '' ? rowData.code : 'N/A'}</>}
              header="Código"
              className="dark:text-white"
            />

            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              body={(rowData) => {
                const voucherType = correlativesTypes.find(
                  (dep) => dep.value === rowData.typeVoucher
                );
                return voucherType ? `${voucherType.value} - ${voucherType.label} ` : 'Boleta';
              }}
              header="Tipo de Factura"
              className="dark:text-white"
            />

            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="resolution"
              header="Resolucion"
              className="dark:text-white"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="serie"
              header="Serie"
              className="dark:text-white"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="from"
              header="Inicio"
              className="dark:text-white"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="to"
              header="Fin"
              className="dark:text-white"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="prev"
              header="Anterior"
              className="dark:text-white"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="next"
              header="Siguiente"
              className="dark:text-white"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="branch.name"
              header="Sucursal"
              className="dark:text-white"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              body={(rowData) => (
                <>
                  {actions.includes('Editar') ? (
                    <Button
                      isIconOnly
                      style={{
                        backgroundColor: theme.colors.secondary,
                      }}
                      onClick={() => {
                        handleUpdate(rowData);
                        setSelectedCorrelativeId(rowData.id);
                      }}
                    >
                      <EditIcon style={{ color: theme.colors.primary }} size={20} />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      disabled
                      style={{ ...style, cursor: 'not-allowed' }}
                      className="flex font-semibold "
                      isIconOnly
                    >
                      <Lock />
                    </Button>
                  )}
                </>
              )}
              header="Acciones"
              className="dark:text-white"
            />
          </DataTable>
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
                    OnGetByBranchAndTypeVoucherCorrelatives(page, 5, '', '');
                  }}
                />
              </div>
              <div className="flex w-full mt-5 md:hidden">
                <SmPagination
                  handleNext={() => {
                    OnGetByBranchAndTypeVoucherCorrelatives(
                      pagination_correlatives.nextPag,
                      5,
                      '',
                      ''
                    );
                  }}
                  handlePrev={() => {
                    OnGetByBranchAndTypeVoucherCorrelatives(
                      pagination_correlatives.prevPag,
                      5,
                      '',
                      ''
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
      </div>
    </div>
  );
}

export default CorrelativesList;
