import {
  CreditCard,
  List,
  Plus,
  Table as ITable,
  EditIcon,
  Key,
  RefreshCcw,
  TrashIcon,
  Eye,
} from 'lucide-react';
import { Theme } from '../hooks/useTheme';
import { Button, ButtonGroup } from '@nextui-org/react';
import TooltipGlobal from './global/TooltipGlobal';

interface Props {
  theme: Theme;
}

function Table({ theme }: Props) {
  const personas = [
    {
      nombre: 'Juan Pérez',
      edad: 30,
      correo: 'juan.perez@example.com',
      direccion: {
        calle: 'Calle Falsa',
        numero: 123,
        ciudad: 'Ciudad de México',
        pais: 'México',
      },
    },
    {
      nombre: 'Ana Gómez',
      edad: 25,
      correo: 'ana.gomez@example.com',
      direccion: {
        calle: 'Avenida Siempre Viva',
        numero: 742,
        ciudad: 'Lima',
        pais: 'Perú',
      },
    },
    {
      nombre: 'Carlos López',
      edad: 40,
      correo: 'carlos.lopez@example.com',
      direccion: {
        calle: 'Boulevard del Sol',
        numero: 456,
        ciudad: 'Buenos Aires',
        pais: 'Argentina',
      },
    },
    {
      nombre: 'María Fernández',
      edad: 35,
      correo: 'maria.fernandez@example.com',
      direccion: {
        calle: 'Avenida Libertador',
        numero: 789,
        ciudad: 'Santiago',
        pais: 'Chile',
      },
    },
  ];

  return (
    <>
      <div className="flex justify-between items-end">
        <ButtonGroup>
          <Button
            isIconOnly
            color="secondary"
            style={{
              backgroundColor: theme.colors.third,
              color: theme.colors.primary,
            }}
          >
            <ITable />
          </Button>
          <Button isIconOnly color="default">
            <CreditCard />
          </Button>
          <Button isIconOnly color="default">
            <List />
          </Button>
        </ButtonGroup>
        <Button
          endContent={<Plus size={20} />}
          style={{
            backgroundColor: theme.colors.third,
            color: theme.colors.primary,
          }}
          className=" hidden font-semibold md:flex"
          type="button"
        >
          Agregar nuevo
        </Button>
        <Button
          type="button"
          style={{
            backgroundColor: theme.colors.third,
            color: theme.colors.primary,
          }}
          className="flex font-semibold md:hidden"
          isIconOnly
        >
          <Plus />
        </Button>
      </div>
      <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
        <table className="w-full">
          <thead className="sticky top-0 z-20 bg-white">
            <tr>
              <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                No.
              </th>

              <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                Nombre
              </th>
              <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                Edad
              </th>
              <th className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                Dirección
              </th>

              <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                Ciudad
              </th>
              <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="max-h-[600px] w-full overflow-y-auto">
            {personas.map((item, index) => (
              <tr className="border-b border-slate-200">
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{index + 1}</td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{item.nombre}</td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{item.edad}</td>
                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{item.correo}</td>
                <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100">
                  {item.direccion.ciudad}
                </td>

                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                  <div className="flex w-full gap-5">
                    <TooltipGlobal text="Editar">
                      <Button
                        isIconOnly
                        style={{
                          backgroundColor: theme.colors.secondary,
                        }}
                      >
                        <EditIcon
                          style={{
                            color: theme.colors.primary,
                          }}
                          size={20}
                        />
                      </Button>
                    </TooltipGlobal>
                    <TooltipGlobal text="Ver detalle">
                      <Button
                        isIconOnly
                        style={{
                          backgroundColor: theme.colors.third,
                        }}
                      >
                        <Eye
                          style={{
                            color: theme.colors.primary,
                          }}
                          size={20}
                        />
                      </Button>
                    </TooltipGlobal>
                    <TooltipGlobal text="Cambiar Contraseña">
                      <Button
                        isIconOnly
                        style={{
                          backgroundColor: theme.colors.warning,
                        }}
                      >
                        <Key color={theme.colors.primary} size={20} />
                      </Button>
                    </TooltipGlobal>

                    <TooltipGlobal text="Eliminar">
                      <Button
                        isIconOnly
                        style={{
                          backgroundColor: theme.colors.danger,
                        }}
                      >
                        <TrashIcon
                          style={{
                            color: theme.colors.primary,
                          }}
                          size={20}
                        />
                      </Button>
                    </TooltipGlobal>
                    <TooltipGlobal text="Activar">
                      <Button
                        isIconOnly
                        style={{
                          backgroundColor: theme.colors.third,
                        }}
                      >
                        <RefreshCcw
                          style={{
                            color: theme.colors.primary,
                          }}
                          size={20}
                        />
                      </Button>
                    </TooltipGlobal>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;
