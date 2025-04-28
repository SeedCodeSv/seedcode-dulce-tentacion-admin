import { useBranchesStore } from "../../store/branches.store";
import { Branches } from "../../types/branches.types";

import ThGlobal from "@/themes/ui/th-global";
import NO_DATA from "@/assets/svg/no_data.svg";

interface Props {
  actionsElement: (item: Branches) => JSX.Element;
}

function TableBranch(props: Props) {
  const { branches_paginated, loading } = useBranchesStore();

  return (
    <>
      <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
        <table className="w-full">
          <thead className="sticky top-0 z-20 bg-white">
            <tr>
              <ThGlobal className="text-left p-3">
                No.
              </ThGlobal>
              <ThGlobal className="text-left p-3">
                Nombre
              </ThGlobal>
              <ThGlobal className="text-left p-3">
                Teléfono
              </ThGlobal>
              <ThGlobal className="text-left p-3">
                Dirección
              </ThGlobal>
              <ThGlobal className="text-left p-3">
                Acciones
              </ThGlobal>
            </tr>
          </thead>
          <tbody className="max-h-[600px] w-full overflow-y-auto">
            {loading ? (
              <tr>
                <td
                  className="p-3 text-sm text-center text-slate-500"
                  colSpan={5}
                >
                  <div className="flex flex-col items-center justify-center w-full h-64">
                    <div className="loader" />
                    <p className="mt-3 text-xl font-semibold">Cargando...</p>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {branches_paginated.branches.length > 0 ? (
                  <>
                    {branches_paginated.branches.map((branch, key) => (
                      <tr key={key} className="border-b border-slate-200">
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
                        <img alt="X" className="w-32 h-32" src={NO_DATA} />
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
