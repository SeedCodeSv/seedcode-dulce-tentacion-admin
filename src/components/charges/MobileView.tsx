import { Button } from "@heroui/react";
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { EditIcon, RefreshCcw, ScrollIcon } from 'lucide-react';
import { global_styles } from '../../styles/global.styles';
import { GridProps, MobileViewProps } from './types/mobile_view.types';
import { useChargesStore } from '../../store/charges.store';
import TooltipGlobal from '../global/TooltipGlobal';
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

function MobileView(props: MobileViewProps) {
  const { layout, deletePopover, handleEdit, actions, handleActive } = props;
  const { charges_paginated } = useChargesStore();
  return (
    <div className="w-full pb-10">
      <DataView
        value={charges_paginated.charges}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "w-full grid dark:bg-transparent pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5",
          }),
        }}
        color="surface"
        className='dark:text-white'
        itemTemplate={(cat) => (
          <GridItem
            charges={cat}
            layout={layout}
            deletePopover={deletePopover}
            handleEdit={handleEdit}
            actions={actions}
            handleActive={handleActive}
          />
        )}
        emptyMessage="No se encontraron resultados"
      />
    </div>
  );
}

export default MobileView;

const GridItem = (props: GridProps) => {
  const { charges, layout, deletePopover, handleEdit, actions, handleActive } = props;
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            "w-full shadow dark:border border-gray-600 hover:shadow-lg p-8 rounded-2xl"
          )}
          key={charges.id}
        >
          <div className="flex w-full gap-2">
            <ScrollIcon className="text-[#274c77] dark:text-gray-400" size={35} />
            <p className="w-full dark:text-white">{charges.name}</p> 
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes('Editar') && (
               
              <ButtonUi
                onPress={() => handleEdit(charges)}
                isIconOnly
                theme={Colors.Success}
              >
                <EditIcon size={20} />
              </ButtonUi>
     
            )}
            {actions.includes('Eliminar') && (
              <>
                {charges.isActive ? (
                  deletePopover({ charges })
                ) : (
                  <Button
                    onClick={() => handleActive(charges.id)}
                    isIconOnly
                    style={global_styles().thirdStyle}
                  >
                    <RefreshCcw />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <ListItem
          handleActive={handleActive}
          charges={charges}
          layout="list"
          deletePopover={deletePopover}
          handleEdit={handleEdit}
          actions={actions}
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { charges, deletePopover, handleEdit, actions, handleActive } = props;
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border shadow rounded-2xl ">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <ScrollIcon className="text-[#274c77] dark:text-gray-400" size={35} />
            <p className="w-full dark:text-white">{charges.name}</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-5">
          {actions.includes('Editar') && (
             <TooltipGlobal text="Editar">
            <Button
              onClick={() => handleEdit(charges)}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <EditIcon size={20} />
            </Button>
            </TooltipGlobal>
          )}
          {actions.includes('Eliminar') && (
            <>
              {charges.isActive ? (
                deletePopover({ charges })
              ) : (
                <Button
                  onClick={() => handleActive(charges.id)}
                  isIconOnly
                  style={global_styles().thirdStyle}
                >
                  <RefreshCcw />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
