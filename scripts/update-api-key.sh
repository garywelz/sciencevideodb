#!/bin/bash

# Script to update youtube-api-key in Secrets Manager
# Usage: ./scripts/update-api-key.sh YOUR_API_KEY_HERE

PROJECT_ID="regal-scholar-453620-r7"
SECRET_NAME="youtube-api-key"

if [ -z "$1" ]; then
  echo "Usage: $0 <API_KEY>"
  echo ""
  echo "Example:"
  echo "  $0 AIzaSyExample123..."
  exit 1
fi

API_KEY="$1"

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

