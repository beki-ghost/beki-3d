import { useEffect, useRef, useCallback, useState } from "react";
import { useLocation } from "react-router";
import { ImageModal } from "./ImageModal";

interface Dimensions {
  itemSize: number;
  containerSize: number;
  indicatorSize: number;
}

interface MiniMapProps {
  projectImages: string[];
}

export const MiniMap = ({ projectImages }: MiniMapProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const isHorizontal = window.innerWidth <= 900;
  const path = useLocation().pathname;

  const dimensionsRef = useRef<Dimensions>({
    itemSize: 0,
    containerSize: 0,
    indicatorSize: 0,
  });
  const maxTranslateRef = useRef(0);
  const currentTranslateRef = useRef(0);
  const targetTranslateRef = useRef(0);
  const isClickMoveRef = useRef(false);
  const touchStartXRef = useRef(0);

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const updateDimensions = useCallback(() => {
    const itemElements = itemsRef.current?.children;
    if (!itemElements || !itemsRef.current || !indicatorRef.current) return;

    if (isHorizontal) {
      dimensionsRef.current = {
        itemSize: (itemElements[0] as HTMLElement).getBoundingClientRect()
          .width,
        containerSize: itemsRef.current.scrollWidth,
        indicatorSize: indicatorRef.current.getBoundingClientRect().width,
      };
    } else {
      dimensionsRef.current = {
        itemSize: (itemElements[0] as HTMLElement).getBoundingClientRect()
          .height,
        containerSize: itemsRef.current.scrollHeight,
        indicatorSize: indicatorRef.current.getBoundingClientRect().height,
      };
    }

    maxTranslateRef.current =
      dimensionsRef.current.containerSize - dimensionsRef.current.indicatorSize;
  }, []);

  const getItemInIndicator = useCallback(() => {
    const itemElements = itemsRef.current?.children;
    if (!itemElements) return 0;

    const indicatorStart = -currentTranslateRef.current;
    const indicatorEnd = indicatorStart + dimensionsRef.current.indicatorSize;

    let maxOverlap = 0;
    let selectIndex = 0;

    Array.from(itemElements).forEach((_, index) => {
      const itemStart = index * dimensionsRef.current.itemSize;
      const itemEnd = itemStart + dimensionsRef.current.itemSize;

      const overlapStart = Math.max(indicatorStart, itemStart);
      const overlapEnd = Math.min(indicatorEnd, itemEnd);
      const overlap = Math.max(overlapEnd - overlapStart, 0);

      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        selectIndex = index;
      }
    });

    return selectIndex;
  }, []);

  const updatePreviewImage = useCallback(
    (index: number, forceUpdate = false) => {
      if (
        previewImageRef.current &&
        (forceUpdate || previewImageRef.current.src !== projectImages[index])
      ) {
        previewImageRef.current.src = projectImages[index];
      }
    },
    []
  );

  const animate = useCallback(() => {
    const lerpFactor = isClickMoveRef.current ? 0.05 : 0.075;
    currentTranslateRef.current = lerp(
      currentTranslateRef.current,
      targetTranslateRef.current,
      lerpFactor
    );

    if (
      Math.abs(currentTranslateRef.current - targetTranslateRef.current) > 0.01
    ) {
      const transform = isHorizontal
        ? `translateX(${currentTranslateRef.current}px)`
        : `translateY(${currentTranslateRef.current}px)`;

      if (itemsRef.current) {
        itemsRef.current.style.transform = transform;
      }

      const activeIndex = getItemInIndicator();
      if (!isClickMoveRef.current) {
        updatePreviewImage(activeIndex);
      }
    } else {
      isClickMoveRef.current = false;
    }

    requestAnimationFrame(animate);
  }, [isHorizontal, getItemInIndicator, updatePreviewImage]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    isClickMoveRef.current = false;

    const scrollVelocity = Math.min(Math.max(e.deltaY * 0.5, -20), 20);
    targetTranslateRef.current = Math.min(
      Math.max(
        targetTranslateRef.current - scrollVelocity,
        -maxTranslateRef.current
      ),
      0
    );
  }, []);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (isHorizontal) {
        touchStartXRef.current = e.touches[0].clientX;
      }
    },
    [isHorizontal]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isHorizontal) {
        isClickMoveRef.current = false; // Add this line
        const touchEndX = e.touches[0].clientX;
        const deltaX = touchStartXRef.current - touchEndX;
        const scrollVelocity = Math.min(Math.max(deltaX * 0.5, -20), 20);
        targetTranslateRef.current = Math.min(
          Math.max(
            targetTranslateRef.current - scrollVelocity,
            -maxTranslateRef.current
          ),
          0
        );

        touchStartXRef.current = touchEndX;
        e.preventDefault();
      }
    },
    [isHorizontal]
  );
  const handleItemClick = useCallback(
    (index: number) => {
      isClickMoveRef.current = true;
      // Center the item perfectly in the indicator
      targetTranslateRef.current =
        -index * dimensionsRef.current.itemSize +
        dimensionsRef.current.indicatorSize / 2 -
        dimensionsRef.current.itemSize / 2;

      // Clamp to bounds
      targetTranslateRef.current = Math.max(
        Math.min(targetTranslateRef.current, 0),
        -maxTranslateRef.current
      );
      updatePreviewImage(index, true);
    },
    [updatePreviewImage]
  );

  const handleResize = useCallback(() => {
    updateDimensions();
    const newMaxTranslate =
      dimensionsRef.current.containerSize - dimensionsRef.current.indicatorSize;
    maxTranslateRef.current = newMaxTranslate;
    targetTranslateRef.current = Math.min(
      Math.max(targetTranslateRef.current, -newMaxTranslate),
      0
    );
    currentTranslateRef.current = targetTranslateRef.current;

    const transform = isHorizontal
      ? `translateX(${currentTranslateRef.current}px)`
      : `translateY(${currentTranslateRef.current}px)`;

    if (itemsRef.current) {
      itemsRef.current.style.transform = transform;
    }
  }, [updateDimensions, isHorizontal]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateDimensions();
      updatePreviewImage(0, true);
      animate();
    }, 100);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleResize,
    updateDimensions,
    updatePreviewImage,
    animate,
  ]);

  const handlePreviewClick = useCallback(() => {
    if (previewImageRef.current) {
      setModalImageSrc(previewImageRef.current.src);
      setIsModalOpen(true);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-secondary touch-none"
    >
      <div className="absolute top-1/6 left-9 md:top-1/2 md:left-8 flex gap-2 md:gap-3 justify-center items-center">
        <p className="text-xl md:text-2xl font-bold text-secondary-foreground/40">
          Category:{" "}
        </p>
        <p className="md:text-2xl font-semibold">
          <span className="text-secondary-foreground">
            {path === "/thumbnails"
              ? "Thumbnails"
              : path === "/sticker-designs"
              ? "Sticker Designs"
              : path === "/social-media-posts"
              ? "Social Media Posts"
              : path === "/flayers-designs"
              ? "Flayer Designs"
              : "Projects"}
          </span>
        </p>
      </div>

      <div className="absolute top-[45%] md:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 md:w-1/2 md:h-3/4 overflow-hidden">
        <img
          ref={previewImageRef}
          src={projectImages[0]}
          alt=""
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain transition-opacity duration-200 cursor-zoom-in"
          onClick={handlePreviewClick}
        />
      </div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 h-20 md:top-1/2 md:right-32 md:left-auto md:transform-none md:w-20 md:h-auto touch-none">
        <div
          ref={indicatorRef}
          className="absolute top-0 left-1/2 transform w-15 h-full md:top-0 md:left-0 md:w-28 md:h-16 border border-black z-20"
        />

        <div
          ref={itemsRef}
          className="absolute left-0 top-0 w-max h-full md:relative md:w-full md:h-full flex flex-row md:flex-col gap-0"
          style={{ willChange: "transform" }}
        >
          {projectImages.map((src, index) => (
            <div
              key={index}
              className="w-15 h-full md:w-28 md:h-16 p-1.5 cursor-pointer touch-non"
              onClick={() => handleItemClick(index)}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover transition-opacity duration-200 select-none"
              />
            </div>
          ))}
        </div>
      </div>
      <ImageModal
        isOpen={isModalOpen}
        imageSrc={modalImageSrc}
        onClose={closeModal}
      />
    </div>
  );
};
