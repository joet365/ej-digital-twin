#!/bin/bash

# Configuration
PROJECT_ID=$(gcloud config get-value project)
SERVICE_NAME="gemini-live-relay"
REGION="us-central1"

echo "Using Project ID: $PROJECT_ID"

# 1. Build and Submit to Google Container Registry
echo "Building container image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME .

# 2. Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=$GEMINI_API_KEY" \
  --set-env-vars="SUPABASE_URL=$SUPABASE_URL" \
  --set-env-vars="SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY" \
  --set-env-vars="GHL_CLIENT_ID=$GHL_CLIENT_ID" \
  --set-env-vars="GHL_CLIENT_SECRET=$GHL_CLIENT_SECRET" \
  --timeout=3600

echo "Deployment complete!"
