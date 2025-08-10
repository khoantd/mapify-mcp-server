#!/bin/bash

# Mapify MCP Server - Cloudflare Workers Deployment Script
set -e

echo "🚀 Deploying Mapify MCP Server to Cloudflare Workers..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if user is logged in
if ! wrangler whoami &> /dev/null; then
    echo "🔐 Please log in to Cloudflare..."
    wrangler login
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Check if MAPIFY_API_KEY secret exists
echo "🔑 Checking for MAPIFY_API_KEY secret..."
if ! wrangler secret list | grep -q "MAPIFY_API_KEY"; then
    echo "⚠️  MAPIFY_API_KEY secret not found."
    echo "Please set your Mapify API key as a secret:"
    echo "Run: wrangler secret put MAPIFY_API_KEY"
    echo "Then run this script again."
    exit 1
fi

# Build the worker
echo "🔨 Building worker..."
pnpm run build:worker

# Deploy to Cloudflare
echo "☁️  Deploying to Cloudflare Workers..."
pnpm run deploy:worker

echo "✅ Deployment successful!"
echo ""
echo "🌐 Your Mapify MCP Server is now live!"
echo "📋 Check your Cloudflare Workers dashboard for the URL"
echo "📖 See README-CLOUDFLARE.md for API usage examples"
echo ""
echo "🧪 Test your deployment:"
echo "curl https://your-worker.your-subdomain.workers.dev/health"
