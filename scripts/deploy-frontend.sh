#!/usr/bin/env bash
set -euo pipefail

STACK_NAME="${STACK_NAME:-sajal-portfolio}"
REGION="${AWS_REGION:-ap-south-1}"

echo "Fetching stack outputs for ${STACK_NAME}..."
BUCKET=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" \
  --output text)

DIST=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendDistributionDomain'].OutputValue" \
  --output text)

if [[ -z "$BUCKET" || "$BUCKET" == "None" ]]; then
  echo "FrontendBucketName not found. Deploy the SAM stack first."
  exit 1
fi

echo "Building frontend..."
npm run build

echo "Syncing dist/ to s3://${BUCKET}..."
aws s3 sync dist/ "s3://${BUCKET}" --delete --region "$REGION"

DIST_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?DomainName=='${DIST}'].Id | [0]" \
  --output text)

if [[ -n "$DIST_ID" && "$DIST_ID" != "None" ]]; then
  echo "Invalidating CloudFront cache (${DIST_ID})..."
  aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*"
fi

echo "Done. Site: https://${DIST}"
