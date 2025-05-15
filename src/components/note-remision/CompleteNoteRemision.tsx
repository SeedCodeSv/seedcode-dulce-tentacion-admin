import { Button } from '@heroui/react';
import { useState } from 'react';

import HeadlessModal from '../global/HeadlessModal';
import useGlobalStyles from '../global/global.styles';

import { ReferalNote } from '@/types/referal-note.types';
import { useReferalNote } from '@/store/referal-notes';
import { formatSimpleDate } from '@/utils/dates';

interface Props {
  note: ReferalNote;
  onClose: () => void;
}

export const CompleteNoteModal = ({ note, onClose }: Props) => {
  const globalStyles = useGlobalStyles();
  const { completeReferalNote } = useReferalNote();
  const [isLoading, setIsLoading] = useState(false);

  const handleCompleteNote = async () => {
    setIsLoading(true);
    const ok = await completeReferalNote(note.id);

    setIsLoading(false);
    if (ok) onClose();
  };

  return (
    <>
      <HeadlessModal
        isOpen={true}
        size="p-4 max-w-[500px]"
        title="Completar nota de remisión"
        onClose={onClose}
      >
        <section className="flex flex-col gap-3 p-3">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Fecha:{' '}
            <span className="font-semibold">
              {formatSimpleDate(`${note.fecEmi}|${note.horEmi}`)}
            </span>
          </p>

          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Numero control: <span className="font-semibold">{note.numeroControl}</span>
          </p>

          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Código generación: <span className="font-semibold">{note.codigoGeneracion}</span>
          </p>

          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Sucursal: <span className="font-semibold">{note.branch.name}</span>
          </p>

          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Empleado: <span className="font-semibold">{note.employee.fullName}</span>
          </p>

          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Observaciones: <span className="font-semibold">{note.observaciones}</span>
          </p>

          <footer className="flex gap-3 mt-2">
            <Button
              isDisabled={isLoading}
              isLoading={isLoading}
              style={globalStyles.secondaryStyle}
              onPress={() => handleCompleteNote()}
            >
              Completar
            </Button>

            <Button style={globalStyles.dangerStyles} onClick={onClose}>
              Cancelar
            </Button>
          </footer>
        </section>
      </HeadlessModal>
    </>
  );
};
