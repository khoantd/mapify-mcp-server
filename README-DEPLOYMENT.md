# 🚀 VPS Deployment Guide

This guide covers multiple ways to deploy the Mapify MCP Server on a VPS.

## 📋 Prerequisites

- **VPS with Ubuntu 20.04+ or Debian 11+**
- **Root or sudo access**
- **Mapify API Key** (get from [mapify.so](https://mapify.so))
- **Git** (for cloning repository)

## 🎯 Deployment Options

### Option 1: Automated Script Deployment (Recommended)

1. **SSH into your VPS:**
   ```bash
   ssh user@your-vps-ip
   ```

2. **Set your API key:**
   ```bash
   export MAPIFY_API_KEY="your_api_key_here"
   ```

3. **Download and run the deployment script:**
   ```bash
   curl -fsSL https://raw.githubusercontent.com/xmindltd/mapify-mcp-server/main/deploy.sh | bash
   ```

4. **Start the service:**
   ```bash
   sudo systemctl start mapify-mcp-server
   sudo systemctl status mapify-mcp-server
   ```

### Option 2: Docker Deployment

1. **Install Docker and Docker Compose:**
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   ```

2. **Clone the repository:**
   ```bash
   git clone https://github.com/xmindltd/mapify-mcp-server.git
   cd mapify-mcp-server
   ```

3. **Set environment variable:**
   ```bash
   export MAPIFY_API_KEY="your_api_key_here"
   ```

4. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

5. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

### Option 3: Manual PM2 Deployment

1. **Install Node.js and pnpm:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pnpm pm2
   ```

2. **Clone and setup:**
   ```bash
   git clone https://github.com/xmindltd/mapify-mcp-server.git
   cd mapify-mcp-server
   pnpm install
   pnpm run build
   ```

3. **Set environment variable:**
   ```bash
   export MAPIFY_API_KEY="your_api_key_here"
   ```

4. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

## 🔧 Configuration

### Environment Variables

- `MAPIFY_API_KEY`: Your Mapify API key (required)
- `NODE_ENV`: Set to `production` for production deployment

### MCP Client Configuration

For your MCP client (Claude Desktop, VS Code, etc.), use this configuration:

```json
{
  "mcpServers": {
    "mapify": {
      "command": "node",
      "args": ["/opt/mapify-mcp-server/build/index.js"],
      "env": {
        "MAPIFY_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## 📊 Monitoring & Logs

### Systemd Service
```bash
# Check status
sudo systemctl status mapify-mcp-server

# View logs
sudo journalctl -u mapify-mcp-server -f

# Restart service
sudo systemctl restart mapify-mcp-server
```

### PM2
```bash
# Check status
pm2 status

# View logs
pm2 logs mapify-mcp-server

# Restart
pm2 restart mapify-mcp-server
```

### Docker
```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f mapify-mcp-server

# Restart
docker-compose restart mapify-mcp-server
```

## 🔒 Security Considerations

1. **Firewall Setup:**
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 22
   sudo ufw enable
   ```

2. **API Key Security:**
   - Store API key in environment variables
   - Never commit API keys to version control
   - Use `.env` files for local development

3. **User Permissions:**
   - Run service as non-root user
   - Restrict file permissions appropriately

## 🚨 Troubleshooting

### Common Issues

1. **Service won't start:**
   ```bash
   sudo journalctl -u mapify-mcp-server -n 50
   ```

2. **API key issues:**
   - Verify API key is set correctly
   - Check API key permissions on Mapify platform

3. **Build failures:**
   ```bash
   pnpm install --force
   pnpm run build
   ```

4. **Permission issues:**
   ```bash
   sudo chown -R $USER:$USER /opt/mapify-mcp-server
   ```

### Health Check

Test if the server is working:
```bash
# For systemd
sudo systemctl is-active mapify-mcp-server

# For PM2
pm2 ping

# For Docker
docker-compose ps
```

## 📈 Scaling

### Multiple Instances (PM2)
```bash
pm2 scale mapify-mcp-server 3
```

### Load Balancer Setup
Consider using nginx as a reverse proxy if you need to scale horizontally.

## 🔄 Updates

### Automated Updates
```bash
cd /opt/mapify-mcp-server
git pull
pnpm install
pnpm run build
sudo systemctl restart mapify-mcp-server
```

### Docker Updates
```bash
docker-compose pull
docker-compose up -d
```

## 📞 Support

- **GitHub Issues**: [Report bugs](https://github.com/xmindltd/mapify-mcp-server/issues)
- **Mapify Platform**: [mapify.so](https://mapify.so)
- **MCP Documentation**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
