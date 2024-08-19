import { Button } from '@nextui-org/react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { EditIcon, RefreshCcw, ScrollIcon, Lock } from 'lucide-react';
import { GridProps, MobileViewProps } from './types/mobile_view.types';
import { global_styles } from '../../../styles/global.styles';
import { useStatusEmployeeStore } from '../../../store/statusEmployee';
import ERROR404 from '../../../assets/not-found-error-alert-svgrepo-com.svg';
import { ThemeContext } from '@/hooks/useTheme';
import { useContext } from 'react';

function MobileView(props: MobileViewProps) {
  const { layout, deletePopover, handleEdit, actions, handleActive } = props;

  const { paginated_status_employee, loading_status_employee } = useStatusEmployeeStore();
  return (
    <div className="w-full pb-10">
      {paginated_status_employee.employeeStatus.length > 0 ? (
        <>
          {' '}
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
                handleActive={handleActive}
              />
            )}
            emptyMessage="No se encontraron estados de empleos"
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

export default MobileView;

const GridItem = (props: GridProps) => {
  const { statusEmployees, layout, deletePopover, handleEdit, actions, handleActive } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow dark:border border-gray-600 hover:shadow-lg p-8 rounded-2xl'
          )}
          key={statusEmployees.id}
        >
          <div className="flex w-full gap-2">
            <ScrollIcon className="text-[#274c77] dark:text-gray-400" size={20} />
            {statusEmployees.name}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes('Editar') && statusEmployees.isActive ? (
              <Button
                onClick={() => handleEdit(statusEmployees)}
                isIconOnly
                style={global_styles().secondaryStyle}
              >
                <EditIcon size={20} />
              </Button>
            ) : (
              <Button
                isIconOnly
                style={{
                  backgroundColor: theme.colors.secondary,
                  cursor: 'not-allowed',
                }}
              >
                <Lock style={{ color: theme.colors.primary }} size={20} />
              </Button>
            )}
            {actions.includes('Eliminar') && statusEmployees.isActive ? (
              <>{deletePopover({ statusEmployees })}</>
            ) : (
              <Button isIconOnly style={{ backgroundColor: theme.colors.danger }}>
                <Lock
                  style={{
                    color: theme.colors.primary,
                    cursor: 'not-allowed',
                  }}
                  size={20}
                />
              </Button>
            )}
            {statusEmployees.isActive === false && (
              <>
                {actions.includes('Activar') ? (
                  <Button
                    onClick={() => handleActive(statusEmployees.id)}
                    isIconOnly
                    style={global_styles().thirdStyle}
                  >
                    <RefreshCcw />
                  </Button>
                ) : (
                  <Button
                    isIconOnly
                    style={{
                      ...global_styles().thirdStyle,
                      cursor: 'not-allowed',
                    }}
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
          handleActive={handleActive}
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
  const { statusEmployees, deletePopover, handleEdit, actions, handleActive } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <div className="flex w-full col-span-1 p-5 border shadow rounded-2xl">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <ScrollIcon className="text-[#274c77] dark:text-gray-400" size={20} />
            {statusEmployees.name}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-5">
          {actions.includes('Editar') && statusEmployees.isActive ? (
            <Button
              onClick={() => handleEdit(statusEmployees)}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <EditIcon size={20} />
            </Button>
          ) : (
            <Button
              isIconOnly
              style={{
                backgroundColor: theme.colors.secondary,
                cursor: 'not-allowed',
              }}
            >
              <Lock style={{ color: theme.colors.primary }} size={20} />
            </Button>
          )}
          {actions.includes('Eliminar') && statusEmployees.isActive ? (
            <>{deletePopover({ statusEmployees })}</>
          ) : (
            <Button isIconOnly style={{ backgroundColor: theme.colors.danger }}>
              <Lock
                style={{
                  color: theme.colors.primary,
                  cursor: 'not-allowed',
                }}
                size={20}
              />
            </Button>
          )}
          {statusEmployees.isActive === false && (
            <>
              {actions.includes('Activar') ? (
                <Button
                  onClick={() => handleActive(statusEmployees.id)}
                  isIconOnly
                  style={global_styles().thirdStyle}
                >
                  <RefreshCcw />
                </Button>
              ) : (
                <Button
                  isIconOnly
                  style={{
                    ...global_styles().thirdStyle,
                    cursor: 'not-allowed',
                  }}
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
