import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ScrollIndicatorProps {
  progress: number;
}

const ScrollIndicator = ({ progress }: ScrollIndicatorProps) => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        scaleX: Math.max(0, Math.min(1, progress)),
        duration: 0.1,
        ease: "none",
      });
    }
  }, [progress]);

  return (
    <div className="fixed top-16 md:top-36 right-8 w-40 h-0.5 bg-slate-600 ">
      <p className="text-lg text-primary">Scroll</p>
      <div
        ref={progressRef}
        className="absolute top-0 left-0 h-full bg-white origin-left scale-x-0 w-full"
      />
    </div>
  );
};

export default ScrollIndicator;
