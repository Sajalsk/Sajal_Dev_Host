import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { profile } from "../data/portfolio";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  useEffect(() => {
    const links = document.querySelectorAll(".header ul a[data-href]");

    const onNavClick = (e: Event) => {
      if (window.innerWidth <= 1024) return;

      const element = e.currentTarget as HTMLAnchorElement;
      const section = element.getAttribute("data-href");
      if (!section) return;

      e.preventDefault();
      document.querySelector(section)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    links.forEach((link) => link.addEventListener("click", onNavClick));

    const onResize = () => ScrollTrigger.refresh(true);
    window.addEventListener("resize", onResize);

    return () => {
      links.forEach((link) => link.removeEventListener("click", onNavClick));
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          SK
        </a>
        <a
          href={`mailto:${profile.email}`}
          className="navbar-connect"
          data-cursor="disable"
        >
          {profile.email}
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#blog" href="#blog">
              <HoverLinks text="BLOG" />
            </a>
          </li>
          <li>
            <a data-href="#architecture" href="#architecture">
              <HoverLinks text="ARCH" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
          <li>
            <a
              href={profile.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="navbar-resume"
            >
              <HoverLinks text="RESUME" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
