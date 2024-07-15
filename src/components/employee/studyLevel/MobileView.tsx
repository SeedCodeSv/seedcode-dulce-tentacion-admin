import { Button } from '@nextui-org/react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { BookText, EditIcon, RefreshCcw, ScrollIcon } from 'lucide-react';

import { GridProps, MobileViewProps } from './types/mobile_view.types';
import { global_styles } from '../../../styles/global.styles';
import { useStatusStudyLevel } from '@/store/studyLevel';

function MobileView(props: MobileViewProps) {
  const { layout, deletePopover, handleEdit, actions, handleActive } = props;

  const { paginated_study_level, loading_study_level } = useStatusStudyLevel();
  return (
    <div className="w-full pb-10">
      <DataView
        value={paginated_study_level.studyLevels}
        gutter
        loading={loading_study_level}
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
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl'
          )}
          key={studyLevel.id}
        >
          <div className="flex w-full gap-2">
            <BookText className="text-[#274c77] dark:text-gray-400" size={20} />
            {studyLevel.name}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <ScrollIcon className="text-[#274c77] dark:text-gray-400" size={20} />
            {studyLevel.description}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes('Editar') && (
              <Button
                onClick={() => handleEdit(studyLevel)}
                isIconOnly
                style={global_styles().secondaryStyle}
              >
                <EditIcon size={20} />
              </Button>
            )}
            {actions.includes('Eliminar') && (
              <>
                {/* {deletePopover({ statusEmployees })} */}
                {studyLevel.isActive ? (
                  deletePopover({ studyLevel })
                ) : (
                  <Button
                    onClick={() => handleActive(studyLevel.id)}
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
  return (
    <>
      <div className="flex w-full p-5 border shadow dark:border-gray-600 rounded-2xl">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <BookText className="text-[#274c77] dark:text-gray-400" size={20} />
            {studyLevel.name}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <ScrollIcon className="text-[#274c77]  dark:text-gray-400" size={20} />
            {studyLevel.description}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-5">
          {actions.includes('Editar') && (
            <Button
              onClick={() => handleEdit(studyLevel)}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <EditIcon size={20} />
            </Button>
          )}
          {actions.includes('Eliminar') && (
            <>
              {/* {deletePopover({ statusEmployees })} */}

              {studyLevel.isActive ? (
                deletePopover({ studyLevel })
              ) : (
                <Button
                  onClick={() => handleActive(studyLevel.id)}
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
