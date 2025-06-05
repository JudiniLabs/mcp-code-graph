# CodeGPT MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io/quickstart/server) server that enables seamless interaction with CodeGPT agents and Code Graphs. This server provides a standardized interface for communicating with CodeGPT's AI agents, making it easy to integrate CodeGPT's capabilities into your applications.

## Features

- **Agent Management**: List and interact with all your CodeGPT agents
- **Environment Configuration**: Flexible setup through environment variables

## Prerequisites

Before using the CodeGPT MCP Server, ensure you have:

1. A CodeGPT account (sign up at [app.codegpt.co](https://app.codegpt.co))
2. A CodeGPT [Code Graph Agent](https://help.codegpt.co/en/articles/9912447-graphs-repositories)
3. An API key from [CodeGPT API Keys page](https://app.codegpt.co/user/api-keys)
4. Your Organization ID (recommended)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the project:
   ```bash
   pnpm build
   ```

## Configuration

Set up your environment variables:

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Configure the required environment variables:
   ```
   CODEGPT_API_KEY=your-api-key
   CODEGPT_ORG_ID=your-org-id  # Optional but recommended
   ```

## Integration with MCP Client

Add the following configuration to your MCP client:

```json
{
	"mcpServers": {
		"CodeGPT": {
			"command": "node",
			"args": ["/path/to/build/directory", "/index.js"],
			"env": {
				"CODEGPT_API_KEY": "your-api-key",
				"CODEGPT_ORG_ID": "optional"
			}
		}
	}
}
```

### Graphs

```json
{
	"mcpServers": {
		"CodeGPT": {
			"command": "node",
			"args": ["/path/to/build/directory", "/graph.js"],
			"env": {
				"CODEGPT_API_KEY": "your-api-key",
				"CODEGPT_ORG_ID": "optional",
            "CODEGPT_GRAPH_ID": "your-graph-id"
			}
		}
	}
}
```

## Available Tools

### 1. list-agents

Lists all available CodeGPT agents associated with your account.

### 2. ask-to-an-agent

Sends a message to a specific CodeGPT agent and receives a response.

## Testing

1. Copy the HTTP test file template:

   ```bash
   cp .http.example .http
   ```

2. Update the test file with your credentials:

   - API key
   - Organization ID
   - Agent ID

3. Use REST Client in VS Code or any HTTP client to test the endpoints

## Error Handling

The server handles various error scenarios:

- Missing API key validation
- HTTP communication errors
- Invalid agent IDs or messages
- Request timeout handling

## Development

### Project Structure

```
├── src/
│   └── index.ts      # Main server implementation
├── build/            # Compiled JavaScript files
├── .env             # Environment configuration
└── tsconfig.json    # TypeScript configuration
```

### Building

```bash
pnpm build
```

### TypeScript Configuration

The project uses TypeScript with the following key configurations:

- Target: ES2022
- Module: Node16
- Strict type checking enabled

## Support

For support and feedback:

- Email: support@codegpt.co
- Website: [app.codegpt.co](https://app.codegpt.co)

## License

[License information here]
