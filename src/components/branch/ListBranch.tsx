import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useBranchesStore } from "../../store/branches.store";
import { Button, Input } from "@nextui-org/react";
import { Edit, PhoneIcon, PlusIcon, SearchIcon, TrashIcon, MapPinIcon } from "lucide-react";
import { ThemeContext } from "../../hooks/useTheme";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmPopup } from "primereact/confirmpopup";

function ListBranch() {
  const { theme } = useContext(ThemeContext);

  const { getBranchesPaginated, branches_paginated } = useBranchesStore();
  const columns = [
    {
      name: "NO.",
      key: "id",
      sortable: true,
    },
    {
      name: "Nombre",
      key: "name",
      sortable: true,
    },
    {
      name: "Dirección",
      key: "address",
      sortable: false,
    },
    {
      name: "Teléfono",
      key: "phone",
      sortable: false,
    },
    {
      name: "Acciones",
      key: "actions",
      sortable: false,
    },
  ];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [limit, setLimit] = useState(8);

  useEffect(() => {
    getBranchesPaginated(1, limit, name, phone, address);
  }, [limit, name, phone, address]);

  const changePage = (page: number) => {
    getBranchesPaginated(page, limit, name, phone, address);
  };

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col w-full gap-4">
        <style>{` .cursor-pagination { background: ${theme.colors.dark}; color: ${theme.colors.primary} } `}</style>
        <div className="grid items-end grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:mt-4">
          <Input
            classNames={{
              base: "w-full bg-white",
              inputWrapper: "border-1 h-10",
            }}
            placeholder="Buscar por nombre..."
            size="sm"
            startContent={<SearchIcon size={20} className="text-default-300" />}
            variant="bordered"
            name="searchName"
            id="searchName"
            value={name}
            autoComplete="search"
            onChange={(e) => setName(e.target.value)}
            isClearable
            onClear={() => setName("")}
          />
          <Input
            classNames={{
              base: "w-full bg-white",
              inputWrapper: "border-1 h-10",
            }}
            placeholder="Buscar por teléfono..."
            size="sm"
            startContent={<SearchIcon size={20} className="text-default-300" />}
            variant="bordered"
            name="searchPhone"
            value={phone}
            id="searchPhone"
            onChange={(e) => setPhone(e.target.value)}
            isClearable
            onClear={() => setPhone("")}
          />
          <Input
            classNames={{
              base: "w-full bg-white",
              inputWrapper: "border-1 h-10",
            }}
            placeholder="Buscar por dirección..."
            size="sm"
            startContent={<SearchIcon size={20} className="text-default-300" />}
            variant="bordered"
            name="searchAddress"
            id="searchAddress"
            value={address}
            autoComplete="search"
            onChange={(e) => setAddress(e.target.value)}
            isClearable
            onClear={() => setAddress("")}
          />
          <div className="col-span-1 md:col-span-3 lg:col-span-1 flex justify-end w-full">
            <Button
              style={{
                backgroundColor: theme.colors.third,
                color: theme.colors.primary,
              }}
              className="h-10 max-w-72"
              endContent={<PlusIcon />}
              size="sm"
              // onClick={() => {
              //   modalAdd.onOpen();
              //   setSelectedBranch(undefined);
              // }}
            >
              Agregar nuevo
            </Button>
          </div>
        </div>
      </div>
    );
  }, [branches_paginated]);

  return (
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
        <div className="w-full grid grid-cols-3 gap-5 mb-10">
          <div>
            <Input placeholder="Escribe para buscar..." startContent={<SearchIcon />} className="w-full" size="lg" variant="bordered" />
          </div>
          <div>
            <Input placeholder="Escribe para buscar..." startContent={<PhoneIcon />}  className="w-full" size="lg" variant="bordered" />
          </div>
          <div>
            <Input placeholder="Escribe para buscar..." startContent={<MapPinIcon />} className="w-full" size="lg" variant="bordered" />
          </div>
        </div>
        <DataTable
          className="shadow"
          emptyMessage="No se encontraron resultados"
          value={branches_paginated.branches}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={{ ...style, borderTopLeftRadius: "10px" }}
            field="id"
            header="No."
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="name"
            header="Nombre"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="phone"
            header="Teléfono"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="address"
            header="Dirección"
          />
          <Column
            headerStyle={{ ...style, borderTopRightRadius: "10px" }}
            header="Acciones"
            body={(item) => (
              <div className="flex w-full gap-5">
                <DeletePopUp id={item.id} />
                <Button
                  size="lg"
                  // onClick={() => {
                  //   setSelectedId(item.id);
                  //   modalChangePassword.onOpen();
                  // }}
                  isIconOnly
                  style={{
                    backgroundColor: theme.colors.third,
                    color: theme.colors.primary,
                  }}
                >
                  <Edit />
                </Button>
              </div>
            )}
          />
        </DataTable>
        {/* <Table isHeaderSticky topContent={topContent} topContentPlacement="outside">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className="font-semibold"
                style={{
                  backgroundColor: theme.colors.dark,
                  color: theme.colors.primary,
                }}
                align={column.key === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={branches_paginated.branches}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "id" && item.id}
                    {columnKey === "name" && item.name}
                    {columnKey === "address" && item.address}
                    {columnKey === "phone" && item.phone}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table> */}
      </div>
    </div>
  );
}

export default ListBranch;

interface Props {
  id: number;
}

const DeletePopUp = ({ id }: Props) => {
  const buttonRef = useRef<HTMLButtonElement>();

  const { theme } = useContext(ThemeContext);

  const [visible, setVisible] = useState(false);

  const handleDelete = () => {};

  return (
    <>
      <Button
        ref={buttonRef as any}
        style={{
          backgroundColor: theme.colors.danger,
          color: theme.colors.primary,
        }}
        size="lg"
        isIconOnly
        onClick={() => setVisible(!visible)}
      >
        <TrashIcon size={20} />
      </Button>
      <ConfirmPopup
        visible={visible}
        onHide={() => setVisible(false)}
        target={buttonRef.current}
        message="¿Deseas eliminar esta sucursal?"
        content={({ message, acceptBtnRef, rejectBtnRef }) => (
          <>
            <div className="p-5 border border-gray-100 shadow-2xl rounded-xl">
              <p className="text-lg font-semibold text-center">{message}</p>
              <div className="flex justify-between gap-5 mt-5">
                <Button
                  ref={acceptBtnRef}
                  size="lg"
                  className="font-semibold"
                  style={{
                    backgroundColor: theme.colors.third,
                    color: theme.colors.primary,
                  }}
                >
                  Eliminar
                </Button>
                <Button size="lg" ref={rejectBtnRef}>
                  Cancelar
                </Button>
              </div>
            </div>
          </>
        )}
      />
    </>
  );
};
