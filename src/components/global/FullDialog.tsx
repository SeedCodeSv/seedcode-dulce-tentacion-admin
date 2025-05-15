import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  className?: string
}

export default function FullDialog(props: Props) {
  const { isOpen, onClose, children, title } = props;

  return (
    <>
      <Transition appear show={isOpen}>
        <Dialog as="div" className="relative z-[1140] focus:outline-none " onClose={onClose}>
          <div
            className={`fixed inset-0 z-[1150] w-screen h-screen overflow-hidden `}
          >
            <div className="flex min-h-full items-center justify-end ">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <Dialog.Panel className={`${props.className ? props.className : 'w-screen' } h-screen border border-white rounded-2xl overflow-y-auto bg-white dark:bg-gray-900 p-8 backdrop-blur-2xl`}>
                  <div className="w-full flex justify-between mb-5">
                    <Dialog.Title as="h3" className="text-base/7 font-medium dark:text-white">
                      {title}
                    </Dialog.Title>
                    <button className="bg-transparent border-0 outline-none" onClick={onClose}>
                      <X className="dark:text-white" />
                    </button>
                  </div>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
