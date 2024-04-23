import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { Size } from "../../types/global.types";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from "react";

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
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[50]" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-blur bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    // <Modal
    //   size={size}
    //   backdrop="blur"
    //   isOpen={isOpen}
    //   onClose={onClose}
    //   scrollBehavior="inside"
    //   placement="bottom-center"
    //   classNames={{
    //     base: isFull ? "min-h-[100vh]" : "",
    //   }}
    //   isDismissable={isDismissable}
    // >
    //   <ModalContent>
    //     {() => (
    //       <>
    //         <ModalHeader className="flex flex-col gap-1 text-sm text-gray-600">{title}</ModalHeader>
    //         <ModalBody>{children}</ModalBody>
    //       </>
    //     )}
    //   </ModalContent>
    // </Modal>
  );
}

export default ModalGlobal;