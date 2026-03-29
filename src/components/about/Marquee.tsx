import gsap from "gsap";
import { useEffect, useRef } from "react";

interface MarqueeItemProps {
  src: string;
}

const MarqueeItem = ({ src }: MarqueeItemProps) => (
  <div className="w-40 h-24 rounded overflow-hidden shrink-0">
    <img src={src} alt="" className="w-full h-full object-cover" />
  </div>
);

interface MarqueeProps {
  images: string[];
  targetVelocity: number;
}

const Marquee = ({ images, targetVelocity }: MarqueeProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(targetVelocity);

  useEffect(() => {
    velocityRef.current = targetVelocity;
  }, [targetVelocity]);

  useEffect(() => {
    if (!trackRef.current) return;

    let marqueePosition = 0;
    let smoothVelocity = 0;

    const ticker = gsap.ticker.add(() => {
      smoothVelocity += (velocityRef.current - smoothVelocity) * 0.5;
      const baseSpeed = 0.45;
      const speed = baseSpeed + smoothVelocity * 5;

      marqueePosition -= speed;

      const trackWidth = trackRef.current!.scrollWidth / 2;
      if (marqueePosition <= -trackWidth) {
        marqueePosition = 0;
      }

      gsap.set(trackRef.current, { x: marqueePosition });
    });

    return () => {
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <div className="absolute left-0 bottom-8 w-full h-30 overflow-hidden flex items-center">
      <div ref={trackRef} className="flex gap-3">
        {[...images, ...images].map((src, index) => (
          <MarqueeItem key={index} src={src} />
        ))}
      </div>
    </div>
  );
};

export default Marquee;
