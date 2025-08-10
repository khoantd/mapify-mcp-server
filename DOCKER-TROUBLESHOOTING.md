# 🐳 Docker Troubleshooting Guide

## Common Docker Runtime Issues

### Issue 1: MCP Server Not Responding

**Symptoms:**
- Container starts but doesn't respond to MCP client
- No error messages in logs
- Container appears healthy but unresponsive

**Solutions:**

1. **Use the runtime-optimized Dockerfile:**
   ```bash
   # Use Dockerfile.runtime instead of Dockerfile
   docker build -f Dockerfile.runtime -t mapify-mcp-server .
   ```

2. **Enable stdio properly:**
   ```bash
   docker run -it --rm \
     -e MAPIFY_API_KEY="your_api_key" \
     -e NODE_ENV=production \
     mapify-mcp-server
   ```

3. **Check stdio handling:**
   ```bash
   # Test stdio communication
   echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | docker run -i mapify-mcp-server
   ```

### Issue 2: Platform Compatibility

**Symptoms:**
- Build fails on ARM64 systems
- Runtime errors on different architectures

**Solutions:**

1. **Force AMD64 platform:**
   ```bash
   docker build --platform linux/amd64 -t mapify-mcp-server .
   ```

2. **Use multi-platform build:**
   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 -t mapify-mcp-server .
   ```

### Issue 3: Memory Issues

**Symptoms:**
- Container crashes with OOM errors
- Build process fails

**Solutions:**

1. **Increase memory limits:**
   ```bash
   docker run --memory=512m mapify-mcp-server
   ```

2. **Use Node.js memory optimization:**
   ```bash
   # Already set in Dockerfile.runtime
   ENV NODE_OPTIONS="--max-old-space-size=512"
   ```

### Issue 4: Signal Handling

**Symptoms:**
- Container doesn't stop gracefully
- Zombie processes

**Solutions:**

1. **Use tini init system:**
   ```bash
   # Already included in Dockerfile.runtime
   ENTRYPOINT ["/sbin/tini", "--"]
   ```

2. **Proper signal handling:**
   ```bash
   docker run --init mapify-mcp-server
   ```

## Debugging Commands

### Check Container Status
```bash
docker ps -a
docker logs mapify-mcp-server
docker exec -it mapify-mcp-server sh
```

### Test MCP Communication
```bash
# Test basic stdio
echo '{"jsonrpc":"2.0","id":1,"method":"initialize"}' | docker run -i mapify-mcp-server

# Test tool invocation
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"generate_mindmap","arguments":{"prompt":"test","mode":"prompt","language":"en"}}}' | docker run -i -e MAPIFY_API_KEY="your_key" mapify-mcp-server
```

### Monitor Resource Usage
```bash
docker stats mapify-mcp-server
docker exec mapify-mcp-server ps aux
```

## Alternative Deployment Methods

### Method 1: Direct Node.js Execution
```bash
# Build locally
pnpm install
pnpm run build

# Run directly
MAPIFY_API_KEY="your_key" node ./build/index.js
```

### Method 2: PM2 in Container
```bash
# Use PM2 for process management
docker run -d \
  -e MAPIFY_API_KEY="your_key" \
  -v $(pwd):/app \
  node:18-alpine \
  sh -c "cd /app && npm install -g pm2 && pm2 start ecosystem.config.js && pm2 logs"
```

### Method 3: Systemd Service
```bash
# Create systemd service file
sudo tee /etc/systemd/system/mapify-mcp-server.service <<EOF
[Unit]
Description=Mapify MCP Server
After=docker.service

[Service]
Type=simple
ExecStart=/usr/bin/docker run --rm --name mapify-mcp-server -e MAPIFY_API_KEY=%i mapify-mcp-server
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Start service
sudo systemctl enable mapify-mcp-server
sudo systemctl start mapify-mcp-server
```

## Environment Variables

### Required
- `MAPIFY_API_KEY`: Your Mapify API key

### Optional
- `NODE_ENV`: Set to `production`
- `NODE_OPTIONS`: Memory and performance tuning
- `DEBUG`: Enable debug logging

## Health Checks

### Basic Health Check
```bash
# Check if container is running
docker ps | grep mapify-mcp-server

# Check logs for errors
docker logs mapify-mcp-server --tail 50

# Test API connectivity
curl -H "Authorization: Bearer $MAPIFY_API_KEY" https://mapify.so/api/v1/preview-mind-maps
```

### MCP Protocol Health Check
```bash
# Test MCP initialization
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{"tools":{},"resources":{}},"clientInfo":{"name":"test","version":"1.0.0"}}}' | docker run -i mapify-mcp-server
```

## Performance Optimization

### Memory Optimization
```bash
# Set Node.js memory limits
docker run -e NODE_OPTIONS="--max-old-space-size=256" mapify-mcp-server
```

### CPU Optimization
```bash
# Limit CPU usage
docker run --cpus=0.5 mapify-mcp-server
```

### Network Optimization
```bash
# Use host networking for better performance
docker run --network host mapify-mcp-server
```

## Logging and Monitoring

### Enable Debug Logging
```bash
docker run -e DEBUG="*" mapify-mcp-server
```

### Structured Logging
```bash
docker run -e NODE_ENV=production -e LOG_LEVEL=info mapify-mcp-server
```

### Log Rotation
```bash
# Use logrotate for container logs
sudo tee /etc/logrotate.d/docker-mapify <<EOF
/var/lib/docker/containers/*/mapify-mcp-server-*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF
```
