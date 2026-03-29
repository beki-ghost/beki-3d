import { useEffect, useState } from "react";

const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isNormal: false,
    isLarge: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isNormal: width >= 1024 && width < 1600,
        isLarge: width >= 1600,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};

export default useResponsive;
