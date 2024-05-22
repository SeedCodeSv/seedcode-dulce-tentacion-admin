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
import { useContext, useEffect, useState } from "react";
import {
  EditIcon,
  User,
  TrashIcon,
  Table as ITable,
  CreditCard,
  List,
  Filter,
} from "lucide-react";
import { useCategoriesStore } from "../../store/categories.store";
import { ThemeContext } from "../../hooks/useTheme";
import AddCategory from "./AddCategory";
import ModalGlobal from "../global/ModalGlobal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AddButton from "../global/AddButton";
import MobileView from "./MobileView";
import Pagination from "../global/Pagination";
import { Paginator } from "primereact/paginator";
import { paginator_styles } from "../../styles/paginator.styles";
import { CategoryProduct } from "../../types/categories.types";
import { Drawer } from "vaul";
import { global_styles } from "../../styles/global.styles";
import classNames from "classnames";

interface PProps {
  actions: string[];
}

function ListCategories({ actions }: PProps) {
  const { theme, context } = useContext(ThemeContext);
  const [openVaul, setOpenVaul] = useState(false);
  const { paginated_categories, getPaginatedCategories } = useCategoriesStore();

  const [selectedCategory, setSelectedCategory] = useState<
    { id: number; name: string } | undefined
  >();

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(8);

  useEffect(() => {
    getPaginatedCategories(1, limit, search);
  }, [limit]);

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
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col w-full p-5 rounded">
        <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
          <div className="flex items-end gap-3">
            <div className="hidden w-full md:flex gap-3">
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
                className="mt-6 font-semibold"
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
            <div className="flex items-center gap-5">
              <div className="block md:hidden">
                <Drawer.Root
                  shouldScaleBackground
                  open={openVaul}
                  onClose={() => setOpenVaul(false)}
                >
                  <Drawer.Trigger asChild>
                    <Button
                      style={global_styles().thirdStyle}
                      size="lg"
                      isIconOnly
                      onClick={() => setOpenVaul(true)}
                      type="button"
                    >
                      <Filter />
                    </Button>
                  </Drawer.Trigger>
                  <Drawer.Portal>
                    <Drawer.Overlay
                      className="fixed inset-0 bg-black/40 z-[60]"
                      onClick={() => setOpenVaul(false)}
                    />
                    <Drawer.Content
                      className={classNames(
                        "bg-gray-100 z-[60] flex flex-col rounded-t-[10px] h-auto mt-24 max-h-[80%] fixed bottom-0 left-0 right-0",
                        context === "dark" ? "dark" : ""
                      )}
                    >
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-t-[10px] flex-1">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-400 mb-8" />
                        <Drawer.Title className="mb-4 dark:text-white font-medium">
                          Filtros disponibles
                        </Drawer.Title>

                        <div className="flex flex-col gap-3">
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
                            className="mt-6 font-semibold"
                            color="primary"
                            size="lg"
                            onClick={() => {
                              handleSearch(undefined);
                              setOpenVaul(false);
                            }}
                          >
                            Buscar
                          </Button>
                        </div>
                      </div>
                    </Drawer.Content>
                  </Drawer.Portal>
                </Drawer.Root>
              </div>
            </div>
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
            size="lg"
            label="Mostrar"
            labelPlacement="outside"
            classNames={{
              label: "font-semibold",
            }}
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value !== "" ? e.target.value : "8"));
            }}
          >
            <SelectItem key={"8"}>8</SelectItem>
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
            actions={actions}
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
                  {actions.includes("Editar") && (
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
                  )}
                  {actions.includes("Eliminar") && (
                    <DeletePopUp category={item} />
                  )}
                </div>
              )}
            />
          </DataTable>
        )}
        {paginated_categories.totalPag > 1 && (
          <>
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
          </>
        )}
      </div>
      <ModalGlobal
        size="w-full md:w-[500px]"
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
  category: CategoryProduct;
}

const DeletePopUp = ({ category }: Props) => {
  const { theme } = useContext(ThemeContext);

  const { deleteCategory } = useCategoriesStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteCategory(category.id);
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
            <p className="font-semibold text-gray-600 dark:text-white">
              Eliminar {category.name}
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
