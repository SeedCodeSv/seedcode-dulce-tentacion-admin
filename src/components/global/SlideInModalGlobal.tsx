import { ISliderInModalGlobalProps } from './types/slider-in-modal';

function SlideInModalGlobal(props: ISliderInModalGlobalProps) {
  return (
    <div className="relative z-90">
      {props.open && (
        <button
          className="fixed inset-0 backdrop-filter backdrop-blur-sm z-40"
          onClick={() => props.setOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0  ${props.className ? props.className : 'w-full sm:w-1/2 md:w-1/3'}  h-full bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
          props.open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">{props.title}</h2>
          <button
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            onClick={() => props.setOpen(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
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
