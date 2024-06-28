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
              "grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid-nogutter gap-5 mt-5",
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
            "w-full shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl"
          )}
          key={user.id}
        >
          <div className="flex w-full gap-2">
            <IUser className="text-[#274c77] dark:text-gray-400" size={35} />
            {user.userName}
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
              className="text-[#006d77] dark:text-gray-400"
              size={35}
            />
            {user.role.name}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            <Button
              onClick={() => openEditModal(user)}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <EditIcon size={20} />
            </Button>
            <Button
              onClick={() => openKeyModal(user)}
              isIconOnly
              style={global_styles().warningStyles}
            >
              <Key size={20} />
            </Button>
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
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <IUser color={"#274c77"} size={35} />
            {user.userName}
          </div>
          {/* <div className="flex items-center w-full gap-2 mt-3">
            <SquareUserRound color="#00bbf9" size={35} />
            {user.employee.fullName}
          </div> */}
          <div className="flex items-center w-full gap-2 mt-3">
            <ShieldCheck color={"#006d77"} size={35} />
            {user.role.name}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-4">
          <Button
            isIconOnly
            style={global_styles().secondaryStyle}
            onClick={() => {
              openEditModal(user);
            }}
          >
            <EditIcon size={20} />
          </Button>
          <Button
            onClick={() => openKeyModal(user)}
            isIconOnly
            style={global_styles().warningStyles}
          >
            <Key size={20} />
          </Button>
          {deletePopover({ user: user })}
        </div>
      </div>
    </>
  );
};

export default MobileView;
