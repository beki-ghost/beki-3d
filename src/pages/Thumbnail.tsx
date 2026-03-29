import { MiniMap } from "@/components/shared/MiniMap";
import { thumbnailImages } from "@/lib/constants/data";

const Thumbnail = () => {
  return <MiniMap projectImages={thumbnailImages} />;
};

export default Thumbnail;
