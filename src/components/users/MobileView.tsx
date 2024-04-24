import React, { useState, useContext, Dispatch, SetStateAction } from "react";
import { Button } from "@nextui-org/react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { useUsersStore } from "../../store/users.store";
import { User } from "../../types/users.types";
import { classNames } from "primereact/utils";
import {
  User as IUser,
  Key,
  ShieldCheck,
  SquareUserRound,
  Trash,
} from "lucide-react";
import { ThemeContext } from "../../hooks/useTheme";

interface Props {
  layout: "grid" | "list";
  deletePopover: ({ id }: { id: number }) => JSX.Element;
}

function MobileView({ layout }: Props) {
  const { users_paginated } = useUsersStore();

  return (
    <div className="w-full pb-10">
      <DataView
        value={users_paginated.users}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5",
          }),
        }}
        color="surface"
        itemTemplate={gridItem}
        emptyMessage="No users found"
      />
    </div>
  );
}

const gridItem = (user: User, layout: "grid" | "list") => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      {layout === "grid" ? (
        <div
          className={classNames(
            "w-full shadow-sm hover:shadow-lg p-8 rounded-2xl"
          )}
          key={user.id}
        >
          <div className="flex w-full gap-2">
            <IUser color={"#274c77"} size={35} />
            {user.userName}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <SquareUserRound color="#00bbf9" size={35} />
            {user.employee.fullName}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <ShieldCheck color={"#006d77"} size={35} />
            {user.role.name}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            <Button
              isIconOnly
              size="lg"
              style={{
                backgroundColor: theme.colors.warning,
              }}
            >
              <Key color={theme.colors.primary} size={20} />
            </Button>
            <Button
              isIconOnly
              size="lg"
              style={{
                backgroundColor: theme.colors.danger,
              }}
            >
              <Trash color={theme.colors.primary} size={20} />
            </Button>
          </div>
        </div>
      ) : (
        <ListItem user={user} />
      )}
    </>
  );
};

const ListItem = ({ user }: { user: User }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <IUser color={"#274c77"} size={35} />
            {user.userName}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <SquareUserRound color="#00bbf9" size={35} />
            {user.employee.fullName}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <ShieldCheck color={"#006d77"} size={35} />
            {user.role.name}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full">
          <Button
            isIconOnly
            size="lg"
            style={{
              backgroundColor: theme.colors.warning,
            }}
          >
            <Key color={theme.colors.primary} size={20} />
          </Button>
          <Button
            isIconOnly
            size="lg"
            style={{
              backgroundColor: theme.colors.danger,
            }}
          >
            <Trash color={theme.colors.primary} size={20} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default MobileView;
