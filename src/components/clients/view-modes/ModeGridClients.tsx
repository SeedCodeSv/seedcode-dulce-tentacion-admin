import TooltipGlobal from '@/components/global/TooltipGlobal';
import { global_styles } from '@/styles/global.styles';
import { Button } from "@heroui/react";
import classNames from 'classnames';
import {
  User as IUser,
  EditIcon,
  Mail,
  Phone,
  Repeat,
  Users2Icon,
  RefreshCcw,
  Dock,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { DeletePopover } from './DeleteClients';
import { PropsCustomersModes } from '@/components/categories/types/mobile-view.types';
function ModeGridClients(props: PropsCustomersModes) {
  const navigate = useNavigate();
  return (
    <div className="grid dark:bg-gray-900 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5">
      {props.customers.map((c) => (
        <div
          key={c.id}
          className={classNames(
            'w-full shadow border dark:border-gray-600 hover:shadow-lg p-5 rounded-2xl'
          )}
        >
          <div className="flex items-center gap-2 mb-3">
            <IUser className="text-[#274c77] dark:text-gray-400" size={20} />
            <p className="w-full dark:text-white">{c.nombre}</p>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Phone className="text-[#274c77] dark:text-gray-400" size={20} />
            <p className="w-full dark:text-white">{c.telefono}</p>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Mail className="text-[#274c77] dark:text-gray-400" size={20} />
            <p className="w-full dark:text-white">{c.correo}</p>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Dock className="text-[#274c77] dark:text-gray-400" size={20} />
            <p className="w-full dark:text-white">{c.numDocumento}</p>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Users2Icon className="text-[#274c77] dark:text-gray-400" size={20} />
            <p className="w-full dark:text-white">
              {c.esContribuyente ? 'Contribuyente' : 'Consumidor final'}
            </p>
          </div>
          <div className="flex justify-between mt-5 w-full">
            {props.actions.includes('Editar') && c.isActive && (
              <TooltipGlobal text="Editar">
                <Button
                  onClick={() =>
                    navigate(`/add-customer/${c.id}/${c.esContribuyente ? 'tribute' : 'normal'}`)
                  }
                  isIconOnly
                  style={global_styles().secondaryStyle}
                >
                  <EditIcon size={20} />
                </Button>
              </TooltipGlobal>
            )}
            {props.actions.includes('Eliminar') && c.isActive && (
              <>{props.customers && <DeletePopover customers={c} />}</>
            )}

            {props.actions.includes('Cambiar Tipo de Cliente') && c.isActive && (
              <>
                {c.esContribuyente === false && c.isActive && (
                  <TooltipGlobal text="Cambiar tipo de cliente">
                    <Button
                      onClick={() => navigate(`/add-customer/${c.id}/tribute`)}
                      isIconOnly
                      style={global_styles().thirdStyle}
                    >
                      <Repeat size={20} />
                    </Button>
                  </TooltipGlobal>
                )}
              </>
            )}

            {c.isActive === false && (
              <>
                {props.actions.includes('Activar Cliente') && (
                  <TooltipGlobal text="Activar">
                    <Button
                      onClick={() => {
                        props.handleActivate(c.id);
                      }}
                      isIconOnly
                      style={global_styles().thirdStyle}
                    >
                      <RefreshCcw size={20} />
                    </Button>
                  </TooltipGlobal>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ModeGridClients;
