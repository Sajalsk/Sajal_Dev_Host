import { PropsWithChildren } from "react";
import { profile } from "../data/portfolio";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            {profile.openToWork && (
              <div className="open-to-work-badge">
                <span className="open-to-work-dot" />
                Open to work
              </div>
            )}
            <h2>Hello! I'm</h2>
            <h1>
              {profile.firstName}
              <br />
              <span>{profile.lastName}</span>
            </h1>
            {profile.openToWork && (
              <p className="open-to-work-sub">{profile.workPreferences}</p>
            )}
          </div>
          <div className="landing-info">
            <h3>A</h3>
            <h2 className="landing-info-h2">{profile.tagline}</h2>
            <h2 className="landing-role-title">{profile.title}</h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
