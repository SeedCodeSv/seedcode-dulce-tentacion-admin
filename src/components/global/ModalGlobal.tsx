import classNames from 'classnames';
import { Dialog } from 'primereact/dialog';

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  registerId?: number;
  onClose: () => void;
  title?: string;
  size: string;
  isFull?: boolean;
  isDismissable?: boolean;
  isMaximizable?: boolean;
}

function ModalGlobal({ children, isOpen, onClose, title, size, isFull, isMaximizable = false }: Props) {

  return (
    <Dialog
      className={classNames(
        isFull && 'w-full overflow-y-auto',
        size,
        'dark:bg-gray-800 overflow-y-auto'
      )}
      header={
        title && (
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )
      }
      maximizable={isMaximizable}
      visible={isOpen}
      onHide={() => onClose()}
    >
      {children}
    </Dialog>
  );
}

export default ModalGlobal;
