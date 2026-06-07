#!/usr/bin/env bash
# Host portfolio on AWS free tier — S3 + CloudFront only (no backend)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STACK_NAME="${STACK_NAME:-sajal-portfolio-hosting}"
REGION="${AWS_REGION:-ap-south-1}"
PROJECT_NAME="${PROJECT_NAME:-sajal-portfolio}"

cd "$ROOT"

echo "==> Checking AWS credentials..."
if ! aws sts get-caller-identity --region "$REGION" >/dev/null 2>&1; then
  echo "ERROR: AWS CLI not configured or invalid keys."
  echo "Run: aws configure"
  echo "  Region: ap-south-1"
  exit 1
fi

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
echo "    Account: $ACCOUNT | Region: $REGION"

echo "==> Deploying hosting stack (S3 + CloudFront)..."
aws cloudformation deploy \
  --template-file aws/hosting.yaml \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --parameter-overrides "ProjectName=${PROJECT_NAME}" \
  --no-fail-on-empty-changeset

BUCKET=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" \
  --output text)

DIST_ID=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" \
  --output text)

WEBSITE=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteUrl'].OutputValue" \
  --output text)

echo "==> Building frontend..."
npm run build

echo "==> Uploading to s3://${BUCKET}..."
aws s3 sync dist/ "s3://${BUCKET}" --delete --region "$REGION"

echo "==> Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*" \
  --query "Invalidation.Id" \
  --output text

echo ""
echo "============================================"
echo "  Portfolio is live (may take 2–5 min):"
echo "  ${WEBSITE}"
echo "============================================"
echo ""
echo "To redeploy after changes: npm run host:aws"
