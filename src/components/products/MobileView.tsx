import { Button } from '@nextui-org/react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { EditIcon, ShoppingBag, ClipboardList, Barcode, RefreshCcw, Lock } from 'lucide-react';
import { useProductsStore } from '../../store/products.store';
import { global_styles } from '../../styles/global.styles';
import { GridProps, IMobileView } from './types/mobile-view.types';
import ERROR404 from '../../assets/not-found-error-alert-svgrepo-com.svg';
import TooltipGlobal from '../global/TooltipGlobal';
function MobileView(props: IMobileView) {
  const { paginated_products } = useProductsStore();
  const { layout, openEditModal, DeletePopover, actions, handleActivate } = props;
  return (
    <div className="w-full  ">
      {paginated_products.products.length > 0 ? (
        <>
          <DataView
            value={paginated_products.products}
            gutter
            layout={layout}
            pt={{
              grid: () => ({
                className:
                  'grid dark:bg-transparent   grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5',
              }),
            }}
            color="surface"
            itemTemplate={(customer) => (
              <GridItem
                product={customer}
                layout={layout}
                openEditModal={openEditModal}
                actions={actions}
                DeletePopover={DeletePopover}
                handleActivate={handleActivate}
              />
            )}
            emptyMessage="No se encontraron productos"
          />
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center border shadow rounded-2xl w-96 h-96">
            <img src={ERROR404} className="w-32" alt="no-data" />
            <p className="text-xl font-light">No se encontraron productos</p>
          </div>
        </>
      )}
    </div>
  );
}
const GridItem = (props: GridProps) => {
  const { product, layout, openEditModal, actions, DeletePopover, handleActivate } = props;
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow border border-white dark:border border-gray-600 hover:shadow-lg p-4 rounded-2xl'
          )}
          key={product.id}
        >
          <div className="flex w-full gap-2">
            <ShoppingBag className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{product.name}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <ClipboardList className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{product.subCategory.categoryProduct.name}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Barcode className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{product.code}</p>
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes('Editar') && product.isActive ? (
              <TooltipGlobal text="Editar">
                <Button
                  className="border border-white"
                  onClick={() => openEditModal(product)}
                  isIconOnly
                  style={global_styles().secondaryStyle}
                >
                  <EditIcon className="dark:text-white" size={20} />
                </Button>
              </TooltipGlobal>
            ) : (
              <Button
                type="button"
                disabled
                style={global_styles().secondaryStyle}
                className="flex font-semibold  border border-white"
                isIconOnly
              >
                <Lock />
              </Button>
            )}
            {actions.includes('Eliminar') && product.isActive ? (
              DeletePopover({ product: product })
            ) : (
              <Button
                type="button"
                disabled
                style={global_styles().dangerStyles}
                className="flex font-semibold border border-white"
                isIconOnly
              >
                <Lock />
              </Button>
            )}
            {!product.isActive && (
              <>
                {actions.includes('Activar') && !product.isActive ? (
                  <Button
                    onClick={() => handleActivate(product.id)}
                    isIconOnly
                    style={global_styles().thirdStyle}
                  >
                    <RefreshCcw />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled
                    style={global_styles().thirdStyle}
                    className="flex font-semibold  border border-white"
                    isIconOnly
                  >
                    <Lock />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <ListItem
          layout="list"
          product={product}
          openEditModal={openEditModal}
          DeletePopover={DeletePopover}
          actions={actions}
          handleActivate={handleActivate}
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { product, openEditModal, DeletePopover, actions, handleActivate } = props;
  return (
    <>
      <div className="flex w-full border border-white col-span-1 p-5 border shadow rounded-2xl ">
        <div className="w-full">
          <div className="flex w-full gap-2">
            <ShoppingBag className="tex-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{product.name}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <ClipboardList className="tex-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{product.subCategory.categoryProduct.name}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Barcode className="tex-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{product.code}</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-3  w-full">
          {actions.includes('Editar') && product.isActive ? (
            <TooltipGlobal text="Editar">
              <Button
                className="border border-white"
                onClick={() => openEditModal(product)}
                isIconOnly
                style={global_styles().secondaryStyle}
              >
                <EditIcon className="dark:text-white" size={20} />
              </Button>
            </TooltipGlobal>
          ) : (
            <Button
              type="button"
              disabled
              style={global_styles().secondaryStyle}
              className="flex font-semibold  border border-white"
              isIconOnly
            >
              <Lock />
            </Button>
          )}
          {actions.includes('Eliminar') && product.isActive ? (
            DeletePopover({ product: product })
          ) : (
            <Button
              type="button"
              disabled
              style={global_styles().dangerStyles}
              className="flex font-semibold border border-white"
              isIconOnly
            >
              <Lock />
            </Button>
          )}
          {!product.isActive && (
            <>
              {actions.includes('Activar') && !product.isActive ? (
                <Button
                  onClick={() => handleActivate(product.id)}
                  isIconOnly
                  style={global_styles().thirdStyle}
                >
                  <RefreshCcw />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled
                  style={global_styles().thirdStyle}
                  className="flex font-semibold  border border-white"
                  isIconOnly
                >
                  <Lock />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileView;
