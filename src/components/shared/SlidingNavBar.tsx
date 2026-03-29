import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link, useLocation } from "react-router-dom";
import useResponsive from "@/lib/hooks/useResponsive";
import { cn } from "@/lib/utils";
import { menuItems, siteName, socialItems } from "@/lib/constants/data";

export const SlidingNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuToggleRef = useRef<HTMLDivElement | null>(null);
  const menuOverlayRef = useRef<HTMLDivElement | null>(null);
  const menuContentRef = useRef<HTMLDivElement | null>(null);
  const menuPreviewImgRef = useRef<HTMLDivElement | null>(null);
  const isOpenRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const pathname = useLocation().pathname;
  const { isMobile } = useResponsive();

  useGSAP(
    () => {
      gsap.set([".link a", ".social a"], { y: "120%", opacity: 0.25 });
      gsap.set(menuContentRef.current, {
        transform:
          "translateX(-100px) translateY(-100px) scale(1.5) rotate(-15deg)",
        opacity: 0.25,
      });
      gsap.set(menuOverlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      });
    },
    { dependencies: [menuItems, socialItems] },
  );

  const animateMenuToggle = (isOpening: boolean) => {
    const openEl =
      menuToggleRef.current?.querySelector<HTMLParagraphElement>("#menu-open");
    const closeEl =
      menuToggleRef.current?.querySelector<HTMLParagraphElement>("#menu-close");

    const targetOut = isOpening ? openEl : closeEl;
    const targetIn = isOpening ? closeEl : openEl;

    if (targetOut) {
      gsap.to(targetOut, {
        x: isOpening ? -5 : 5,
        y: isOpening ? -10 : 10,
        rotation: isOpening ? -5 : 5,
        opacity: 0,
        delay: 0.25,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    if (targetIn) {
      gsap.to(targetIn, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        delay: 0.5,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const resetPreviewImage = () => {
    const wrap = menuPreviewImgRef.current;
    if (!wrap) return;
    wrap.innerHTML = "";
    const img = document.createElement("img");
    img.src = "/assets/img1.jpg";
    wrap.appendChild(img);
  };

  const openMenu = () => {
    if (isAnimatingRef.current || isOpenRef.current) return;
    isAnimatingRef.current = true;
    setIsOpen(true);

    gsap.to(containerRef.current, {
      rotation: 10,
      x: 300,
      y: 450,
      scale: 1.5,
      duration: 1.25,
      ease: "power4.inOut",
    });

    animateMenuToggle(true);

    gsap.to(menuContentRef.current, {
      rotation: 0,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 1.25,
      ease: "power4.inOut",
    });

    gsap.to([".link a", ".social a"], {
      y: "0%",
      opacity: 1,
      duration: 1,
      delay: 0.75,
      stagger: 0.1,
      ease: "power3.out",
    });

    gsap.to(menuOverlayRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
      duration: 1.25,
      ease: "power4.inOut",
      onComplete: () => {
        isOpenRef.current = true;
        isAnimatingRef.current = false;
      },
    });
  };

  const closeMenu = () => {
    if (isAnimatingRef.current || !isOpenRef.current) return;
    isAnimatingRef.current = true;

    gsap.to(containerRef.current, {
      rotation: 0,
      x: 0,
      y: 0,
      scale: 1,
      duration: 1.25,
      ease: "power4.inOut",
    });

    animateMenuToggle(false);

    gsap.to(menuContentRef.current, {
      rotation: -15,
      x: -100,
      y: -100,
      scale: 1.5,
      opacity: 0.25,
      duration: 1.25,
      ease: "power4.inOut",
    });

    gsap.to(menuOverlayRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.25,
      ease: "power4.inOut",
      onComplete: () => {
        isOpenRef.current = false;
        isAnimatingRef.current = false;
        setIsOpen(false);
        gsap.set([".link a", ".social a"], { y: "120%" });
        resetPreviewImage();
      },
    });
  };

  const onToggleClick = () => {
    if (!isOpenRef.current) openMenu();
    else closeMenu();
  };

  const onLinkClick = () => {
    if (isOpenRef.current) {
      closeMenu();
    }
  };

  const onLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isOpenRef.current || isAnimatingRef.current) return;
    const link = e.currentTarget;
    const imgSrc = link.getAttribute("data-img");
    if (!imgSrc) return;
    const wrap = menuPreviewImgRef.current;
    if (!wrap) return;

    const previewImages = wrap.querySelectorAll("img");
    if (
      previewImages.length > 0 &&
      previewImages[previewImages.length - 1].src.endsWith(imgSrc)
    )
      return;

    // Animate out existing images before adding new one
    if (previewImages.length > 0) {
      gsap.to(previewImages, {
        opacity: 0,
        scale: 0.8,
        rotation: -10,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          previewImages.forEach((img) => img.remove());
          addNewPreviewImage(imgSrc, wrap);
        },
      });
    } else {
      addNewPreviewImage(imgSrc, wrap);
    }
  };

  const addNewPreviewImage = (imgSrc: string, wrap: HTMLDivElement) => {
    const newPreviewImg = document.createElement("img");
    newPreviewImg.src = imgSrc;
    newPreviewImg.style.opacity = "0";
    newPreviewImg.style.transform = "scale(1.25) rotate(10deg)";
    newPreviewImg.className = "absolute will-change-transform";
    wrap.appendChild(newPreviewImg);

    gsap.to(newPreviewImg, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.75,
      ease: "power2.out",
    });
  };

  return (
    <div className="z-20">
      <nav
        className={cn(
          "fixed w-screen px-10 py-8 flex justify-between items-center z-20",
          isOpen
            ? "text-primary"
            : pathname === "/" || pathname === "/about"
              ? "text-primary"
              : "text-black",
        )}
      >
        <div className="">
          <Link className="text-lg md:text-2xl" to="/" onClick={onLinkClick}>
            [ {siteName} ]
          </Link>
        </div>

        <div className="flex justify-center items-center space-x-2 md:space-x-24">
          <p className="text-lg md:text-2xl">
            <span
              className={cn(
                isOpen
                  ? "text-primary/60"
                  : pathname === "/" || pathname === "/about"
                    ? "text-primary/60"
                    : "text-black/40",
              )}
            >
              {pathname === "/"
                ? "01"
                : String(
                    menuItems.findIndex((item) => item.href === pathname) + 2,
                  ).padStart(2, "0")}
            </span>{" "}
            {pathname === "/"
              ? "Work"
              : menuItems.find((item) => item.href === pathname)?.name ||
                "Work"}
          </p>
          <div
            className="relative w-12 h-6 cursor-pointer text-xl md:text-2xl flex justify-center items-center"
            ref={menuToggleRef}
            onClick={onToggleClick}
          >
            <p
              id="menu-open"
              className="absolute origin-top will-change-transform"
            >
              {isMobile ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                "Menu"
              )}
            </p>
            <p
              id="menu-close"
              className="absolute origin-top-left will-change-transform opacity-0 transform -translate-x-1.25 translate-y-2.5 rotate-5"
            >
              {isMobile ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                "Close"
              )}
            </p>
          </div>
        </div>
      </nav>

      <div
        className="fixed w-screen h-screen bg-black z-10"
        ref={menuOverlayRef}
      >
        <div
          className="relative w-full h-full flex justify-center items-center origin-bottom-left will-change-transform"
          ref={menuContentRef}
        >
          <div className="w-full p-10 flex gap-10">
            <div className="hidden md:flex-3 md:flex justify-center items-center">
              <div
                className="relative w-1/2 h-full overflow-hidden rounded-2xl"
                ref={menuPreviewImgRef}
              >
                <img
                  className="absolute will-change-transform w-full h-full"
                  src="/assets/img1.jpg"
                  alt=""
                />
              </div>
            </div>

            <div className="flex-2 py-10 flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                {menuItems.map((item, index) => (
                  <div key={index} className="pb-1.5">
                    <Link
                      to={item.href}
                      data-img={item.image}
                      onMouseEnter={onLinkHover}
                      className="group relative inline-block transition-colors duration-500 text-primary text-3xl md:text-6xl"
                      onClick={onLinkClick}
                    >
                      {item.name}
                      <span className="absolute left-0 top-[102.5%] h-0.5 w-full bg-primary origin-right scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.6,0,0.4,1)] group-hover:origin-left group-hover:scale-x-100" />
                    </Link>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                {socialItems.map((item, index) => (
                  <div key={index} className="pb-1.5">
                    <Link
                      className="text-primary/70 hover:text-primary transition-colors"
                      to={item.href}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
