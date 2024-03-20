import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  Card,
  CardHeader,
  CardBody,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
} from "@nextui-org/react";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  EditIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { useCategoriesStore } from "../../store/categories.store";
import { CategoryProduct } from "../../types/categories.types";
import { ThemeContext } from "../../hooks/useTheme";
import AddCategory from "./AddCategory";
import ModalGlobal from "../global/ModalGlobal";
// import { CategoryProduct } from "../../types/products.types";
// import ModalGlobal from "../global/ModalGlobal";
// import AddNewCategory from "./AddNewCategory";

function ListCategories() {
  const { theme } = useContext(ThemeContext);

  const { paginated_categories, getPaginatedCategories } = useCategoriesStore();

  const [selectedCategory, setSelectedCategory] = useState<
    { id: number; name: string } | undefined
  >();

  const columns = [
    {
      name: "NO.",
      key: "id",
      sortable: true,
    },
    {
      name: "Categoría",
      key: "category",
      sortable: true,
    },
    {
      name: "Acciones",
      key: "actions",
      sortable: false,
    },
  ];

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(8);

  useEffect(() => {
    if (search !== "") {
      getPaginatedCategories(1, limit, search);
    } else {
      getPaginatedCategories(1, limit, "");
    }
  }, [search, limit]);

  const changePage = (page: number) => {
    getPaginatedCategories(page, 8, search);
  };

  const modalAdd = useDisclosure();

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col w-full gap-4">
        <style>{` .cursor-pagination { background: ${theme.colors.dark}; color: ${theme.colors.primary} } `}</style>
        <div className="grid items-end grid-cols-1 gap-3 sm:grid-cols-2 md:flex-row 2xl:mt-4">
          <Input
            classNames={{
              base: "w-full bg-white",
              inputWrapper: "border-1 h-10",
            }}
            placeholder="Buscar por nombre..."
            size="sm"
            startContent={<SearchIcon size={20} className="text-default-300" />}
            variant="bordered"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex justify-end w-full">
            <Button
              className="h-10 font-semibold max-w-72"
              style={{
                backgroundColor: theme.colors.third,
                color: theme.colors.primary,
              }}
              endContent={<PlusIcon />}
              size="sm"
              onClick={() => {
                modalAdd.onOpen();
                setSelectedCategory(undefined);
              }}
            >
              Agregar nuevo
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between 2xl:mt-6 2xl:mb-6">
          <span className="text-xs sm:text-small text-default-400 ">
            Total {paginated_categories.categoryProducts.length} productos
          </span>
          <label className="flex items-center text-xs text-default-400 sm:text-small">
            Productos por pagina
            <select
              defaultValue={limit.toString()}
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={(e) => {
                setLimit(Number(e.target.value));
              }}
            >
              <option value="5">5</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [paginated_categories]);

  return (
    <div className="w-full h-full p-5 bg-gray-50">
      <div className="hidden w-full p-5 bg-white rounded lg:flex">
        <Table
          isHeaderSticky
          bottomContentPlacement="outside"
          topContentPlacement="outside"
          topContent={topContent}
          bottomContent={
            <>
              <div className="mt-10 mb-20 lg:mb-0">
                <Pagination
                  total={paginated_categories.totalPag}
                  initialPage={paginated_categories.currentPag}
                  page={paginated_categories.currentPag}
                  showControls
                  showShadow
                  boundaries={2}
                  color="primary"
                  onChange={(page) => changePage(page)}
                  classNames={{
                    cursor: "cursor-pagination",
                    next: "cursor-pagination",
                    prev: "cursor-pagination",
                  }}
                />
              </div>
            </>
          }
          classNames={{
            wrapper: "max-h-[450px] 2xl:max-h-[600px]",
          }}
        >
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
          <TableBody
            items={paginated_categories.categoryProducts}
            className="overflow-y-auto h-96 max-h-96"
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "id" && item.id}
                    {columnKey === "category" && item.name}
                    {columnKey === "actions" && (
                      <>
                        <div className="flex gap-6">
                          <Button
                            onClick={() => {
                              setSelectedCategory({
                                id: item.id,
                                name: item.name,
                              });
                              modalAdd.onOpen();
                            }}
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
                          <DeletePopover category={item} />
                        </div>
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="grid w-full h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:hidden">
        <div className="w-full col-span-1 sm:col-span-2 md:col-span-3">
          {topContent}
        </div>
        <div className="grid w-full grid-cols-1 col-span-3 gap-5 my-3 sm:grid-cols-2 md:grid-cols-3">
          {paginated_categories.categoryProducts.map((product) => (
            <CardItem
              key={product.id}
              category={product}
              setOpenModal={modalAdd.onOpen}
              setCategory={setSelectedCategory}
            />
          ))}
        </div>
        <div className="col-span-1 mb-10 sm:col-span-2 md:col-span-3 lg:mb-0">
          <div className="hidden sm:flex">{2}</div>
          <div className="flex items-center justify-between pb-10 sm:hidden">
            <Button
              isIconOnly
              className="bg-coffee-brown"
              disabled={paginated_categories.currentPag === 1}
              onClick={() => changePage(paginated_categories.currentPag - 1)}
            >
              <ChevronLeft color="white" />
            </Button>
            <p className="text-sm font-semibold text-gray-600">
              {paginated_categories.currentPag} de{" "}
              {paginated_categories.totalPag}
            </p>
            <Button
              isIconOnly
              className="bg-coffee-brown"
              disabled={
                paginated_categories.currentPag ===
                paginated_categories.totalPag
              }
              onClick={() => changePage(paginated_categories.currentPag + 1)}
            >
              <ChevronRight color="white" />
            </Button>
          </div>
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

interface PopProps {
  category: CategoryProduct;
}

export const DeletePopover = ({ category }: PopProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { theme } = useContext(ThemeContext);

  return (
    <Popover isOpen={isOpen} onClose={onClose} backdrop="blur" showArrow>
      <PopoverTrigger>
        <Button
          onClick={onOpen}
          isIconOnly
          style={{ backgroundColor: theme.colors.danger }}
        >
          <TrashIcon style={{ color: theme.colors.primary }} size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-full p-5">
          <p className="font-semibold text-gray-600">
            Eliminar {category.name}
          </p>
          <p className="mt-3 text-center text-gray-600 w-72">
            ¿Estas seguro de eliminar este registro?
          </p>
          <div className="flex gap-5 mt-4">
            <Button onClick={onClose}>No, cancelar</Button>
            <Button
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
  );
};

interface CardProps {
  category: CategoryProduct;
  setCategory: Dispatch<
    SetStateAction<{ id: number; name: string } | undefined>
  >;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export const CardItem = ({
  category,
  setCategory,
  setOpenModal,
}: CardProps) => {
  return (
    <Card isBlurred isPressable className="max-h-44">
      <CardHeader>
        <div className="flex">
          <div className="flex flex-col">
            <p className="ml-3 text-sm font-semibold text-gray-600">
              {category.name}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody></CardBody>
      <CardHeader>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setCategory({ id: category.id, name: category.name });
              setOpenModal(true);
            }}
            isIconOnly
            className="bg-coffee-green"
          >
            <EditIcon className="text-white" size={20} />
          </Button>
          <DeletePopover category={category} />
        </div>
      </CardHeader>
    </Card>
  );
};
