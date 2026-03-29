import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LoaderCopy from "./LoaderCopy";
import LoaderCounter from "./LoaderCounter";
import LoaderRevealer from "./LoaderRevealer";
import { loadertext } from "@/lib/constants/data";

interface LoaderProps {
  handleLoaderComplete: () => void;
}

export default function Loader({ handleLoaderComplete }: LoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const revealerRef = useRef<HTMLDivElement>(null);

  const animateCounter = (selector: string, duration = 5, delay = 0) => {
    const counterElement = document.querySelector(selector);
    if (!counterElement) return;
    let currentValue = 0;
    const updateInterval = 200;
    const maxDuration = duration * 1000;
    const startTime = Date.now();

    setTimeout(() => {
      const updateCounter = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = elapsedTime / maxDuration;

        if (currentValue < 100 && elapsedTime < maxDuration) {
          const target = Math.floor(progress * 100);
          const jump = Math.floor(Math.random() * 25) + 5;
          currentValue = Math.min(currentValue + jump, target, 100);
          counterElement.textContent = currentValue.toString().padStart(2, "0");
          setTimeout(updateCounter, updateInterval + Math.random() * 100);
        } else {
          counterElement.textContent = "100";
        }
      };
      updateCounter();
    }, delay * 1000);
  };

  useGSAP(
    () => {
      const loader = loaderRef.current!;
      const copy = copyRef.current!;
      const counter = counterRef.current!;
      const revealer = revealerRef.current!;

      const copyLines = copy.querySelectorAll(".line");
      const counterLines = counter.querySelectorAll(".line");

      let selector: string;
      if (counter.id) {
        selector = `#${counter.id}`;
      } else {
        const attrName = "data-loader-counter";
        counter.setAttribute(attrName, "true");
        selector = `[${attrName}="true"]`;
      }

      animateCounter(selector, 5, 1.5);

      const tl = gsap.timeline();

      tl.to([...copyLines, ...counterLines], {
        y: "0%",
        duration: 1,
        stagger: 0.075,
        ease: "power3.out",
        delay: 1,
      })
        .to(revealer, { scale: 0.1, duration: 0.75, ease: "power2.out" }, "<")
        .to(revealer, { scale: 0.25, duration: 0.75, ease: "power3.out" })
        .to(revealer, { scale: 0.5, duration: 0.75, ease: "power3.out" })
        .to(revealer, { scale: 0.75, duration: 0.75, ease: "power2.out" })
        .to(revealer, { scale: 1, duration: 1, ease: "power3.out" })
        .to(
          loader,
          {
            clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
            duration: 1.25,
            ease: "power3.out",
            onComplete: handleLoaderComplete,
          },
          "-=1"
        );
    },
    { scope: loaderRef }
  );

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex p-8 bg-black min-h-screen"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <LoaderRevealer ref={revealerRef} />
      <div
        ref={copyRef}
        className="flex-1 flex flex-col justify-center items-start gap-4"
      >
        <LoaderCopy text={loadertext[0].text} />
        <LoaderCopy text={loadertext[1].text} />
      </div>
      <LoaderCounter ref={counterRef} />
    </div>
  );
}
