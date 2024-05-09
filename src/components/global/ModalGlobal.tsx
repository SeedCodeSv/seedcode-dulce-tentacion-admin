// import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import classNames from "classnames";
import { Dialog } from "primereact/dialog";
import { useColorScheme } from '../../../../seedwaresv-erp-app/components/useColorScheme.web';

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  registerId?: number;
  onClose: () => void;
  title?: string;
  size: string;
  isFull?: boolean;
  isDismissable?: boolean;
}

function ModalGlobal({
  isDismissable = true,
  children,
  isOpen,
  onClose,
  title,
  size,
  isFull,
}: Props) {

  return (
    <Dialog
      visible={isOpen}
      className={classNames(
        isFull && "w-full h-full",
        size,
        "bg-red-700 dark:bg-gray-800"
      )}
      pt={{
        content: () => {
          return {
            style: {
              backgroundColor: "rgb(31 41 55)",
              color: "#ffffff",
            },
          };
        },
        header: () => {
          return {
            style: {
              backgroundColor: "rgb(31 41 55)",
              color: "#ffffff",
            },
          };
        },
      }}
      onHide={() => onClose()}
      header={
        title && (
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )
      }
    >
      {children}
    </Dialog>
  );
}

export default ModalGlobal;
