import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { useEffect, useState } from "react";

import Pagination from "@/components/global/Pagination";
import { ResponsiveFilterWrapper } from "@/components/global/ResposiveFilters";
import { useBranchesStore } from "@/store/branches.store";
import { useBranchProductReportStore } from "@/store/reports/branch_product.store";
import { useTransmitterStore } from "@/store/transmitter.store";
import DivGlobal from "@/themes/ui/div-global";
import { TableComponent } from "@/themes/ui/table-ui";
import { fechaActualString } from "@/utils/dates";
import LoadingTable from "@/components/global/LoadingTable";
import EmptyTable from "@/components/global/EmptyTable";
import TdGlobal from "@/themes/ui/td-global";
import { ProductLossSourceList } from "@/utils/utils";
import classNames from "classnames";

export default function ProductLossComponent({ }: { actions: string[] }) {
  const { gettransmitter } = useTransmitterStore();
  const { getProductsLoss, productsLoss, loadingProductLoss } = useBranchProductReportStore()
  const { branch_list, getBranchesList } = useBranchesStore();
  const [filter, setFilter] = useState({
    page: 1,
    limit: 30,
    startDate: fechaActualString,
    endDate: fechaActualString,
    branchId: 0,
    name: ''
  });


  useEffect(() => {
    getProductsLoss(filter);
    getBranchesList();
  }, []);

  useEffect(() => {
    gettransmitter();
  }, []);

  const handleAutocompleteChange = (name: string, value: string) => {
    setFilter((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <DivGlobal>
      <div className="flex justify-between md:flex-col">
        <ResponsiveFilterWrapper onApply={() => getProductsLoss(filter)}>
          <Input
            className="dark:text-white"
            classNames={{ base: 'font-semibold' }}
            defaultValue={filter.startDate}
            label="Fecha inicial"
            labelPlacement="outside"
            type="date"
            value={filter.startDate}
            variant="bordered"
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
          />

          <Input
            className="dark:text-white"
            classNames={{ base: 'font-semibold' }}
            defaultValue={filter.endDate}
            label="Fecha final"
            labelPlacement="outside"
            type="date"
            value={filter.endDate}
            variant="bordered"
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
          />

          <div className="w-full">
            <Autocomplete
              className="dark:text-white"
              classNames={{ base: 'font-semibold' }}
              clearButtonProps={{ onClick: () => handleAutocompleteChange('branchId', '') }}
              label="Sucursal"
              labelPlacement="outside"
              placeholder="Selecciona la Sucursal"
              variant="bordered"
              onClear={() => handleAutocompleteChange('branchId', '')}
            >
              {branch_list.map((branch) => (
                <AutocompleteItem
                  key={branch.id}
                  className="dark:text-white"
                  onPress={() => {
                    handleAutocompleteChange('branchId', String(branch.id));
                  }}

                >
                  {branch.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <div className="w-full">
            <Autocomplete
              className="dark:text-white"
              classNames={{ base: 'font-semibold' }}
              clearButtonProps={{ onClick: () => handleAutocompleteChange('name', '') }}
              label="Tipo "
              labelPlacement="outside"
              placeholder="Selecciona el Tipo"
              variant="bordered"
            >
              {ProductLossSourceList.map((e) => (
                <AutocompleteItem
                  key={e.id}
                  className="dark:text-white"
                  onPress={() => handleAutocompleteChange('name', e.type)}
                >
                  {e.type}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
        </ResponsiveFilterWrapper>

        {/* <div className="flex items-center gap-3 mt-3">
          {actions.includes('Descargar PDF') && (
            <ButtonUi
              showTooltip
              isDisabled={loading_data}
              startContent={loading_data ? <Spinner /> : <AiOutlineFilePdf className="" size={25} />}
              theme={Colors.Info}
              tooltipText='Descargar PDF'
              onPress={() => {
                if (!loading_data) {
                  handle()
                }
                else return
              }}
            />

          )}
          <MovementsExportExcell branch={branch} filters={filter} tableData={inventoryMoments} transmitter={transmitter} />
        </div> */}
      </div>
      <TableComponent
        className='hidden xl:flex'
        headers={['Fecha', 'Fuente', 'Producto', 'Cantidad', 'Sucursal', 'Información']}
      >
        {loadingProductLoss ?
          <tr>
            <td colSpan={6}>
              <LoadingTable />
            </td>
          </tr> : productsLoss.productLoss.length === 0 ?
            <tr>
              <td colSpan={6}>
                <EmptyTable />
              </td>
            </tr>
            : (productsLoss.productLoss.map((item, index) => (
              <tr key={index} className="border-b dark:border-slate-600 border-slate-200">
                <TdGlobal className="p-3">
                  {item?.date}
                </TdGlobal>
                <TdGlobal className="p-3">
                  {item?.source}
                </TdGlobal>
                <TdGlobal className="p-3">
                  {item?.branchProduct?.product?.name}
                </TdGlobal>
                <TdGlobal className="p-3">
                  {item?.quantity}
                </TdGlobal>
                <TdGlobal className="p-3">
                  {item?.branchProduct?.branch?.name}
                </TdGlobal>
                <TdGlobal className="p-3">
                  {item?.observation}
                </TdGlobal>
              </tr>
            ))
            )}
      </TableComponent>


      {productsLoss.productLoss.length > 0 ? (
        <div className="w-full xl:hidden mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
          {productsLoss.productLoss.map((product) => (
            <div
              key={product.id}
              className="w-full shadow dark:border border-gray-300 dark:border-gray-600 hover:shadow-lg p-5 rounded-2xl bg-white dark:bg-gray-900"
            >
              <p className="font-semibold text-gray-900 dark:text-white mb-2">
                <span className="font-medium">Producto:</span> {product.branchProduct?.product?.name}
              </p>

              <div className="text-sm space-y-1 text-gray-700 dark:text-gray-200">
                <p><span className="font-medium">Sucursal:</span> {product.branchProduct?.branch?.name}</p>
                <p><span className="font-medium">Fuente:</span> {product.source}</p>
                <p><span className="font-medium">Fecha:</span> {product.date}</p>
                <p><span className="font-medium">Cantidad:</span> {product.quantity}</p>
                <p><span className="font-medium">Observación:</span> {product.observation}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="xl:hidden flex justify-center items-center mt-10">
          <EmptyTable />
        </div>
      )}

      {productsLoss.totalPag > 1 && (
        <div
          className='mt-4'
        >
          <Pagination
            currentPage={productsLoss.currentPag}
            nextPage={productsLoss.nextPag}
            previousPage={productsLoss.prevPag}
            totalPages={productsLoss.totalPag}
            onPageChange={(page) => {
              getProductsLoss({ ...filter, page });
            }}
          />
        </div>
      )}
    </DivGlobal>
  )
}