import {  FaUserShield } from 'react-icons/fa';
import { useContext, useEffect, useState, useCallback } from 'react';
import AddButton from '../global/AddButton';

import { get_roles_list } from '@/services/users.service';
import { Role } from '@/types/auth.types';
import { get_actions_by_role } from '@/services/actions_rol.service';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ThemeContext } from '@/hooks/useTheme';
import { Action, GroupedAction } from '@/types/contract_type.types';
import { UserRoundCheck } from 'lucide-react';
import { useNavigate } from 'react-router';

const ListActionRol = () => {
  const [rolId, setRolId] = useState(0);
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleActions, setRoleActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(false);

  const { theme } = useContext(ThemeContext);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await get_roles_list();
      if (data) {
        setRoles(data.data.roles);
      }
    }  finally {
      setLoading(false);
    }
  }, []);

  const fetchActionsByRole = useCallback(async () => {
    if (rolId) {
      try {
        setLoading(true);
        const data = await get_actions_by_role(rolId);
        if (data) {
          setRoleActions(data.data.roleActions);
        }
      }  finally {
        setLoading(false);
      }
    }
  }, [rolId]);

  useEffect(() => {
    fetchRoles();
    fetchActionsByRole();
  }, [fetchRoles, fetchActionsByRole]);

  const groupActionsByModule = (actions: Action[]): GroupedAction[] => {
    const groupedActions = actions.reduce(
      (acc, action) => {
        const moduleName = action.action.view.name;
        if (!acc[moduleName]) {
          acc[moduleName] = { moduleName, actions: [], role: action.role.name };
        }
        acc[moduleName].actions.push(action.action.name);
        return acc;
      },
      {} as { [key: string]: GroupedAction }
    );

    return Object.values(groupedActions);
  };

  const groupedActions = groupActionsByModule(roleActions);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  // const actionIcon = (actionName: string) => {
  //   switch (actionName) {
  //     case 'Mostrar':
  //       return <FaEye />;
  //     case 'Editar':
  //       return <FaEdit />;
  //     case 'Eliminar':
  //       return <FaTrashAlt />;
  //     case 'Agregar':
  //       return <FaPlus />;
  //     default:
  //       return null;
  //   }
  // };
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="flex items-start gap-3"></div>
            <div className="flex w-full">
              <div className="flex items-end justify-end">
                <AddButton onClick={() => navigate('/AddActionRol')} />
              </div>
            </div>
          </div>
          <div className="grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => setRolId(role.id)}
                className="relative w-full shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl flex items-center"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setRolId(role.id)}
                aria-pressed={rolId === role.id}
              >
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
                  {role.id}
                </div>
                <div className="w-16 h-16 rounded-full mr-4">
                  <UserRoundCheck size={40} color="green" />
                </div>
                <p className="font-semibold dark:text-white">{role.name}</p>
              </div>
            ))}
          </div>

          {rolId > 0 && (
            <DataTable
              className="shadow"
              emptyMessage="No se encontraron resultados"
              value={groupedActions}
              tableStyle={{ minWidth: '50rem' }}
              loading={loading}
            >
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
                field="moduleName"
                header="Modulo"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                // body={(rowData) => (
                //   <div>
                //     {rowData.actions.map((action, index) => (
                //       <span key={index} className="flex items-center gap-2">
                //         {actionIcon(action)} {action}
                //       </span>
                //     ))}
                //   </div>
                // )}
                header="Acciones"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                body={(rowData) => (
                  <div className="flex items-center gap-2">
                    <FaUserShield />
                    {rowData.role}
                  </div>
                )}
                field="role"
                header="Rol"
              />
            </DataTable>
          )}
        </div>
      </div>
    </>
  );
};

export default ListActionRol;
