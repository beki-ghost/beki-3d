import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { useLocation } from "react-router-dom";

export default forwardRef<HTMLDivElement>(function LoaderRevealer(_, ref) {
  const pathname = useLocation().pathname;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-1/2 left-1/2 bg-secondary -translate-x-1/2 -translate-y-1/2 scale-0 bg-base-300 w-[300%] md:w-[150%] aspect-square z-10",
        pathname === "/" || pathname === "/about"
          ? "bg-secondary"
          : "bg-background"
      )}
    />
  );
});
