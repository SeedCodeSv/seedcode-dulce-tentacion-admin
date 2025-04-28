import Lottie from 'lottie-react';

import NO_DATA from '../../assets/svg/NoSelectProduct.json';

function EmptyTable() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Lottie animationData={NO_DATA} className="w-80 h-80 " color="#274c77" />
      <p className="mt-3 text-xl dark:text-white">No se encontraron resultados</p>
    </div>
  );
}

export default EmptyTable;
