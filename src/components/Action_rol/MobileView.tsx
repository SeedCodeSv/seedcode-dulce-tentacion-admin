import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { Laptop, SquareStack, UsersRound } from 'lucide-react';
import { GridProps, MobileViewProps } from './types/mobile_view.types';
import { useActionsRolStore } from '../../store/actions_rol.store';

function MobileView(props: MobileViewProps) {
  const { layout, actions } = props;
  const { actions_roles_grouped } = useActionsRolStore();
  return (
    <div className="w-full pb-10">
      <DataView
        value={actions_roles_grouped}
        gutter
        // loading={loading_categories}
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5',
          }),
        }}
        color="surface"
        itemTemplate={(cat) => (
          <GridItem
            action={cat}
            layout={layout}
            //   deletePopover={deletePopover}
            //   handleEdit={handleEdit}
            actions={actions}
            //   handleActive={handleActive}
          />
        )}
        emptyMessage="No category found"
      />
    </div>
  );
}

export default MobileView;

const GridItem = (props: GridProps) => {
  const { action, layout, actions } = props;
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl'
          )}
        >
          <div className="flex w-full gap-2 mt-2">
            <UsersRound className="text-[#274c77] dark:text-gray-400" size={35} />
            {action.role}
          </div>
          <div className="flex w-full gap-2 mt-2">
            <Laptop className="text-[#00bbf9] dark:text-gray-400" size={35} />
            {action.view}
          </div>
          <div className="flex w-full gap-2 mt-2">
            <SquareStack className="text-[#006d77] dark:text-gray-400" size={35} />
            {action.action.join(', ')}
          </div>
          {/* <div className="flex justify-between mt-5 w-ful">
            {actions.includes('Editar') && (
              <Button
                onClick={() => handleEdit(category)}
                isIconOnly
                style={global_styles().secondaryStyle}
              >
                <EditIcon size={20} />
              </Button>
            )}
            {actions.includes('Eliminar') && (
              <>
                {category.isActive ? (
                  deletePopover({ category })
                ) : (
                  <Button
                    onClick={() => handleActive(category.id)}
                    isIconOnly
                    style={global_styles().thirdStyle}
                  >
                    <RefreshCcw />
                  </Button>
                )}
              </>
            )}
          </div> */}
        </div>
      ) : (
        <ListItem
          //   handleActive={handleActive}
          action={action}
          layout="list"
          //   deletePopover={deletePopover}
          //   handleEdit={handleEdit}
          actions={actions}
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { action } = props;
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2 mt-2">
            <UsersRound className="text-[#274c77] dark:text-gray-400" size={35} />
            {action.role}
          </div>

          <div className="flex items-center w-full gap-2 mt-2">
            <Laptop className="text-[#006d77] dark:text-gray-400" size={35} />
            {action.view}
          </div>
          <div className="flex items-center w-full gap-2 mt-2">
            <SquareStack className="text-[#00bbf9] dark:text-gray-400" size={35} />
            {action.action.join(', ')}
          </div>
        </div>
        {/* <div className="flex flex-col items-end justify-between w-full gap-5">
          {actions.includes('Editar') && (
            <Button
              onClick={() => handleEdit(category)}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <EditIcon size={20} />
            </Button>
          )}
          {actions.includes('Eliminar') && (
            <>
              {category.isActive ? (
                deletePopover({ category })
              ) : (
                <Button
                  onClick={() => handleActive(category.id)}
                  isIconOnly
                  style={global_styles().thirdStyle}
                >
                  <RefreshCcw />
                </Button>
              )}
            </>
          )}
        </div> */}
      </div>
    </>
  );
};
