import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { Size } from "../../types/global.types";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  registerId?: number;
  onClose: () => void;
  title?: string;
  size: Size;
  isFull?: boolean;
  isDismissable?: boolean;
}

function ModalGlobal({
  isDismissable,
  children,
  isOpen,
  onClose,
  title,
  size,
  isFull = false,
}: Props) {
  return (
    <Modal
      size={size}
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      placement="bottom-center"
      classNames={{
        base: isFull ? "min-h-[100vh]" : "",
      }}
      isDismissable={isDismissable}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-sm text-gray-600">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalGlobal;