import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { Truck, ShoppingBag, Barcode, FileSpreadsheet } from 'lucide-react';
import { useBranchesStore } from '../../../store/branches.store';
import { IGetBranchProduct } from '../../../types/branches.types';

interface Props {
  layout: 'grid' | 'list';
}

function MobileView({ layout }: Props) {
  const { branch_products_list } = useBranchesStore();

  return (
    <div className="w-full pb-10">
      <DataView
        value={branch_products_list}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5',
          }),
        }}
        color="surface"
        itemTemplate={(branchProduct) => gridItem(branchProduct, layout)}
        emptyMessage="No employee found"
      />
    </div>
  );
}

const gridItem = (branchProduct: IGetBranchProduct, layout: 'grid' | 'list') => {
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames('w-full shadow-sm hover:shadow-lg dark:border dar:border-gray-600 p-6 rounded-2xl')}
          key={branchProduct.id}
        >
          <div className="flex w-full gap-2">
            <Truck className='text-[#274c77] dark:text-gray-400' size={35} />
            {branchProduct.branch.name}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <ShoppingBag className="text-[#00bbf9] dark:text-gray-400" size={35} />
            {branchProduct.product.name}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Barcode className='text-[#221] dark:text-gray-400' size={35} />
            {branchProduct.product.code}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <FileSpreadsheet className='text-[#006d77] dark:text-gray-400' size={35} />
            {branchProduct.product.description}
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
