import { Button } from "@heroui/react";
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
        gutter
        className="dark:text-white"
        color="surface"
        emptyMessage="No se encontraron resultados"
        itemTemplate={(correlative) => (
          <GridItem
            actions={actions}
            correlative={correlative}
            layout={layout}
            openEditModal={openEditModal}
          />
        )}
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'w-full grid dark:bg-transparent pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5 mt-5',
          }),
        }}
        value={correlatives}
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
            'w-full shadow flex flex-col justify-between hover:shadow-lg p-5 border border-white rounded-2xl'
          )}
        >
          <div className="space-y-2">
            {' '}
            {/* Se agregó un espacio vertical entre cada bloque */}
            <div className="flex w-full gap-2 items-center">
              {' '}
              {/* Se agregaron items-center para alinear íconos */}
              <Barcode className="dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">
                Codigo : {correlative.code.trim() !== '' ? correlative.code : 'N/A'}
              </p>
            </div>
            <div className="flex w-full gap-2 items-center">
              <ScrollText className="dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">
                Tipo de Factura :{' '}
                {correlativesTypes.find((t) => t.value === correlative.typeVoucher)
                  ? `${correlativesTypes.find((t) => t.value === correlative.typeVoucher)?.value} - ${correlativesTypes.find((t) => t.value === correlative.typeVoucher)?.label}`
                  : 'Tipo no encontrado'}
              </p>
            </div>
            <div className="flex w-full gap-2 items-center">
              <Proportions className="dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">Resolucion : {correlative.resolution}</p>
            </div>
            <div className="flex w-full gap-2 items-center">
              <Columns3 className="dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">Serie : {correlative.serie}</p>
            </div>
            <div className="flex w-full gap-2 items-center">
              <Minus className="dark:text-blue-300" />
              <p className="w-full dark:text-white">Inicio : {correlative.from}</p>
            </div>
            <div className="flex w-full gap-2 items-center">
              <Diff className="dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">Fin : {correlative.to}</p>
            </div>
            <div className="flex w-full gap-2 items-center">
              <ArrowLeft className="dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">Anterior : {correlative.prev}</p>
            </div>
            <div className="flex w-full gap-2 items-center">
              <ArrowRight className="dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">Siguiente : {correlative.next}</p>
            </div>
            <div className="flex w-full gap-2 items-center">
              <Store className="dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">
                Sucursal : {correlative?.branch?.name ?? 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex justify-between mt-5 w-full">
            {actions.includes('Editar') && (
              <TooltipGlobal text="Editar">
                <Button
                  isIconOnly
                  style={global_styles().secondaryStyle}
                  onClick={() => openEditModal(correlative)}
                >
                  <EditIcon size={20} />
                </Button>
              </TooltipGlobal>
            )}
          </div>
        </div>
      ) : (
        <ListItem
          actions={actions}
          correlative={correlative}
          layout="list"
          openEditModal={openEditModal}
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { correlative, openEditModal, actions } = props;

  return (
    <>
      <div className="flex w-full col-span-1 p-5 border border-white shadow rounded-2xl">
        <div className="w-full space-y-2">
          {' '}
          {/* Se añadió space-y-2 para separar las filas */}
          <div className="flex w-full gap-2 items-center">
            {' '}
            {/* items-center para alinear los íconos y el texto */}
            <Barcode className="dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">
              Codigo : {correlative.code.trim() !== '' ? correlative.code : 'N/A'}
            </p>
          </div>
          <div className="flex w-full gap-2 items-center">
            <ScrollText className="dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">
              Tipo de Factura :{' '}
              {correlativesTypes.find((t) => t.value === correlative.typeVoucher)
                ? `${correlativesTypes.find((t) => t.value === correlative.typeVoucher)?.value} - ${correlativesTypes.find((t) => t.value === correlative.typeVoucher)?.label}`
                : 'Tipo no encontrado'}
            </p>
          </div>
          <div className="flex w-full gap-2 items-center">
            <Proportions className="dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">Resolucion : {correlative.resolution}</p>
          </div>
          <div className="flex w-full gap-2 items-center">
            <Columns3 className="dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">Serie : {correlative.serie}</p>
          </div>
          <div className="flex w-full gap-2 items-center">
            <Minus className="dark:text-blue-300" />
            <p className="w-full dark:text-white">Inicio : {correlative.from}</p>
          </div>
          <div className="flex w-full gap-2 items-center">
            <Diff className="dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">Fin : {correlative.to}</p>
          </div>
          <div className="flex w-full gap-2 items-center">
            <ArrowLeft className="dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">Anterior : {correlative.prev}</p>
          </div>
          <div className="flex w-full gap-2 items-center">
            <ArrowRight className="dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">Siguiente : {correlative.next}</p>
          </div>
          <div className="flex w-full gap-2 items-center">
            <Store className="dark:text-blue-300" size={20} />
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
