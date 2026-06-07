import { useState } from "react";
import "./styles/Work.css";
import ProjectCover from "./ProjectCover";
import ProjectModal from "./interactive/ProjectModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects } from "../data/portfolio";

gsap.registerPlugin(useGSAP);

const Work = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  useGSAP(() => {
    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <>
      <div className="work-section" id="work">
        <div className="work-container section-container">
          <h2>
            My <span>Work</span>
          </h2>
          <div className="work-flex">
            {projects.map((project, index) => (
              <div className="work-box" key={project.title}>
                <div className="work-info">
                  <div className="work-title">
                    <h3>0{index + 1}</h3>

                    <div>
                      <h4>{project.title}</h4>
                      <p>{project.category}</p>
                    </div>
                  </div>
                  <h4>{project.period}</h4>
                  <p>{project.description}</p>
                  <p>{project.tools}</p>
                  <button
                    className="work-case-btn"
                    onClick={() => setActiveProject(project.title)}
                    data-cursor="disable"
                  >
                    View case study →
                  </button>
                </div>
                <button
                  className="work-cover-btn"
                  onClick={() => setActiveProject(project.title)}
                  aria-label={`Open ${project.title} case study`}
                  data-cursor="disable"
                >
                  <ProjectCover
                    index={index}
                    category={project.category}
                    accent={project.accent}
                    gradient={project.gradient}
                    // image={project.image}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProjectModal
        projectTitle={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
};

export default Work;
