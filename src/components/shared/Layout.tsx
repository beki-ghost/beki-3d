import React, { useState } from "react";
import { SlidingNavBar } from "./SlidingNavBar";
import PageTransition from "./PageTransition";
import Loader from "../loader/Loader";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setShowContent(false);
  };
  return (
    <div className="min-h-screen">
      <SlidingNavBar />
      {showLoader && <Loader handleLoaderComplete={handleLoaderComplete} />}
      <PageTransition showContent={showContent}>
        <main className="">{children}</main>
      </PageTransition>
    </div>
  );
};

export default Layout;
