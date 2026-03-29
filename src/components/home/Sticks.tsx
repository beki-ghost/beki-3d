import useResponsive from "@/lib/hooks/useResponsive";

interface SticksProps {
  totalSlides: number;
  currentIndex: number;
  sticksPerSection?: number;
}

const Sticks = ({
  totalSlides,
  currentIndex,
  sticksPerSection = 40,
}: SticksProps) => {
  const { isMobile, isTablet, isNormal } = useResponsive();

  const renderSection = (sectionIndex: number) => {
    const items = [];
    const isCurrentSection = sectionIndex === currentIndex;

    items.push(
      <div
        key={`count-${sectionIndex}`}
        className={`shrink-0 text-xs ${
          isCurrentSection ? "text-primary" : "text-primary/60"
        }`}
      >
        <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
      </div>
    );
    const stickCount = isMobile
      ? 8
      : isTablet
      ? 20
      : isNormal
      ? 20
      : sticksPerSection;

    for (let i = 0; i < stickCount; i++) {
      items.push(
        <div
          key={`stick-${sectionIndex}-${i}`}
          className={`shrink-0 w-1 h-4 transition-all duration-300 ${
            isCurrentSection
              ? "opacity-100 scale-80 bg-primary/80"
              : "opacity-40 scale-75 bg-primary/40"
          }`}
        />
      );
    }

    return items;
  };

  return (
    <div className="flex justify-between items-center h-2 sm:h-4 min-h-2 sm:min-h-4 space-x-0.5 sm:space-x-1 px-4 sm:px-7">
      {Array.from({ length: totalSlides }, (_, index) => renderSection(index))}
    </div>
  );
};

export default Sticks;
