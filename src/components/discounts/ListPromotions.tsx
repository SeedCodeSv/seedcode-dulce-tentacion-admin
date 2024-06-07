import { useNavigate } from 'react-router';
import AddButton from '../global/AddButton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Table as ITable, CreditCard, List } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  ButtonGroup,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { usePromotionsStore } from '../../store/promotions/promotions.store';
import { useBranchesStore } from '../../store/branches.store';
import { Tipos_Promotions, limit_options } from '../../utils/constants';
import Pagination from '../global/Pagination';
import SmPagination from '../global/SmPagination';

function ListDiscount() {
  const [page, serPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [branchId, setbranchId] = useState(0);
  const [type, setType] = useState('');
  const { getBranchesList, branch_list } = useBranchesStore();

  const { pagination_promotions, getPaginatedPromotions, loading_products } = usePromotionsStore();

  useEffect(() => {
    getPaginatedPromotions(1, limit, branchId, type);
    getBranchesList();
  }, [limit]);
  const { theme } = useContext(ThemeContext);
  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const handleSearch = (searchParam: string | undefined) => {
    getPaginatedPromotions(page, limit, branchId, searchParam ?? type);
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full flex flex-col h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="flex w-full justify-between items-end gap-3">
              <Autocomplete
                label="Sucursal"
                labelPlacement="outside"
                placeholder="Selecciona la sucursal"
              >
                {branch_list.map((branch) => (
                  <AutocompleteItem
                    onClick={() => setbranchId(branch.id)}
                    className="dark:text-white"
                    key={branch.id}
                    value={branch.id}
                  >
                    {branch.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>

              <Select
                variant="bordered"
                placeholder="Selecciona el tipo de promoción"
                className="w-full dark:text-white"
                label="Tipo de Promoción"
                labelPlacement="outside"
                classNames={{
                  label: 'font-semibold text-gray-500 text-sm',
                }}
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                }}
              >
                {Tipos_Promotions.map((limit) => (
                  <SelectItem key={limit} value={limit} className="dark:text-white">
                    {limit}
                  </SelectItem>
                ))}
              </Select>
              <Button
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.primary,
                }}
                className="font-semibold"
                color="primary"
                onClick={() => handleSearch(undefined)}
              >
                Buscar
              </Button>
            </div>

            <div className="flex w-full mt-4">
              <div className="items-start justify-between w-full gap-10 lg:justify-start">
                <ButtonGroup>
                  <Button
                    isIconOnly
                    color="secondary"
                    style={{
                      backgroundColor: view === 'table' ? theme.colors.third : '#e5e5e5',
                      color: view === 'table' ? theme.colors.primary : '#3e3e3e',
                    }}
                    onClick={() => setView('table')}
                  >
                    <ITable />
                  </Button>

                  <Button
                    isIconOnly
                    color="default"
                    style={{
                      backgroundColor: view === 'grid' ? theme.colors.third : '#e5e5e5',
                      color: view === 'grid' ? theme.colors.primary : '#3e3e3e',
                    }}
                    onClick={() => setView('grid')}
                  >
                    <CreditCard />
                  </Button>
                  <Button
                    isIconOnly
                    color="default"
                    style={{
                      backgroundColor: view === 'list' ? theme.colors.third : '#e5e5e5',
                      color: view === 'list' ? theme.colors.primary : '#3e3e3e',
                    }}
                    onClick={() => setView('list')}
                  >
                    <List />
                  </Button>
                </ButtonGroup>
              </div>

              <div className="items-start justify-between w-full gap-10 lg:justify-start">
                <div className="flex justify-end w-full">
                  <AddButton
                    onClick={() => {
                      navigate('/AddPromotions');
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Select
                className="max-w-44  dark:text-white"
                variant="bordered"
                label="Mostrar"
                labelPlacement="outside"
                defaultSelectedKeys={['5']}
                classNames={{
                  label: 'font-semibold',
                }}
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                }}
              >
                {limit_options.map((limit) => (
                  <SelectItem key={limit} value={limit} className="dark:text-white">
                    {limit}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {view === 'table' && (
              <DataTable
                className="w-full shadow mt-6 "
                emptyMessage="No se encontraron resultados"
                value={pagination_promotions.promotionsDiscount}
                tableStyle={{ minWidth: '50rem' }}
                loading={loading_products}
              >
                <Column
                  headerClassName="text-sm font-semibold"
                  headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
                  field="id"
                  className="text-center justify-center"
                  // body={(rowData) => {
                  //   const actionId = idCounter + actions_roles_grouped.indexOf(rowData);
                  //   return actionId;
                  // }}
                  header="No."
                />
                <Column
                  headerClassName="text-sm font-semibold"
                  headerStyle={style}
                  field="typePromotion"
                  header="Tipo de Promoción"
                />
                <Column
                  headerClassName="text-sm font-semibold"
                  headerStyle={style}
                  field="startDate"
                  header="Fecha Inicial"
                />
                <Column
                  headerClassName="text-sm font-semibold"
                  headerStyle={style}
                  field="endDate"
                  header="Fecha Final"
                />
                {/* <Column
                  headerClassName="text-sm font-semibold"
                  headerStyle={style}
                  field="priority"
                  header="Prioidad"
                /> */}
                <Column
                  headerClassName="text-sm font-semibold"
                  headerStyle={style}
                  field="branch.name"
                  header="Sucursal"
                />
                {/* <Column
                  headerStyle={{ ...style, borderTopRightRadius: '10px' }}
                  header="Acciones"
                  body={(item) => (
                    <div className="flex gap-6">
                      {actions.includes('Editar') && (
                        <Button
                          onClick={() => handleEdit(item)}
                          isIconOnly
                          style={{
                            backgroundColor: theme.colors.secondary,
                          }}
                        >
                          <EditIcon style={{ color: theme.colors.primary }} size={20} />
                        </Button>
                      )}
                      {actions.includes('Eliminar') && (
                        <>
                          {item.isActive ? (
                            <DeletePopUp category={item} />
                          ) : (
                            <Button
                              onClick={() => handleActivate(item.id)}
                              isIconOnly
                              style={global_styles().thirdStyle}
                            >
                              <RefreshCcw />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                /> */}
              </DataTable>
            )}

            {pagination_promotions.totalPag > 1 && (
              <>
                <div className="hidden w-full mt-5 md:flex">
                  <Pagination
                    previousPage={pagination_promotions.prevPag}
                    nextPage={pagination_promotions.nextPag}
                    currentPage={pagination_promotions.currentPag}
                    totalPages={pagination_promotions.totalPag}
                    onPageChange={(page) => {
                      serPage(page);
                      getPaginatedPromotions(page, limit, branchId, type);
                    }}
                  />
                </div>
                <div className="flex w-full mt-5 md:hidden">
                  <SmPagination
                    handleNext={() => {
                      serPage(pagination_promotions.nextPag);
                      getPaginatedPromotions(
                        pagination_promotions.nextPag,

                        limit,
                        branchId,
                        type
                      );
                    }}
                    handlePrev={() => {
                      serPage(pagination_promotions.prevPag);
                      getPaginatedPromotions(
                        pagination_promotions.prevPag,

                        limit,
                        branchId,
                        type
                      );
                    }}
                    currentPage={pagination_promotions.currentPag}
                    totalPages={pagination_promotions.totalPag}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ListDiscount;
