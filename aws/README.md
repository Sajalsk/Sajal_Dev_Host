# Portfolio AWS Backend

Serverless backend for the portfolio — designed for **AWS free tier learning**.

## Architecture

```
React (S3 + CloudFront)
        │
        ▼
   API Gateway
    │         │
    ▼         ▼
Contact λ   Analytics λ
    │              │
    ▼              ▼
DynamoDB      DynamoDB
    │
    ▼
   SQS ──► Email Worker λ ──► SES
```

### AWS services used

| Service | Purpose | Free tier |
|---------|---------|-----------|
| S3 | Frontend + assets hosting | 5 GB (12 mo) |
| CloudFront | CDN + HTTPS | 1 TB transfer (12 mo) |
| API Gateway | REST API | 1M calls (12 mo) |
| Lambda | 3 functions | 1M requests/mo |
| DynamoDB | 3 tables (on-demand) | 25 GB storage |
| SQS | Email queue + DLQ | 1M requests/mo |
| SES | Recruiter emails | 3,000/mo (12 mo) |
| CloudWatch | Logs + X-Ray | 5 GB logs |
| IAM | Least-privilege roles | Free |

### Local dev (Docker)

Mirrors the same API routes with **Redis** (rate limits) + **DynamoDB Local** + **Express**.

## Prerequisites

1. [AWS CLI](https://aws.amazon.com/cli/) configured (`aws configure`)
2. [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
3. [Docker](https://www.docker.com/) (for local stack)
4. Node.js 20+

## Step 1 — Local learning stack

```bash
# From repo root
npm run docker:up

# API available at http://localhost:4000
# Health: GET http://localhost:4000/health
```

Create `.env` in repo root:

```env
VITE_API_URL=http://localhost:4000
```

```bash
npm run dev
```

Submit the recruiter form — check Docker logs for the SES mock email.

## Step 2 — Verify SES (required before deploy)

SES starts in **sandbox mode**. In AWS Console → SES (region: `ap-south-1` recommended):

1. Verify `sajalsk247@gmail.com` as an identity
2. (Later) Request production access to email any recruiter address

## Step 3 — Deploy backend

```bash
cd aws
sam build
sam deploy --guided
```

Suggested answers:
- **Stack name**: `sajal-portfolio`
- **Region**: `ap-south-1`
- **OwnerEmail / FromEmail**: your verified SES email
- **AllowedOrigin**: `http://localhost:5173` for dev, then your CloudFront URL

Copy the **ApiUrl** from outputs.

## Step 4 — Deploy frontend

```bash
# From repo root — set production API URL
echo "VITE_API_URL=https://YOUR_API_ID.execute-api.ap-south-1.amazonaws.com/prod" >> .env

npm run build
npm run aws:deploy-frontend
```

Or manually:

```bash
aws s3 sync dist/ s3://YOUR_FRONTEND_BUCKET --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Step 5 — Update CORS

After CloudFront is live, redeploy SAM with:

```
AllowedOrigin=https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/contact` | Recruiter form → DynamoDB + SQS → SES |
| POST | `/analytics/event` | Track page/contact events |
| GET | `/analytics/stats` | Public stats metadata |
| GET | `/health` | Local Docker only |

## Learning path (Phase 3)

- [ ] Add **ElastiCache Redis** for production rate limiting (replace DynamoDB rate table)
- [ ] Add **ECS Fargate** + Docker image for heavier workloads
- [ ] Add **Route 53** + **ACM** for custom domain
- [ ] Add **AWS WAF** on CloudFront
- [ ] Add **EventBridge** for scheduled analytics reports

## Troubleshooting

**SES email not arriving**
- Check SES sandbox — recipient must be verified until production access is granted
- Check Email Worker Lambda logs in CloudWatch
- Check SQS DLQ for failed messages

**CORS errors**
- `AllowedOrigin` must match your frontend URL exactly (no trailing slash)

**Rate limit (429)**
- 5 submissions per IP per hour (DynamoDB in AWS, Redis locally)
