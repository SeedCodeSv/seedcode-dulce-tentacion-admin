import { useState, useEffect, useContext, useMemo } from "react";
import { useBranchesStore } from "../../store/branches.store";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { ThemeContext } from "../../hooks/useTheme";

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
    <div className="w-full h-full p-5 bg-gray-50">
      <div className="hidden w-full p-5 bg-white rounded lg:flex">
        <Table isHeaderSticky topContent={topContent} topContentPlacement="outside">
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
        </Table>
      </div>
    </div>
  );
}

export default ListBranch;
