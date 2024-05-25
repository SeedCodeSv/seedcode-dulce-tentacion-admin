import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../hooks/useTheme";
import { useExpenseStore } from "../../store/expenses.store";
import {
  Button,
  ButtonGroup,
  Input,
  useDisclosure,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import {
  IExpense, /*IExpensePayloads*/
  IGetExpense
} from "../../types/expenses.types";
import {
  EditIcon,
  User,
  TrashIcon,
  Table as ITable,
  CreditCard,
  List,
  Files,
} from "lucide-react";
// import Zoom from "react-medium-image-zoom";
import AddButton from "../global/AddButton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Pagination from "../global/Pagination";
import { Paginator } from "primereact/paginator";
import { paginator_styles } from "../../styles/paginator.styles";
import ModalGlobal from "../global/ModalGlobal";
import AddExpenses from "./AddExpenses";
import MobileView from "./MobileView";
import { formatCurrency } from "../../utils/dte";
import { limit_options } from "../../utils/constants";
import Anexo from "./Anexo";
// import { Document, Page } from 'react-pdf';
const ListExpenses = () => {
  const { theme } = useContext(ThemeContext);
  const { getExpensesPaginated, expenses_paginated } = useExpenseStore();
  const [selectedCategory, setSelectedCategory] = useState<IExpense>();
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(8);

  useEffect(() => {
    getExpensesPaginated(1, 1, limit, category);
  }, []);

  const handleSearch = (name: string | undefined) => {
    getExpensesPaginated(1, 1, limit, name ?? category);
  };

  const modalAdd = useDisclosure();
  const showAnexo = useDisclosure();

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const [view, setView] = useState<"table" | "grid" | "list">("table");

  const handleEdit = (item: IExpense) => {
    setSelectedCategory(item);
    modalAdd.onOpen();
  };

  const [selectedExpense, setSelectedExpense] = useState<IGetExpense>()
  const openAnexoModal = (expense: IGetExpense): void => {
    setSelectedExpense(expense)
    showAnexo.onOpen()
  }
  return (
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col w-full p-5 rounded">
        <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
          <div className="flex items-end gap-3">
            <div className="flex items-end gap-3">
              <Input
                startContent={<User />}
                className="w-full xl:w-96 dark:text-white"
                variant="bordered"
                labelPlacement="outside"
                label="Nombre"
                classNames={{
                  label: "font-semibold text-gray-700",
                  inputWrapper: "pr-0",
                }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                onClick={() => handleSearch(undefined)}
              >
                Buscar
              </Button>
            </div>
          </div>
          <div className="flex items-end justify-between w-full gap-10 lg:justify-end">
            <ButtonGroup>
              <Button
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
            className="w-44 dark:text-white"
            variant="bordered"
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
            {limit_options.map((option) => (
              <SelectItem key={option} className="dark:text-white">
                {option}
              </SelectItem>
            ))}
          </Select>
        </div>
        {(view === "grid" || view === "list") && (
          <MobileView
            deletePopover={DeletePopUp}
            layout={view as "grid" | "list"}
            handleEdit={handleEdit}
          />
        )}
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
              body={(rowData) => formatCurrency(Number(rowData.total))}
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
                    style={{
                      backgroundColor: theme.colors.secondary,
                    }}
                  >
                    <EditIcon
                      style={{ color: theme.colors.primary }}
                      size={20}
                    />
                  </Button>
                  <Button
                    isIconOnly
                    aria-label="Abrir PDF"
                    style={{
                      backgroundColor: theme.colors.secondary,
                    }}
                    onClick={() => openAnexoModal(item)}
                  >
                    <Files
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
        {expenses_paginated.totalPag > 1 && (
          <>
            <div className="hidden w-full mt-5 md:flex">
              <Pagination
                previousPage={expenses_paginated.prevPag}
                nextPage={expenses_paginated.nextPag}
                currentPage={expenses_paginated.currentPag}
                totalPages={expenses_paginated.totalPag}
                onPageChange={(page) => {
                  getExpensesPaginated(1, page, limit, category);
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
          </>
        )}
      </div>
      <ModalGlobal
        size="w-full sm:w-[500px]"
        title={selectedCategory ? "Editar gastos" : "Nueva gastos"}
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
      >
        <AddExpenses
          closeModal={modalAdd.onClose}
          expenses={selectedCategory}
        />
      </ModalGlobal>
      
        {selectedExpense && (
          <Anexo
            expenses={selectedExpense}
            clear={() => {
              showAnexo.onClose()
              setSelectedExpense(undefined)
            }}
          />
        )}
    
    </div>
  );
};

export default ListExpenses;

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
            <p className="font-semibold text-gray-600 dark:text-white">
              Eliminar
            </p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
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
