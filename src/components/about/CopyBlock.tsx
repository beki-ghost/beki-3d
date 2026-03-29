interface CopyBlockProps {
  children: React.ReactNode;
  onRef: (el: HTMLDivElement | null) => void;
  title: string;
}

const CopyBlock = ({ children, onRef, title }: CopyBlockProps) => (
  <div className="flex-1 md:space-y-4">
    <p className="text-secondary text-sm md:text-xl">{title}</p>

    <div ref={onRef}>
      <p className="text-secondary text-xs md:text-lg">{children}</p>
    </div>
  </div>
);

export default CopyBlock;
