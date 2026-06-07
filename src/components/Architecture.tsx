import {
  architectureFlow,
  architecturePhases,
  mermaidDiagram,
} from "../data/architecture";
import "./styles/Architecture.css";

const Architecture = () => {
  return (
    <div className="architecture-section section-container" id="architecture">
      <div className="architecture-container">
        <h2>
          System <span>architecture</span>
        </h2>
        <p className="architecture-intro">
          This portfolio runs on an AWS serverless backend — built to learn
          production patterns with Docker, Redis, and event-driven design.
        </p>

        <div className="architecture-diagram">
          <div className="arch-layer">
            <span className="arch-label">Client</span>
            <div className="arch-box accent">React + Vite</div>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer row">
            <div className="arch-col">
              <span className="arch-label">CDN</span>
              <div className="arch-box">CloudFront</div>
              <div className="arch-box small">S3 Frontend</div>
            </div>
            <div className="arch-col">
              <span className="arch-label">API</span>
              <div className="arch-box">API Gateway</div>
              <div className="arch-box small">Lambda</div>
            </div>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer row">
            <div className="arch-box">DynamoDB</div>
            <div className="arch-box">SQS</div>
            <div className="arch-box">SES</div>
            <div className="arch-box">CloudWatch</div>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer row dev">
            <div className="arch-box">Docker</div>
            <div className="arch-box">Redis</div>
            <div className="arch-box">DynamoDB Local</div>
          </div>
        </div>

        <div className="architecture-phases">
          {architecturePhases.map((phase) => (
            <div className={`arch-phase ${phase.status}`} key={phase.phase}>
              <h4>{phase.phase}</h4>
              <ul>
                {phase.services.map((svc) => (
                  <li key={svc.name}>
                    <strong>{svc.name}</strong> — {svc.role}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="architecture-flow">
          <h4>Request flow</h4>
          <ol>
            {architectureFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <details className="architecture-mermaid">
          <summary>Mermaid diagram (for docs / README)</summary>
          <pre>{mermaidDiagram}</pre>
        </details>
      </div>
    </div>
  );
};

export default Architecture;
