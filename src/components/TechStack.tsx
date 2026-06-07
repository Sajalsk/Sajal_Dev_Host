import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { techStackCategories } from "../data/portfolio";
import "./styles/TechStack.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TechStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".skill-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".skill-bar-fill").forEach((bar) => {
        const width = bar.dataset.width ?? "0";
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${width}%`,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bar,
              start: "top 90%",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <div className="techstack section-container" id="techstack" ref={sectionRef}>
      <h2>
        My <span>Tech Stack</span>
      </h2>
      <div className="techstack-grid">
        {techStackCategories.map((category) => (
          <div
            className="skill-card"
            key={category.title}
            style={{ "--card-accent": category.color } as React.CSSProperties}
          >
            <h3>{category.title}</h3>
            <ul className="skill-list">
              {category.skills.map((skill) => (
                <li key={skill}>
                  <div className="skill-row">
                    <span>{skill}</span>
                  </div>
                  <div className="skill-bar-track">
                    <div className="skill-bar-fill" data-width="100" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="techstack-glow" aria-hidden="true" />
    </div>
  );
};

export default TechStack;
