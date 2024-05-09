import { useContext, useEffect, useState } from "react";
import { useCategoriesExpenses } from "../../store/categories_expenses.store.ts";
import { ThemeContext } from "../../hooks/useTheme";
import {
  Input,
  Button,
  useDisclosure,
  ButtonGroup,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { CategoryExpense } from "../../types/categories_expenses.types.ts";
import {
  EditIcon,
  User,
  TrashIcon,
  Table as ITable,
  CreditCard,
  List,
} from "lucide-react";
import AddButton from "../global/AddButton";
import MobileView from "./MobileView";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Pagination from "../global/Pagination";
import { Paginator } from "primereact/paginator";
import { paginator_styles } from "../../styles/paginator.styles";
import ModalGlobal from "../global/ModalGlobal";
import AddExpensesCategories from "../../components/expenses_categories/AddExpensesCategories";
const ListExpensesCategories = () => {
  const { theme } = useContext(ThemeContext);

  const { paginated_categories_expenses, getPaginatedCategoriesExpenses } =
    useCategoriesExpenses();

  const [selectedCategory, setSelectedCategory] = useState<
    { id: number; name: string } | undefined
  >();

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    getPaginatedCategoriesExpenses(1, limit, search);
  }, [limit]);

  const handleSearch = (name: string | undefined) => {
    getPaginatedCategoriesExpenses(1, limit, name ?? search);
  };

  const modalAdd = useDisclosure();

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const [view, setView] = useState<"table" | "grid" | "list">("table");

  const handleEdit = (item: CategoryExpense) => {
    setSelectedCategory({
      id: item.id,
      name: item.name,
    });
    modalAdd.onOpen();
  };

  return (
    <div className="w-full h-full p-5 bg-gray-50">
      <div className="flex flex-col w-full p-5 bg-white rounded">
        <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
          <div className="flex items-end gap-3">
            <div className="flex items-end gap-3">
              <Input
                startContent={<User />}
                className="w-full xl:w-96"
                variant="bordered"
                labelPlacement="outside"
                label="Nombre"
                classNames={{
                  label: "font-semibold text-gray-700",
                  inputWrapper: "pr-0",
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="lg"
                placeholder="Escribe para buscar..."
                isClearable
                onClear={() => {
                  setSearch("");
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
            value={paginated_categories_expenses.categoryExpenses}
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
                  <DeletePopUp categoryExpenses={item} />
                </div>
              )}
            />
          </DataTable>
        )}
        {paginated_categories_expenses.totalPag > 1 && (
          <>
            <div className="hidden w-full mt-5 md:flex">
              <Pagination
                previousPage={paginated_categories_expenses.prevPag}
                nextPage={paginated_categories_expenses.nextPag}
                currentPage={paginated_categories_expenses.currentPag}
                totalPages={paginated_categories_expenses.totalPag}
                onPageChange={(page) => {
                  getPaginatedCategoriesExpenses(page, limit, search);
                }}
              />
            </div>
            <div className="flex w-full mt-5 md:hidden">
              <Paginator
                pt={paginator_styles(1)}
                className="flex justify-between w-full"
                first={paginated_categories_expenses.currentPag}
                rows={limit}
                totalRecords={paginated_categories_expenses.total}
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
        size="lg"
        title={
          selectedCategory
            ? "Editar categoría de gastos"
            : "Nueva categoría de gastos"
        }
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
      >
        <AddExpensesCategories
          closeModal={modalAdd.onClose}
          categoryExpenses={selectedCategory}
        />
      </ModalGlobal>
    </div>
  );
};

export default ListExpensesCategories;

interface Props {
  categoryExpenses: CategoryExpense;
}
const DeletePopUp = ({ categoryExpenses }: Props) => {
  const { theme } = useContext(ThemeContext);

  const { deleteCategoriesExpenses } = useCategoriesExpenses();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteCategoriesExpenses(categoryExpenses.id);
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
              Eliminar {categoryExpenses.name}
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
