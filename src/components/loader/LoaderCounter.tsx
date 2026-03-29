import { forwardRef } from "react";

export default forwardRef<HTMLDivElement>(function LoaderCounter(_, ref) {
  return (
    <div
      ref={ref}
      className="flex items-end text-4xl font-sans text-foreground"
    >
      <span className="line">00</span>
    </div>
  );
});
