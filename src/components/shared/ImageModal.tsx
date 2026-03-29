interface ImageModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
}

export const ImageModal = ({ isOpen, imageSrc, onClose }: ImageModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <div className="relative max-w-5xl max-h-full">
        <img
          src={imageSrc}
          alt="Enlarged preview"
          className="w-full h-full object-cover "
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />
      </div>
    </div>
  );
};
