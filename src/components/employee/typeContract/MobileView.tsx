import { Button } from '@nextui-org/react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { EditIcon, RefreshCcw, ScrollIcon, Lock } from 'lucide-react';
import { GridProps, MobileViewProps } from './types/mobile_view.types';
import { global_styles } from '../../../styles/global.styles';
import { useContractTypeStore } from '../../../store/contractType';
import { useContext } from 'react';
import { ThemeContext } from '@/hooks/useTheme';

function MobileView(props: MobileViewProps) {
  const { layout, deletePopover, handleEdit, actions, handleActive } = props;

  const { loading_contract_type, paginated_contract_type } = useContractTypeStore();
  return (
    <div className="w-full ">
      <DataView
        value={paginated_contract_type.contractTypes}
        gutter
        loading={loading_contract_type}
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'grid   grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5',
          }),
        }}
        color="surface"
        itemTemplate={(cat) => (
          <GridItem
            ContractTypes={cat}
            layout={layout}
            deletePopover={deletePopover}
            handleEdit={handleEdit}
            actions={actions}
            handleActive={handleActive}
          />
        )}
        emptyMessage="No se encontraron tipos de contrato"
      />
    </div>
  );
}

export default MobileView;

const GridItem = (props: GridProps) => {
  const { theme } = useContext(ThemeContext);
  const { ContractTypes, layout, deletePopover, handleEdit, actions, handleActive } = props;
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full border shadow flex flex-col justify-between hover:shadow-lg p-5 dark:border dark:border-gray-600 rounded-2xl'
          )}
          key={ContractTypes.id}
        >
          <div className="flex w-full gap-2">
            <ScrollIcon className="text-blue-500 dark:text-blue-300" size={20} />
            {ContractTypes.name}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes('Editar') && ContractTypes.isActive ? (
              <Button
                onClick={() => handleEdit(ContractTypes)}
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
            {actions.includes('Eliminar') && ContractTypes.isActive ? (
              deletePopover({ ContractTypes })
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
            {ContractTypes.isActive === false && (
              <>
                {actions.includes('Activar') ? (
                  <Button
                    onClick={() => handleActive(ContractTypes.id)}
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
          ContractTypes={ContractTypes}
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
  const { theme } = useContext(ThemeContext);
  const { ContractTypes, deletePopover, handleEdit, actions, handleActive } = props;
  return (
    <>
      <div className="flex w-full p-5 border shadow dark:border-gray-600 rounded-2xl">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <ScrollIcon className="text-blue-500 dark:text-blue-300" size={20} />
            {ContractTypes.name}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-5">
          {actions.includes('Editar') && ContractTypes.isActive ? (
            <Button
              onClick={() => handleEdit(ContractTypes)}
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
          {actions.includes('Eliminar') && ContractTypes.isActive ? (
            deletePopover({ ContractTypes })
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
          {ContractTypes.isActive === false && (
            <>
              {actions.includes('Activar') ? (
                <Button
                  onClick={() => handleActive(ContractTypes.id)}
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
