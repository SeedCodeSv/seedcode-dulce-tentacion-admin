import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import classNames from 'classnames';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  size: string;
  isFull?: boolean;
}

function HeadlessModal(props: Props) {
  const { isOpen, onClose, children, title, size, isFull } = props;

  return (
    <Transition appear show={isOpen}>
      <Dialog
        as="div"
        className="relative z-[1141] focus:outline-none"
        onClose={(event: React.MouseEvent<HTMLElement> | boolean) => {
          if (event instanceof MouseEvent) {
            if (event.target === event.currentTarget) {
              return;
            }
            onClose;
          }
        }}
      >
        <div className="fixed backdrop-blur-sm inset-0 z-[1151] w-screen h-screen overflow-hidden">
          <div className="flex items-center justify-center w-screen h-screen overflow-hidden">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 transform-[scale(95%)]"
              enterTo="opacity-100 transform-[scale(100%)]"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 transform-[scale(100%)]"
              leaveTo="opacity-0 transform-[scale(95%)]"
            >
              <Dialog.Overlay
                className="fixed inset-0 bg-gray-950/50"
                onClick={(event) => {
                  if (event.target === event.currentTarget) {
                    event.stopPropagation();
                  }
                }}
              />
              <Dialog.Panel
                className={classNames(
                  isFull
                    ? 'h-screen w-screen rounded-0'
                    : size + ' rounded-lg max-h-[90vh] overflow-y-auto',
                  'relative transform bg-white z-[100] text-left shadow-xl transition-all'
                )}
              >
                <div className="w-full border border-white h-full p-3  rounded-lg overflow-y-auto bg-white dark:bg-gray-900">
                  <div>
                    <div className="mt-3 text-center sm:mx-4 sm:mt-0 sm:text-left">
                      <div className="flex justify-between w-full">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
                        >
                          {title}
                        </Dialog.Title>

                        <button onClick={() => onClose()}>
                          <X className="dark:text-white" size={20} />
                        </button>
                      </div>
                      {children}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default HeadlessModal;
