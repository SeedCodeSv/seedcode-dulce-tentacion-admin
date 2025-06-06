import { Chip } from "@heroui/react";
import { Check, Clock, Settings, X } from "lucide-react";

export type Status = 'Abierta' | 'En Proceso' | 'Completada' | 'Cancelada';
type StatusColors = 'warning' | 'primary' | 'success' | 'danger';

export const RenderStatus = ({ status }: { status: Status }) => {
  const statusColor: Record<Status, StatusColors> = {
    Abierta: 'warning',
    'En Proceso': 'primary',
    Completada: 'success',
    Cancelada: 'danger',
  };

  return (
    <div className="flex gap-3">
      <Chip
        className="px-4"
        color={statusColor[status] || 'default'}
        endContent={
          <>
            {status === 'En Proceso' && <Settings className=" animate-spin" size={20} />}
            {status === 'Abierta' && <Clock className="text-white" size={20} />}
            {status === 'Cancelada' && <X className="text-white" size={20} />}
            {status === 'Completada' && <Check className="text-white" size={20} />}
          </>
        }
      >
        <span className="text-xs text-white">{status}</span>
      </Chip>
    </div>
  );
};

export const RenderIconStatus = ({ status }: { status: Status }) => {
  return (
    <div className="flex">
        <span className="text-xs max-w-24 flex justify-between w-full">{status}{status === 'En Proceso' && <Settings className="text-blue-400" size={20} />}
          {status === 'Abierta' && <Clock className="text-yellow-400" size={20} />}
          {status === 'Cancelada' && <X className="text-red-400" size={20} />}
          {status === 'Completada' && <Check className="text-green-400" size={20} />}</span>
    </div>
  );
};
