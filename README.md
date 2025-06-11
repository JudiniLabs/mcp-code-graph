# CodeGPT- Deep Graph Codebase MCP Server
A [Model Context Protocol](https://modelcontextprotocol.io/quickstart/server) server that enables seamless interaction with Code Graphs by CodeGPT

<img width="1090" alt="Screenshot 2025-06-11 at 13 58 37" src="https://github.com/user-attachments/assets/5794fc46-632c-4cf2-bdc0-d71b100039b0" />

## How this works
This MCP allows you to interact with the knowledge graphs available in your CodeGPT account.

<img width="1373" alt="Screenshot 2025-06-11 at 14 01 15" src="https://github.com/user-attachments/assets/a588bafc-d5a8-4955-8d48-3addaf3ed71c" />

You’ll be able to use these advanced graph-based queries across different MCP Hosts such as ChatGPT, Cursor, Windsurf, GitHub Copilot, Claude Desktop, and others. 

## Available Tools

`list_graphs`: List all available repository graphs that you have access to. Returns basic information about each graph including the graph ID, repository name with branch, and description. Use this tool when you need to discover available graphs or when CODEGPT_GRAPH_ID is not set in the environment.

`get_code`: Get the complete code implementation of a specific functionality (class, function, method, etc.) from the repository graph. This is the primary tool for code retrieval and should be prioritized over other tools. The repository is represented as a graph where each node contains code, documentation, and relationships to other nodes. Use this when you need to examine the actual implementation of any code entity.

`find_direct_connections`: Explore the immediate relationships of a functionality within the code graph. This reveals first-level connections including: parent functionalities that reference this node, child functionalities that this node directly calls or uses, declaration/definition relationships, and usage patterns. Essential for understanding code dependencies and architecture. The repository is represented as a connected graph where each node (function, class, file, etc.) has relationships with other nodes.

`nodes_semantic_search`: Search for code functionalities across the repository graph using semantic similarity based on natural language queries. This tool finds relevant functions, classes, methods, and other code entities that match the conceptual meaning of your query, even if they don't contain the exact keywords. Perfect for discovering related functionality, finding similar implementations, or exploring unfamiliar codebases. The search operates on the semantic understanding of code purpose and behavior.

`docs_semantic_search`: Search through repository documentation using semantic similarity to find relevant information, guides, API documentation, README content, and explanatory materials. This tool specifically targets documentation files (markdown, rst, etc.) rather than code, making it ideal for understanding project setup, architecture decisions, usage instructions, and conceptual explanations. Use this when you need context about how the repository works rather than examining the actual code implementation.

`get_usage_dependency_links`: Generate a comprehensive adjacency list showing all functionalities that would be affected by changes to a specific code entity. This performs deep dependency analysis through the code graph to identify the complete impact radius of modifications. Essential for impact analysis, refactoring planning, and understanding code coupling. The result shows which functionalities depend on the target entity either directly or through a chain of dependencies, formatted as 'file_path::functionality_name' pairs.

## Prerequisites

Before using the CodeGPT MCP Server, ensure you have:

1. A CodeGPT account (sign up at [app.codegpt.co](https://app.codegpt.co))
2. Uploaded a repository to [Code Graph](https://help.codegpt.co/en/articles/9912447-code-graphs)
3. An API key from [CodeGPT API Keys page](https://app.codegpt.co/user/api-keys)
4. Your Organization ID (optional)

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

### Cursor
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

## Claude Desktop
Add the following configuration to the `claude_desktop_config.json` file in your Claude Desktop installation directory:
```json
   {
      "mcpServers": {
         "Code Graph MCP Server": {
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

### CodeGPT Extension
```json
   {
      "mcpServers": {
         "Code Graph MCP Server": {
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

### Visual Studio Code
Add the folloging configuration to your mcp.json file in the .vscode folder:
```json
   {
      "servers": {
         "Code Graph MCP Server": {
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
