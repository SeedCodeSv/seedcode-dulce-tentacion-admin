import { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  ButtonGroup,
  useDisclosure
} from '@heroui/react';
import { Search, ArrowLeft, CreditCard, Table as ITable, Pencil, LibrarySquare } from 'lucide-react';

import { useBranchesStore } from '../../../store/branches.store';
import { CategoryProduct } from '../../../types/categories.types';
import { useCategoriesStore } from '../../../store/categories.store';
import Pagination from '../../global/Pagination';
import SmPagination from '../../global/SmPagination';
import SearchBranchProduct from '../search_branch_product/SearchBranchProduct';

import MobileView from './MobileView';
import UpdateBranchProduct from './UpdateBranchProduct';
import MenuUpdate from './MenuUpdate';
import DeletePopUp from './DeleteMenu';

import { formatCurrency } from '@/utils/dte';
import BottomDrawer from '@/components/global/BottomDrawer';
import { limit_options } from '@/utils/constants';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';
import { Branches, IGetBranchProduct } from '@/types/branches.types';
import LoadingTable from '@/components/global/LoadingTable';
import EmptyTable from '@/components/global/EmptyTable';
import BranchProductExcell from './BranchProductExcell';
import DownloadPDFButton from './BranchProductPDF';
import { useTransmitterStore } from '@/store/transmitter.store';
interface Props {
  id: number;
  onclick: () => void;
  actions: string[]
}
export default function ListBranchProduct({ id, onclick, actions }: Props) {
    const { transmitter, gettransmitter } = useTransmitterStore();
  
  const {
    getBranchProducts,
    branch_product_Paginated,
    loading_branch_product,
    branch_products_list,
  } = useBranchesStore();
  const { list_categories, getListCategories } = useCategoriesStore();
  const [category, setCategory] = useState('');
  const [branch, setBranch] = useState<Branches>()
  const [code, setCode] = useState('');
  const [page, serPage] = useState(1);
  const [name, setName] = useState('');
  const [limit, setLimit] = useState(10);
  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');

  const [openVaul, setOpenVaul] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<IGetBranchProduct>();
  const vaul = useDisclosure();
  const library = useDisclosure()
  const [modalVisible, setModalVisible] = useState<'main' | 'product' | 'menu'>('main')

  const changePage = () => {
    getBranchProducts(id, page, limit, name, category, code);
  };

  useEffect(() => {
    getBranchProducts(id, page, limit, name, category, code);
  }, [id, limit]);

  useEffect(() => {
    gettransmitter()
    getListCategories();
  }, []);

  const handleEdit = async (item: IGetBranchProduct) => {
    if (!item) {

      return
    }
    setSelectedBranch(item);
    vaul.onOpen();

  };

  const handleRefresh = () => {
    getBranchProducts(id, page, limit, name, category, code);

  }

  return (
    <>
      {modalVisible === 'main' && (
        <DivGlobal>
          <button className="mb-4  w-24 cursor-pointer flex" onClick={onclick}>
            <ArrowLeft className="dark:text-white mr-2" />
            <p className="dark:text-white">Regresar</p>
          </button>
          <div className="hidden w-full   gap-2 mb-4 md:grid">
            <div className="flex gap-5 ">
              <Input
                isClearable
                autoComplete="search"
                className="w-full  order-1"
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                id="searchName"
                label="Nombre"
                labelPlacement="outside"
                name="searchName"
                placeholder="Buscar por nombre..."
                startContent={<Search className='dark:text-white' />}
                value={name}
                variant="bordered"
                onChange={(e) => setName(e.target.value)}
                onClear={() => setName('')}
              />
              <Input
                isClearable
                autoComplete="search"
                className="w-full  order-2"
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                id="searCode"
                label="Código"
                labelPlacement="outside"
                name="searCode"
                placeholder="Buscar por codigo..."
                startContent={<Search className='dark:text-white' />}
                value={code}
                variant="bordered"
                onChange={(e) => setCode(e.target.value)}
                onClear={() => setCode('')}
              />

              <Autocomplete
                className="w-full  order-3"
                classNames={{
                  base: 'font-semibold text-gray-500 text-sm',
                }}
                clearButtonProps={{
                  onClick: () => setCategory(''),
                }}
                label="Categoria"
                labelPlacement="outside"
                placeholder="Selecciona la categoría"
                value={category}
                variant="bordered"
                onSelectionChange={(key) => {
                  if (key) {
                    const branchSelected = JSON.parse(key as string) as Branches;

                    setCategory(branchSelected.name);
                    setBranch(branchSelected)
                  }
                }}
              >
                {list_categories.map((bra) => (
                  <AutocompleteItem key={JSON.stringify(bra)} className="dark:text-white">
                    {bra.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </div>
          <SearchBranchProduct />
          <div className="w-full flex items-end justify-between">
            <div className='flex gap-4 items-end'>
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
            
            <DownloadPDFButton  branch={branch!} transmitter={transmitter}/>
            <BranchProductExcell branch={branch!} transmitter={transmitter}/>
            </div>
            <div className="flex items-end gap-5">
              <div>
                <Select
                  className="w-44"
                  classNames={{
                    label: 'font-semibold',
                    selectorIcon: 'dark:text-white'
                  }}
                  label="Mostrar"
                  labelPlacement="outside"
                  placeholder="Mostrar"
                  value={limit}
                  variant="bordered"
                  onChange={(e) => {
                    setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                  }}
                >
                  {limit_options.map((limit) => (
                    <SelectItem key={limit} className="dark:text-white">
                      {limit}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="hidden md:flex">
                <ButtonUi color="primary" theme={Colors.Primary} onPress={() => changePage()}>
                  Buscar
                </ButtonUi>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-5  md:grid-cols-2">
            <div className="flex items-end justify-between gap-10 mt lg:justify-end">
              <div className="flex items-center gap-5">
                <div className="block md:hidden">
                  <BottomDrawer
                    open={openVaul}
                    title="Filtros disponibles"
                    onClose={() => setOpenVaul(false)}
                  >
                    <div className="flex flex-col gap-3">
                      <>
                        <Input
                          isClearable
                          autoComplete="search"
                          className="w-full xl:w-96"
                          classNames={{
                            label: 'font-semibold text-gray-700',
                            inputWrapper: 'pr-0',
                          }}
                          id="searchName"
                          label="Nombre"
                          labelPlacement="outside"
                          name="searchName"
                          placeholder="Buscar por nombre..."
                          startContent={<Search />}
                          value={name}
                          variant="bordered"
                          onChange={(e) => setName(e.target.value)}
                          onClear={() => setName('')}
                        />
                        <Input
                          isClearable
                          autoComplete="search"
                          className="w-full xl:w-96"
                          classNames={{
                            label: 'font-semibold text-gray-700',
                            inputWrapper: 'pr-0',
                          }}
                          id="searCode"
                          label="Código"
                          labelPlacement="outside"
                          name="searCode"
                          placeholder="Buscar por código..."
                          startContent={<Search />}
                          value={code}
                          variant="bordered"
                          onChange={(e) => setCode(e.target.value)}
                          onClear={() => setCode('')}
                        />
                        <Autocomplete
                          className="w-full xl:w-80"
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          clearButtonProps={{
                            onClick: () => setCategory(''),
                          }}
                          defaultSelectedKey={`${category}`}
                          label="Categoría"
                          labelPlacement="outside"
                          placeholder="Selecciona la categoría"
                          value={category}
                          variant="bordered"
                          onSelectionChange={(key) => {
                            if (key) {
                              setCategory(key as string);
                            }
                          }}
                        >
                          {list_categories.map((bra) => (
                            <AutocompleteItem key={bra.name} className="dark:text-white">
                              {bra.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </>
                      <Button
                        className="mb-10 font-semibold"
                        onPress={() => {
                          changePage();
                          setOpenVaul(false);
                        }}
                      >
                        Aplicar
                      </Button>
                    </div>
                  </BottomDrawer>
                </div>
              </div>
            </div>
          </div>
          {view === 'table' && (
            <>
              <TableComponent
                headers={["Nº", "Nombre", "Codigo", "Precio", 'Stock', 'Reservado', 'Acciones']}
              >
                {loading_branch_product ? (
                  <tr>
                    <td className="p-3 text-sm text-center text-slate-500" colSpan={7}>
                      <LoadingTable />
                    </td>
                  </tr>
                ) : (
                  <>
                    {branch_products_list.length > 0 ? (
                      <>
                        {branch_products_list.map((cat, index) => (
                          <tr key={index} className="border-b border-slate-200">
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {cat.id}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                              {cat.product.name}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {cat.product.code}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {formatCurrency(Number(cat.price))}
                            </td>
                            <td className="p-3 text-sm text-green-500 dark:text-green-300">
                              {Number(cat.stock).toFixed(2)}
                            </td>
                            <td className="p-3 text-sm text-red-500 dark:text-red-300">
                              {cat.reserved}
                            </td>
                            <td className='flex flex-row gap-2'>
                              {actions.includes('Editar producto') && (
                                <ButtonUi
                                  isIconOnly
                                  showTooltip
                                  className="flex font-semibold border border-white cursor-pointer"
                                  theme={Colors.Primary}
                                  tooltipText='Editar producto'
                                  type="button"
                                  onPress={() => {
                                    handleEdit(cat)
                                    setModalVisible('product')
                                  }}
                                >
                                  <Pencil />
                                </ButtonUi>
                              )}

                              {cat.hasActiveMenu && (
                                <>
                                  {actions.includes('Editar Menu') && (
                                    <ButtonUi
                                      isIconOnly
                                      showTooltip
                                      className="flex font-semibold border border-white cursor-pointer"
                                      theme={Colors.Success}
                                      tooltipText='Editar Menu'
                                      type="button"
                                      onPress={() => {
                                        library.onOpen()
                                        handleEdit(cat)
                                        setModalVisible('menu')
                                      }}
                                    >
                                      <LibrarySquare />
                                    </ButtonUi>
                                  )}

                                  {actions.includes('Eliminar Menu') && (
                                    <>{cat.isActive && <DeletePopUp
                                      branchId={cat?.branchId ?? 0}
                                      branchProductId={cat?.id ?? 0}
                                      productName={cat?.product?.name ?? 'N/A'}
                                      reload={() => {
                                        handleRefresh()
                                      }}
                                    />}</>
                                  )}

                                </>

                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={7}>
                          <EmptyTable />
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </TableComponent>
            </>
          )}
          {(view === 'grid' || view === 'list')
            && <MobileView
              actions={actions}
              handleEdit={handleEdit}
              layout={'grid'}
              library={library}
              reload={handleRefresh}
              setModalVisible={setModalVisible}
            />}

          {branch_product_Paginated.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  currentPage={branch_product_Paginated.currentPag}
                  nextPage={branch_product_Paginated.nextPag}
                  previousPage={branch_product_Paginated.prevPag}
                  totalPages={branch_product_Paginated.totalPag}
                  onPageChange={(page) => {
                    serPage(page);
                    getBranchProducts(id, page, limit, name, category, code);
                  }}
                />
              </div>
              <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
                <SmPagination
                  currentPage={branch_product_Paginated.currentPag}
                  handleNext={() => {
                    serPage(branch_product_Paginated.nextPag);

                    getBranchProducts(
                      id,
                      branch_product_Paginated.nextPag,
                      limit,
                      name,
                      category,
                      code
                    );
                  }}
                  handlePrev={() => {
                    serPage(branch_product_Paginated.prevPag);
                    getBranchProducts(
                      id,
                      branch_product_Paginated.prevPag,
                      limit,
                      name,
                      category,
                      code
                    );
                  }}
                  totalPages={branch_product_Paginated.totalPag}
                />
              </div>
            </>
          )}
        </DivGlobal>

      )}

      {modalVisible === 'product' &&
        vaul.isOpen && (
          <UpdateBranchProduct
            branch_products={selectedBranch}
            reloadData={changePage}
            onClose={() => {
              vaul.onClose
              setModalVisible('main')
              setSelectedBranch(undefined)
            }
            }

          />
        )
      }
      {modalVisible === 'menu' && library.isOpen &&
        <MenuUpdate
          branch_products={selectedBranch}
          reloadData={changePage}
          onClose={() => {
            library.onClose
            setModalVisible('main')
            setSelectedBranch(undefined)

          }}
        />}
    </>
  );
}
