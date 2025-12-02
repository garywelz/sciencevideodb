#!/bin/bash

# Script to restore a previous version of youtube-api-key secret

PROJECT_ID="regal-scholar-453620-r7"
SECRET_NAME="youtube-api-key"
VERSION=${1:-1}

if [ -z "$1" ]; then
  echo "Usage: $0 <VERSION_NUMBER>"
  echo ""
  echo "Available versions:"
  gcloud secrets versions list "$SECRET_NAME" --project="$PROJECT_ID" --format="table(name,state,createTime)" --limit=5
  echo ""
  echo "Example: $0 1"
  exit 1
fi

echo "Restoring youtube-api-key to version $VERSION..."
echo ""

# Get the value from the old version
OLD_VALUE=$(gcloud secrets versions access "$VERSION" --secret="$SECRET_NAME" --project="$PROJECT_ID" 2>/dev/null)

if [ $? -ne 0 ] || [ -z "$OLD_VALUE" ]; then
  echo "❌ Could not access version $VERSION"
  exit 1
fi

echo "Value from version $VERSION (first 30 chars): ${OLD_VALUE:0:30}..."
echo ""
read -p "Do you want to create a new version with this value? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -n "$OLD_VALUE" | gcloud secrets versions add "$SECRET_NAME" \
    --project="$PROJECT_ID" \
    --data-file=-
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully restored version $VERSION as the latest!"
  else
    echo ""
    echo "❌ Failed to restore version"
    exit 1
  fi
else
  echo "Cancelled."
fi

