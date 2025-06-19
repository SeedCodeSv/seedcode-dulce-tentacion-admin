import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { CalendarMinus2, CalendarPlus2, Edit, Shapes, Store } from 'lucide-react';
import { Button } from "@heroui/react";

import { usePromotionsStore } from '../../store/promotions/promotions.store';
import { global_styles } from '../../styles/global.styles';

import { GridProps, MobileViewProps } from './types/mobile_view.types';

function MobileView(props: MobileViewProps) {
  const { layout, actions, openEditModal } = props;

  const { pagination_promotions, loading_products } = usePromotionsStore();

  return (
    <div className="w-full pb-10">
      <DataView
        gutter
        color="surface"
        emptyMessage="No se encontraron resultados"
        itemTemplate={(cat) => (
          <GridItem
            actions={actions}
            layout={layout}
            openEditModal={openEditModal}
            promotion={cat}
          />
        )}
        layout={layout}
        loading={loading_products}
        pt={{
          grid: () => ({
            className:
              'grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5',
          }),
        }}
        value={pagination_promotions.promotionsDiscount}
      />
    </div>
  );
}

export default MobileView;

const GridItem = (props: GridProps) => {
  const { promotion, layout, actions, openEditModal } = props;

  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl'
          )}
        >
          <div className="flex w-full gap-2 mt-2">
            <Shapes className="text-[#274c77] dark:text-gray-400" size={20} />
            {promotion.typePromotion}
          </div>
          <div className="flex w-full gap-2 mt-2">
            <CalendarPlus2 className="text-[#006d77] dark:text-gray-400" size={20} />
            {promotion.startDate}
          </div>
          <div className="flex w-full gap-2 mt-2">
            <CalendarMinus2 className="text-[#006d77] dark:text-gray-400" size={20} />
            {promotion.endDate}
          </div>
          <div className="flex w-full gap-2 mt-2">
            <Store className="text-[#00bbf9] dark:text-gray-400" size={20} />
            {promotion.branch.name}
          </div>
          <div className="flex justify-between mt-5 w-full">
            <Button
              isIconOnly
              style={global_styles().secondaryStyle}
              onClick={() => openEditModal({ ...promotion, id: promotion.id })}
            >
              <Edit size={15} />
            </Button>
          </div>
        </div>
      ) : (
        <ListItem
          actions={actions}
          layout="list"
          openEditModal={openEditModal}
          promotion={promotion}
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  // const { theme } = useContext(ThemeContext);
  const { promotion, openEditModal } = props;

  return (
    <>
      <div
        className="flex w-full col-span-1 p-5 border
      -b shadow md:col-span-2 lg:col-span-3 xl:col-span-4"
      >
        <div className="w-full">
          <div className="flex items-center w-full gap-2 mt-2">
            <Shapes className="text-[#274c77] dark:text-gray-400" size={20} />
            {promotion.typePromotion}
          </div>

          <div className="flex items-center w-full gap-2 mt-2">
            <CalendarPlus2 className="text-[#006d77] dark:text-gray-400" size={20} />
            {promotion.startDate}
          </div>
          <div className="flex items-center w-full gap-2 mt-2">
            <CalendarMinus2 className="text-[#00bbf9] dark:text-gray-400" size={20} />
            {promotion.endDate}
          </div>
          <div className="flex items-center w-full gap-2 mt-2">
            <Store className="text-[#00bbf9] dark:text-gray-400" size={20} />
            {promotion.branch.name}
          </div>
          <div className="flex justify-between mt-5 w-full">
            <Button
              isIconOnly
              style={global_styles().secondaryStyle}
              onPress={() => openEditModal({ ...promotion, id: promotion.id })}
            >
              <Edit size={15} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
