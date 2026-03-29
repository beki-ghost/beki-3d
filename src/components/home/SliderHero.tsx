import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { Link } from "react-router";
import { email, slideData } from "@/lib/constants/data";
import Sticks from "./Sticks";

gsap.registerPlugin(SplitText);

interface SlideProps {
  data: (typeof slideData)[0];
  index: number;
  isNew?: boolean;
}

const Slide = ({ data, index, isNew = false }: SlideProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!slideRef.current || !titleRef.current) return;

    const split = new SplitText(titleRef.current, {
      type: "words",
      mask: "words",
    });

    if (isNew) {
      gsap.set(split.words, { yPercent: 100 });
      gsap.to(split.words, {
        yPercent: 0,
        duration: 0.4,
        ease: "power4.Out",
        stagger: 0.1,
        delay: 0.5,
      });
    }

    gsap.set(slideRef.current, {
      y: -10 + 10 * index + "%",
      z: 8 * index,
      scale: 0.8 + index * 0.05,
      opacity: 1,
      // delay: index * 0.5,
    });
  }, [index, isNew]);

  return (
    <div
      ref={slideRef}
      className="cursor-pointer slide absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-100 md:w-1/2 3xl:h-125 rounded-sm flex justify-center items-center overflow-hidden"
    >
      <Link
        to={data.to}
        className="flex justify-center items-center w-full h-full"
      >
        <img
          src={data.image}
          alt={data.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        <h2
          ref={titleRef}
          className="text-primary max-w-1/2 text-center text-4xl lg:text-5xl xl:text-7xl font-semibold tracking-tighter md:tracking-normal relative z-10"
        >
          {data.title}
        </h2>
      </Link>
    </div>
  );
};

export const SliderHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const [slides, setSlides] = useState(() => slideData.slice(0, 5));
  const [frontIndex, setFrontIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const wheelAccumulatorRef = useRef(0);
  const isWheelActiveRef = useRef(false);
  const isTouchActiveRef = useRef(false);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const [lastDirection, setLastDirection] = useState<"down" | "up" | null>(
    null,
  );

  const animateSlides = (direction: "down" | "up") => {
    if (!sliderRef.current || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setLastDirection(direction);
    const slideElements = sliderRef.current.querySelectorAll(".slide");

    if (direction === "down") {
      const newFrontIndex = (frontIndex + 1) % slideData.length;
      const newBackIndex = (newFrontIndex + 4) % slideData.length;

      // Animate background color
      gsap.to(containerRef.current, {
        backgroundColor: slideData[newFrontIndex].bgColor,
        duration: 1,
        ease: "power3.inOut",
      });

      slideElements.forEach((slide, index) => {
        const targetPosition = index - 1;
        gsap.to(slide, {
          y: -10 + 10 * targetPosition + "%",
          z: 8 * targetPosition,
          scale: 0.8 + targetPosition * 0.05,
          opacity: targetPosition < 0 ? 0 : 1,
          duration: 0.5,
          // delay: index * 0.1,
          ease: "power3.inOut",
          onComplete: () => {
            if (index === 0) {
              setSlides((prev) => [...prev.slice(1), slideData[newBackIndex]]);
              setFrontIndex(newFrontIndex);
              isAnimatingRef.current = false;
            }
          },
        });
      });
    } else {
      const newFrontIndex =
        (frontIndex - 1 + slideData.length) % slideData.length;

      // Animate background color
      gsap.to(containerRef.current, {
        backgroundColor: slideData[newFrontIndex].bgColor,
        duration: 1,
        ease: "power3.inOut",
      });

      slideElements.forEach((slide, index) => {
        gsap.to(slide, {
          y: -10 + 10 * (index + 1) + "%",
          z: 8 * (index + 1),
          scale: 0.8 + (index + 1) * 0.05,
          opacity: index + 1 > 4 ? 0 : 1,
          duration: 0.5,
          // delay: (slideElements.length - 1 - index) * 0.1,
          ease: "power3.inOut",
          onComplete: () => {
            if (index === slideElements.length - 1) {
              setSlides((prev) => [
                slideData[newFrontIndex],
                ...prev.slice(0, -1),
              ]);
              setFrontIndex(newFrontIndex);
              isAnimatingRef.current = false;
            }
          },
        });
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimatingRef.current || isWheelActiveRef.current) return;

      wheelAccumulatorRef.current += Math.abs(e.deltaY);

      if (wheelAccumulatorRef.current >= 100) {
        isWheelActiveRef.current = true;
        wheelAccumulatorRef.current = 0;
        animateSlides(e.deltaY > 0 ? "down" : "up");
        setTimeout(() => {
          isWheelActiveRef.current = false;
        }, 1200);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isAnimatingRef.current || isTouchActiveRef.current) return;
      touchStartRef.current = {
        y: e.touches[0].clientY,
        x: e.touches[0].clientX,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current || isTouchActiveRef.current) return;
      const deltaY = touchStartRef.current.y - e.changedTouches[0].clientY;
      const deltaX = Math.abs(
        touchStartRef.current.x - e.changedTouches[0].clientX,
      );

      if (Math.abs(deltaY) > deltaX && Math.abs(deltaY) > 50) {
        isTouchActiveRef.current = true;
        animateSlides(deltaY > 0 ? "down" : "up");
        setTimeout(() => {
          isTouchActiveRef.current = false;
        }, 1200);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [frontIndex]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: slideData[0].bgColor }}
    >
      {/* Top Left - Year */}
      <div className="flex justify-between items-center font-semibold text-sm md:text-xl">
        <div className="absolute top-32 md:top-36 left-10 z-10 text-primary text-center">
          Year
          <br />
          <span ref={yearRef}>{slideData[frontIndex].year}</span>
        </div>

        {/* Top Right - Scroll */}
        <div className="absolute top-32 md:top-36 right-8 z-10 text-primary ">
          Scroll
        </div>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="absolute w-full h-screen overflow-hidden"
        style={{ perspective: "250px", perspectiveOrigin: "50% 100%" }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={`${slide.title}-${index}`}
            data={slide}
            index={index}
            isNew={
              lastDirection === "down"
                ? index === slides.length - 1
                : lastDirection === "up"
                  ? index === 0
                  : false
            }
          />
        ))}
      </div>

      {/* Bottom Left - Email */}
      <div className="absolute bottom-16 left-4 sm:bottom-12 sm:left-6 z-10 text-primary text-xs sm:text-lg underline">
        <a href={`mailto:${email}`}>{email}</a>
      </div>

      {/* Bottom Right - Location */}
      <div className="absolute bottom-16 right-4 sm:bottom-12 sm:right-6 z-10 text-primary text-xs sm:text-lg">
        Addis Ababa, Ethiopia
      </div>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 w-full">
        <Sticks totalSlides={slideData.length} currentIndex={frontIndex} />
      </div>
    </div>
  );
};
