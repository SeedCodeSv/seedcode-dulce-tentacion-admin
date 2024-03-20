import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUsersStore } from "../../store/users.store";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import ModalGlobal from "../global/ModalGlobal";
import AddUsers from "./AddUsers";
import { Key, PlusIcon, User, UserCog } from "lucide-react";
import UpdatePassword from "./UpdatePassword";
import { User as TUser } from "../../types/users.types";
import { ThemeContext } from "../../hooks/useTheme";

function ListUsers() {
  const { theme } = useContext(ThemeContext);

  const { getUsers, users } = useUsersStore();

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      name: "NO.",
      key: "id",
      sortable: false,
    },
    {
      name: "Nombre de usuario",
      key: "name",
      sortable: false,
    },
    {
      name: "Rol",
      key: "role",
      sortable: false,
    },
    {
      name: "Empleado",
      key: "employee",
      sortable: false,
    },
    {
      name: "Acciones",
      key: "actions",
      sortable: false,
    },
  ];

  const modalAdd = useDisclosure();
  const modalChangePassword = useDisclosure();

  const [selectId, setSelectedId] = useState(0);

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50">
        <div className="flex justify-end w-full">
          <Button
            className="h-10 max-w-72"
            endContent={<PlusIcon />}
            size="sm"
            onClick={() => modalAdd.onOpen()}
            style={{
              backgroundColor: theme.colors.third,
              color: theme.colors.primary,
            }}
          >
            Agregar nuevo
          </Button>
        </div>
        <div className="hidden w-full p-5 bg-white rounded shadow lg:flex">
          <Table
            isHeaderSticky
            bottomContentPlacement="outside"
            topContentPlacement="outside"
            classNames={{
              wrapper: "max-h-[450px] 2xl:max-h-[600px]",
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  className="font-semibold"
                  align={column.key === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                  style={{
                    backgroundColor: theme.colors.dark,
                    color: theme.colors.primary,
                  }}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={users}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey === "id" && item.id}
                      {columnKey === "name" && item.userName}
                      {columnKey === "role" && item.role.name}
                      {columnKey === "employee" && item.employee.fullName}
                      {columnKey === "actions" && (
                        <div className="flex gap-3">
                          <Button
                            onClick={() => {
                              setSelectedId(item.id);
                              modalChangePassword.onOpen();
                            }}
                            isIconOnly
                            style={{
                              backgroundColor: theme.colors.danger,
                            }}
                          >
                            <Key color={theme.colors.primary} size={20} />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="grid w-full h-auto grid-cols-1 gap-5 mt-3 sm:grid-cols-2 md:grid-cols-3 lg:hidden">
          {users.map((user) => (
            <CardItem
              key={user.id}
              user={user}
              setUser={setSelectedId}
              setOpenModal={modalChangePassword.onOpen}
            />
          ))}
        </div>
      </div>
      <ModalGlobal
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
        title="Agregar usuario"
        size="lg"
      >
        <AddUsers onClose={modalAdd.onClose} />
      </ModalGlobal>
      <ModalGlobal
        isOpen={modalChangePassword.isOpen}
        onClose={modalChangePassword.onClose}
        title="Agregar usuario"
        size="lg"
      >
        <UpdatePassword
          id={selectId}
          closeModal={modalChangePassword.onClose}
        />
      </ModalGlobal>
    </>
  );
}

export default ListUsers;

interface CardProps {
  user: TUser;
  setUser: Dispatch<SetStateAction<number>>;
  setOpenModal: any;
}

export const CardItem = ({ user, setUser, setOpenModal }: CardProps) => {
  return (
    <Card isBlurred isPressable>
      <CardHeader>
        <div className="flex">
          <div className="flex flex-col">
            <p className="ml-3 text-sm font-semibold text-gray-600">
              {user.userName}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <p className="flex ml-3 text-sm font-semibold text-gray-700">
          <UserCog size={25} className="text-default-400" />
          <p className="ml-3">{user.role.name}</p>
        </p>
        <p className="flex mt-5 ml-3 text-sm font-semibold text-gray-700">
          <User size={25} className="text-default-400" />
          <p className="ml-3">{user.employee.fullName}</p>
        </p>
      </CardBody>
      <CardHeader>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setUser(user.id);
              setOpenModal(true);
            }}
            isIconOnly
            className="bg-[#FF8E8F]"
          >
            <Key className="text-white" size={20} />
          </Button>
          {/* <DeletePopover employee={employee} /> */}
        </div>
      </CardHeader>
    </Card>
  );
};
