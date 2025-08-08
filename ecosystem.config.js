module.exports = {
  apps: [
    {
      name: 'mapify-mcp-server',
      script: './build/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        MAPIFY_API_KEY: process.env.MAPIFY_API_KEY
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
