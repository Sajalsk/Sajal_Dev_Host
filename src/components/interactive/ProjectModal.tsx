import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { projectCaseStudies } from "../../data/interactive";
import { projects } from "../../data/portfolio";
import PythagDemo from "./PythagDemo";
import "./styles/ProjectModal.css";

type ProjectModalProps = {
  projectTitle: string | null;
  onClose: () => void;
};

const ProjectModal = ({ projectTitle, onClose }: ProjectModalProps) => {
  const [showDemo, setShowDemo] = useState(false);
  const project = projects.find((p) => p.title === projectTitle);
  const caseStudy = projectTitle ? projectCaseStudies[projectTitle] : null;

  useEffect(() => {
    if (!projectTitle) return;
    setShowDemo(false);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [projectTitle, onClose]);

  if (!project || !caseStudy) return null;

  const isPythag = project.title === "Pythag";

  return (
    <div className="project-modal-overlay" onClick={onClose} data-cursor="disable">
      <div
        className="project-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ ["--modal-accent" as string]: project.accent }}
      >
        <button className="project-modal-close" onClick={onClose} aria-label="Close">
          <MdClose />
        </button>

        <div className="project-modal-header">
          <span className="project-modal-tag">{project.category}</span>
          <h2>{project.title}</h2>
          <p className="project-modal-period">{project.period}</p>
          {project.image && (
            <div className="project-modal-shot">
              <img src={project.image} alt={`${project.title} preview`} />
            </div>
          )}
        </div>

        <div className="project-modal-body">
          <section>
            <h4>Problem</h4>
            <p>{caseStudy.problem}</p>
          </section>
          <section>
            <h4>My role</h4>
            <p>{caseStudy.role}</p>
          </section>
          <section>
            <h4>What I built</h4>
            <ul>
              {caseStudy.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
          <section>
            <h4>Impact</h4>
            <ul>
              {caseStudy.impact.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </section>
          <section>
            <h4>Stack</h4>
            <p>{project.tools}</p>
          </section>
          <p className="project-modal-access">{caseStudy.accessNote}</p>

          {isPythag && (
            <div className="project-modal-actions">
              <button
                className="project-modal-btn"
                onClick={() => setShowDemo((v) => !v)}
              >
                {showDemo ? "Hide demo" : "Try live demo"}
              </button>
            </div>
          )}

          {isPythag && showDemo && <PythagDemo />}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
