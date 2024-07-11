import Layout from '@/layout/Layout';
import React, { useState } from 'react';
type Role = 'AGREGAR' | 'MOSTRAR' | 'ACTUALIZAR' | 'ELIMINAR' ;
type roles =
  | 'Administrador';

const roles: Role[] = ['AGREGAR', 'MOSTRAR', 'ACTUALIZAR', 'ELIMINAR'];
const permissions: roles[] = [
  'Administrador'
  
];

type State = Record<Role, Record<roles, boolean>>;

const initialState: State = {
  AGREGAR: {
    Administrador: false,
  },
  MOSTRAR: {
    Administrador: false,
  },
  ACTUALIZAR: {
    Administrador: false,
  },
  ELIMINAR: {
    Administrador: false,
  },
};

const PermissionTable: React.FC = () => {
  const [state, setState] = useState<State>(initialState);

  const handleCheckboxChange = (role: Role, permission: roles) => {
    setState((prevState) => ({
      ...prevState,
      [role]: {
        ...prevState[role],
        [permission]: !prevState[role][permission],
      },
    }));
  };

  return (
    <Layout title="Asignar nuevas acciones">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b border-gray-200">Permissions</th>
                  {roles.map((role) => (
                    <th key={role} className="px-4 py-2 border-b border-gray-200 text-center">
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission}>
                    <td className="px-4 py-2 border-b border-gray-200">{permission}</td>
                    {roles.map((role) => (
                      <td key={role} className="px-4 py-2 border-b border-gray-200 text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={state[role][permission]}
                          onChange={() => handleCheckboxChange(role, permission)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PermissionTable;
