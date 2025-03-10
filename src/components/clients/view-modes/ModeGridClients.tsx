import TooltipGlobal from '@/components/global/TooltipGlobal';
import { global_styles } from '@/styles/global.styles';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';

import { EditIcon, Repeat, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { DeletePopover } from './DeleteClients';
import { PropsCustomersModes } from '@/components/categories/types/mobile-view.types';
import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';
function ModeGridClients(props: PropsCustomersModes) {
  const navigate = useNavigate();
  return (
    <div className="grid dark:bg-gray-900 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5">
      {props.customers.map((c, index) => (
        <Card key={index}>
          <CardHeader>{c.nombre}</CardHeader>
          <CardBody>
            <p>
              <span className="font-semibold">Correo:</span>
              {c.correo}
            </p>
            <p>
              <span className="font-semibold">Telefono:</span>
              {c.telefono}
            </p>
            <p>
              <span className="font-semibold">Direccion:</span>
              {`${c.direccion?.nombreDepartamento} ${c.direccion?.municipio} ${c.direccion?.complemento}`}
            </p>
            <div className="flex w-full gap-2 mt-3">
              <span
                className={`px-2 text-white rounded-lg ${
                  c.esContribuyente ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {c.esContribuyente ? 'CONTRIBUYENTE' : 'CONSUMIDOR FINAL'}
              </span>
            </div>
          </CardBody>
          <CardHeader className="flex gap-5">
            <div className="flex justify-between mt-5 w-full">
              {props.actions.includes('Editar') && c.isActive && (
                <TooltipGlobal text="Editar">
                  <ButtonUi
                    onPress={() =>
                      navigate(`/add-customer/${c.id}/${c.esContribuyente ? 'tribute' : 'normal'}`)
                    }
                    isIconOnly
                    theme={Colors.Primary}
                  >
                    <EditIcon size={20} />
                  </ButtonUi>
                </TooltipGlobal>
              )}
              {props.actions.includes('Eliminar') && c.isActive && (
                <>{props.customers && <DeletePopover customers={c} />}</>
              )}

              {props.actions.includes('Cambiar Tipo de Cliente') && c.isActive && (
                <>
                  {c.esContribuyente === false && c.isActive && (
                    <TooltipGlobal text="Cambiar tipo de cliente">
                      <ButtonUi
                        onPress={() => navigate(`/add-customer/${c.id}/tribute`)}
                        isIconOnly
                        theme={Colors.Info}
                      >
                        <Repeat size={20} />
                      </ButtonUi>
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
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default ModeGridClients;
