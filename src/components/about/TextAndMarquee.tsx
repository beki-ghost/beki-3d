import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import Lenis from "lenis";
import CopyBlock from "./CopyBlock";
import Marquee from "./Marquee";
import ScrollIndicator from "./ScrollIndicator";

interface TextAndMarqueeProps {
  texts: {
    title: string;
    content: string;
  }[];
  images: string[];
}

export const TextAndMarquee = ({ images, texts }: TextAndMarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const copyBlockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [targetVelocity, setTargetVelocity] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", (e) => {
      setTargetVelocity(Math.abs(e.velocity) * 0.05);
      ScrollTrigger.update();
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const textBlocks = copyBlockRefs.current.filter(Boolean);
    const splitInstances = textBlocks
      .map((textBlock) => {
        const paragraph = textBlock?.querySelector("p");
        return paragraph
          ? SplitText.create(paragraph, {
              type: "words",
              mask: "words",
            })
          : null;
      })
      .filter(Boolean);

    gsap.set(splitInstances[1]?.words || [], { yPercent: 100 });
    gsap.set(splitInstances[2]?.words || [], { yPercent: 100 });

    const overlapCount = 5;

    const getWordsProgress = (
      phaseProgress: number,
      wordIndex: number,
      totalWords: number
    ) => {
      const totalLength = 1 + overlapCount / totalWords;
      const scale =
        1 /
        Math.min(
          totalLength,
          1 + (totalWords - 1) / totalWords + overlapCount / totalWords
        );

      const startTime = (wordIndex / totalWords) * scale;
      const endTime = startTime + (overlapCount / totalWords) * scale;
      const duration = endTime - startTime;

      if (phaseProgress <= startTime) return 0;
      if (phaseProgress >= endTime) return 1;
      return (phaseProgress - startTime) / duration;
    };

    const animateBlock = (
      outBlock: any,
      inBlock: any,
      phaseProgress: number
    ) => {
      outBlock.words?.forEach((word: HTMLElement, i: number) => {
        const progress = getWordsProgress(
          phaseProgress,
          i,
          outBlock.words.length
        );
        gsap.set(word, { yPercent: progress * 100 });
      });

      inBlock.words?.forEach((word: HTMLElement, i: number) => {
        const progress = getWordsProgress(
          phaseProgress,
          i,
          inBlock.words.length
        );
        gsap.set(word, { yPercent: 100 - progress * 100 });
      });
    };

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setScrollProgress(self.progress);

        if (self.progress <= 0.5) {
          const phase1 = self.progress / 0.5;
          animateBlock(splitInstances[0], splitInstances[1], phase1);
        } else {
          const phase2 = (self.progress - 0.5) / 0.5;
          gsap.set(splitInstances[0]?.words || [], { yPercent: 100 });
          animateBlock(splitInstances[1], splitInstances[2], phase2);
        }
      },
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      splitInstances.forEach((instance) => instance?.revert?.());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[600vh]">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-background">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full px-8 flex gap-16 max-md:top-96 max-md:flex-col">
          {texts.map((text, index) => (
            <CopyBlock
              key={index}
              title={text.title}
              onRef={(el) => (copyBlockRefs.current[index] = el)}
            >
              {text.content}
            </CopyBlock>
          ))}
        </div>

        <Marquee images={images} targetVelocity={targetVelocity} />
        <ScrollIndicator progress={scrollProgress} />
      </div>
    </div>
  );
};
