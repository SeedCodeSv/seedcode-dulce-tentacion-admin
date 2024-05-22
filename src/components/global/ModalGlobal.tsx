import { useContext } from "react";
import classNames from "classnames";
import { Dialog } from "primereact/dialog";
import { ThemeContext } from "../../hooks/useTheme";

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
  children,
  isOpen,
  onClose,
  title,
  size,
  isFull,
}: Props) {
  const { context } = useContext(ThemeContext);

  return (
    <Dialog
      visible={isOpen}
      className={classNames(
        context === "light" ? "light" : "dark",
        isFull && "w-full h-full overflow-y-auto",
        size,
        "dark:bg-gray-800 overflow-y-auto"
      )}
      pt={{
        content: () => {
          return {
            style: {
              backgroundColor:
                context === "light" ? "#ffffff" : "rgb(31 41 55)",
              color: context === "light" ? "rgb(31 41 55)" : "#ffffff",
            },
          };
        },
        header: () => {
          return {
            style: {
              backgroundColor:
                context === "light" ? "#ffffff" : "rgb(31 41 55)",
              color: context === "light" ? "rgb(31 41 55)" : "#ffffff",
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
