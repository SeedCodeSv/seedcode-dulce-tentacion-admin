import {
  Button,
  ButtonGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import { Barcode, CreditCard, List, Search, Table as ITable, Plus, Send } from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useBranchProductStore } from '../../store/branch_product.store';
import { return_branch_id } from '../../storage/localStorage';
import { BranchProduct } from '../../types/branch_products.types';
import Pagination from '../global/Pagination';
import { limit_options } from '../../utils/constants';
import { global_styles } from '../../styles/global.styles';
import CartProducts from './CartProducts';
import ModalGlobal from '../global/ModalGlobal';
import FormMakeSale from './FormMakeSale';
import useEventListener, { TEventHandler } from '../../hooks/useEventListeners';
import { useAuthStore } from '../../store/auth.store';
import { toast } from 'sonner';
import AddButton from '../global/AddButton';
// import MobileView_NewSale from './MobileView_NewSale';
import CardView from './Products/CardiView';
import { formatCurrency } from '../../utils/dte';
import { Paginator } from 'primereact/paginator';
import { paginator_styles } from '../../styles/paginator.styles';

const MainView = () => {
  const { theme } = useContext(ThemeContext);
  const [viewMovil, setViewMovil] = useState<'grid' | 'list'>('grid');

  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [limit, setLimit] = useState<number>(5);
  const modalAdd = useDisclosure();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    pagination_branch_products,
    getPaginatedBranchProducts,

    getProductByCode,
    cart_products,
    emptyCart,
  } = useBranchProductStore();

  useEffect(() => {
    getPaginatedBranchProducts(Number(return_branch_id()), 1, limit, code, name);
  }, [limit]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const handleSearch = () => {
    getPaginatedBranchProducts(Number(return_branch_id()), 1, limit, name, code);
  };

  const { user } = useAuthStore();

  let barcode = '';
  let interval: NodeJS.Timeout | undefined;

  const handler = (evt: KeyboardEvent) => {
    if (interval) clearInterval(interval);
    if (evt.code === 'Enter') {
      if (barcode) getProductByCode(user?.employee.branch.transmitterId ?? 0, barcode);
      barcode = '';
      return;
    }
    if (evt.key !== 'Shift') barcode += evt.key;
    interval = setInterval(() => (barcode = ''), 200000);
  };

  useEventListener('keydown', handler as TEventHandler);

  const total = useMemo(() => {
    const total = cart_products.reduce((acc, product) => {
      return acc + Number(product.price) * product.quantity;
    }, 0);
    return formatCurrency(total);
  }, [cart_products]);
  return (
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
        <div className="w-full h-full overflow-y-auto p-4 flex flex-col">
          <div className="flex justify-end lg:hidden">
            <AddButton onClick={onOpen} />
          </div>
          <div className="w-full h-[75%] pb-5">
            <CartProducts />
          </div>
          <div className="w-full h-[25%]  pt-10">
            <div className="w-full h-full flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 p-5">
              <div className="grid grid-cols-2 w-full">
                <p className="text-lg font-semibold dark:text-white">
                  Total: <span className="font-normal">{total}</span>
                </p>
                <p className="text-lg font-semibold dark:text-white">
                  Descuento: <span className="font-normal">$0</span>
                </p>
              </div>
              <div className="flex items-end justify-end w-full mt-5">
                <Button
                  style={global_styles().thirdStyle}
                  className="ml-5"
                  isIconOnly
                  onClick={() => {
                    cart_products.length > 0
                      ? modalAdd.onOpen()
                      : toast.error('No tienes productos agregados');
                  }}
                >
                  <Send />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[80vh] 2xl:h-[94vh]  min-h-full overflow-y-auto p-4 hidden lg:flex flex-col">
          <ListProduct />
        </div>
      </div>

      <ModalGlobal
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
        title="Nueva venta"
        size="w-full md:w-[500px] lg:w-[600px]"
      >
        <FormMakeSale
          clear={() => {
            modalAdd.onClose();
            emptyCart();
          }}
        />
      </ModalGlobal>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} title="Agregar" size="full">
        <ModalContent>
          <>
            <ModalHeader>Agregar</ModalHeader>
            <ModalBody>
              <div className="w-full h-full overflow-y-auto p-4">
                <Input
                  variant="bordered"
                  placeholder="Escribe para buscar..."
                  label="Buscar por nombre"
                  labelPlacement="outside"
                  className="dark:text-white"
                  classNames={{
                    label: 'text-sm font-semibold',
                    inputWrapper: 'pr-0',
                  }}
                  onChange={(e) => setName(e.target.value)}
                  startContent={<Search size={20} />}
                  endContent={
                    <Button
                      onClick={handleSearch}
                      style={{
                        backgroundColor: theme.colors.secondary,
                        color: theme.colors.primary,
                      }}
                    >
                      Buscar
                    </Button>
                  }
                />
                <Input
                  variant="bordered"
                  placeholder="Escribe para buscar..."
                  label="Buscar por código"
                  labelPlacement="outside"
                  className="dark:text-white pt-4"
                  classNames={{
                    label: 'text-sm font-semibold',
                    inputWrapper: 'pr-0',
                  }}
                  startContent={<Barcode size={20} />}
                  onChange={(e) => setCode(e.target.value)}
                  endContent={
                    <Button
                      onClick={handleSearch}
                      style={{
                        backgroundColor: theme.colors.secondary,
                        color: theme.colors.primary,
                      }}
                    >
                      Buscar
                    </Button>
                  }
                />
                <div className="w-full mt-5 flex justify-between">
                  <ButtonGroup>
                    <Button
                      isIconOnly
                      color="default"
                      style={{
                        backgroundColor: viewMovil === 'grid' ? theme.colors.third : '#e5e5e6',
                        color: viewMovil === 'grid' ? theme.colors.primary : '#3e3e3e',
                      }}
                      onClick={() => setViewMovil('grid')}
                    >
                      <CreditCard />
                    </Button>
                    <Button
                      isIconOnly
                      color="default"
                      style={{
                        backgroundColor: viewMovil === 'list' ? theme.colors.third : '#e5e5e5',
                        color: viewMovil === 'list' ? theme.colors.primary : '#3e3e3e',
                      }}
                      onClick={() => setViewMovil('list')}
                    >
                      <List />
                    </Button>
                  </ButtonGroup>
                  <Select
                    className="w-44 dark:text-white"
                    variant="bordered"
                    label="Mostrar"
                    labelPlacement="outside"
                    classNames={{
                      label: 'font-semibold',
                    }}
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                    }}
                  >
                    {limit_options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="w-full mt-5 p-5 bg-gray-100 dark:bg-gray-900 overflow-y-auto rounded">
                  <h1 className="text-lg font-semibold dark:text-white">Lista de productos</h1>
                  {(viewMovil === 'grid' || viewMovil === 'list') && (
                    <CardView layout={viewMovil as 'grid' | 'list'} />
                  )}
                  {pagination_branch_products.totalPag > 1 && (
                    <div className="flex w-full mt-5">
                      <Paginator
                          pt={paginator_styles(1)}
                          className='flex justify-between w-full'
                          first={(pagination_branch_products.currentPag - 1) * limit}
                          rows={limit}
                          totalRecords={pagination_branch_products.total}
                          template={{
                            layout: 'PrevPageLink CurrentPageReport NextPageLink',
                          }}
                          currentPageReportTemplate='{currentPage} de {totalPages}'
                          onPageChange={(e) => {
                            getPaginatedBranchProducts(Number(return_branch_id()), e.page + 1, limit, name, code)
                          }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MainView;

const ListProduct = () => {
  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');
  const { theme } = useContext(ThemeContext);

  const { user } = useAuthStore();

  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [limit, setLimit] = useState<number>(5);

  const {
    branch_products,
    pagination_branch_products,
    getPaginatedBranchProducts,
    addProductCart,
    getProductByCode,
  } = useBranchProductStore();

  let barcode = '';
  let interval: NodeJS.Timeout | undefined;

  const handler = (evt: KeyboardEvent) => {
    if (interval) clearInterval(interval);
    if (evt.code === 'Enter') {
      if (barcode) getProductByCode(user?.employee.branch.transmitterId ?? 0, barcode);
      barcode = '';
      return;
    }
    if (evt.key !== 'Shift') barcode += evt.key;
    interval = setInterval(() => (barcode = ''), 200000);
  };

  useEventListener('keydown', handler as TEventHandler);

  useEffect(() => {
    getPaginatedBranchProducts(Number(return_branch_id()), 1, limit, code, name);
  }, [limit]);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const priceBodyTemplate = (product: BranchProduct) => {
    return formatCurrency(Number(product.price));
  };

  const nameBodyTemplate = (product: BranchProduct) => {
    const name =
      product.product.name.length > 20
        ? `${product.product.name.substring(0, 20)}...`
        : product.product.name;
    return (
      <>
        {product.product.name.length > 20 ? (
          <Tooltip content={product.product.name} showArrow>
            <span>{name}</span>
          </Tooltip>
        ) : (
          <span>{name}</span>
        )}
      </>
    );
  };

  const handleSearch = () => {
    getPaginatedBranchProducts(Number(return_branch_id()), 1, limit, name, code);
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 mt-5">
      <Input
        variant="bordered"
        placeholder="Escribe para buscar..."
        label="Buscar por nombre"
        labelPlacement="outside"
        className="dark:text-white"
        classNames={{
          label: 'text-sm font-semibold z-[5]',
          inputWrapper: 'pr-0',
        }}
        onChange={(e) => setName(e.target.value)}
        startContent={<Search size={20} />}
        endContent={
          <Button
            onClick={handleSearch}
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.primary,
            }}
          >
            Buscar
          </Button>
        }
      />
      <Input
        variant="bordered"
        placeholder="Escribe para buscar..."
        label="Buscar por código"
        labelPlacement="outside"
        className="dark:text-white pt-4"
        classNames={{
          label: 'text-sm font-semibold z-[5]',
          inputWrapper: 'pr-0',
        }}
        startContent={<Barcode size={20} />}
        onChange={(e) => setCode(e.target.value)}
        endContent={
          <Button
            onClick={handleSearch}
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.primary,
            }}
          >
            Buscar
          </Button>
        }
      />
      <div className="w-full mt-5 flex justify-between">
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
        <Select
          className="w-44 dark:text-white z-[5]"
          variant="bordered"
          label="Mostrar"
          labelPlacement="outside"
          classNames={{
            label: 'font-semibold z-[5]',
          }}
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
          }}
        >
          {limit_options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className="w-full mt-5 p-5 bg-white shadow dark:bg-gray-900 overflow-y-auto rounded">
        <h1 className="text-base font-semibold dark:text-white">Lista de productos</h1>
        {(view === 'grid' || view === 'list') && <CardView layout={view as 'grid' | 'list'} />}
        {view === 'table' && (
          <DataTable
            className="w-full shadow mt-5"
            emptyMessage="No se encontraron resultados"
            value={branch_products}
            tableStyle={{ minWidth: '50rem' }}
            size="small"
            scrollable
          >
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={{ ...style }}
              bodyClassName={'bg-white dark:bg-gray-900'}
              field="product.name"
              body={nameBodyTemplate}
              header="Nombre"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              bodyClassName={'bg-white dark:bg-gray-900'}
              field="price"
              body={priceBodyTemplate}
              header="Precio"
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              bodyClassName={'bg-white dark:bg-gray-900'}
              field="product.categoryProduct.name"
              header="Categoría"
            />
            <Column
              headerStyle={{ ...style }}
              header="Acciones"
              frozen={true}
              bodyClassName={'bg-white dark:bg-gray-900'}
              alignFrozen="right"
              body={(item) => (
                <div className="flex gap-6">
                  <Button
                    style={global_styles().secondaryStyle}
                    isIconOnly
                    onClick={() => {
                      addProductCart(item);
                      toast.success('Producto agregado al carrito');
                    }}
                  >
                    <Plus />
                  </Button>
                </div>
              )}
            />
          </DataTable>
        )}
        {pagination_branch_products.totalPag > 1 && (
          <>
            <div className="w-full block lg:hidden mt-5 2xl:block">
              <Pagination
                totalItems={3}
                totalPages={pagination_branch_products.totalPag}
                currentPage={pagination_branch_products.currentPag}
                previousPage={pagination_branch_products.prevPag}
                nextPage={pagination_branch_products.nextPag}
                onPageChange={(page) => {
                  getPaginatedBranchProducts(Number(return_branch_id()), page, limit, name, code);
                }}
              />
            </div>
            <div className="w-full flex mt-5 justify-between 2xl:hidden">
              <Button
                onClick={() => {
                  getPaginatedBranchProducts(
                    Number(return_branch_id()),
                    pagination_branch_products.prevPag,
                    limit,
                    name,
                    code
                  );
                }}
                className="px-10"
                style={global_styles().thirdStyle}
              >
                Anterior
              </Button>
              <Button
                onClick={() => {
                  getPaginatedBranchProducts(
                    Number(return_branch_id()),
                    pagination_branch_products.nextPag,
                    limit,
                    name,
                    code
                  );
                }}
                className="px-10"
                style={global_styles().thirdStyle}
              >
                Siguiente
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
