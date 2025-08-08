#!/bin/bash

# Mapify MCP Server VPS Deployment Script
# This script sets up the Mapify MCP Server on a VPS

set -e

echo "🚀 Starting Mapify MCP Server deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
echo "📦 Installing pnpm..."
sudo npm install -g pnpm

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "📁 Setting up application directory..."
sudo mkdir -p /opt/mapify-mcp-server
sudo chown $USER:$USER /opt/mapify-mcp-server
cd /opt/mapify-mcp-server

# Clone the repository (if not already present)
if [ ! -d ".git" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/xmindltd/mapify-mcp-server.git .
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the application
echo "🔨 Building application..."
pnpm run build

# Create logs directory
mkdir -p logs

# Set up environment variables
echo "🔧 Setting up environment variables..."
if [ -z "$MAPIFY_API_KEY" ]; then
    echo "⚠️  Warning: MAPIFY_API_KEY environment variable is not set!"
    echo "Please set it before starting the server:"
    echo "export MAPIFY_API_KEY='your_api_key_here'"
fi

# Create systemd service file
echo "🔧 Creating systemd service..."
sudo tee /etc/systemd/system/mapify-mcp-server.service > /dev/null <<EOF
[Unit]
Description=Mapify MCP Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/opt/mapify-mcp-server
Environment=NODE_ENV=production
Environment=MAPIFY_API_KEY=$MAPIFY_API_KEY
ExecStart=/usr/bin/node /opt/mapify-mcp-server/build/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service
echo "🔧 Enabling systemd service..."
sudo systemctl daemon-reload
sudo systemctl enable mapify-mcp-server

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set your MAPIFY_API_KEY: export MAPIFY_API_KEY='your_api_key_here'"
echo "2. Start the service: sudo systemctl start mapify-mcp-server"
echo "3. Check status: sudo systemctl status mapify-mcp-server"
echo "4. View logs: sudo journalctl -u mapify-mcp-server -f"
echo ""
echo "🔗 For MCP client configuration, use:"
echo "Command: node"
echo "Args: /opt/mapify-mcp-server/build/index.js"
echo "Environment: MAPIFY_API_KEY=your_api_key_here"
