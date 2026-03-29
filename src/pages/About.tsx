import { TextAndMarquee } from "@/components/about/TextAndMarquee";
import { images, texts } from "@/lib/constants/data";

export const About = () => {
  return <TextAndMarquee images={images} texts={texts} />;
};
