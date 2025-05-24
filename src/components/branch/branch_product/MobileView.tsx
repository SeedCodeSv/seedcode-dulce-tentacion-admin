import { classNames } from 'primereact/utils';
import { Truck, ShoppingBag, Barcode, FileSpreadsheet, Pencil, LibrarySquare } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { UseDisclosureProps } from '@heroui/react';

import { useBranchesStore } from '../../../store/branches.store';
import { IGetBranchProduct } from '../../../types/branches.types';

import DeletePopUp from './DeleteMenu';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
interface Props {
  layout: 'grid' | 'list';
  reload: () => void
  setModalVisible: Dispatch<SetStateAction<"main" | "product" | "menu">>
  library: UseDisclosureProps
  handleEdit: (item: IGetBranchProduct) => Promise<void>
  actions: string[]
}
function MobileView({ layout, reload, setModalVisible, library, handleEdit, actions }: Props) {
  const { branch_products_list } = useBranchesStore();

  return (
    <div className="grid pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5">
      {branch_products_list.map((branchProduct) =>
        gridItem(branchProduct, layout, reload, setModalVisible, library, handleEdit, actions)
      )}

    </div>
  );
}
const gridItem = (branchProduct: IGetBranchProduct,
  layout: 'grid' | 'list',
  reload: () => void,
  setModalVisible: Dispatch<SetStateAction<"main" | "product" | "menu">>
  , library: UseDisclosureProps,
  handleEdit: (item: IGetBranchProduct) => Promise<void>,
  actions: string[]
) => {
  return (
    <>
      {layout === 'grid' ? (
        <div
          key={branchProduct.id}
          className={classNames(
            'w-full shadow border border-white hover:shadow-lg dark:border dar:border-gray-600 p-6 rounded-2xl'
          )}
        >
          <div className="flex w-full gap-2">
            <Truck className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="dark:text-white"> {branchProduct.branch.name}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <ShoppingBag className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="dark:text-white"> {branchProduct.product.name}</p>{' '}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Barcode className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="dark:text-white">{branchProduct.product.code}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <FileSpreadsheet className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="dark:text-white"> {branchProduct.product.description}</p>{' '}
          </div>

          <div className='flex flex-row gap-2 mt-2 justify-between'>
            {actions.includes('Editar producto') && (
              <ButtonUi
                isIconOnly
                showTooltip
                className="flex font-semibold border border-white cursor-pointer"
                theme={Colors.Primary}
                tooltipText='Editar producto'
                type="button"
                onPress={() => {
                  handleEdit(branchProduct)
                  setModalVisible('product')
                }}
              >
                <Pencil />
              </ButtonUi>
            )}

            {branchProduct.hasActiveMenu && (
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
                      library.onOpen!()

                      handleEdit(branchProduct)
                      setModalVisible('menu')
                    }}
                  >
                    <LibrarySquare />
                  </ButtonUi>
                )}

                {actions.includes('Eliminar Menu') && (
                  <>{branchProduct.isActive && <DeletePopUp
                    branchId={branchProduct?.branchId ?? 0}
                    branchProductId={branchProduct?.id ?? 0}
                    productName={branchProduct?.product?.name ?? 'N/A'}
                    reload={() => {
                      reload()
                    }}
                  />}</>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <ListItem branchProduct={branchProduct} />
      )}
    </>
  );
};

const ListItem = ({ branchProduct }: { branchProduct: IGetBranchProduct }) => {
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <Truck color={'#274c77'} size={35} />
            {branchProduct.branch.name}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <ShoppingBag color="#00bbf9" size={35} />
            {branchProduct.product.name}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Truck color={'#006d77'} size={35} />
            {branchProduct.branch.name}
          </div>

        </div>
      </div>
    </>
  );
};

export default MobileView;
