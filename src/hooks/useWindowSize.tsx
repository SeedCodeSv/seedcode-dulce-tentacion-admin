import { useState, useEffect } from 'react';

// const useWindowSize = () => {
//   const [windowSize, setWindowSize] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight,
//   });

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowSize({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       });
//     };

//     window.addEventListener('resize', handleResize);

//     // Limpieza del evento al desmontar el componente
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []); // El efecto se ejecuta solo en el montaje del componente

//   return { windowSize };
// };

// import { useEffect, useState } from 'react';

const useWindowSize = () => {
  const isClient = typeof window === 'object';

  const getSize = () => ({
    width: isClient ? window.innerWidth : 0,
    height: isClient ? window.innerHeight : 0,
  });

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      setWindowSize(getSize());
    };

    window.addEventListener('resize', handleResize);
    // Llamamos una vez para actualizar tras montaje
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);

  return { windowSize };
};

export default useWindowSize;


// export default useWindowSize;
