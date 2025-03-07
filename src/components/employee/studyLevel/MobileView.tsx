import { Button } from "@heroui/react";
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { BookText, EditIcon, RefreshCcw, ScrollIcon, Lock } from 'lucide-react';

import { GridProps, MobileViewProps } from './types/mobile_view.types';
import { global_styles } from '../../../styles/global.styles';
import { useStatusStudyLevel } from '@/store/studyLevel';
import { ThemeContext } from '@/hooks/useTheme';
import { useContext } from 'react';

function MobileView(props: MobileViewProps) {
  const { layout, deletePopover, handleEdit, actions, handleActive } = props;

  const { paginated_study_level, loading_study_level } = useStatusStudyLevel();
  return (
    <div className="w-full ">
      <DataView
        value={paginated_study_level.studyLevels}
        gutter
        loading={loading_study_level}
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'w-full grid dark:bg-transparent pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5',
          }),
        }}
        color="surface"
        itemTemplate={(cat) => (
          <GridItem
            studyLevel={cat}
            layout={layout}
            deletePopover={deletePopover}
            handleEdit={handleEdit}
            actions={actions}
            handleActive={handleActive}
          />
        )}
        emptyMessage="No se encontraron registros"
      />
    </div>
  );
}

export default MobileView;

const GridItem = (props: GridProps) => {
  const { studyLevel, layout, deletePopover, handleEdit, actions, handleActive } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full border shadow flex flex-col justify-between hover:shadow-lg p-5 dark:border dark:border-gray-600 rounded-2xl'
          )}
          key={studyLevel.id}
        >
          <div className="flex w-full gap-2">
            <BookText className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white"> {studyLevel.name}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <ScrollIcon className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white"> {studyLevel.description}</p>
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes('Editar') && studyLevel.isActive ? (
              <Button
                onClick={() => handleEdit(studyLevel)}
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

            {actions.includes('Eliminar') && studyLevel.isActive ? (
              deletePopover({ studyLevel })
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

            {studyLevel.isActive === false && (
              <>
                {actions.includes('Activar') ? (
                  <Button
                    onClick={() => handleActive(studyLevel.id)}
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
          studyLevel={studyLevel}
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
  const { studyLevel, deletePopover, handleEdit, actions, handleActive } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <div className="flex w-full dark:border-white col-span-1 p-5 border shadow rounded-2xl ">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <BookText className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white"> {studyLevel.name}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <ScrollIcon className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white"> {studyLevel.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-5">
          {actions.includes('Editar') && studyLevel.isActive ? (
            <Button
              onClick={() => handleEdit(studyLevel)}
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

          {actions.includes('Eliminar') && studyLevel.isActive ? (
            deletePopover({ studyLevel })
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

          {studyLevel.isActive === false && (
            <>
              {actions.includes('Activar') ? (
                <Button
                  onClick={() => handleActive(studyLevel.id)}
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
