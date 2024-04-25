import {
  Input,
  Button,
  useDisclosure,
  ButtonGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useContext, useEffect, useRef, useState } from "react";
import {
  EditIcon,
  Search,
  TrashIcon,
  Table as ITable,
  CreditCard,
  List,
} from "lucide-react";
import { useCategoriesStore } from "../../store/categories.store";
import { ThemeContext } from "../../hooks/useTheme";
import AddCategory from "./AddCategory";
import ModalGlobal from "../global/ModalGlobal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AddButton from "../global/AddButton";
import MobileView from "./MobileView";
import { ConfirmPopup } from "primereact/confirmpopup";
import Pagination from "../global/Pagination";
import { Paginator } from "primereact/paginator";
import { paginator_styles } from "../../styles/paginator.styles";
import { CategoryProduct } from "../../types/categories.types";

function ListCategories() {
  const { theme } = useContext(ThemeContext);

  const { paginated_categories, getPaginatedCategories } = useCategoriesStore();

  const [selectedCategory, setSelectedCategory] = useState<
    { id: number; name: string } | undefined
  >();

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(8);

  useEffect(() => {
    getPaginatedCategories(1, limit, search);
  }, []);

  const handleSearch = (name: string | undefined) => {
    getPaginatedCategories(1, limit, name ?? search);
  };

  const modalAdd = useDisclosure();

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const [view, setView] = useState<"table" | "grid" | "list">("table");

  const handleEdit = (item: CategoryProduct) => {
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
                startContent={<Search />}
                className="w-full xl:w-96"
                variant="bordered"
                labelPlacement="outside"
                label="Buscar"
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
            value={paginated_categories.categoryProducts}
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
                  <DeletePopUp id={item.id} />
                </div>
              )}
            />
          </DataTable>
        )}
        <div className="hidden w-full mt-5 md:flex">
          <Pagination
            previousPage={paginated_categories.prevPag}
            nextPage={paginated_categories.nextPag}
            currentPage={paginated_categories.currentPag}
            totalPages={paginated_categories.totalPag}
            onPageChange={(page) => {
              getPaginatedCategories(page, limit, search);
            }}
          />
        </div>
        <div className="flex w-full mt-5 md:hidden">
          <Paginator
            pt={paginator_styles(1)}
            className="flex justify-between w-full"
            first={paginated_categories.currentPag}
            rows={limit}
            totalRecords={paginated_categories.total}
            template={{
              layout: "PrevPageLink CurrentPageReport NextPageLink",
            }}
            currentPageReportTemplate="{currentPage} de {totalPages}"
          />
        </div>
      </div>
      <ModalGlobal
        size="md"
        title={selectedCategory ? "Editar categoría" : "Nueva categoría"}
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
      >
        <AddCategory
          closeModal={modalAdd.onClose}
          category={selectedCategory}
        />
      </ModalGlobal>
    </div>
  );
}

export default ListCategories;
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
        message="¿Deseas eliminar esta categoría?"
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
