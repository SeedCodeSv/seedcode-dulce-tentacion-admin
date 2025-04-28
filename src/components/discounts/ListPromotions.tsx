import { useNavigate } from "react-router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Table as ITable, CreditCard, EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  ButtonGroup,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

import AddButton from "../global/AddButton";
import { usePromotionsStore } from "../../store/promotions/promotions.store";
import { useBranchesStore } from "../../store/branches.store";
import { Tipos_Promotions, limit_options } from "../../utils/constants";
import Pagination from "../global/Pagination";
import SmPagination from "../global/SmPagination";
import { formatDate } from "../../utils/dates";
import {
  Promotion,
  PromotionCategories,
  PromotionProducts,
} from "../../types/promotions.types";
import HeadlessModal from "../global/HeadlessModal";
import { Branches } from "../../types/branches.types";
import TooltipGlobal from "../global/TooltipGlobal";

import UpdatePromotionsBranch from "./UpdatePromotionBranch";
import MobileView from "./MobileView";
import UpdatePromotionsProduct from "./UpdatePromotionsProduct";

import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

interface Props {
  actions: string[];
}

function ListDiscount({ actions }: Props) {
  const [page, serPage] = useState(1);

  const [limit, setLimit] = useState(5);
  const [branch, setbranch] = useState<Branches>();
  const [type, setType] = useState("");
  const { getBranchesList, branch_list } = useBranchesStore();
  const [dateInitial, setDateInitial] = useState(formatDate());
  const [dateEnd, setDateEnd] = useState(formatDate());

  const {
    pagination_promotions,
    getPaginatedPromotions,
    loading_products,
  } = usePromotionsStore();

  useEffect(() => {
    getPaginatedPromotions(
      1,
      limit,
      Number(branch?.id),
      type,
      dateInitial,
      dateEnd
    );
    getBranchesList();
  }, [limit]);

  const [view, setView] = useState<"table" | "grid" | "list">("table");
  const handleSearch = (searchParam: string | undefined) => {
    getPaginatedPromotions(
      page,
      limit,
      Number(branch?.id),
      searchParam ?? type,
      dateInitial,
      dateEnd
    );
  };

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPromotionProduct, setIsOpenPromotionProduct] = useState(false);
  const [, setIsOpenPromotionCategory] = useState(false);

  const [promotionId, setPromotionId] = useState(0);
  const [, setDataPromotion] = useState<PromotionCategories>();
  const [dataPromotionProduct, setDataPromotionProduct] = useState<
    PromotionProducts
  >();
  // const [dataPromotionClass, setDataPromotionClass] = useState<PromotionClass>();
  const [dataPromotionBranch, setDataPromotionBranch] = useState<Promotion>();
  const priorityMapping: { [key: string]: string } = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
  };

  // Define un tipo para las prioridades
  type Priority = "LOW" | "MEDIUM" | "HIGH";

  const priorityMap: Record<Priority, { label: string; color: string }> = {
    LOW: { label: "Baja", color: "green" },
    MEDIUM: { label: "Media", color: "orange" },
    HIGH: { label: "Alta", color: "red" },
  };

  <Column
    body={(item: { priority: string }) => (
      <span>{priorityMapping[item.priority] || item.priority}</span>
    )}
    header="Prioridad"
    headerClassName="text-sm font-semibold"
  />;

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="flex flex-col w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="flex items-end justify-between w-full gap-3">
              <Autocomplete
                className="font-semibold dark:text-white"
                label="Sucursal"
                labelPlacement="outside"
                placeholder="Selecciona la sucursal"
                variant="bordered"
              >
                {branch_list.map((branch) => (
                  <AutocompleteItem
                    key={branch.id}
                    className="dark:text-white"
                    onClick={() => setbranch(branch)}
                  >
                    {branch.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>

              <Select
                className="w-full dark:text-white"
                classNames={{
                  label: "font-semibold text-gray-500 text-sm",
                }}
                label="Tipo de Promoción"
                labelPlacement="outside"
                placeholder="Selecciona el tipo de promoción"
                value={type}
                variant="bordered"
                onChange={(e) => {
                  setType(e.target.value);
                }}
              >
                {Tipos_Promotions.map((limit) => (
                  <SelectItem
                    key={limit}
                    className="dark:text-white"
                  >
                    {limit}
                  </SelectItem>
                ))}
              </Select>
              <Input
                classNames={{
                  input: "dark:text-white dark:border-gray-600",
                  label: "text-sm font-semibold dark:text-white",
                }}
                defaultValue={formatDate()}
                label="Fecha inicial"
                labelPlacement="outside"
                placeholder="Buscar por nombre..."
                type="date"
                value={dateInitial}
                variant="bordered"
                onChange={(e) => setDateInitial(e.target.value)}
              />
              <Input
                classNames={{
                  input: "dark:text-white dark:border-gray-600",
                  label: "text-sm font-semibold dark:text-white",
                }}
                label="Fecha final"
                labelPlacement="outside"
                placeholder="Buscar por nombre..."
                type="date"
                value={dateEnd}
                variant="bordered"
                onChange={(e) => setDateEnd(e.target.value)}
              />
              <ButtonUi
                className="font-semibold"
                color="primary"
                theme={Colors.Primary}
                onPress={() => handleSearch(undefined)}
              >
                Buscar
              </ButtonUi>
            </div>

            <div className="flex w-full mt-4">
              <div className="flex items-start justify-between w-full gap-10 lg:justify-start">
                <Select
                  className="max-w-44 dark:text-white"
                  classNames={{
                    label: "font-semibold",
                  }}
                  defaultSelectedKeys={["5"]}
                  label="Mostrar"
                  labelPlacement="outside"
                  value={limit}
                  variant="bordered"
                  onChange={(e) => {
                    setLimit(
                      Number(e.target.value !== "" ? e.target.value : "5")
                    );
                  }}
                >
                  {limit_options.map((limit) => (
                    <SelectItem
                      key={limit}
                      className="dark:text-white"
                    >
                      {limit}
                    </SelectItem>
                  ))}
                </Select>
                <div className="mt-6">
                <ButtonGroup className="mt-4">
                <ButtonUi
                  isIconOnly
                  theme={view === 'table' ? Colors.Primary : Colors.Default}
                  onPress={() => setView('table')}
                >
                  <ITable />
                </ButtonUi>
                <ButtonUi
                  isIconOnly
                  theme={view === 'grid' ? Colors.Primary : Colors.Default}
                  onPress={() => setView('grid')}
                >
                  <CreditCard />
                </ButtonUi>
              </ButtonGroup>
                </div>
              </div>

              <div className="items-start justify-between w-full gap-10 mt-6 lg:justify-start">
                <div className="flex justify-end w-full">
                  <AddButton
                    onClick={() => {
                      navigate("/AddPromotions");
                    }}
                  />
                </div>
              </div>
            </div>

            {(view === "grid" || view === "list") && (
              <MobileView
                actions={actions}
                layout={view as "grid" | "list"}
                openEditModal={(promotion) => {
                  if (type === "Categorias") {
                    setIsOpenPromotionCategory(true);
                    setPromotionId(promotion.id);
                    // setDataPromotion(promotion.id);
                  } else if (type === "Productos") {
                    setIsOpenPromotionProduct(true);
                    setPromotionId(promotion.id);
                    // setDataPromotionProduct(promotion.id);
                  } else if (type === "Sucursales") {
                    setIsOpen(true);
                    setPromotionId(promotion.id);
                    // setDataPromotionBranch(promotion.id);
                  }
                }}
              />
            )}

            {view === "table" && (
              <DataTable
                className="w-full mt-6 shadow "
                emptyMessage="No se encontraron resultados"
                loading={loading_products}
                tableStyle={{ minWidth: "50rem" }}
                value={pagination_promotions.promotionsDiscount}
              >
                <Column
                  field="id"
                  header="No."
                  headerClassName="text-sm font-semibold"
                  headerStyle={{  borderTopLeftRadius: "10px" }}
                />
                <Column
                  field="name"
                  header="Nombre"
                  headerClassName="text-sm font-semibold"
                />
                <Column
                  field="startDate"
                  header="Fecha Inicial"
                  headerClassName="text-sm font-semibold"
                />
                <Column
                  field="endDate"
                  header="Fecha Final"
                  headerClassName="text-sm font-semibold"
                />

                <Column
                  body={(item) => (
                    <span>
                      {item.percentage > 0
                        ? `${item.percentage}%`
                        : item.fixedPrice
                        ? `$${item.fixedPrice}`
                        : ""}
                    </span>
                  )}
                  header="Descuento"
                  headerClassName="text-sm font-semibold"
                />

                <Column
                  body={(item: { priority: Priority }) => (
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor:
                            priorityMap[item.priority]?.color || "black",
                          marginRight: "8px",
                        }}
                       />
                      {priorityMap[item.priority]?.label || item.priority}
                    </span>
                  )}
                  header="Prioridad"
                  headerClassName="text-sm font-semibold"
                />

                <Column
                  body={(item) => (
                    <div className="">
                      {type === "Categorias" && (
                        <TooltipGlobal text={"Editar Promoción"}>
                          <ButtonUi
                            isIconOnly
                            theme={Colors.Primary}
                            onClick={() => {
                              setIsOpenPromotionCategory(true);
                              setPromotionId(item.id);
                              setDataPromotion(item);
                            }}
                          >
                            <EditIcon size={20} />
                          </ButtonUi>
                        </TooltipGlobal>
                      )}
                      {type === "Productos" && (
                        <ButtonUi
                          isIconOnly
                          theme={Colors.Primary}
                          onClick={() => {
                            setPromotionId(item.id);
                            setDataPromotionProduct(item);
                            setIsOpenPromotionProduct(true);
                          }}
                        >
                          <EditIcon size={20} />
                        </ButtonUi>
                      )}
                      {type === "Sucursales" && (
                        <ButtonUi
                          isIconOnly
                          theme={Colors.Primary}
                          onClick={() => {
                            setIsOpen(true);
                            setPromotionId(item.id);
                            setDataPromotionBranch(item);
                          }}
                        >
                          <EditIcon  size={20} />
                        </ButtonUi>
                      )}
                    </div>
                  )}
                  header="Acciones"
                  headerClassName="text-sm font-semibold"
                />
              </DataTable>
            )}

            {pagination_promotions.totalPag > 1 && (
              <>
                <div className="hidden w-full mt-5 md:flex">
                  <Pagination
                    currentPage={pagination_promotions.currentPag}
                    nextPage={pagination_promotions.nextPag}
                    previousPage={pagination_promotions.prevPag}
                    totalPages={pagination_promotions.totalPag}
                    onPageChange={(page) => {
                      serPage(page);
                      getPaginatedPromotions(
                        page,
                        limit,
                        Number(branch?.id),
                        type,
                        dateInitial,
                        dateEnd
                      );
                    }}
                  />
                </div>
                <div className="flex w-full mt-5 md:hidden">
                  <SmPagination
                    currentPage={pagination_promotions.currentPag}
                    handleNext={() => {
                      serPage(pagination_promotions.nextPag);
                      getPaginatedPromotions(
                        pagination_promotions.nextPag,

                        limit,
                        Number(branch?.id),
                        type,
                        dateInitial,
                        dateEnd
                      );
                    }}
                    handlePrev={() => {
                      serPage(pagination_promotions.prevPag);
                      getPaginatedPromotions(
                        pagination_promotions.prevPag,

                        limit,
                        Number(branch?.id),
                        type,
                        dateInitial,
                        dateEnd
                      );
                    }}
                    totalPages={pagination_promotions.totalPag}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {/* <HeadlessModal
          size="2xl"
          title="Actualizar promoción por categoría"
          isOpen={isOpenPromotionCategory}
          onClose={() => setIsOpenPromotionCategory(false)}
        >
          <UpdatePromotionsByCategory
            onClose={() => setIsOpenPromotionCategory(false)}
            id={promotionId}
            reloadData={() =>
              getPaginatedPromotions(1, limit, Number(branch?.id), type, dateInitial, dateEnd)
            }
            promotion={dataPromotion}
          />
        </HeadlessModal> */}

        <HeadlessModal
          isOpen={isOpenPromotionProduct}
          size="2xl"
          title="Actualizar promoción por producto"
          onClose={() => setIsOpenPromotionProduct(false)}
        >
          <UpdatePromotionsProduct
            branch={branch}
            id={promotionId}
            promotion={dataPromotionProduct}
            reloadData={() =>
              getPaginatedPromotions(
                1,
                limit,
                Number(branch?.id),
                type,
                dateInitial,
                dateEnd
              )
            }
            onClose={() => setIsOpenPromotionProduct(false)}
          />
        </HeadlessModal>

        {dataPromotionBranch && (
          <HeadlessModal
            isOpen={isOpen}
            size="2xl"
            title="Actualizar promoción"
            onClose={() => setIsOpen(false)}
          >
            <UpdatePromotionsBranch
              id={promotionId}
              promotion={dataPromotionBranch}
              reloadData={() =>
                getPaginatedPromotions(
                  1,
                  limit,
                  Number(branch?.id),
                  type,
                  dateInitial,
                  dateEnd
                )
              }
              onClose={() => setIsOpen(false)}
            />
          </HeadlessModal>
        )}
      </div>
    </>
  );
}

export default ListDiscount;
