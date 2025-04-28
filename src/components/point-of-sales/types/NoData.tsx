import Lottie from 'lottie-react';

// import NO_DATA from '../../assets/svg/NoSelectProduct.json';
import NO_DATA from '../../../assets/svg/NoSelectProduct.json';
function NoData() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Lottie animationData={NO_DATA} className="w-80 h-80 " color="#274c77" />
      <p className=" text-xl dark:text-white text-gray-500">No se encontraron registros</p>
    </div>
  );
}

export default NoData;
