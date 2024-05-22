import { Button } from "@nextui-org/react";
import { DataView } from "primereact/dataview";
import { classNames } from "primereact/utils";
import { User as IUser, Truck, Phone, Edit, RefreshCcw } from "lucide-react";
import { Employee } from "../../types/employees.types";
import { useEmployeeStore } from "../../store/employee.store";
import { global_styles } from "../../styles/global.styles";

interface Props {
  layout: "grid" | "list";
  deletePopover: ({ employee }: { employee: Employee }) => JSX.Element;
  openEditModal: (employee: Employee) => void;
  actions: string[];
  handleActivate: (id: number) => void;
}

function MobileView({ layout, openEditModal, deletePopover, actions, handleActivate }: Props) {
  const { employee_paginated, loading_employees } = useEmployeeStore();

  return (
    <div className="w-full pb-10">
      <DataView
        value={employee_paginated.employees}
        gutter
        loading={loading_employees}
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5",
          }),
        }}
        color="surface"
        itemTemplate={(employee) =>
          gridItem(employee, layout, openEditModal, deletePopover, actions, handleActivate)
        }
        emptyMessage="No se encontraron empleados"
      />
    </div>
  );
}

const gridItem = (
  employee: Employee,
  layout: "grid" | "list",
  openEditModal: (employee: Employee) => void,
  deletePopover: ({ employee }: { employee: Employee }) => JSX.Element,
  actions: string[],
  handleActivate: (id: number) => void
) => {
  return (
    
    <>
      {layout === "grid" ? (
        <div
          className={classNames(
            "w-full shadow-sm hover:shadow-lg border dark:border-gray-600 p-8 rounded-2xl"
          )}
          key={employee.id}
        >
          <div className="flex w-full gap-2">
            <IUser className="text-[#274c77] dark:text-gray-400" size={35} />
            {employee.fullName}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Phone size={35} className="text-[#00bbf9] dark:text-gray-400" />
            {employee.phone}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Truck className="text-[#006d77] dark:text-gray-400" size={35} />
            {employee.branch.name}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes("Editar") && (
              <Button
                onClick={() => openEditModal(employee)}
                isIconOnly
                style={global_styles().thirdStyle}
              >
                <Edit size={15} />
              </Button>
            )}
            {actions.includes("Eliminar") && (
              <>
                {employee.isActive ? (
                  deletePopover({ employee })
                ) : (
                  <Button
                    onClick={() => handleActivate(employee.id)}
                    isIconOnly
                    style={global_styles().thirdStyle}
                  >
                    <RefreshCcw />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <ListItem
          actions={actions}
          employee={employee}
          openEditModal={openEditModal}
          deletePopover={deletePopover}
          handleActivate={handleActivate}
        />
      )}
    </>
  );
};

const ListItem = ({
  employee,
  openEditModal,
  deletePopover,
  actions,
  handleActivate
}: {
  employee: Employee;
  openEditModal: (employee: Employee) => void;
  deletePopover: ({ employee }: { employee: Employee }) => JSX.Element;
  actions: string[];
  handleActivate: (id: number) => void;
}) => {
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
          <IUser className="text-[#274c77] dark:text-gray-400" size={35} />
            {employee.fullName}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
          <Phone size={35} className="text-[#00bbf9] dark:text-gray-400" />
            {employee.phone}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
          <Truck className="text-[#006d77] dark:text-gray-400" size={35} />
            {employee.branch.name}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full">
          {actions.includes("Editar") && (
            <Button
              onClick={() => openEditModal(employee)}
              isIconOnly
              style={global_styles().thirdStyle}
            >
              <Edit size={15} />
            </Button>
          )}
          {actions.includes("Eliminar") && (
            <>
              {employee.isActive ? (
                deletePopover({ employee })
              ) : (
                <Button
                  onClick={() => handleActivate(employee.id)}
                  isIconOnly
                  style={global_styles().thirdStyle}
                >
                  <RefreshCcw />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileView;
