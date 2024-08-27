import { Button } from '@nextui-org/react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import {
  ArrowLeft,
  ArrowRight,
  Barcode,
  Columns3,
  Diff,
  EditIcon,
  Minus,
  Proportions,
  ScrollText,
  Store,
} from 'lucide-react';

import { GridProps, IMobileViewProps } from '../types/mobile_correlatives_types';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { global_styles } from '@/styles/global.styles';
import { useCorrelativesStore } from '@/store/correlatives-store/correlatives.store';
import { correlativesTypes } from '@/types/correlatives/correlatives_data.types';

function MobileView(props: IMobileViewProps) {
  const { correlatives } = useCorrelativesStore();
  const { layout, openEditModal, actions } = props;

  return (
    <div className="w-full pb-10">
      <DataView
        className="dark:text-white"
        value={correlatives}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'w-full grid dark:bg-transparent pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5 mt-5',
          }),
        }}
        color="surface"
        itemTemplate={(correlative) => (
          <GridItem
            correlative={correlative}
            layout={layout}
            openEditModal={openEditModal}
            actions={actions}
          />
        )}
        emptyMessage="No se encontraron resultados"
      />
    </div>
  );
}
const GridItem = (props: GridProps) => {
  const { layout, correlative, openEditModal, actions } = props;
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow flex flex-col justify-between hover:shadow-lg p-5 border border-white  rounded-2xl'
          )}
        >
          <div>
            <div className="flex w-full gap-2">
              <Barcode className=" dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">
                Codigo : {correlative.code.trim() !== '' ? correlative.code : 'N/A'}
              </p>
            </div>
            <div className="flex w-full gap-2">
              <ScrollText className=" dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">
                Tipo de Factura :{' '}
                {correlativesTypes.find((t) => t.value === correlative.typeVoucher)
                  ? `${correlativesTypes.find((t) => t.value === correlative.typeVoucher)?.value} - ${correlativesTypes.find((t) => t.value === correlative.typeVoucher)?.label}`
                  : 'Tipo no encontrado'}
              </p>
            </div>
            <div className="flex w-full gap-2">
              <Proportions className=" dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">Resolucion : {correlative.resolution}</p>
            </div>
            <div className="flex w-full gap-2">
              <Columns3 className=" dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">Serie : {correlative.serie}</p>
            </div>
            <div className="flex w-full gap-2">
              <Minus className=" dark:text-blue-300" />
              <p className="w-full dark:text-white">Inicio : {correlative.from}</p>
            </div>
            <div className="flex w-full gap-2">
              <Diff className=" dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">Fin : {correlative.to}</p>
            </div>
            <div className="flex w-full gap-2">
              <ArrowLeft className=" dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">Anterior : {correlative.prev}</p>
            </div>
            <div className="flex w-full gap-2">
              <ArrowRight className=" dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">Siguiente : {correlative.next}</p>
            </div>
            <div className="flex w-full gap-2">
              <Store className=" dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">
                Sucursal : {correlative?.branch?.name ?? 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes('Editar') && (
              <TooltipGlobal text="Editar">
                <Button
                  onClick={() => openEditModal(correlative)}
                  isIconOnly
                  style={global_styles().secondaryStyle}
                >
                  <EditIcon size={20} />
                </Button>
              </TooltipGlobal>
            )}
          </div>
        </div>
      ) : (
        <ListItem
          correlative={correlative}
          layout="list"
          openEditModal={openEditModal}
          actions={actions}
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { correlative, openEditModal, actions } = props;
  return (
    <>
      <div className="flex w-full col-span-1 p-5  border border-white shadow rounded-2xl ">
        <div className="w-full">
          <div className="flex w-full gap-2">
            <Barcode className=" dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">
              Codigo : {correlative.code.trim() !== '' ? correlative.code : 'N/A'}
            </p>
          </div>
          <div className="flex w-full gap-2">
            <ScrollText className=" dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">
              Tipo de Factura :{' '}
              {correlativesTypes.find((t) => t.value === correlative.typeVoucher)
                ? `${correlativesTypes.find((t) => t.value === correlative.typeVoucher)?.value} - ${correlativesTypes.find((t) => t.value === correlative.typeVoucher)?.label}`
                : 'Tipo no encontrado'}
            </p>
          </div>
          <div className="flex w-full gap-2">
            <Proportions className=" dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">Resolucion : {correlative.resolution}</p>
          </div>
          <div className="flex w-full gap-2">
            <Columns3 className=" dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">Serie : {correlative.serie}</p>
          </div>
          <div className="flex w-full gap-2">
            <Minus className=" dark:text-blue-300" />
            <p className="w-full dark:text-white">Inicio : {correlative.from}</p>
          </div>
          <div className="flex w-full gap-2">
            <Diff className=" dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">Fin : {correlative.to}</p>
          </div>
          <div className="flex w-full gap-2">
            <ArrowLeft className=" dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">Anterior : {correlative.prev}</p>
          </div>
          <div className="flex w-full gap-2">
            <ArrowRight className=" dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">Siguiente : {correlative.next}</p>
          </div>
          <div className="flex w-full gap-2">
            <Store className=" dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">
              Sucursal : {correlative?.branch?.name ?? 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-4">
          {actions.includes('Editar') && (
            <TooltipGlobal text="Editar">
              <Button
                isIconOnly
                style={global_styles().secondaryStyle}
                onClick={() => {
                  openEditModal(correlative);
                }}
              >
                <EditIcon size={20} />
              </Button>
            </TooltipGlobal>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileView;
