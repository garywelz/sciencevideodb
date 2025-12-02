#!/bin/bash

# Script to update youtube-api-key in Google Secrets Manager
# Uses the GOOGLE_API_KEY from apilist.md

PROJECT_ID="regal-scholar-453620-r7"
SECRET_NAME="youtube-api-key"

# The API key from apilist.md line 36
API_KEY="AIzaSyD4Zg7--Dx_zFOLkPnol-cQ--ORSFI4NZs"

echo "Updating YouTube API key in Secrets Manager..."
echo "Project: $PROJECT_ID"
echo "Secret: $SECRET_NAME"
echo ""

# Update the secret
echo -n "$API_KEY" | gcloud secrets versions add "$SECRET_NAME" \
  --project="$PROJECT_ID" \
  --data-file=-

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully updated youtube-api-key secret!"
  echo ""
  echo "You can now run the tests:"
  echo "  npm run test:youtube"
else
  echo ""
  echo "❌ Failed to update secret. Check your gcloud authentication."
  exit 1
fi

