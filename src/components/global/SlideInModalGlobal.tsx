import { ISliderInModalGlobalProps } from './types/slider-in-modal';

function SlideInModalGlobal(props: ISliderInModalGlobalProps) {
  return (
    <div className="relative z-50">
      {props.open && (
        <div
          className="fixed inset-0 backdrop-filter backdrop-blur-sm z-40"
          onClick={() => props.setOpen(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 w-full sm:w-1/2 md:w-1/3 h-full bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
          props.open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">{props.title}</h2>
          <button
            onClick={() => props.setOpen(false)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 text-gray-700 dark:text-gray-300">
          <p>{props.children}</p>
        </div>
      </div>
    </div>
  );
}

export default SlideInModalGlobal;
