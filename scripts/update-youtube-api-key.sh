#!/bin/bash

# Script to update youtube-api-key in Google Secrets Manager
# 
# Usage:
#   ./scripts/update-youtube-api-key.sh YOUR_API_KEY
# 
# Or set as environment variable:
#   export YOUTUBE_API_KEY="your-key-here"
#   ./scripts/update-youtube-api-key.sh

PROJECT_ID="regal-scholar-453620-r7"
SECRET_NAME="youtube-api-key"

# Get API key from command line argument or environment variable
if [ -n "$1" ]; then
  API_KEY="$1"
elif [ -n "$YOUTUBE_API_KEY" ]; then
  API_KEY="$YOUTUBE_API_KEY"
else
  echo "❌ Error: API key required"
  echo ""
  echo "Usage:"
  echo "  $0 YOUR_API_KEY"
  echo ""
  echo "Or set environment variable:"
  echo "  export YOUTUBE_API_KEY=\"your-key-here\""
  echo "  $0"
  exit 1
fi

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

