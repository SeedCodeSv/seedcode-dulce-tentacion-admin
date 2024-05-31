import { Button } from '@nextui-org/react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { useConfigurationStore } from '../../store/perzonalitation.store';
import { global_styles } from '../../styles/global.styles';
import { GridProps, MovileViewProps } from './types/mobile-configuarion.types';
import { Image } from 'primereact/image';

function MobileViewConfi(props: MovileViewProps) {
  const { layout, handleEdit } = props;
  const { personalization } = useConfigurationStore();

  return (
    <div className="w-full ">
      <DataView
        value={personalization}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "grid dark:bg-slate-800 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5",
          }),
        }}
        color="surface"
        itemTemplate={(cat) => (
          <GridItem configuration={cat} layout={layout} handleEdit={handleEdit} />
        )}
        emptyMessage="No ay datos de logo ni nombre..."
      />
    </div>
  );
}

export default MobileViewConfi;

const GridItem = (props: GridProps) => {
  const { configuration, layout, handleEdit } = props;
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full lg:ml-96 md:ml-48 xl:ml-96 flex bg-white dark:bg-gray-800 flex-col border items-center shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl'
          )}
          key={configuration.id}
        >
          <div className="flex w-full gap-2 justify-center dark:text-white">
            {configuration.name}
          </div>
          <div className="flex justify-center mt-5 w-ful">
            <Image src={configuration.logo} alt={configuration.name} preview width="90" />
          </div>
          <Button className='mt-3' onClick={() => handleEdit(configuration)} style={global_styles().darkStyle}>
            Actualizar
          </Button>
        </div>
      ) : (
        <ListItem configuration={configuration} layout="list" handleEdit={handleEdit} />
      )}
    </>
  );
};



const ListItem = (props: GridProps) => {
  const { configuration, handleEdit } = props;
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4 bg-red">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            {configuration.name}
          </div>
          <div className="ml[-10px] w-full">
            <Image src={configuration.logo} alt={configuration.name} width="75" preview />
          </div>
        </div>

        <Button onClick={() => handleEdit(configuration)} style={global_styles().darkStyle}>
          Actualizar
        </Button>
      </div>
    </>
  );
};
