export type CaseStudy = {
  problem: string;
  role: string;
  highlights: string[];
  impact: string[];
  accessNote: string;
};

export const projectCaseStudies: Record<string, CaseStudy> = {
  Petwell: {
    problem:
      "Pet wellness data arrived as CSV files on SFTP servers and needed to become personalized PDF health reports — automatically, reliably, and at scale.",
    role: "Backend developer — pipeline design, PDF generation, AWS integration",
    highlights: [
      "SFTP file monitoring with cron-based ingestion",
      "CSV/Excel parsing with validation and error handling",
      "Automated PDF report generation via PDFKit",
      "AWS Secrets Manager, CloudWatch, and CodePipeline",
    ],
    impact: [
      "End-to-end automation from upload to email dispatch",
      "Reduced manual intervention on malformed file handling",
    ],
    accessNote:
      "Internal client platform — no public URL. Contact me for a sanitized overview.",
  },
  Pythag: {
    problem:
      "A SaaS cell-monitoring platform needed real-time dashboards, high uptime, and fast frontend performance under concurrent users.",
    role: "Full-stack developer — UI, real-time data layer, performance tuning",
    highlights: [
      "Next.js + TypeScript + Shadcn component system",
      "Highcharts dashboards with WebSocket + REST integration",
      "Agile delivery with Jira across dev and QA teams",
      "Four-month performance and reliability refactor",
    ],
    impact: [
      "99.9% uptime with sub-100ms dashboard latency",
      "25% higher session engagement, 40% faster frontend",
      "60% lower API failure rates during peak traffic",
    ],
    accessNote:
      "Production SaaS — demo below uses simulated data, not live client feeds.",
  },
  Xcelight: {
    problem:
      "Enterprises needed to turn CCTV streams into actionable insights with emotion detection and real-time KPI monitoring.",
    role: "Full-stack developer — dashboards, API integration, data pipelines",
    highlights: [
      "AI-powered video analytics with emotion detection",
      "Next.js dashboards with Chart.js and WebSocket.io",
      "Enterprise API integrations for automated video processing",
      "Scalable ingestion for thousands of concurrent feeds",
    ],
    impact: [
      "50% reduction in dashboard latency",
      "60% less manual intervention in video workflows",
    ],
    accessNote:
      "Enterprise platform — case study only. Contact me for a sanitized overview.",
  },
};

export type FaqEntry = {
  id: string;
  keywords: string[];
  answer: string;
  followUps: string[];
};

