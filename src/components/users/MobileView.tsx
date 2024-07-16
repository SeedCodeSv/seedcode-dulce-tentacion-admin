import { Button } from "@nextui-org/react";
import { DataView } from "primereact/dataview";
import { useUsersStore } from "../../store/users.store";
import { classNames } from "primereact/utils";
import {
  EditIcon,
  User as IUser,
  Key,
  ShieldCheck,
  // SquareUserRound,
} from "lucide-react";
import { global_styles } from "../../styles/global.styles";
import { GridProps, IMobileViewProps } from "./types/mobile-view.types";
import TooltipGlobal from "../global/TooltipGlobal";

function MobileView(props: IMobileViewProps) {
  const { users_paginated } = useUsersStore();
  const { layout, deletePopover, openEditModal, openKeyModal, actions } = props;

  return (
    <div className="w-full pb-10">
      <DataView
        value={users_paginated.users}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "w-full grid dark:bg-transparent pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5",
          }),
        }}
        color="surface"
        itemTemplate={(user) => (
          <GridItem
            user={user}
            layout={layout}
            deletePopover={deletePopover}
            openEditModal={openEditModal}
            openKeyModal={openKeyModal}
            actions={actions}
          />
        )}
        emptyMessage="No users found"
      />
    </div>
  );
}
const GridItem = (props: GridProps) => {
  const { layout, user, deletePopover, openEditModal, openKeyModal, actions } = props;
  return (
    <>
      {layout === "grid" ? (
        <div
          className={classNames(
             "w-full shadow dark:border border-gray-600 hover:shadow-lg p-8 rounded-2xl"
          )}
          key={user.id}
        >
          <div className="flex w-full gap-2">
            <IUser className="text-[#274c77] dark:text-gray-400"
              size={20} />
             <p className="w-full dark:text-white">{user.userName}</p>
          </div>
          {/* <div className="flex w-full gap-2 mt-3">
            <SquareUserRound
              className="text-[#00bbf9] dark:text-gray-400"
              size={35}
            />
            {user.}
          </div> */}
          <div className="flex w-full gap-2 mt-3">
            <ShieldCheck
              className="text-[#274c77] dark:text-gray-400"
              size={20}
            />
            <p className="w-full dark:text-white">{user.role.name}</p> 
          </div>
          <div className="flex justify-between mt-5 w-ful">
          <TooltipGlobal text="Editar">
            <Button
              onClick={() => openEditModal(user)}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <EditIcon size={20} />
            </Button>
            </TooltipGlobal>
            <TooltipGlobal text="Cambiar Contraseña ">
            <Button
              onClick={() => openKeyModal(user)}
              isIconOnly
              style={global_styles().warningStyles}
            >
              <Key size={20} />
            </Button>
            </TooltipGlobal>
            {deletePopover({ user: user })}
          </div>
        </div>
      ) : (
        <ListItem
          user={user}
          layout="list"
          openEditModal={openEditModal}
          deletePopover={deletePopover}
          openKeyModal={openKeyModal}
          actions={actions}
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { user, deletePopover, openEditModal, openKeyModal } = props;
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border shadow rounded-2xl ">
       <div className="w-full">
          <div className="flex items-center w-full gap-2">
          <IUser className="text-[#274c77] dark:text-gray-400"
              size={20} />
             <p className="w-full dark:text-white">{user.userName}</p>
          </div>
          {/* <div className="flex items-center w-full gap-2 mt-3">
            <SquareUserRound color="#00bbf9" size={35} />
            {user.employee.fullName}
          </div> */}
          <div className="flex items-center w-full gap-2 mt-3">
          <ShieldCheck
              className="text-[#274c77] dark:text-gray-400"
              size={20}
            />
            <p className="w-full dark:text-white">{user.role.name}</p> 
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-4">
        <TooltipGlobal text="Editar">
          <Button
            isIconOnly
            style={global_styles().secondaryStyle}
            onClick={() => {
              openEditModal(user);
            }}
          >
            <EditIcon size={20} />
          </Button>
          </TooltipGlobal>
          <TooltipGlobal text="Cambiar contraseña">
          <Button
            onClick={() => openKeyModal(user)}
            isIconOnly
            style={global_styles().warningStyles}
          >
            <Key size={20} />
          </Button>
          </TooltipGlobal>
          {deletePopover({ user: user })}
        </div>
      </div>
    </>
  );
};

export default MobileView;
