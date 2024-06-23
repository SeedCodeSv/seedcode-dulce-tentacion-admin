import { useNavigate } from 'react-router';
import AddButton from '../global/AddButton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Table as ITable, CreditCard, List, EditIcon } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  ButtonGroup,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { usePromotionsStore } from '../../store/promotions/promotions.store';
import { useBranchesStore } from '../../store/branches.store';
import { Tipos_Promotions, limit_options } from '../../utils/constants';
import Pagination from '../global/Pagination';
import SmPagination from '../global/SmPagination';
import { formatDate } from '../../utils/dates';
import MobileView from './MobileView';
import UpdatePromotionsByCategory from './UpdatePromotionsCategories';
import { Promotion, PromotionCategories, PromotionProducts } from '../../types/promotions.types';
import UpdatePromotionsBranch from './UpdatePromotionBranch';
import HeadlessModal from '../global/HeadlessModal';
import { Branches } from '../../types/branches.types';

import { global_styles } from '../../styles/global.styles';
import TooltipGlobal from '../global/TooltipGlobal';
import UpdatePromotionsProduct from './UpdatePromotionsProduct';

interface Props {
  actions: string[];
}

function ListDiscount({ actions }: Props) {
  const [page, serPage] = useState(1);

  const [limit, setLimit] = useState(5);
  const [branch, setbranch] = useState<Branches>();
  const [type, setType] = useState('');
  const { getBranchesList, branch_list } = useBranchesStore();
  const [dateInitial, setDateInitial] = useState(formatDate());
  const [dateEnd, setDateEnd] = useState(formatDate());

  const { pagination_promotions, getPaginatedPromotions, loading_products } = usePromotionsStore();

  useEffect(() => {
    getPaginatedPromotions(1, limit, Number(branch?.id), type, dateInitial, dateEnd);
    getBranchesList();
  }, [limit]);
  const { theme } = useContext(ThemeContext);
  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const handleSearch = (searchParam: string | undefined) => {
    getPaginatedPromotions(
      page,
      limit,
      Number(branch?.id),
      searchParam ?? type,
      dateInitial,
      dateEnd
    );
  };

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPromotionProduct, setIsOpenPromotionProduct] = useState(false);
  const [isOpenPromotionCategory, setIsOpenPromotionCategory] = useState(false);

  const [promotionId, setPromotionId] = useState(0);
  const [dataPromotion, setDataPromotion] = useState<PromotionCategories>();
  const [dataPromotionProduct, setDataPromotionProduct] = useState<PromotionProducts>();
  // const [dataPromotionClass, setDataPromotionClass] = useState<PromotionClass>();
  const [dataPromotionBranch, setDataPromotionBranch] = useState<Promotion>();
  const priorityMapping: { [key: string]: string } = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
  };

  // Define un tipo para las prioridades
  type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

  const priorityMap: Record<Priority, { label: string; color: string }> = {
    LOW: { label: 'Baja', color: 'green' },
    MEDIUM: { label: 'Media', color: 'orange' },
    HIGH: { label: 'Alta', color: 'red' },
  };

  <Column
    headerClassName="text-sm font-semibold"
    headerStyle={style}
    header="Prioridad"
    body={(item: { priority: string }) => (
      <span>{priorityMapping[item.priority] || item.priority}</span>
    )}
  />;

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full flex flex-col h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="flex w-full justify-between items-end gap-3">
              <Autocomplete
                className="font-semibold dark:text-white"
                label="Sucursal"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Selecciona la sucursal"
              >
                {branch_list.map((branch) => (
                  <AutocompleteItem
                    onClick={() => setbranch(branch)}
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
              <Input
                onChange={(e) => setDateInitial(e.target.value)}
                value={dateInitial}
                defaultValue={formatDate()}
                placeholder="Buscar por nombre..."
                type="date"
                variant="bordered"
                label="Fecha inicial"
                labelPlacement="outside"
                classNames={{
                  input: 'dark:text-white dark:border-gray-600',
                  label: 'text-sm font-semibold dark:text-white',
                }}
              />
              <Input
                onChange={(e) => setDateEnd(e.target.value)}
                value={dateEnd}
                placeholder="Buscar por nombre..."
                variant="bordered"
                label="Fecha final"
                type="date"
                labelPlacement="outside"
                classNames={{
                  input: 'dark:text-white dark:border-gray-600',
                  label: 'text-sm font-semibold dark:text-white',
                }}
              />
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
              <div className="flex items-start justify-between w-full gap-10 lg:justify-start">
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
                <div className="mt-6">
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
              </div>

              <div className="items-start justify-between w-full gap-10 mt-6 lg:justify-start">
                <div className="flex justify-end w-full">
                  <AddButton
                    onClick={() => {
                      navigate('/AddPromotions');
                    }}
                  />
                </div>
              </div>
            </div>

            {(view === 'grid' || view === 'list') && (
              <MobileView
                layout={view as 'grid' | 'list'}
                actions={actions}
                openEditModal={(promotion) => {
                  if (type === 'Categorias') {
                    setIsOpenPromotionCategory(true);
                    setPromotionId(promotion.id);
                    // setDataPromotion(promotion.id);
                  } else if (type === 'Productos') {
                    setIsOpenPromotionProduct(true);
                    setPromotionId(promotion.id);
                    // setDataPromotionProduct(promotion.id);
                  } else if (type === 'Sucursales') {
                    setIsOpen(true);
                    setPromotionId(promotion.id);
                    // setDataPromotionBranch(promotion.id);
                  }
                }}
              />
            )}

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
                  header="No."
                />
                <Column
                  headerClassName="text-sm font-semibold"
                  headerStyle={style}
                  field="name"
                  header="Nombre"
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

                <Column
                  headerClassName="text-sm font-semibold"
                  headerStyle={style}
                  header="Descuento"
                  body={(item) => (
                    <span>
                      {item.percentage > 0
                        ? `${item.percentage}%`
                        : item.fixedPrice
                          ? `$${item.fixedPrice}`
                          : ''}
                    </span>
                  )}
                />

                <Column
                  headerClassName="text-sm font-semibold"
                  headerStyle={style}
                  header="Prioridad"
                  body={(item: { priority: Priority }) => (
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: priorityMap[item.priority]?.color || 'black',
                          marginRight: '8px',
                        }}
                      ></span>
                      {priorityMap[item.priority]?.label || item.priority}
                    </span>
                  )}
                />

                <Column
                  headerClassName="text-sm font-semibold"
                  headerStyle={style}
                  body={(item) => (
                    <div className="">
                      {type === 'Categorias' && (
                        <TooltipGlobal
                          childrem={
                            <Button
                              onClick={() => {
                                setIsOpenPromotionCategory(true);
                                setPromotionId(item.id);
                                setDataPromotion(item);
                              }}
                              isIconOnly
                              style={global_styles().secondaryStyle}
                            >
                              <EditIcon color={theme.colors.primary} size={20} />
                            </Button>
                          }
                          text={'Editar Promoción'}
                        ></TooltipGlobal>
                      )}
                      {type === 'Productos' && (
                        <Button
                          onClick={() => {
                            setPromotionId(item.id);
                            setDataPromotionProduct(item);
                            setIsOpenPromotionProduct(true);
                          }}
                          isIconOnly
                          style={global_styles().secondaryStyle}
                        >
                          <EditIcon color={theme.colors.primary} size={20} />
                        </Button>
                      )}
                      {type === 'Sucursales' && (
                        <Button
                          onClick={() => {
                            setIsOpen(true);
                            setPromotionId(item.id);
                            setDataPromotionBranch(item);
                          }}
                          isIconOnly
                          style={global_styles().secondaryStyle}
                        >
                          <EditIcon color={theme.colors.primary} size={20} />
                        </Button>
                      )}
                    </div>
                  )}
                  header="Acciones"
                />
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
                      getPaginatedPromotions(
                        page,
                        limit,
                        Number(branch?.id),
                        type,
                        dateInitial,
                        dateEnd
                      );
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
                        Number(branch?.id),
                        type,
                        dateInitial,
                        dateEnd
                      );
                    }}
                    handlePrev={() => {
                      serPage(pagination_promotions.prevPag);
                      getPaginatedPromotions(
                        pagination_promotions.prevPag,

                        limit,
                        Number(branch?.id),
                        type,
                        dateInitial,
                        dateEnd
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
        <HeadlessModal
          size="2xl"
          title="Actualizar promoción por categoría"
          isOpen={isOpenPromotionCategory}
          onClose={() => setIsOpenPromotionCategory(false)}
        >
          <UpdatePromotionsByCategory
            onClose={() => setIsOpenPromotionCategory(false)}
            id={promotionId}
            reloadData={() =>
              getPaginatedPromotions(1, limit, Number(branch?.id), type, dateInitial, dateEnd)
            }
            promotion={dataPromotion}
          />
        </HeadlessModal>

        <HeadlessModal
          title="Actualizar promoción por producto"
          size="2xl"
          isOpen={isOpenPromotionProduct}
          onClose={() => setIsOpenPromotionProduct(false)}
        >
          <UpdatePromotionsProduct
            onClose={() => setIsOpenPromotionProduct(false)}
            id={promotionId}
            promotion={dataPromotionProduct}
            branch={branch}
            reloadData={() =>
              getPaginatedPromotions(1, limit, Number(branch?.id), type, dateInitial, dateEnd)
            }
          />
        </HeadlessModal>

        {dataPromotionBranch && (
          <HeadlessModal
            title="Actualizar promoción"
            size="2xl"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <UpdatePromotionsBranch
              onClose={() => setIsOpen(false)}
              reloadData={() =>
                getPaginatedPromotions(1, limit, Number(branch?.id), type, dateInitial, dateEnd)
              }
              id={promotionId}
              promotion={dataPromotionBranch}
            />
          </HeadlessModal>
        )}
      </div>
    </>
  );
}

export default ListDiscount;
