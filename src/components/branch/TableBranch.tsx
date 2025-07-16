import { useBranchesStore } from "../../store/branches.store";
import { Branches } from "../../types/branches.types";
import LoadingTable from "../global/LoadingTable";
import EmptyTable from "../global/EmptyTable";

import { TableComponent } from "@/themes/ui/table-ui";

interface Props {
  actionsElement: (item: Branches) => JSX.Element;
}

function TableBranch(props: Props) {
  const { branches_paginated, loading } = useBranchesStore();

  return (
    <>
      <TableComponent
        className="overflow-auto"
        headers={['Nº', 'Nombre', 'Teléfono', 'Dirección', 'Acciones']}>
        {loading ? (
          <tr>
            <td
              className="p-3 text-sm text-center text-slate-500"
              colSpan={5}
            >
              <LoadingTable />
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
                  <EmptyTable />
                </td>
              </tr>
            )}
          </>
        )}
      </TableComponent>
    </>
  );
}

export default TableBranch;
