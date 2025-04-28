import { Button } from "@heroui/react";
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { Image } from 'primereact/image';

import { useConfigurationStore } from '../../store/perzonalitation.store';
import { global_styles } from '../../styles/global.styles';

import { GridProps, MovileViewProps } from './types/mobile-configuarion.types';

function MobileViewConfi(props: MovileViewProps) {
  const { layout, handleEdit } = props;
  const { personalization } = useConfigurationStore();

  return (
    <div className="w-full ">
      <DataView
        gutter
        color="surface"
        emptyMessage="No se encontraron resultados"
        itemTemplate={(cat) => (
          <GridItem configuration={cat} handleEdit={handleEdit} layout={layout} />
        )}
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "grid dark:bg-gray-900 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5",
          }),
        }}
        value={personalization}
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
          key={configuration.id}
          className={classNames(
            'w-full lg:ml-96 md:ml-48 xl:ml-96 flex bg-white dark:bg-gray-900 flex-col border items-center shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl'
          )}
        >
          <div className="flex w-full gap-2 justify-center dark:text-white">
            {configuration.name}
          </div>
          <div className="flex justify-center mt-5 w-ful">
            <Image preview alt={configuration.name} src={configuration.logo} width="90" />
          </div>
          <Button className='mt-3' style={global_styles().darkStyle} onClick={() => handleEdit(configuration)}>
            Actualizar
          </Button>
        </div>
      ) : (
        <ListItem configuration={configuration} handleEdit={handleEdit} layout="list" />
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
            <Image preview alt={configuration.name} src={configuration.logo} width="75" />
          </div>
        </div>

        <Button style={global_styles().darkStyle} onClick={() => handleEdit(configuration)}>
          Actualizar
        </Button>
      </div>
    </>
  );
};
