#!/bin/bash

# Script to test M2M authentication and endpoints
# Usage: ./scripts/test-m2m.sh

echo "M2M Endpoint Testing Script"
echo "==========================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create .env file with your Auth0 credentials"
    exit 1
fi

# Load environment variables
source .env

# Prompt for M2M credentials if not in .env
if [ -z "$AUTH0_M2M_CLIENT_ID" ]; then
    read -p "Enter AUTH0 M2M Client ID: " AUTH0_M2M_CLIENT_ID
fi

if [ -z "$AUTH0_M2M_CLIENT_SECRET" ]; then
    read -p "Enter AUTH0 M2M Client Secret: " AUTH0_M2M_CLIENT_SECRET
fi

echo "1. Getting M2M access token..."
echo ""

# Get access token
TOKEN_RESPONSE=$(curl -s --request POST \
  --url https://${AUTH0_M2M_DOMAIN}/oauth/token \
  --header 'content-type: application/json' \
  --data "{
    \"client_id\":\"${AUTH0_M2M_CLIENT_ID}\",
    \"client_secret\":\"${AUTH0_M2M_CLIENT_SECRET}\",
    \"audience\":\"${AUTH0_M2M_AUDIENCE}\",
    \"grant_type\":\"client_credentials\"
  }")

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "Error: Could not get access token"
    echo "Response: $TOKEN_RESPONSE"
    exit 1
fi

echo "✓ Access token obtained"
echo ""

# Determine base URL
BASE_URL="${APP_URL:-http://localhost:3000}"

# Test new-round endpoint
echo "2. Testing POST /new-round..."
NEW_ROUND_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${BASE_URL}/new-round" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
echo "$NEW_ROUND_RESPONSE"
echo ""

# Wait a moment
sleep 1

# Test close endpoint
echo "3. Testing POST /close..."
CLOSE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${BASE_URL}/close" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
echo "$CLOSE_RESPONSE"
echo ""

# Wait a moment
sleep 1

# Test store-results endpoint
echo "4. Testing POST /store-results..."
RESULTS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${BASE_URL}/store-results" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"numbers": [5, 12, 23, 34, 39, 45]}')
echo "$RESULTS_RESPONSE"
echo ""

echo "==========================="
echo "Testing complete!"
echo ""
echo "Expected responses:"
echo "- new-round: HTTP_STATUS:204"
echo "- close: HTTP_STATUS:204"
echo "- store-results: HTTP_STATUS:204 (if round is closed and no results yet)"
echo "                 HTTP_STATUS:400 (if round is active or results already stored)"
