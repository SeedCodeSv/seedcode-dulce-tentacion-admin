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
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  EditIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import ReturnImageCategory from "../global/ReturnImageCategory";
import { useProductsStore } from "../../store/products.store";
import ReturnAvatarImage from "../global/ReturnAvatarImage";
import { Product } from "../../types/products.types";
import ModalGlobal from "../global/ModalGlobal";
import AddProducts from "./AddProducts";
import { useCategoriesStore } from "../../store/categories.store";
import ReturnImgCategory from "../global/ReturnImgCategory";

function ListProducts() {
  const { getPaginatedProducts, paginated_products } = useProductsStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (search !== "") {
      getPaginatedProducts(1, 8, category, search);
    } else {
      getPaginatedProducts(1, 8, category, search);
    }
  }, [search, category]);

  const { list_categories, getListCategories } = useCategoriesStore();
  useEffect(() => {
    getListCategories();
  }, []);

  const changePage = (page: number) => {
    getPaginatedProducts(page, 8, category, search);
  };

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
      name: "Precio",
      key: "price",
      sortable: true,
    },
    {
      name: "Código",
      key: "code",
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

  const modalAdd = useDisclosure();

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid items-end grid-cols-1 gap-3 sm:grid-cols-3 md:flex-row">
          <Input
            isClearable
            classNames={{
              base: "w-full bg-white",
            }}
            placeholder="Buscar por nombre..."
            size="sm"
            startContent={<SearchIcon size={20} className="text-default-300" />}
            variant="bordered"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            aria-labelledby="select-label"
            className="bg-white"
            placeholder="Buscar por categoría..."
            size="sm"
            startContent={<SearchIcon size={20} className="text-default-300" />}
            variant="bordered"
            onChange={(e) => {
              if (e.target.value) {
                setCategory(e.target.value);
              } else {
                setCategory("");
              }
            }}
          >
            {list_categories.map((list) => (
              <SelectItem key={list.name} textValue={list.name}>
                <div className="flex items-center gap-2">
                  <ReturnImgCategory category={list.name} />
                  <div className="flex flex-col">
                    <span className="text-small">{list.name}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </Select>
          <div className="flex justify-end w-full">
            <Button
              className="h-10 max-w-72 bg-coffee-green text-background"
              endContent={<PlusIcon />}
              size="sm"
              onClick={() => modalAdd.onOpen()}
            >
              Agregar nuevo
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-small text-default-400 ">
            Total {paginated_products.products.length} productos
          </span>
          <label className="flex items-center text-xs text-default-400 sm:text-small">
            Productos por pagina
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              //   onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [paginated_products]);

  const bottomContent = useMemo(() => {
    if (paginated_products.total === 0) {
      return <div>No se encontraron resultados</div>;
    }
    return (
      <div className="mt-10 mb-20 lg:mb-0">
        <Pagination
          total={paginated_products.totalPag}
          initialPage={paginated_products.currentPag}
          page={paginated_products.currentPag}
          showControls
          showShadow
          boundaries={2}
          color="primary"
          onChange={(page) => changePage(page)}
          classNames={{
            cursor: "bg-[#65451F] shadow shadow-[#65451F] font-semibold",
            next: "bg-[#65451F] text-white",
            prev: "bg-[#65451F] text-white",
          }}
        />
      </div>
    );
  }, [paginated_products, paginated_products.products]);

  return (
    <div className="w-full h-full p-5 bg-gray-50">
      <div className="hidden p-5 bg-white rounded lg:flex">
        <Table
          topContent={topContent}
          bottomContentPlacement="outside"
          topContentPlacement="outside"
          bottomContent={bottomContent}
          isHeaderSticky={true}
          classNames={{
            wrapper: "max-h-[450px] 2xl:max-h-[600px]",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className="font-semibold text-white bg-coffee-brown"
                align={column.key === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={paginated_products.products}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "id" && item.id}
                    {columnKey === "name" && (
                      <>
                        <ReturnImageCategory
                          category={item.categoryProduct.name}
                          product_name={item.name}
                          description={item.description}
                        />
                      </>
                    )}
                    {columnKey === "price" && "$" + item.price}
                    {columnKey === "code" && item.code}
                    {columnKey === "category" && item.categoryProduct.name}
                    {columnKey === "actions" && (
                      <>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => {
                              setSelectedProduct(item);
                              modalAdd.onOpen();
                            }}
                            isIconOnly
                            className="bg-coffee-green"
                          >
                            <EditIcon className="text-white" size={20} />
                          </Button>
                          <PopoverDelete product={item} />
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:hidden">
        <div className="col-span-1 sm:col-span-2 md:col-span-3 ">
          {topContent}
        </div>
        {paginated_products.products.map((product) => (
          <Card key={product.id} isPressable isBlurred>
            <CardHeader>
              <div className="flex">
                <ReturnAvatarImage category={product.categoryProduct.name} />
                <div className="flex flex-col">
                  <p className="ml-3 text-sm font-semibold text-gray-600">
                    {product.name}
                  </p>
                  <p className="ml-3 text-sm text-gray-600">
                    {product.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm font-semibold text-gray-600">
                Precio: <span className="font-normal">${product.price}</span>
              </p>
              <p className="text-sm font-semibold text-gray-600">
                Categoría:{" "}
                <span className="font-normal">
                  {product.categoryProduct.name}
                </span>
              </p>
            </CardBody>
            <CardHeader>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSelectedProduct(product);
                    modalAdd.onOpen();
                  }}
                  isIconOnly
                  className="bg-coffee-green"
                >
                  <EditIcon className="text-white" size={20} />
                </Button>
                <PopoverDelete product={product} />
              </div>
            </CardHeader>
          </Card>
        ))}
        <div className="col-span-1 mb-10 sm:col-span-2 md:col-span-3 lg:mb-0">
          <div className="hidden sm:flex">{bottomContent}</div>
          <div className="flex items-center justify-between sm:hidden">
            <Button
              isIconOnly
              className="bg-coffee-brown"
              disabled={paginated_products.currentPag === 1}
              onClick={() => changePage(paginated_products.currentPag - 1)}
            >
              <ChevronLeft color="white" />
            </Button>
            <p className="text-sm font-semibold text-gray-600">
              {paginated_products.currentPag} de {paginated_products.totalPag}
            </p>
            <Button
              isIconOnly
              className="bg-coffee-brown"
              disabled={
                paginated_products.currentPag === paginated_products.totalPag
              }
              onClick={() => changePage(paginated_products.currentPag + 1)}
            >
              <ChevronRight color="white" />
            </Button>
          </div>
        </div>
      </div>
      <ModalGlobal
        title={selectedProduct ? "Editar producto" : "Nuevo producto"}
        onClose={modalAdd.onClose}
        size="md"
        isOpen={modalAdd.isOpen}
        isDismissable={false}
      >
        <AddProducts
          onCloseModal={modalAdd.onClose}
          product={selectedProduct}
        />
      </ModalGlobal>
    </div>
  );
}

export default ListProducts;

interface PopProps {
  product: Product;
}

export const PopoverDelete = (props: PopProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Popover isOpen={isOpen} onClose={onClose} backdrop="blur">
      <PopoverTrigger>
        <Button onClick={onOpen} isIconOnly className="bg-[#B06161]">
          <TrashIcon className="text-white" size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-full p-5">
          <p className="font-semibold text-gray-600">
            Eliminar {props.product.name}
          </p>
          <p className="mt-3 text-center text-gray-600 w-72">
            ¿Estas seguro de eliminar este registro?
          </p>
          <div className="mt-4">
            <Button onClick={onClose}>No, cancelar</Button>
            <Button className="bg-[#B06161] ml-5 text-white">
              Si, eliminar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};