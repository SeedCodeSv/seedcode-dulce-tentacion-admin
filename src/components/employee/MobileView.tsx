import { Button } from '@nextui-org/react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import {
  User as IUser,
  Truck,
  Phone,
  RefreshCcw,
  EditIcon,
  Lock,
  FileText,
  ScanBarcode,
} from 'lucide-react';
import { useEmployeeStore } from '../../store/employee.store';
import { global_styles } from '../../styles/global.styles';
import { GridProps, IMobileView } from './types/mobile-view.types';
import TooltipGlobal from '../global/TooltipGlobal';
import { DeletePopover } from './ListEmployee';
import ProofSalary from './employees-pdfs/ProofSalary';
import ProofeOfEmployment from './employees-pdfs/ProofeOfEmployment';

function MobileView(props: IMobileView) {
  const { layout, openEditModal, deletePopover, actions, handleActivate, OpenPdf } = props;
  const { employee_paginated, loading_employees } = useEmployeeStore();

  return (
    <div className="w-full ">
      <DataView
        value={employee_paginated.employees}
        gutter
        loading={loading_employees}
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'grid dark:bg-transparent  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5',
          }),
        }}
        color="surface"
        itemTemplate={(employee) => (
          <GridItem
            OpenPdf={OpenPdf}
            employee={employee}
            layout={layout}
            openEditModal={openEditModal}
            deletePopover={deletePopover}
            actions={actions}
            handleActivate={handleActivate}
          />
        )}
        emptyMessage="No se encontraron empleados"
      />
    </div>
  );
}

const GridItem = (props: GridProps) => {
  const { employee, layout, openEditModal, deletePopover, OpenPdf, actions, handleActivate } =
    props;
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow-sm  hover:shadow-lg border dark:border-gray-600 p-8 rounded-2xl flex flex-col justify-between'
          )}
          key={employee.id}
        >
          <div className="flex w-full gap-2">
            <IUser className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{`${employee.firstName} ${employee.firstLastName}`}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Phone size={20} className="text-blue-500 dark:text-blue-300" />
            <p className="w-full dark:text-white">{employee.phone}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Truck className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{employee.branch.name}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <ScanBarcode className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{employee.code}</p>
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {employee.isActive && actions.includes('Editar') ? (
              <TooltipGlobal text="Editar">
                <Button
                  className="border border-white"
                  onClick={() => {
                    openEditModal(employee);

                    // setIsOpenModalUpdate(true);
                  }}
                  isIconOnly
                  style={global_styles().secondaryStyle}
                >
                  <EditIcon className="text-white" size={20} />
                </Button>
              </TooltipGlobal>
            ) : (
              <Button
                type="button"
                disabled
                style={global_styles().secondaryStyle}
                className="flex font-semibold border border-white  cursor-not-allowed"
                isIconOnly
              >
                <Lock />
              </Button>
            )}

            {actions.includes('Eliminar') && employee.isActive ? (
              <DeletePopover employee={employee} />
            ) : (
              <Button
                type="button"
                disabled
                style={global_styles().dangerStyles}
                className="flex font-semibold border border-white  cursor-not-allowed"
                isIconOnly
              >
                <Lock />
              </Button>
            )}
            {actions.includes('Contrato') && employee.isActive ? (
              <Button
                className="border border-white"
                onClick={() => OpenPdf(employee)}
                isIconOnly
                style={global_styles().darkStyle}
              >
                <FileText className="text-white" size={20} />
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  disabled
                  style={global_styles().darkStyle}
                  className="flex font-semibold border border-white "
                  isIconOnly
                >
                  <Lock />
                </Button>
              </>
            )}
            <ProofSalary employee={employee} actions={actions}></ProofSalary>

            <ProofeOfEmployment employee={employee} actions={actions}></ProofeOfEmployment>

            {!employee.isActive && (
              <>
                {actions.includes('Activar') ? (
                  <TooltipGlobal text="Activar">
                    <Button
                      className="border border-white"
                      onClick={() => handleActivate(employee.id)}
                      isIconOnly
                      style={global_styles().thirdStyle}
                    >
                      <RefreshCcw />
                    </Button>
                  </TooltipGlobal>
                ) : (
                  <Button
                    type="button"
                    disabled
                    style={global_styles().thirdStyle}
                    className="flex font-semibold border border-white  cursor-not-allowed"
                    isIconOnly
                  >
                    <Lock />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <ListItem
          actions={actions}
          OpenPdf={OpenPdf}
          layout="list"
          employee={employee}
          openEditModal={openEditModal}
          deletePopover={deletePopover}
          handleActivate={handleActivate}
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { employee, actions, openEditModal, handleActivate, OpenPdf } = props;
  return (
    <>
      <div className="flex w-full border-white p-5 border shadow  rounded-2xl">
        <div className="w-full">
          <div className="flex w-full gap-2">
            <IUser className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{`${employee.firstName} ${employee.firstLastName}`}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Phone size={20} className="text-blue-500 dark:text-blue-300" />
            <p className="w-full dark:text-white">{employee.phone}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Truck className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{employee.branch.name}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <ScanBarcode className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{employee.code}</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-5 w-full">
          {employee.isActive && actions.includes('Editar') ? (
            <TooltipGlobal text="Editar">
              <Button
                className="border border-white"
                onClick={() => {
                  openEditModal(employee);

                  // setIsOpenModalUpdate(true);
                }}
                isIconOnly
                style={global_styles().secondaryStyle}
              >
                <EditIcon className="text-white" size={20} />
              </Button>
            </TooltipGlobal>
          ) : (
            <Button
              type="button"
              disabled
              style={global_styles().secondaryStyle}
              className="flex font-semibold border border-white  cursor-not-allowed"
              isIconOnly
            >
              <Lock />
            </Button>
          )}

          {actions.includes('Eliminar') && employee.isActive ? (
            <DeletePopover employee={employee} />
          ) : (
            <Button
              type="button"
              disabled
              style={global_styles().dangerStyles}
              className="flex font-semibold border border-white  cursor-not-allowed"
              isIconOnly
            >
              <Lock />
            </Button>
          )}
          {actions.includes('Contrato') && employee.isActive ? (
            <Button
              className="border border-white"
              onClick={() => OpenPdf(employee)}
              isIconOnly
              style={global_styles().darkStyle}
            >
              <FileText className="text-white" size={20} />
            </Button>
          ) : (
            <>
              <Button
                type="button"
                disabled
                style={global_styles().darkStyle}
                className="flex font-semibold border border-white "
                isIconOnly
              >
                <Lock />
              </Button>
            </>
          )}
          <ProofSalary employee={employee} actions={actions}></ProofSalary>

          <ProofeOfEmployment employee={employee} actions={actions}></ProofeOfEmployment>
          {!employee.isActive && (
            <>
              {actions.includes('Activar') ? (
                <TooltipGlobal text="Activar">
                  <Button
                    className="border border-white"
                    onClick={() => handleActivate(employee.id)}
                    isIconOnly
                    style={global_styles().thirdStyle}
                  >
                    <RefreshCcw />
                  </Button>
                </TooltipGlobal>
              ) : (
                <Button
                  type="button"
                  disabled
                  style={global_styles().thirdStyle}
                  className="flex font-semibold border border-white  cursor-not-allowed"
                  isIconOnly
                >
                  <Lock />
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
