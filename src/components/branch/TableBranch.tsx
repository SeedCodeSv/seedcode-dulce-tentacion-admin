import React from 'react';
import { useBranchesStore } from '../../store/branches.store';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { global_styles } from '../../styles/global.styles';
import { Branches } from '../../types/branches.types';
import useWindowSize from '../../hooks/useWindowSize';

interface Props {
  actionsElement: (item: Branches) => JSX.Element;
}

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
          header="No."
        />
        <Column
          headerClassName="text-sm font-semibold"
          headerStyle={global_styles().darkStyle}
          field="name"
          header="Nombre"
        />
        <Column
          headerClassName="text-sm font-semibold"
          headerStyle={global_styles().darkStyle}
          field="phone"
          header="Teléfono"
        />
        <Column
          headerClassName="text-sm font-semibold"
          headerStyle={global_styles().darkStyle}
          field="address"
          header="Dirección"
        />
        <Column
          headerStyle={{
            ...global_styles().darkStyle,
            borderTopRightRadius: '10px',
          }}
          header="Acciones"
          body={(item) => props.actionsElement(item)}
        />
      </DataTable>
    </>
  );
}

export default TableBranch;
