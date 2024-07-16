import { useBranchesStore } from '../../store/branches.store';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { global_styles } from '../../styles/global.styles';
import { Branches } from '../../types/branches.types';
import useWindowSize from '../../hooks/useWindowSize';

/* eslint-disable no-unused-vars */
interface Props {
  actionsElement: (item: Branches) => JSX.Element;
}
/* eslint-enable no-unused-vars */

function TableBranch(props: Props) {
  const { branches_paginated } = useBranchesStore();

  const { windowSize } = useWindowSize();

  return (
    <>
      <DataTable
        className="shadow"
        emptyMessage="No se encontraron resultados"
        value={branches_paginated.branches}
        tableStyle={{ minWidth: windowSize.width < 768 ? '50rem' : '100%' }}
      >
        <Column
          headerClassName="text-sm font-semibold"
          headerStyle={{
            ...global_styles().darkStyle,
            borderTopLeftRadius: '10px',
          }}
          field="id"
          bodyClassName={"dark:text-white"}
          header="No."
        />
        <Column
          headerClassName="text-sm font-semibold"
          headerStyle={global_styles().darkStyle}
          field="name"
          bodyClassName={"dark:text-white"}
          header="Nombre"
        />
        <Column
          headerClassName="text-sm font-semibold"
          headerStyle={global_styles().darkStyle}
          field="phone"
          bodyClassName={"dark:text-white"}
          header="Teléfono"
        />
        <Column
          headerClassName="text-sm font-semibold"
          headerStyle={global_styles().darkStyle}
          field="address"
          bodyClassName={"dark:text-white"}
          header="Dirección"
        />
        <Column
          headerStyle={{
            ...global_styles().darkStyle,
            borderTopRightRadius: '10px',
          }}
          bodyClassName={"dark:text-white"}
          header="Acciones"
          body={(item) => props.actionsElement(item)}
        />
      </DataTable>
    </>
  );
}

export default TableBranch;
