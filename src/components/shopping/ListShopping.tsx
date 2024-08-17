import { ThemeContext } from '@/hooks/useTheme';
import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../global/Pagination';
import { useAuthStore } from '@/store/auth.store';
import { useBranchProductStore } from '@/store/branch_product.store';
import useGlobalStyles from '../global/global.styles';
import { fechaEnFormatoDeseado } from '@/utils/date';
import { useShoppingStore } from '@/store/shopping.store';
import { ArrayAction } from '@/types/view.types';

function ShoppingPage({ actions }: ArrayAction) {
  const { theme } = useContext(ThemeContext);
  const styles = useGlobalStyles();
  const [dateInitial, setDateInitial] = useState(fechaEnFormatoDeseado);
  const [dateEnd, setDateEnd] = useState(fechaEnFormatoDeseado);
  const { shoppingList, getPaginatedShopping, pagination_shopping } = useShoppingStore();
  const { user } = useAuthStore();
  const { getBranchesList, branches_list } = useBranchProductStore();
  const [branchId, setBranchId] = useState('');
  useEffect(() => {
    getPaginatedShopping(
      user?.correlative.branch.transmitterId as number,
      1,
      5,
      dateInitial,
      dateEnd,
      branchId
    );
    getBranchesList();
  }, []);

  const searchDailyReport = () => {
    getPaginatedShopping(
      user?.correlative.branch.transmitterId as number,
      1,
      5,
      dateInitial,
      dateEnd,
      branchId
    );
  };
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  return (
    <>
      <div className="flex justify-end mt-10">
        {actions.includes('Agregar') && (
          <Link
            style={styles.darkStyle}
            to="/CreateShopping"
            className="py-2 px-4 text-sm rounded-lg mr-8 mt-4"
          >
            Nueva compra
          </Link>
        )}
      </div>
      <div className="grid grid-cols-4 m-4 gap-5 px-2">
        <Input
          className="dark:text-white"
          onChange={(e) => {
            setDateInitial(e.target.value);
          }}
          placeholder="Buscar por nombre..."
          type="date"
          defaultValue={fechaEnFormatoDeseado}
          variant="bordered"
          label="Fecha inicial"
          labelPlacement="outside"
          classNames={{
            label: 'text-sm font-semibold',
          }}
        />
        <Input
          className="dark:text-white"
          onChange={(e) => {
            setDateEnd(e.target.value);
          }}
          defaultValue={fechaEnFormatoDeseado}
          placeholder="Buscar por nombre..."
          variant="bordered"
          label="Fecha final"
          type="date"
          labelPlacement="outside"
          classNames={{
            label: 'text-sm font-semibold',
          }}
        />

        <Autocomplete
          className="dark:text-white font-semibold"
          variant="bordered"
          label="Sucursal"
          labelPlacement="outside"
          placeholder="Selecciona la sucursal"
          clearButtonProps={{ onClick: () => setBranchId('') }}
        >
          {branches_list.map((item) => (
            <AutocompleteItem
              key={JSON.stringify(item)}
              onClick={() => setBranchId(item.name)}
              value={item.name}
              className="dark:text-white"
            >
              {item.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>

        <div>
          <Button className="mt-6" onClick={searchDailyReport} style={styles.secondaryStyle}>
            Buscar
          </Button>
        </div>
      </div>
      <div className="mt-6 m-6">
        <DataTable
          className="shadow dark:text-white"
          emptyMessage="No se encontraron resultados"
          value={shoppingList}
          tableStyle={{ minWidth: '10rem' }}
        >
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            bodyClassName="text-sm"
            headerStyle={{ ...style, borderTopLeftRadius: '5px' }}
            field="id"
            header="No."
          />
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            bodyClassName="text-sm"
            headerStyle={style}
            field="controlNumber"
            header="Número de control"
          />
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            bodyClassName="text-sm"
            headerStyle={style}
            field="generationCode"
            header="Código de generación"
          />
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            bodyClassName="text-sm"
            header="Fecha/Hora emision"
            body={(rowData) => (
              <>
                {rowData.fecEmi} {rowData.horEmi}
              </>
            )}
          />

          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            bodyClassName="text-sm"
            field="subTotal"
            header="Subtotal"
          />
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            bodyClassName="text-sm"
            field="totalIva"
            header="IVA"
          />
          <Column
            className="dark:text-gray-400"
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            bodyClassName="text-sm"
            field="montoTotalOperacion"
            header="Monto total"
          />
        </DataTable>

        {pagination_shopping.totalPag > 1 && (
          <>
            <div className="hidden w-full mt-5 md:flex">
              <Pagination
                previousPage={pagination_shopping.prevPag}
                nextPage={pagination_shopping.nextPag}
                currentPage={pagination_shopping.currentPag}
                totalPages={pagination_shopping.totalPag}
                onPageChange={(page) => {
                  getPaginatedShopping(
                    user?.correlative.branch.transmitterId as number,
                    page,

                    5,
                    // "2024-07-02",
                    // "2024-07-02"
                    dateInitial,
                    dateEnd,
                    branchId
                  );
                }}
              />
            </div>
            <div className="flex items-center justify-between w-full mt-5 md:hidden">
              <Button
                onClick={() => {
                  getPaginatedShopping(
                    user?.correlative.branch.transmitterId as number,
                    pagination_shopping.prevPag,

                    5,
                    dateInitial,
                    dateEnd,
                    branchId
                  );
                }}
                style={styles.darkStyle}
                isIconOnly
              >
                <ChevronLeft />
              </Button>
              <span className="font-semibold">
                {pagination_shopping.currentPag} de {pagination_shopping.totalPag}
              </span>
              <Button
                onClick={() => {
                  getPaginatedShopping(
                    user?.correlative.branch.transmitterId as number,
                    pagination_shopping.prevPag,

                    5,
                    dateInitial,
                    dateEnd,
                    branchId
                  );
                }}
                style={styles.darkStyle}
                isIconOnly
              >
                <ChevronRight />
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ShoppingPage;
