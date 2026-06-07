import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
// import Blog from "./Blog";
// import Architecture from "./Architecture";
import PortfolioAssistant from "./interactive/PortfolioAssistant";
import { usePageAnalytics } from "../hooks/useAnalytics";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  usePageAnalytics();

  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;

    const resizeHandler = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsDesktopView(window.innerWidth > 1024);
        if (document.querySelector(".main-active")) {
          setSplitText();
        }
      }, 300);
    };

    window.addEventListener("resize", resizeHandler);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (!document.querySelector(".main-active")) return;
    setSplitText();
  }, [isDesktopView]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      <PortfolioAssistant />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {/* <Blog /> */}
            {/* <Architecture /> */}
            <Suspense fallback={null}>
              <TechStack />
            </Suspense>
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
