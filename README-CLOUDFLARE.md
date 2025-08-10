# Cloudflare Workers Deployment Guide

This guide explains how to deploy the Mapify MCP Server to Cloudflare Workers as an HTTP API.

## Overview

The Cloudflare Workers deployment transforms the original MCP server (which uses stdio transport) into an HTTP-based API that can be accessed from any web application, mobile app, or other HTTP client.

## 🚀 Quick Deployment

### Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Node.js**: Version 16 or higher
3. **Mapify API Key**: Get one from [mapify.so](https://mapify.so/app#show-settings)

### Step 1: Install Dependencies

```bash
# Install dependencies
pnpm install

# Install Wrangler CLI globally (optional)
npm install -g wrangler
```

### Step 2: Configure Wrangler

```bash
# Login to Cloudflare
wrangler login

# Create a KV namespace (optional, for future caching)
wrangler kv:namespace create "mapify-cache"
wrangler kv:namespace create "mapify-cache" --preview
```

Update the `wrangler.toml` file with your KV namespace IDs if you created them.

### Step 3: Set Environment Variables

Set your Mapify API key as a secret:

```bash
wrangler secret put MAPIFY_API_KEY
# Enter your API key when prompted
```

### Step 4: Build and Deploy

```bash
# Build the worker
pnpm run build:worker

# Deploy to Cloudflare
pnpm run deploy:worker
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MAPIFY_API_KEY` | Yes | Your Mapify API token from mapify.so |

### Custom Domain (Optional)

To use a custom domain:

1. Add your domain to Cloudflare
2. In the Workers dashboard, go to your worker
3. Click "Custom Domains" and add your domain
4. Configure DNS as instructed

## 📡 API Endpoints

Once deployed, your worker will provide these endpoints:

### Health Check
```
GET https://your-worker.your-subdomain.workers.dev/
GET https://your-worker.your-subdomain.workers.dev/health
```

### Generate Mind Map
```
POST https://your-worker.your-subdomain.workers.dev/generate
```

**Request Body:**
```json
{
  "prompt": "Machine Learning fundamentals",
  "mode": "prompt",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mind map generated successfully",
  "data": {
    "imageUrl": "https://mapify.so/...",
    "editUrl": "https://mapify.so/...",
    "prompt": "Machine Learning fundamentals",
    "mode": "prompt",
    "language": "en"
  }
}
```

### API Documentation
```
GET https://your-worker.your-subdomain.workers.dev/docs
```

## 🔧 Parameters

### Mode Options
- `prompt`: Generate from text input
- `ai-search`: Search the web and generate mind map
- `youtube`: Generate from YouTube video URL
- `website`: Generate from website URL

### Supported Languages
`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `ja`, `zh-CN`, `zh-TW`, `ko`, and many more.

## 💡 Usage Examples

### Text Prompt
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Artificial Intelligence concepts",
    "mode": "prompt",
    "language": "en"
  }'
```

### AI Search
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "climate change solutions 2025",
    "mode": "ai-search",
    "language": "en"
  }'
```

### YouTube Video
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "https://youtube.com/watch?v=example",
    "mode": "youtube",
    "language": "en"
  }'
```

### Website Content
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "https://example.com/article",
    "mode": "website",
    "language": "en"
  }'
```

## 🛠️ Development

### Local Development

```bash
# Start local development server
pnpm run dev:worker

# Your worker will be available at http://localhost:8787
```

### Testing

Test your deployment:

```bash
# Health check
curl https://your-worker.your-subdomain.workers.dev/health

# Generate a test mind map
curl -X POST https://your-worker.your-subdomain.workers.dev/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello World", "mode": "prompt"}'
```

## 📊 Monitoring and Logs

1. **Cloudflare Dashboard**: View analytics, logs, and metrics
2. **Real-time Logs**: Use `wrangler tail` to see live logs
3. **Analytics**: Monitor requests, errors, and performance

```bash
# View real-time logs
wrangler tail
```

## ⚡ Performance and Limits

### Cloudflare Workers Limits
- **CPU Time**: 100ms per request (can be extended with paid plans)
- **Memory**: 128MB
- **Request Size**: 100MB
- **Response Size**: 100MB

### Optimization Tips
- The worker is optimized for fast startup and low memory usage
- Responses include CORS headers for web application compatibility
- Error handling provides detailed feedback for debugging

## 🔒 Security

- API key is stored as a Cloudflare secret (encrypted)
- CORS headers allow cross-origin requests
- All requests are logged for monitoring
- Rate limiting can be added using Cloudflare features

## 🆘 Troubleshooting

### Common Issues

1. **API Key Not Set**
   ```
   Error: MAPIFY_API_KEY environment variable is required
   ```
   Solution: Set the secret using `wrangler secret put MAPIFY_API_KEY`

2. **Build Errors**
   ```
   Error: Cannot resolve module
   ```
   Solution: Run `pnpm install` and ensure all dependencies are installed

3. **Deployment Fails**
   ```
   Error: Not logged in
   ```
   Solution: Run `wrangler login` first

### Getting Help

- Check the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)
- View logs with `wrangler tail`
- Check the Cloudflare dashboard for error details

## 🔄 Updates

To update your deployment:

```bash
# Pull latest changes
git pull

# Install any new dependencies
pnpm install

# Build and deploy
pnpm run build:worker
pnpm run deploy:worker
```

## 📱 Integration Examples

### JavaScript/React
```javascript
const generateMindMap = async (prompt, mode = 'prompt') => {
  const response = await fetch('https://your-worker.your-subdomain.workers.dev/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, mode, language: 'en' })
  });
  return response.json();
};
```

### Python
```python
import requests

def generate_mind_map(prompt, mode='prompt'):
    response = requests.post(
        'https://your-worker.your-subdomain.workers.dev/generate',
        json={'prompt': prompt, 'mode': mode, 'language': 'en'}
    )
    return response.json()
```

### cURL
```bash
#!/bin/bash
WORKER_URL="https://your-worker.your-subdomain.workers.dev"

generate_mindmap() {
  curl -X POST "$WORKER_URL/generate" \
    -H "Content-Type: application/json" \
    -d "{\"prompt\": \"$1\", \"mode\": \"${2:-prompt}\", \"language\": \"en\"}"
}

# Usage: generate_mindmap "Your topic here" "prompt"
```

---

## 🎉 You're Ready!

Your Mapify MCP Server is now deployed on Cloudflare Workers and accessible via HTTP API. You can integrate it into any application that can make HTTP requests!

For the original MCP server documentation, see [README.md](./README.md).
