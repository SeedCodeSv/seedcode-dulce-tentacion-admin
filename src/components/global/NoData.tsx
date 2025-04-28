
import Lottie from 'lottie-react';

import NO_DATA from '../../assets/svg/NoSelectProduct.json';
function NoData() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* <img src={NO_DATA} alt="X" className="w-32 h-32" /> */}
      <Lottie animationData={NO_DATA} className="w-80 h-80 " color='#274c77' />
      <p className=" text-xl dark:text-white text-gray-500">Aún no agregas productos</p>
    </div>
  );
}

export default NoData;
