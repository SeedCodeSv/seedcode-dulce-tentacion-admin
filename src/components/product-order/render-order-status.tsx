import { Chip } from "@heroui/react";
import { Check, Clock, Settings, TriangleAlert } from "lucide-react";

export type Status = 'Abierta' | 'En Proceso' | 'Completada' | 'Completada Parcial';
export const StautsProductOrder = [
  'Abierta', 
  'En Proceso', 
  'Completada', 
  'Completada Parcial'
]

type StatusColors = 'warning' | 'primary' | 'success' | 'danger';

export const RenderStatus = ({ status }: { status: Status }) => {
  const statusColor: Record<Status, StatusColors> = {
    Abierta: 'warning',
    'En Proceso': 'primary',
    'Completada Parcial': 'danger',
    Completada: 'success',
  };

  return (
    <div className="flex gap-3">
      <Chip
        className="px-4"
        color={statusColor[status] || 'default'}
        startContent={
          <>
            {status === 'En Proceso' && <Settings className="" size={20} />}
            {status === 'Abierta' && <Clock className="text-white" size={20} />}
            {status === 'Completada Parcial' && <TriangleAlert className="text-white" size={20} />}
            {status === 'Completada' && <Check className="text-white" size={20} />}
          </>
        }
      >
        <span className="text-xs text-white select-none">{status}</span>
      </Chip>
    </div>
  );
};
