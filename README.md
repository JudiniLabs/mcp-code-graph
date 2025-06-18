# CodeGPT- Code Graph MCP Server
A [Model Context Protocol](https://modelcontextprotocol.io/quickstart/server) server that enables seamless interaction with Code Graphs by CodeGPT

<img width="1094" alt="Screenshot 2025-06-11 at 14 17 47" src="https://github.com/user-attachments/assets/26b5223c-bfac-41c6-9796-f11e039f640d" />

## How this works
This MCP allows you to interact with the knowledge graphs available in your CodeGPT account.

<img width="1373" alt="Screenshot 2025-06-11 at 14 01 15" src="https://github.com/user-attachments/assets/a588bafc-d5a8-4955-8d48-3addaf3ed71c" />

You’ll be able to use these advanced graph-based queries across different MCP Hosts such as ChatGPT, Cursor, Windsurf, GitHub Copilot, Claude Desktop, and others. 

## Available Tools

`list_graphs`: Lists available repository graphs with basic information.

`get_code`: Retrieves the complete source code for a specific functionality from the graph.

`find_direct_connections`: Explores the direct relationships of a functionality within the code graph.

`nodes_semantic_search`: Semantically searches for code functionalities using natural language.

`docs_semantic_search`: Semantically searches repository documentation.

`get_usage_dependency_links`: Analyzes and lists functionalities affected by changes to a code entity.

## Prerequisites

Before using the CodeGPT MCP Server, ensure you have:

1. A CodeGPT account (sign up at [app.codegpt.co](https://app.codegpt.co))
2. Uploaded a repository to [Code Graph](https://help.codegpt.co/en/articles/9912447-code-graphs)
3. An API key from [CodeGPT API Keys page](https://app.codegpt.co/user/api-keys)
4. Your Organization ID (optional)

## Installation

## Using npx
1. Add the following to your MCP client configuration:
```json
{
   "mcpServers": {
      "Deep Graph MCP - CodeGPT": {
         "command": "npx",
         "args": ["-y", "mcp-code-graph@latest"],
         "env": {
            "CODEGPT_API_KEY": "your-api-key",
            "CODEGPT_GRAPH_ID": "your-graph-id", // optional
            "CODEGPT_ORG_ID": "your-org-id" // optional
         }
      }
   }
}
```

## Or clone and run the Server (STDIO mode)
This is the recommended way to run the server locally. (stdio mode is the default mode for MCP servers)

1. Clone the repository:
```bash
git clone https://github.com/JudiniLabs/mcp-code-graph.git
cd mcp-code-graph
```
1. Install dependencies:
```bash
pnpm install
```
1. Build the project:
```bash
pnpm build
```

Set up your environment variables, or you could add them to your MCP client configuration.

### Environment Variables in .env file

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure the required environment variables:
```
CODEGPT_API_KEY=your-api-key
CODEGPT_ORG_ID=your-org-id  # Optional
CODEGPT_GRAPH_ID=your-graph-id  # Optional
```

## Integration with MCP Client

Add the following configuration to your MCP client (Cursor, Claude Desktop, Windsurf, etc.)

```json
{
   "mcpServers": {
      "Code Graph MCP Server": {
         "command": "node",
         "args": ["/path/to/build/directory", "/index.js"]
      }
   }
}
```

## Error Handling

The server handles various error scenarios:

- Missing API key validation
- HTTP communication errors
- Request timeout handling

### Project Structure

```
├── src/
│   └── index.ts      # Main server implementation
├── build/            # Compiled JavaScript files
├── .env             # Environment configuration(not included in version control)
├── .gitignore       # Git ignore rules
└── package.json    # Project metadata and dependencies
```

## Support

For support and feedback:

- Email: support@codegpt.co
- Website: [app.codegpt.co](https://app.codegpt.co)

## License

[MIT License](https://opensource.org/licenses/MIT)
