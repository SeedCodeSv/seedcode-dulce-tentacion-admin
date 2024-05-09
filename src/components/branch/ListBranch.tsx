import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useBranchesStore } from "../../store/branches.store";
import {
  Button,
  ButtonGroup,
  Input,
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
  BoxIcon,
  MapPinIcon,
  Table as ITable,
  CreditCard,
  List,
  Filter,
} from "lucide-react";
import { ThemeContext } from "../../hooks/useTheme";
import { ConfirmPopup } from "primereact/confirmpopup";
import AddButton from "../global/AddButton";
import { Drawer } from "vaul";
import Pagination from "../global/Pagination";
import { Paginator } from "primereact/paginator";
import { paginator_styles } from "../../styles/paginator.styles";
import ModalGlobal from "../global/ModalGlobal";
import AddBranch from "./AddBranch";
import { global_styles } from "../../styles/global.styles";
import { limit_options, messages } from "../../utils/constants";
import TableBranch from "./TableBranch";
import MobileView from "./MobileView";
import { Branches } from "../../types/branches.types";
import { toast } from "sonner";
import ListBranchProduct from "./branch_product/ListBranchProduct";
import BoxBranch from "./BoxBranch";
function ListBranch() {
  const { theme } = useContext(ThemeContext);

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
            size="lg"
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
            size="lg"
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
            size="lg"
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
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
        <div className="hidden w-full grid-cols-3 gap-5 mb-4 md:grid ">
          {filters}
        </div>
        <div className="grid md:flex md:justify-between w-full grid-cols-1 gap-5 mb-4 lg:grid-cols-2">
          <div className="hidden md:flex">
            <Button
              style={global_styles().secondaryStyle}
              className="px-12 font-semibold max-w-72"
              size="lg"
              onClick={() => handleSearch()}
              type="button"
            >
              Buscar
            </Button>
          </div>
          <div className="flex items-end justify-between gap-10 mt lg:justify-end">
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
                type="button"
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
                type="button"
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
                    <Drawer.Content className="bg-gray-100 z-[60] flex flex-col rounded-t-[10px] h-auto mt-24 max-h-[80%] fixed bottom-0 left-0 right-0">
                      <div className="p-4 bg-white rounded-t-[10px] flex-1">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                        <Drawer.Title className="mb-4 font-medium">
                          Filtros disponibles
                        </Drawer.Title>
                        <div className="flex flex-col gap-3">
                          {filters}
                          <Button
                            style={global_styles().secondaryStyle}
                            className="mb-10 font-semibold"
                            size="lg"
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
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center justify-between w-full mb-5">
          <Switch
            defaultSelected
            classNames={{
              label: "font-semibold text-sm",
            }}
            onValueChange={(isSelected) => setActive(isSelected ? 1 : 0)}
            size="lg"
          >
            {active === 1 ? "Mostrar inactivos" : "Mostrar activos"}
          </Switch>
          <Select
            className="w-44 dark:text-white"
            variant="bordered"
            size="lg"
            label="Mostrar"
            labelPlacement="outside"
            classNames={{
              label: "font-semibold",
            }}
            defaultSelectedKeys={["5"]}
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value !== "" ? e.target.value : "5"));
            }}
          >
            {limit_options.map((option) => (
              <SelectItem key={option} value={option}>
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
                  {item.isActive ? (
                    <>
                      <Button
                        size="lg"
                        onClick={() => {
                          handleEdit(item);
                        }}
                        isIconOnly
                        style={global_styles().secondaryStyle}
                      >
                        <Edit />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Switch
                        onValueChange={() => handleInactive(item)}
                        defaultSelected={item.isActive}
                        size="lg"
                      >
                        Activar
                      </Switch>
                    </>
                  )}
                  {/* <BoxPopUp branch={item}/> */}
                  <Button
                    size="lg"
                    onClick={() => {
                      setBranch(item);
                      modalBoxBranch.onOpen();
                    }}
                    isIconOnly
                    style={global_styles().darkStyle}
                  >
                    <BoxIcon />
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => {
                      setBranchId(item.id);
                      modalBranchProduct.onOpen();
                    }}
                    isIconOnly
                    style={global_styles().thirdStyle}
                  >
                    <ShoppingBag />
                  </Button>
                  <DeletePopUp branch={item} />
                </div>
              </>
            )}
          />
        )}
        {(view === "grid" || view === "list") && (
          <>
            <MobileView
              layout={view as "grid" | "list"}
              deletePopover={DeletePopUp}
              handleEdit={handleEdit}
              handleBranchProduct={handleBranchProduct}
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
      <ModalGlobal
        isOpen={modalAdd.isOpen}
        onClose={() => {
          modalAdd.onClose();
          setSelectedBranch(undefined);
        }}
        title={selectedBranch ? "Editar sucursal" : "Nueva sucursal"}
        size="w-full md:w-[500px]"
      >
        <AddBranch branch={selectedBranch} closeModal={modalAdd.onClose} />
      </ModalGlobal>
      <ModalGlobal
        isOpen={modalBranchProduct.isOpen}
        onClose={() => {
          modalBranchProduct.onClose();
        }}
        title={"Productos de la sucursal"}
        size="auto"
      >
        <ListBranchProduct id={BranchId} />
      </ModalGlobal>
      <ModalGlobal
        isOpen={modalBoxBranch.isOpen}
        onClose={() => {
          clearClose();
          modalBoxBranch.onClose();
        }}
        size="w-full md:w-[500px]"
      >
        <BoxBranch
          branch={Branch}
          closeModal={modalBoxBranch.onClose}
          setBranch={setBranch}
        />
      </ModalGlobal>
    </div>
  );
}

export default ListBranch;

interface Props {
  branch: Branches;
}

const DeletePopUp = ({ branch }: Props) => {
  const buttonRef = useRef<HTMLButtonElement>();

  const { deleteBranch, disableBranch } = useBranchesStore();

  const [visible, setVisible] = useState(false);

  const handleDelete = () => {
    if (branch.isActive) {
      disableBranch(branch.id, !branch.isActive).then((res) => {
        if (res) {
          toast.success(messages.success);
          setVisible(false);
        } else {
          toast.error(messages.error);
        }
      });
    } else {
      deleteBranch(branch.id).then((res) => {
        if (res) {
          toast.success(messages.success);
          setVisible(false);
        } else {
          toast.error(messages.error);
        }
      });
    }
  };

  return (
    <>
      <Button
        ref={buttonRef as any}
        style={global_styles().dangerStyles}
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
        message="¿Deseas eliminar esta sucursal?"
        content={({ message, acceptBtnRef, rejectBtnRef }) => (
          <>
            <div className="p-5 border border-gray-100 shadow-2xl rounded-xl">
              <p className="text-lg font-semibold text-center">{message}</p>
              <div className="flex justify-between gap-5 mt-5">
                <Button
                  ref={acceptBtnRef}
                  size="lg"
                  className="font-semibold"
                  style={global_styles().thirdStyle}
                  onClick={handleDelete}
                >
                  Eliminar
                </Button>
                <Button
                  size="lg"
                  ref={rejectBtnRef}
                  onClick={() => setVisible(false)}
                >
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
