import "./styles/ProjectCover.css";

type ProjectCoverProps = {
  index: number;
  category: string;
  accent: string;
  gradient: string;
  image?: string;
};

const ProjectCover = ({
  index,
  category,
  accent,
  gradient,
  image,
}: ProjectCoverProps) => {
  return (
    <div
      className="project-cover"
      style={{
        background: gradient,
        ["--project-accent" as string]: accent,
      }}
    >
      {image && (
        <img
          className="project-cover-image"
          src={image}
          alt={`${category} preview`}
          loading="lazy"
        />
      )}
      <div className="project-cover-grid" />
      <div className="project-cover-content">
        <span className="project-cover-index">0{index + 1}</span>
        <span className="project-cover-tag">{category}</span>
      </div>
    </div>
  );
};

export default ProjectCover;
