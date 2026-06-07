import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { profile } from "../../data/portfolio";
import {
  isApiConfigured,
  submitContact,
  trackAnalyticsEvent,
} from "../../lib/api";
import "./styles/RecruiterForm.css";

type RecruiterFormProps = {
  open: boolean;
  onClose: () => void;
};

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as
  | string
  | undefined;

const RecruiterForm = ({ open, onClose }: RecruiterFormProps) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    trackAnalyticsEvent("contact_open");
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const openMailtoFallback = () => {
    const subject = encodeURIComponent(
      `Job Opportunity — ${role} at ${company}`
    );
    const body = encodeURIComponent(
      `Hi Sajal,

I'm reaching out regarding a full-time opportunity.

Recruiter / HR: ${name}
Company: ${company}
Role: ${role}
Location: ${location || "Not specified"}
Expected joining / notice: ${availability || "To be discussed"}

Additional details:
${message}

---
Sent via portfolio contact form`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const submitViaWeb3Forms = async () => {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Job Opportunity — ${role} at ${company}`,
        from_name: name,
        name,
        company,
        role,
        location: location || "Not specified",
        availability: availability || "To be discussed",
        message,
        replyto: profile.email,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Submission failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      name,
      company,
      role,
      location,
      availability,
      message,
    };

    try {
      if (isApiConfigured()) {
        await submitContact(payload);
      } else if (WEB3FORMS_KEY) {
        await submitViaWeb3Forms();
      } else {
        openMailtoFallback();
      }

      setSent(true);
      setName("");
      setCompany("");
      setRole("");
      setLocation("");
      setAvailability("");
      setMessage("");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not send right now. Try again or email me directly.";
      setError(`${message} (${profile.email})`);
    } finally {
      setSubmitting(false);
    }
  };

  const backendLabel = isApiConfigured()
    ? "AWS API"
    : WEB3FORMS_KEY
      ? "Web3Forms"
      : "email fallback";

  return (
    <div className="recruiter-modal-overlay" onClick={onClose} data-cursor="disable">
      <div
        className="recruiter-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recruiter-modal-title"
      >
        <button
          className="recruiter-modal-close"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <MdClose />
        </button>

        <h4 id="recruiter-modal-title">For Recruiters & HR</h4>
        <p className="recruiter-form-sub">
          Open to full-time roles. Share position details and I'll get back to
          you. Backend: <strong>{backendLabel}</strong>.
          {!isApiConfigured() && !WEB3FORMS_KEY && (
            <>
              {" "}
              Form opens your email app — hit <strong>Send</strong> to deliver.
            </>
          )}
        </p>

        <form className="recruiter-form" onSubmit={handleSubmit}>
          <div className="recruiter-form-row">
            <input
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              placeholder="Company *"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <input
            placeholder="Job title / Role *"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          <div className="recruiter-form-row">
            <input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              placeholder="Joining timeline / notice period"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            />
          </div>
          <textarea
            placeholder="Role details, team, compensation range, interview process..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Discuss opportunity"}
          </button>
          {sent && (
            <p className="recruiter-form-sent">
              Thanks — your message was received. I'll reply soon.
            </p>
          )}
          {error && <p className="recruiter-form-error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default RecruiterForm;
