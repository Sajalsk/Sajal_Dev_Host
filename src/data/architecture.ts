export const architecturePhases = [
  {
    phase: "Phase 1 — Live (AWS Free Tier)",
    status: "active",
    services: [
      { name: "S3", role: "Static frontend + asset storage" },
      { name: "CloudFront", role: "Global CDN + HTTPS" },
      { name: "API Gateway", role: "REST API edge" },
      { name: "Lambda", role: "Contact API, email worker, analytics" },
      { name: "DynamoDB", role: "Submissions, analytics, rate limits" },
      { name: "SQS", role: "Async email processing queue" },
      { name: "SES", role: "Recruiter notification emails" },
      { name: "CloudWatch", role: "Logs, traces, observability" },
      { name: "IAM", role: "Least-privilege service roles" },
    ],
  },
  {
    phase: "Phase 2 — Local dev (Docker)",
    status: "active",
    services: [
      { name: "Docker Compose", role: "Local full-stack environment" },
      { name: "Redis", role: "IP rate limiting cache" },
      { name: "DynamoDB Local", role: "Local NoSQL parity with AWS" },
      { name: "Express API", role: "Mirrors Lambda routes for dev" },
    ],
  },
  {
    phase: "Phase 3 — Planned",
    status: "planned",
    services: [
      { name: "ElastiCache Redis", role: "Production rate-limit cache" },
      { name: "ECS Fargate", role: "Containerized services if needed" },
      { name: "Route 53", role: "Custom domain DNS" },
      { name: "ACM", role: "TLS certificates" },
      { name: "WAF", role: "Edge protection" },
    ],
  },
];

export const architectureFlow = [
  "Recruiter submits form on CloudFront-hosted React app",
  "API Gateway routes POST /contact to Contact Lambda",
  "Lambda validates input, checks DynamoDB rate limit, stores submission",
  "Job is pushed to SQS for reliable async processing",
  "Email Worker Lambda reads SQS → sends SES notification",
  "Analytics events flow to a separate Lambda + DynamoDB table",
  "CloudWatch captures logs and X-Ray traces across the pipeline",
];

export const mermaidDiagram = `flowchart TB
  subgraph Client
    UI[React Portfolio]
  end

  subgraph CDN
    CF[CloudFront]
    S3[(S3 Frontend Bucket)]
  end

  subgraph API
    AG[API Gateway]
    L1[Contact Lambda]
    L2[Analytics Lambda]
  end

  subgraph Data
    DDB[(DynamoDB)]
    SQS[SQS Queue]
    L3[Email Worker Lambda]
    SES[SES]
  end

  subgraph Dev["Local Dev (Docker)"]
    REDIS[(Redis)]
    DDBLOCAL[(DynamoDB Local)]
    EXPRESS[Express API]
  end

  UI --> CF --> S3
  UI --> AG
  AG --> L1 --> DDB
  L1 --> SQS --> L3 --> SES
  AG --> L2 --> DDB
  EXPRESS --> REDIS
  EXPRESS --> DDBLOCAL`;
