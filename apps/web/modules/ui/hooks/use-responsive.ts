import { useState, useEffect } from 'react';

export function useResponsive() {
  const getIsLandscape = () =>
    typeof window !== 'undefined'
      ? window.innerWidth > window.innerHeight
      : false;

  const getRatio = () =>
    typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1;

  const [ratio, setRatio] = useState(getRatio);

  const [isLandscape, setIsLandscape] = useState(getIsLandscape);

  const getSize = (size: number) => {
    const newSize = Math.round(ratio * size * 10) / 10;
    return newSize > 10 ? 10 : newSize < 1 ? 1 : newSize;
  };

  const sizes = {
    '1': getSize(1) + 'vh',
    '2': getSize(2) + 'vh',
    '3': getSize(3) + 'vh',
    '4': getSize(4) + 'vh',
    '5': getSize(5) + 'vh',
    '6': getSize(6) + 'vh',
    '7': getSize(7) + 'vh',
    '8': getSize(8) + 'vh',
    '9': getSize(9) + 'vh',
    '10': getSize(10) + 'vh',
  };

  console.log(ratio);

  useEffect(() => {
    function handleResize() {
      setIsLandscape(getIsLandscape());
      setRatio(getRatio());
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Initial check in case of SSR hydration
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return sizes;
}