export const faqEntries: FaqEntry[] = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "sup", "greetings"],
    answer:
      "Hey! 👋 Great to meet you. I'm here to tell you about Sajal — his stack, projects, and experience. What would you like to know?",
    followUps: [
      "What's your tech stack?",
      "Tell me about your projects",
      "Are you open to full-time roles?",
      "Who is Sajal?",
    ],
  },
  {
    id: "about",
    keywords: ["who", "about", "sajal", "introduce", "background"],
    answer:
      "I'm Sajal Khandelwal, a Full Stack Developer at Xcelore, Noida. I build MERN apps with React, Next.js, Node.js, and TypeScript — focused on performance, real-time dashboards, and AWS-backed deployments.",
    followUps: [
      "What's your tech stack?",
      "What did you build at Xcelore?",
      "Tell me about your education",
      "How can I contact you?",
    ],
  },
  {
    id: "stack",
    keywords: ["stack", "tech", "skills", "mern", "technologies", "know"],
    answer:
      "My stack: TypeScript, JavaScript, React.js, Next.js, Node.js, Express, MongoDB, PostgreSQL, WebSockets, Docker, AWS, Git, and Highcharts. See the Tech Stack section for the full breakdown from my resume.",
    followUps: [
      "Tell me about Pythag",
      "What did you build at Xcelore?",
      "Tell me about Petwell",
      "Are you open to full-time roles?",
    ],
  },
  {
    id: "experience",
    keywords: ["experience", "work", "job", "xcelore", "years"],
    answer:
      "I'm a Full Stack Developer at Xcelore since April 2024. I've improved load times by 35%, platform responsiveness by 30%, and cut deployment issues by 40% through CI/CD and AWS monitoring.",
    followUps: [
      "Tell me about your projects",
      "What's your tech stack?",
      "Are you open to full-time roles?",
      "How can I contact you?",
    ],
  },
  {
    id: "petwell",
    keywords: ["petwell", "pet", "wellness", "sftp", "pdf"],
    answer:
      "Petwell is a pet wellness automation platform I built with Node.js — SFTP CSV ingestion, validation, cron jobs, PDF health reports, and AWS-powered deployment pipelines.",
    followUps: [
      "Tell me about Pythag",
      "Tell me about Xcelight",
      "What's your tech stack?",
      "What did you build at Xcelore?",
    ],
  },
  {
    id: "pythag",
    keywords: ["pythag", "cell", "monitor", "saas", "dashboard", "highcharts"],
    answer:
      "Pythag is a Cell Monitor SaaS platform using Next.js, TypeScript, Shadcn, and Highcharts with WebSocket real-time data. Try the live demo inside the Pythag case study!",
    followUps: [
      "Tell me about Petwell",
      "Tell me about Xcelight",
      "What's your tech stack?",
      "How can I contact you?",
    ],
  },
  {
    id: "xcelight",
    keywords: ["xcelight", "video", "analytics", "ai", "cctv"],
    answer:
      "Xcelight is an AI-powered video analytics platform that turns CCTV footage into business insights with emotion detection and real-time KPI dashboards.",
    followUps: [
      "Tell me about Pythag",
      "Tell me about Petwell",
      "What did you build at Xcelore?",
      "What's your tech stack?",
    ],
  },
  {
    id: "projects",
    keywords: ["project", "projects", "portfolio", "built"],
    answer:
      "My main projects are Petwell (automation), Pythag (SaaS monitoring), and Xcelight (video analytics). Open any project card in the Work section for the full case study.",
    followUps: [
      "Tell me about Pythag",
      "Tell me about Petwell",
      "Tell me about Xcelight",
      "What's your tech stack?",
    ],
  },
  {
    id: "opportunities",
    keywords: ["open", "full-time", "fulltime", "opportunity", "opportunities", "looking", "available"],
    answer:
      "I'm open to full-time Full Stack Developer roles. HR and recruiters can share position details via the contact form — company, role, location, and joining timeline.",
    followUps: [
      "What's your notice period?",
      "Are you open to remote work?",
      "How can I contact you?",
      "What's your expected CTC?",
    ],
  },
  {
    id: "notice",
    keywords: ["notice", "joining", "start", "timeline", "when", "availability"],
    answer:
      "My notice period and joining timeline depend on the current project handover. Share the role details via the contact form and I'll confirm availability within 24 hours.",
    followUps: [
      "Are you open to full-time roles?",
      "Are you open to remote work?",
      "How can I contact you?",
      "What's your expected CTC?",
    ],
  },
  {
    id: "remote",
    keywords: ["remote", "hybrid", "wfh", "work from home", "onsite", "on-site", "office"],
    answer:
      "I'm based in Noida and open to hybrid or on-site roles in the NCR region. Fully remote opportunities are welcome too — happy to discuss timezone overlap and collaboration setup.",
    followUps: [
      "Are you open to relocation?",
      "Are you open to full-time roles?",
      "What's your notice period?",
      "How can I contact you?",
    ],
  },
  {
    id: "salary",
    keywords: ["salary", "ctc", "compensation", "pay", "package", "lpa", "expected"],
    answer:
      "Compensation depends on role scope, tech stack, and location. I'm happy to discuss CTC range directly — share the job details via the contact form or book a quick call from the Contact section.",
    followUps: [
      "Are you open to full-time roles?",
      "What's your notice period?",
      "Are you open to remote work?",
      "How can I contact you?",
    ],
  },
  {
    id: "location",
    keywords: ["location", "relocate", "relocation", "noida", "india", "based", "where"],
    answer:
      "I'm based in Noida, India. Open to roles in NCR (Noida, Gurgaon, Delhi) and willing to relocate for the right full-time opportunity.",
    followUps: [
      "Are you open to remote work?",
      "Are you open to full-time roles?",
      "What's your notice period?",
      "How can I contact you?",
    ],
  },
  {
    id: "contact",
    keywords: ["contact", "email", "job", "recruiter", "hr", "reach", "phone", "linkedin", "hire", "number"],
    answer:
      "Reach me at sajalsk247@gmail.com or +91 9936616471. HR and recruiters can use the form in Contact to share full-time role details. Also on GitHub (Sajalsk) and LinkedIn.",
    followUps: [
      "Book a 15-min call",
      "Are you open to full-time roles?",
      "What's your notice period?",
      "Where can I find your resume?",
    ],
  },
  {
    id: "schedule",
    keywords: ["call", "meet", "schedule", "book", "calendly", "cal", "interview"],
    answer:
      "Recruiters can book a 15-minute intro call from the Contact section — or email me at sajalsk247@gmail.com to coordinate a time.",
    followUps: [
      "Are you open to full-time roles?",
      "What's your expected CTC?",
      "What's your tech stack?",
      "What's your notice period?",
    ],
  },
  {
    id: "education",
    keywords: ["education", "degree", "college", "kiet", "cgpa"],
    answer:
      "B.Tech in Computer Science from KIET Group of Institutions, Ghaziabad (Nov 2020 – Jul 2024), CGPA 7.8.",
    followUps: [
      "What did you build at Xcelore?",
      "What's your tech stack?",
      "Tell me about your projects",
      "Are you open to full-time roles?",
    ],
  },
  {
    id: "resume",
    keywords: ["resume", "cv", "download"],
    answer:
      "Click the RESUME link in the top navbar to view my resume.",
    followUps: [
      "What's your tech stack?",
      "Are you open to full-time roles?",
      "How can I contact you?",
      "What did you build at Xcelore?",
    ],
  },
];

