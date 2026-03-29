import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  showContent?: boolean;
}

export default function PageTransition({
  children,
  showContent = false,
}: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useGSAP(() => {
    if (!containerRef.current || showContent) return;

    gsap.fromTo(
      containerRef.current,
      {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      },
      {
        clipPath: "polygon(0 100%, 100% 100%, 100% 0%, 0 0%)",
        duration: 1.2,
        ease: "power3.out",
      }
    );
  }, [location.pathname, showContent]);

  if (showContent) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "min-h-screen z-50",
        location.pathname === "/" ? "bg-secondary" : "bg-background"
      )}
    >
      <div
        ref={containerRef}
        className="min-h-screen z-50"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
      >
        {children}
      </div>
    </div>
  );
}
