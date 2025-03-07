import TooltipGlobal from '@/components/global/TooltipGlobal';
import { Button } from "@heroui/react";
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

import { DeletePopover } from './DeleteClients';
import { useNavigate } from 'react-router';
import useGlobalStyles from '@/components/global/global.styles';
import { PropsCustomersModes } from '@/components/categories/types/mobile-view.types';

function ModeListClients(props: PropsCustomersModes) {
  const navigate = useNavigate();
  const styles = useGlobalStyles();
  return (
    <div className="grid dark:bg-gray-900 pb-10 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 2xl:grid-cols-1  gap-5 mt-5">
      {props.customers.map((c) => (
        <div className="flex w-full border dark:border-gray-600 rounded-2xl shadow p-5">
          <div className="w-full">
            <div className="flex w-full gap-2">
              <div>
                <IUser className="text-[#274c77] dark:text-gray-400" size={20} />
              </div>
              <p className="text-[#274c77] dark:text-white font-semibold">
                Nombre: <span className="font-normal">{c.nombre}</span>
              </p>
            </div>
            <div className="flex items-center w-full gap-2 mt-3">
              <div>
                <Phone className="text-[#274c77] dark:text-gray-400" size={20} />
              </div>
              <p className="text-[#274c77] dark:text-white font-semibold">
                Telefono: <span className="font-normal">{c.telefono}</span>
              </p>
            </div>
            <div className="flex items-center w-full gap-2 mt-3">
              <div>
                <Mail className="text-[#274c77] dark:text-gray-400" size={20} />
              </div>
              <p className="text-[#274c77] dark:text-white font-semibold">
                Correo: <span className="font-normal">{c.correo}</span>
              </p>
            </div>
            <div className="flex items-center w-full gap-2 mt-3">
              <div>
                <Dock className="text-[#274c77] dark:text-gray-400" size={20} />
              </div>
              <p className="text-[#274c77] dark:text-white font-semibold">
                Documento: <span className="font-normal">{c.numDocumento}</span>
              </p>
            </div>
            <div className="flex items-center w-full gap-2 mt-3">
              <div>
                <Users2Icon className="text-[#274c77] dark:text-gray-400" size={20} />
              </div>
              <p className="text-[#274c77] dark:text-white font-semibold">
                Contribuyente:{' '}
                <span className="font-normal">{c.esContribuyente ? 'Si' : 'No'}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 justify-between w-full">
            {props.actions.includes('Editar') && c.isActive && (
              <TooltipGlobal text="Editar">
                <Button
                  onClick={() =>
                    navigate(`/add-customer/${c.id}/${c.esContribuyente ? 'tribute' : 'normal'}`)
                  }
                  isIconOnly
                  style={styles.secondaryStyle}
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
                      style={styles.thirdStyle}
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
                      style={styles.thirdStyle}
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

export default ModeListClients;
