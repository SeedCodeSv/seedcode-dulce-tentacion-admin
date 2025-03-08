import { useBranchesStore } from "../../store/branches.store";
import { Branches } from "../../types/branches.types";
import NO_DATA from "@/assets/svg/no_data.svg";

/* eslint-disable no-unused-vars */
interface Props {
  actionsElement: (item: Branches) => JSX.Element;
}
/* eslint-enable no-unused-vars */

function TableBranch(props: Props) {
  const { branches_paginated, loading } = useBranchesStore();

  return (
    <>
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
                Teléfono
              </th>
              <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                Dirección
              </th>
              <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="max-h-[600px] w-full overflow-y-auto">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-3 text-sm text-center text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center w-full h-64">
                    <div className="loader"></div>
                    <p className="mt-3 text-xl font-semibold">Cargando...</p>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {branches_paginated.branches.length > 0 ? (
                  <>
                    {branches_paginated.branches.map((branch) => (
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {branch.id}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {branch.name}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {branch.phone}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          {branch.address}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                         {props.actionsElement(branch)}
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="flex flex-col items-center justify-center w-full">
                        <img src={NO_DATA} alt="X" className="w-32 h-32" />
                        <p className="mt-3 text-xl">
                          No se encontraron resultados
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TableBranch;
