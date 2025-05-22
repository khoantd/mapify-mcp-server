# Mapify MCP Server

Mapify's official MCP (Mind Map Creation Protocol) Server for generating mind maps from text prompts, YouTube links, and web links. Supports multiple languages and returns both image and edit URLs for generated mind maps.

---

## Table of Contents
- [Features](#features)
- [Configuration](#configuration)
- [Development](#development)
- [License](#license)

---

## Features
- Generate mind maps from text, YouTube, or web links
- Multi-language support
- Returns both image URL and edit URL for generated mind maps

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/)
- [A valid Mapify API token](https://mapify.so/app/all)

### Clone the repository
```bash
git clone https://github.com/xmindltd/mapify-mcp-server.git
```

### Configuration

To connect the MCP server, configure your client as follows (replace `<YOUR_API_KEY>` with your actual Mapify API key):

```json
{
  "mcpServers": {
    "mapify": {
      "command": "node",
      "args": ["/<absolute-path-to>/mapify-mcp-server/build/index.js"],
      "env": {
        "MAPIFY_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

---

## Development

1. **Clone the repository and install dependencies:**
    ```bash
    git clone https://github.com/xmindltd/mapify-mcp-server.git
    cd mapify-mcp-server
    pnpm install
    ```
2. **Build the project:**
    ```bash
    pnpm build
    ```
3. **Start the server:**
    ```bash
    pnpm start
    ```

---

## License

// TODO