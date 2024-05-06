import { useContext } from "react";
import { Button } from "@nextui-org/react";
import { DataView } from "primereact/dataview";
import { classNames } from "primereact/utils";
import { User as IUser, Truck, Phone, Edit } from "lucide-react";
import { ThemeContext } from "../../hooks/useTheme";
import { Employee } from "../../types/employees.types";
import { useEmployeeStore } from "../../store/employee.store";

interface Props {
  layout: "grid" | "list";
  deletePopover: ({ employee }: { employee: Employee }) => JSX.Element;
  openEditModal: (employee: Employee) => void;
}

function MobileView({ layout, openEditModal, deletePopover }: Props) {
  const { employee_paginated } = useEmployeeStore();

  return (
    <div className="w-full pb-10">
      <DataView
        value={employee_paginated.employees}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5",
          }),
        }}
        color="surface"
        itemTemplate={(employee) =>
          gridItem(employee, layout, openEditModal, deletePopover)
        }
        emptyMessage="No employee found"
      />
    </div>
  );
}

const gridItem = (
  employee: Employee,
  layout: "grid" | "list",
  openEditModal: (employee: Employee) => void,
  deletePopover: ({ employee }: { employee: Employee }) => JSX.Element
) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      {layout === "grid" ? (
        <div
          className={classNames(
            "w-full shadow-sm hover:shadow-lg p-8 rounded-2xl"
          )}
          key={employee.id}
        >
          <div className="flex w-full gap-2">
            <IUser color={"#274c77"} size={35} />
            {employee.fullName}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Phone color="#00bbf9" size={35} className="" />
            {employee.phone}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Truck color={"#006d77"} size={35} />
            {employee.branch.name}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            <Button
              isIconOnly
              size="lg"
              style={{
                backgroundColor: theme.colors.secondary,
              }}
              onClick={() => {
                openEditModal(employee);
              }}
            >
              <Edit color={theme.colors.primary} size={20} />
            </Button>
            {deletePopover({ employee: employee })}
          </div>
        </div>
      ) : (
        <ListItem
          employee={employee}
          openEditModal={openEditModal}
          deletePopover={deletePopover}
        />
      )}
    </>
  );
};

const ListItem = ({
  employee,
  openEditModal,
  deletePopover,
}: {
  employee: Employee;
  openEditModal: (employee: Employee) => void;
  deletePopover: ({
    employee,
  }: {
    employee: Employee;
  }) => JSX.Element;
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <IUser color={"#274c77"} size={35} />
            {employee.fullName}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Phone color="#00bbf9" size={35} />
            {employee.phone}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Truck color={"#006d77"} size={35} />
            {employee.branch.name}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full">
          <Button
            isIconOnly
            size="lg"
            style={{
              backgroundColor: theme.colors.secondary,
            }}
            onClick={() => {
              openEditModal(employee);
            }}
          >
            <Edit color={theme.colors.primary} size={20} />
          </Button>
          {deletePopover({ employee: employee })}
        </div>
      </div>
    </>
  );
};

export default MobileView;
