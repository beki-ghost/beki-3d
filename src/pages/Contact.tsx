import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { contactSections, email } from "@/lib/constants/data";

export const Contact = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-secondary text-secondary-foreground flex flex-col pt-16 ">
      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1">
        {/* Left Side */}
        <div className="flex-1 flex flex-col justify-between p-16">
          <h1 className="text-[8rem] leading-none font-bold tracking-tight">
            Addis Ababa,
            <br />
            Ethiopia
          </h1>
          <div className="space-y-2">
            <p className="text-lg italic">(Local Time)</p>
            <div className="text-[8rem] font-semibold text-gray-600">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 p-16 flex flex-col  md:pr-28">
          <a href={`mailto:${email}`}>
            <div className="flex items-center justify-between mb-8 cursor-pointer hover:translate-x-5 transition-transform duration-300 ease-in-out">
              <h2 className="text-7xl italic">(Say hello)</h2>
              <ArrowRight className="w-8 h-8" />
            </div>
          </a>
          <hr className="py-8" />

          <div className="space-y-12 flex-1">
            {contactSections.map((section) => (
              <div key={section.id} className="flex justify-between">
                <div>
                  <span className="text-gray-600 text-2xl">{section.id}</span>
                  <h3 className="text-3xl font-medium">{section.title}</h3>
                </div>
                <div className="text-right">
                  {section.items.map((item, index) =>
                    item.isLink ? (
                      <a
                        key={index}
                        href={item.href}
                        className="block text-xl underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <p key={index} className="text-xl">
                        {item.text}
                      </p>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Footer */}
      <div className="hidden lg:flex justify-between items-center px-10 py-5 pt-0">
        <p className="text-lg text-gray-600">A Multi-Disciplinary Designer</p>
        <div className="flex space-x-4">
          <a
            href="https://github.com/rouge9"
            className="underline text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Developed By
          </a>
          <span>|</span>
          <a
            href="mailto:robelged1992@gmail.com"
            className="underline text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Designed By
          </a>
        </div>
        <div className="text-lg text-gray-600">
          Elevating Spaces, Defining Aesthetics, Cultivating Brands
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden p-6 flex flex-col  pr-28">
        <a href={`mailto:${email}`}>
          <div className="flex items-center justify-between mb-2 cursor-pointer hover:translate-x-5 transition-transform duration-300 ease-in-out">
            <h2 className="text-2xl italic">(Say hello)</h2>
            <ArrowRight className="w-6 h-6" />
          </div>
        </a>
        <hr className="py-2" />

        <div className="space-y-4 flex-1">
          {contactSections.map((section) => (
            <div key={section.id}>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-gray-600">{section.id}</span>
                <h3 className="text-lg font-medium">{section.title}</h3>
              </div>
              <div className="space-y-2">
                {section.items.map((item, index) =>
                  item.isLink ? (
                    <a
                      key={index}
                      href={item.href}
                      className="block underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <p key={index}>{item.text}</p>
                  )
                )}
              </div>
            </div>
          ))}

          <div className="">
            <h1 className="text-4xl leading-tight font-light">
              Düsseldorf,
              <br />
              Germany
            </h1>
            <p className="text-sm italic mt-4">(Local Time)</p>
            <div className="text-2xl font-light text-gray-600 mt-2">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-4">
          <p className="text-sm text-gray-600">
            A Multi-Disciplinary Design Studio
          </p>
          <div className="flex space-x-2 text-sm">
            <a href="#" className="underline">
              Developed by
            </a>
            <span>|</span>
            <a href="#" className="underline">
              Designed By
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
