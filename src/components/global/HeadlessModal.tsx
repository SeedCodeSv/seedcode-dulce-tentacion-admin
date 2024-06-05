import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import classNames from "classnames";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  size: string;
}

function HeadlessModal(props: Props) {
  const { isOpen, onClose, children, title, size } = props;

  return (
    <Transition appear show={isOpen}>
      <Dialog
        as="div"
        className="relative z-[1141] focus:outline-none"
        onClose={onClose}
      >
        <div className="fixed inset-0 z-[1151] w-screen h-screen overflow-hidden">
          <div className="flex w-screen h-screen overflow-hidden items-center justify-center">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 transform-[scale(95%)]"
              enterTo="opacity-100 transform-[scale(100%)]"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 transform-[scale(100%)]"
              leaveTo="opacity-0 transform-[scale(95%)]"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-950/50" />
              <Dialog.Panel
                className={classNames(
                  "bg-white rounded-xl dark:bg-gray-800 backdrop-blur-2xl",
                  size
                )}
              >
                <div className="w-full flex justify-between p-1 mt-1">
                  <Dialog.Title
                    as="h3"
                    className=" font-medium dark:text-white ml-3"
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="bg-transparent border-0 mr-3 outline-none"
                  >
                    <X className="dark:text-white" />
                  </button>
                </div>
                <div className="w-full top-[-10]">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default HeadlessModal;
