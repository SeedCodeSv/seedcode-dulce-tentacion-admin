import { Button } from '@nextui-org/react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { EditIcon, ScrollIcon } from 'lucide-react';

import { GridProps, MobileViewProps } from './types/mobile_view.types';
import { global_styles } from '../../../styles/global.styles';
import { useStatusEmployeeStore } from '../../../store/statusEmployee';

function MobileView(props: MobileViewProps) {
  const { layout, deletePopover, handleEdit, actions } = props;

  const { paginated_status_employee, loading_status_employee } = useStatusEmployeeStore();
  return (
    <div className="w-full pb-10">
      <DataView
        value={paginated_status_employee.employeeStatus}
        gutter
        loading={loading_status_employee}
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
            statusEmployees={cat}
            layout={layout}
            deletePopover={deletePopover}
            handleEdit={handleEdit}
            actions={actions}
            // handleActive={handleActive}
          />
        )}
        emptyMessage="No se encontraron estados de empleos"
      />
    </div>
  );
}

export default MobileView;

const GridItem = (props: GridProps) => {
  const { statusEmployees, layout, deletePopover, handleEdit, actions } = props;
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl'
          )}
          key={statusEmployees.id}
        >
          <div className="flex w-full gap-2">
            <ScrollIcon className="text-[#274c77] dark:text-gray-400" size={20} />
            {statusEmployees.name}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes('Editar') && (
              <Button
                onClick={() => handleEdit(statusEmployees)}
                isIconOnly
                style={global_styles().secondaryStyle}
              >
                <EditIcon size={20} />
              </Button>
            )}
            {actions.includes('Eliminar') && (
              <>
               {deletePopover({ statusEmployees })}
                {/* {statusEmployees.isActive ? (
                  deletePopover({ statusEmployees })
                ) : (
                  <Button
                    onClick={() => handleActive(statusEmployees.id)}
                    isIconOnly
                    style={global_styles().thirdStyle}
                  >
                    <RefreshCcw />
                  </Button>
                )} */}
              </>
            )}
          </div>
        </div>
      ) : (
        <ListItem
          // handleActive={handleActive}
          statusEmployees={statusEmployees}
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
  const { statusEmployees, deletePopover, handleEdit, actions } = props;
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <ScrollIcon className="text-[#274c77] dark:text-gray-400" size={20} />
            {statusEmployees.name}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-5">
          {actions.includes('Editar') && (
            <Button
              onClick={() => handleEdit(statusEmployees)}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <EditIcon size={20} />
            </Button>
          )}
          {actions.includes('Eliminar') && (
            <>
              {deletePopover({ statusEmployees })}

              {/* {statusEmployees.isActive ? (
                deletePopover({ statusEmployees })
              ) : (
                <Button
                  onClick={() => handleActive(statusEmployees.id)}
                  isIconOnly
                  style={global_styles().thirdStyle}
                >
                  <RefreshCcw />
                </Button>
              )} */}
            </>
          )}
        </div>
      </div>
    </>
  );
};
