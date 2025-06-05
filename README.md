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
			"args": ["/path/to/build/directory", "/intex.js"],
			"env": {
				"CODEGPT_API_KEY": "your-api-key",
				"CODEGPT_GRAPH_ID": "your-graph-id"
				"CODEGPT_ORG_ID": "optional",
			}
		}
	}
}
```

## Available Tools

[agregar las tools from graphs.ts]



## Error Handling

The server handles various error scenarios:

- Missing API key validation
- HTTP communication errors
- Invalid agent IDs or messages
- Request timeout handling

## Development (revisar)

### Project Structure

```
├── src/
│   └── index.ts      # Main server implementation
├── build/            # Compiled JavaScript files
├── .env             # Environment configuration
└── tsconfig.json    # TypeScript configuration
```


## Support

For support and feedback:

- Email: support@codegpt.co
- Website: [app.codegpt.co](https://app.codegpt.co)

## License

[License information here]
