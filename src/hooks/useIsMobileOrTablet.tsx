import { useEffect, useState } from 'react';

const useIsMobileOrTablet = () => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  const checkDevice = () => {
    const width = window.innerWidth;

    setIsMobileOrTablet(width < 1024);
  };

  useEffect(() => {
    checkDevice();

    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return isMobileOrTablet;
};

export default useIsMobileOrTablet;
