#!/bin/bash

# Script to check and restore previous versions of youtube-api-key secret

PROJECT_ID="regal-scholar-453620-r7"
SECRET_NAME="youtube-api-key"

echo "Checking versions of youtube-api-key secret..."
echo ""

# List all versions (shows the latest first)
gcloud secrets versions list "$SECRET_NAME" \
  --project="$PROJECT_ID" \
  --format="table(name,state,createTime)" \
  --limit=5

echo ""
echo "Latest version value (first 30 chars only for security):"
LATEST_VALUE=$(gcloud secrets versions access latest --secret="$SECRET_NAME" --project="$PROJECT_ID" 2>/dev/null)
if [ $? -eq 0 ]; then
  echo "${LATEST_VALUE:0:30}..."
else
  echo "Could not access latest version"
fi

echo ""
echo "To view a specific version, use:"
echo "  gcloud secrets versions access <VERSION_NUMBER> --secret=$SECRET_NAME --project=$PROJECT_ID"
echo ""
echo "To set a specific version as the latest, use:"
echo "  gcloud secrets versions enable <VERSION_NUMBER> --secret=$SECRET_NAME --project=$PROJECT_ID"

