import { useState } from "react";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import RecruiterForm from "./interactive/RecruiterForm";
import { profile } from "../data/portfolio";
import "./styles/Contact.css";

const Contact = () => {
  const [recruiterOpen, setRecruiterOpen] = useState(false);

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${profile.email}`} data-cursor="disable">
                {profile.email}
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href={profile.phoneHref} data-cursor="disable">
                {profile.phone}
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href={profile.leetcode}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LeetCode <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>{profile.name}</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>

        <div className="recruiter-trigger-wrap">
          <h4>For Recruiters & HR</h4>
          <p>Open to full-time Full Stack Developer roles.</p>
          <div className="recruiter-actions">
            <button
              className="recruiter-open-btn"
              onClick={() => setRecruiterOpen(true)}
              data-cursor="disable"
              type="button"
            >
              Share job details →
            </button>
            {profile.calLink && (
              <a
                href={profile.calLink}
                target="_blank"
                rel="noopener noreferrer"
                className="recruiter-cal-btn"
                data-cursor="disable"
              >
                Book a 15-min call →
              </a>
            )}
          </div>
        </div>

        <RecruiterForm
          open={recruiterOpen}
          onClose={() => setRecruiterOpen(false)}
        />
      </div>
    </div>
  );
};

export default Contact;