export const defaultSuggestions = [
  "What's your tech stack?",
  "Tell me about Pythag",
  "Are you open to full-time roles?",
  "What did you build at Xcelore?",
];

const fallbackAnswer =
  "I can answer questions about my stack, projects (Petwell, Pythag, Xcelight), and experience. HR recruiters can use the contact form for full-time opportunities.";

export function findFaqMatch(query: string): FaqEntry | null {
  const words = query.toLowerCase().split(/\s+/);
  let best: { score: number; entry: FaqEntry | null } = { score: 0, entry: null };

  for (const entry of faqEntries) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (query.toLowerCase().includes(kw)) score += 3;
      for (const w of words) {
        if (kw.includes(w) && w.length > 2) score += 1;
      }
    }
    if (score > best.score) best = { score, entry };
  }

  return best.score > 0 ? best.entry : null;
}

export function findAnswer(query: string): string {
  return findFaqMatch(query)?.answer ?? fallbackAnswer;
}

function normalizeQuestion(text: string) {
  return text.toLowerCase().replace(/[?!.]/g, "").trim();
}

function isAlreadyAsked(suggestion: string, history: string[]) {
  const norm = normalizeQuestion(suggestion);
  return history.some((q) => {
    const asked = normalizeQuestion(q);
    return asked === norm || asked.includes(norm) || norm.includes(asked);
  });
}

export function getDynamicSuggestions(
  lastUserMessage: string,
  history: string[]
): string[] {
  const match = findFaqMatch(lastUserMessage);
  const pools = [
    ...(match?.followUps ?? []),
    ...defaultSuggestions,
    ...faqEntries.flatMap((e) => e.followUps),
  ];

  const unique: string[] = [];
  for (const item of pools) {
    if (!unique.includes(item) && !isAlreadyAsked(item, history)) {
      unique.push(item);
    }
    if (unique.length >= 4) break;
  }

  return unique.length > 0 ? unique : defaultSuggestions;
}
