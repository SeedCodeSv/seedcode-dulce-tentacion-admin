import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from "../../hooks/useTheme";
import { useExpenseStore } from '../../store/expenses.store';
import { Button, ButtonGroup, Input, useDisclosure,  Select,
    SelectItem,
    Popover,
    PopoverTrigger,
    PopoverContent, } from '@nextui-org/react';
import {IExpense} from "../../types/expenses.types"
import {
    EditIcon,
    Search,
    TrashIcon,
    Table as ITable,
    CreditCard,
    List,
  } from "lucide-react";
import AddButton from '../global/AddButton';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Pagination from "../global/Pagination";
import { Paginator } from "primereact/paginator";
import { paginator_styles } from "../../styles/paginator.styles";
import ModalGlobal from "../global/ModalGlobal";
import AddExpenses from "./AddExpenses"
const ListExpenses = () => {
    const { theme } = useContext(ThemeContext);

    const { getExpensesPaginated, expenses_paginated } =
      useExpenseStore();
  
    const [selectedCategory, setSelectedCategory] = useState<IExpense>();
  
    const [category, setCategory] = useState("");
    const [limit, setLimit] = useState(8);
  
    useEffect(() => {
        getExpensesPaginated(1, 1, limit, category);
    }, []);
  
    const handleSearch = (name: string | undefined) => {
        getExpensesPaginated( 1,1, limit, name ?? category);
    };
  
    const modalAdd = useDisclosure();
  
    const style = {
      backgroundColor: theme.colors.dark,
      color: theme.colors.primary,
    };
  
    const [view, setView] = useState<"table" | "grid" | "list">("table");
  
    const handleEdit = (item: IExpense) => {
      setSelectedCategory(item);
      modalAdd.onOpen();
    };
  
  return (
    <div className="w-full h-full p-5 bg-gray-50">
    <div className="flex flex-col w-full p-5 bg-white rounded">
      <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
        <div className="flex items-end gap-3">
          <div className="flex items-end gap-3">
            <Input
              startContent={<Search />}
              className="w-full xl:w-96"
              variant="bordered"
              labelPlacement="outside"
              label="Buscar"
              classNames={{
                label: "font-semibold text-gray-700",
                inputWrapper: "pr-0",
              }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="lg"
              placeholder="Escribe para buscar..."
              isClearable
              onClear={() => {
                setCategory("");
                handleSearch("");
              }}
            />
            <Button
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary,
              }}
              className="font-semibold"
              color="primary"
              size="lg"
              onClick={() => handleSearch(undefined)}
            >
              Buscar
            </Button>
          </div>
        </div>
        <div className="flex items-end justify-between w-full gap-10 lg:justify-end">
          <ButtonGroup>
            <Button
              size="lg"
              isIconOnly
              color="secondary"
              style={{
                backgroundColor:
                  view === "table" ? theme.colors.third : "#e5e5e5",
                color: view === "table" ? theme.colors.primary : "#3e3e3e",
              }}
              onClick={() => setView("table")}
            >
              <ITable />
            </Button>
            <Button
              size="lg"
              isIconOnly
              color="default"
              style={{
                backgroundColor:
                  view === "grid" ? theme.colors.third : "#e5e5e5",
                color: view === "grid" ? theme.colors.primary : "#3e3e3e",
              }}
              onClick={() => setView("grid")}
            >
              <CreditCard />
            </Button>
            <Button
              size="lg"
              isIconOnly
              color="default"
              style={{
                backgroundColor:
                  view === "list" ? theme.colors.third : "#e5e5e5",
                color: view === "list" ? theme.colors.primary : "#3e3e3e",
              }}
              onClick={() => setView("list")}
            >
              <List />
            </Button>
          </ButtonGroup>
          <AddButton
            onClick={() => {
              setSelectedCategory(undefined);
              modalAdd.onOpen();
            }}
          />
        </div>
      </div>
      <div className="flex justify-end w-full mb-5">
        <Select
          className="w-44"
          variant="bordered"
          size="lg"
          label="Mostrar"
          labelPlacement="outside"
          classNames={{
            label: "font-semibold",
          }}
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value !== "" ? e.target.value : "5"));
          }}
        >
          <SelectItem key={"5"}>5</SelectItem>
          <SelectItem key={"10"}>10</SelectItem>
          <SelectItem key={"20"}>20</SelectItem>
          <SelectItem key={"30"}>30</SelectItem>
          <SelectItem key={"40"}>40</SelectItem>
          <SelectItem key={"50"}>50</SelectItem>
          <SelectItem key={"100"}>100</SelectItem>
        </Select>
      </div>
      {/* {(view === "grid" || view === "list") && (
        <MobileView
          deletePopover={DeletePopUp}
          layout={view as "grid" | "list"}
          handleEdit={handleEdit}
        />
      )} */}
      {view === "table" && (
        <DataTable
          className="w-full shadow"
          emptyMessage="No se encontraron resultados"
          value={expenses_paginated.expenses}
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
            field="categoryExpense.name"
            header="Categoría"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="total"
            header="Total"
          />
          <Column
            headerClassName="text-sm font-semibold"
            headerStyle={style}
            field="description"
            header="Descripción"
          />
          <Column
            headerStyle={{ ...style, borderTopRightRadius: "10px" }}
            header="Acciones"
            body={(item) => (
              <div className="flex gap-6">
                <Button
                  onClick={() => handleEdit(item)}
                  isIconOnly
                  size="lg"
                  style={{
                    backgroundColor: theme.colors.secondary,
                  }}
                >
                  <EditIcon
                    style={{ color: theme.colors.primary }}
                    size={20}
                  />
                </Button>
                <DeletePopUp expenses={item} />
              </div>
            )}
          />
        </DataTable>
      )}
      <div className="hidden w-full mt-5 md:flex">
        <Pagination
          previousPage={expenses_paginated.prevPag}
          nextPage={expenses_paginated.nextPag}
          currentPage={expenses_paginated.currentPag}
          totalPages={expenses_paginated.totalPag}
          onPageChange={(page) => {
            getExpensesPaginated(1,page, limit, category);
          }}
        />
      </div>
      <div className="flex w-full mt-5 md:hidden">
        <Paginator
          pt={paginator_styles(1)}
          className="flex justify-between w-full"
          first={expenses_paginated.currentPag}
          rows={limit}
          totalRecords={expenses_paginated.total}
          template={{
            layout: "PrevPageLink CurrentPageReport NextPageLink",
          }}
          currentPageReportTemplate="{currentPage} de {totalPages}"
        />
      </div>
    </div>
    <ModalGlobal
      size="lg"
      title={
        selectedCategory
          ? "Editar categoría de gastos"
          : "Nueva categoría de gastos"
      }
      isOpen={modalAdd.isOpen}
      onClose={modalAdd.onClose}
    >
      <AddExpenses
        closeModal={modalAdd.onClose}
        expenses={selectedCategory}
      />
    </ModalGlobal>
  </div>
  )
}

export default ListExpenses

interface Props {
  expenses: IExpense;
}
const DeletePopUp = ({ expenses }: Props) => {
  const { theme } = useContext(ThemeContext);

  const { deleteExpenses } = useExpenseStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteExpenses(expenses.id);
    onClose();
  };

  return (
    <>
      <Popover isOpen={isOpen} onClose={onClose} backdrop="blur" showArrow>
        <PopoverTrigger>
          <Button
            onClick={onOpen}
            isIconOnly
            style={{
              backgroundColor: theme.colors.danger,
            }}
            size="lg"
          >
            <TrashIcon
              style={{
                color: theme.colors.primary,
              }}
              size={20}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-full p-5">
            <p className="font-semibold text-gray-600">
              Eliminar
            </p>
            <p className="mt-3 text-center text-gray-600 w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="mt-4">
              <Button onClick={onClose}>No, cancelar</Button>
              <Button
                onClick={() => handleDelete()}
                className="ml-5"
                style={{
                  backgroundColor: theme.colors.danger,
                  color: theme.colors.primary,
                }}
              >
                Si, eliminar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};