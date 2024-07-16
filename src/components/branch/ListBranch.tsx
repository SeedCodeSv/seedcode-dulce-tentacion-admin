import { useState, useEffect, useContext, useMemo } from "react";
import { useBranchesStore } from "../../store/branches.store";
import {
  Button,
  ButtonGroup,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import {
  Edit,
  ShoppingBag,
  PhoneIcon,
  User,
  TrashIcon,
  MapPinIcon,
  Table as ITable,
  CreditCard,
  List,
  Filter,
  RefreshCcw,
} from "lucide-react";
import { ThemeContext } from "../../hooks/useTheme";
import AddButton from "../global/AddButton";
import { Drawer } from "vaul";
import Pagination from "../global/Pagination";
import { Paginator } from "primereact/paginator";
import { paginator_styles } from "../../styles/paginator.styles";
import AddBranch from "./AddBranch";
import { global_styles } from "../../styles/global.styles";
import { limit_options, messages } from "../../utils/constants";
import TableBranch from "./TableBranch";
import MobileView from "./MobileView";
import { Branches } from "../../types/branches.types";
import { toast } from "sonner";
import ListBranchProduct from "./branch_product/ListBranchProduct";
import BoxBranch from "./BoxBranch";
import classNames from "classnames";
import HeadlessModal from "../global/HeadlessModal";
import TooltipGlobal from "../global/TooltipGlobal";

interface PropsBranch {
  actions: string[];
}

function ListBranch(props: PropsBranch) {
  const { theme, context } = useContext(ThemeContext);

  const {
    getBranchesPaginated,
    branches_paginated,
    disableBranch,
  } = useBranchesStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [limit, setLimit] = useState(5);
  const [active, setActive] = useState<1 | 0>(1);
  const [BranchId, setBranchId] = useState(0);
  const [view, setView] = useState<"table" | "grid" | "list">("table");

  useEffect(() => {
    getBranchesPaginated(1, limit, name, phone, address, active);
  }, [limit, active]);

  const changePage = (page: number) => {
    getBranchesPaginated(page, limit, name, phone, address, active);
  };

  const modalAdd = useDisclosure();
  const modalBranchProduct = useDisclosure();
  const modalBoxBranch = useDisclosure();
  const filters = useMemo(() => {
    return (
      <>
        <div>
          <Input
            startContent={<User />}
            className="w-full dark:text-white"
            variant="bordered"
            labelPlacement="outside"
            label="Nombre"
            classNames={{
              label: "font-semibold text-gray-700",
              inputWrapper: "pr-0",
            }}
            isClearable
            value={name}
            placeholder="Escribe para buscar..."
            onChange={(e) => setName(e.target.value)}
            onClear={() => {
              setName("");
              getBranchesPaginated(1, limit, "", phone, address, active);
            }}
          />
        </div>
        <div>
          <Input
            labelPlacement="outside"
            label="Teléfono"
            placeholder="Escribe para buscar..."
            startContent={<PhoneIcon />}
            className="w-full dark:text-white"
            classNames={{
              label: "font-semibold text-gray-700",
              inputWrapper: "pr-0",
            }}
            variant="bordered"
            isClearable
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onClear={() => {
              setPhone("");
              getBranchesPaginated(1, limit, name, "", address, active);
            }}
          />
        </div>
        <div>
          <Input
            placeholder="Escribe para buscar..."
            startContent={<MapPinIcon />}
            className="w-full dark:text-white"
            variant="bordered"
            isClearable
            labelPlacement="outside"
            label="Dirección"
            classNames={{
              label: "font-semibold text-gray-700",
              inputWrapper: "pr-0",
            }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onClear={() => {
              setAddress("");
              getBranchesPaginated(1, limit, name, phone, "", active);
            }}
          />
        </div>
      </>
    );
  }, [name, setName, phone, setPhone, address, setAddress]);

  const [openVaul, setOpenVaul] = useState(false);

  const handleSearch = () => {
    getBranchesPaginated(1, limit, name, phone, address);
  };

  const [selectedBranch, setSelectedBranch] = useState<Branches>();
  const [Branch, setBranch] = useState<Branches>();

  const handleEdit = (item: Branches) => {
    setSelectedBranch(item);
    modalAdd.onOpen();
  };
  const handleBox = (item: Branches) => {
    setBranch(item);
    modalBoxBranch.onOpen();
  };
  const handleBranchProduct = (id: number) => {
    setBranchId(id);
    modalBranchProduct.onOpen();
  };

  const handleInactive = (item: Branches) => {
    disableBranch(item.id, !item.isActive);
  };
  const clearClose = () => {
    setBranch(undefined);
  };
  return (
    <>
      {BranchId >= 1 ? (
        <ListBranchProduct onclick={() => setBranchId(0)} id={BranchId} />
      ) : (
        <div className="w-full h-full p-4 md:p-10 md:px-12">
          <div className="w-full h-full p-4 overflow-y-auto bg-white shadow custom-scrollbar md:p-8 dark:bg-gray-900">
            <div className="hidden w-full grid-cols-3 gap-5 mb-4 md:grid ">
              {filters}
            </div>
            <div className="grid w-full grid-cols-1 gap-5 mb-4 md:flex md:justify-between lg:grid-cols-2">
              <div className="hidden md:flex">
                <Button
                  style={global_styles().secondaryStyle}
                  className="px-12 font-semibold max-w-72"
                  onClick={() => handleSearch()}
                  type="button"
                >
                  Buscar
                </Button>
              </div>
              <div className="flex items-end justify-between gap-10 mt lg:justify-end">
                <ButtonGroup>
                  <Button
                    isIconOnly
                    color="secondary"
                    style={{
                      backgroundColor:
                        view === "table" ? theme.colors.third : "#e5e5e5",
                      color:
                        view === "table" ? theme.colors.primary : "#3e3e3e",
                    }}
                    onClick={() => setView("table")}
                    type="button"
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
                    type="button"
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
                    type="button"
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
                            <Drawer.Title className="mb-4 font-medium dark:text-white">
                              Filtros disponibles
                            </Drawer.Title>
                            <div className="flex flex-col gap-3">
                              {filters}
                              <Button
                                style={global_styles().secondaryStyle}
                                className="mb-10 font-semibold"
                                onClick={() => {
                                  handleSearch();
                                  setOpenVaul(false);
                                }}
                                type="button"
                              >
                                Aplicar
                              </Button>
                            </div>
                          </div>
                        </Drawer.Content>
                      </Drawer.Portal>
                    </Drawer.Root>
                  </div>
                  <AddButton onClick={() => modalAdd.onOpen()} />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between w-full gap-5 mb-5 sm:flex-row sm:items-center">
              <Switch
                defaultSelected
                classNames={{
                  label: "font-semibold text-sm",
                }}
                onValueChange={(isSelected) => setActive(isSelected ? 1 : 0)}
              >
                {active === 1 ? "Mostrar inactivos" : "Mostrar activos"}
              </Switch>
              <Select
                className="w-44 dark:text-white"
                variant="bordered"
                label="Mostrar"
                labelPlacement="outside"
                classNames={{
                  label: "font-semibold",
                }}
                defaultSelectedKeys={["5"]}
                value={limit}
                onChange={(e) => {
                  setLimit(
                    Number(e.target.value !== "" ? e.target.value : "5")
                  );
                }}
              >
                {limit_options.map((option) => (
                  <SelectItem
                    className="w-full dark:text-white"
                    key={option}
                    value={option}
                  >
                    {option}
                  </SelectItem>
                ))}
              </Select>
            </div>
            {view === "table" && (
              <TableBranch
                actionsElement={(item) => (
                  <>
                    <div className="flex w-full gap-5">
                      <Button
                        onClick={() => {
                          setBranchId(item.id);
                          modalBranchProduct.onOpen();
                        }}
                        isIconOnly
                        style={global_styles().thirdStyle}
                      >
                        <ShoppingBag />
                      </Button>
                      {props.actions.includes("Editar") && (
                        <>
                          <Button
                            onClick={() => {
                              handleEdit(item);
                            }}
                            isIconOnly
                            style={global_styles().secondaryStyle}
                          >
                            <Edit />
                          </Button>
                        </>
                      )}
                      {props.actions.includes("Eliminar") && (
                        <>
                          {item.isActive ? (
                            <DeletePopUp branch={item} />
                          ) : (
                            <TooltipGlobal text="Activar la sucursal">
                              <Button
                              onClick={() => {
                                handleInactive(item);
                              }}
                              isIconOnly
                              style={global_styles().thirdStyle}
                            >
                              <RefreshCcw />
                            </Button>
                            </TooltipGlobal>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              />
            )}
            {(view === "grid" || view === "list") && (
              <>
                <MobileView
                  handleActive={() => {
                    handleInactive;
                  }}
                  layout={view as "grid" | "list"}
                  deletePopover={DeletePopUp}
                  handleEdit={handleEdit}
                  handleBranchProduct={handleBranchProduct}
                  handleBox={handleBox}
                />
              </>
            )}
            {branches_paginated.totalPag > 1 && (
              <>
                <div className="hidden w-full mt-5 md:flex">
                  <Pagination
                    previousPage={branches_paginated.prevPag}
                    nextPage={branches_paginated.nextPag}
                    currentPage={branches_paginated.currentPag}
                    totalPages={branches_paginated.totalPag}
                    onPageChange={(page) => {
                      changePage(page);
                    }}
                  />
                </div>
                <div className="flex w-full mt-5 md:hidden">
                  <Paginator
                    pt={paginator_styles(1)}
                    className="flex justify-between w-full"
                    first={branches_paginated.currentPag}
                    rows={limit}
                    totalRecords={branches_paginated.total}
                    template={{
                      layout: "PrevPageLink CurrentPageReport NextPageLink",
                    }}
                    currentPageReportTemplate="{currentPage} de {totalPages}"
                    onPageChange={(e) => {
                      changePage(e.page + 1);
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <HeadlessModal
            isOpen={modalAdd.isOpen}
            onClose={() => {
              modalAdd.onClose();
              setSelectedBranch(undefined);
            }}
            title={selectedBranch ? "Editar sucursal" : "Nueva sucursal"}
            size="w-[350px] md:w-[500px]"
          >
            <AddBranch branch={selectedBranch} closeModal={modalAdd.onClose} />
          </HeadlessModal>

          <HeadlessModal
            title=""
            isOpen={modalBoxBranch.isOpen}
            onClose={() => {
              clearClose();
              modalBoxBranch.onClose();
            }}
            size="w-[350px] md:w-[500px]"
          >
            <BoxBranch
              branch={Branch}
              closeModal={modalBoxBranch.onClose}
              setBranch={setBranch}
            />
          </HeadlessModal>
        </div>
      )}
    </>
  );
}

export default ListBranch;

interface Props {
  branch: Branches;
}

const DeletePopUp = ({ branch }: Props) => {
  const { deleteBranch, disableBranch } = useBranchesStore();
  const { theme } = useContext(ThemeContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = () => {
    if (branch.isActive) {
      disableBranch(branch.id, !branch.isActive).then((res) => {
        if (res) {
          toast.success(messages.success);
          onClose()
        } else {
          toast.error(messages.error);
        }
      });
    } else {
      deleteBranch(branch.id).then((res) => {
        if (res) {
          toast.success(messages.success);
          onClose()
        } else {
          toast.error(messages.error);
        }
      });
    }
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
            <TooltipGlobal text="Eliminar la sucursal" color="primary">
              <TrashIcon
                style={{
                  color: theme.colors.primary,
                }}
                size={20}
              />
            </TooltipGlobal>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-full p-5">
            <p className="font-semibold text-gray-600 dark:text-white">
              Eliminar {branch.name}
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
