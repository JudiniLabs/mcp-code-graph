# Deep Graph MCP Server by [CodeGPT](https://codegpt.co/)
A [Model Context Protocol](https://modelcontextprotocol.io/quickstart/server) server that enables seamless interaction with Code Graphs.

<img width="1373" alt="Screenshot 2025-06-11 at 14 01 15" src="https://github.com/user-attachments/assets/a588bafc-d5a8-4955-8d48-3addaf3ed71c" />

## How this works

This MCP allows you to interact with the knowledge graphs available in your CodeGPT account.

You’ll be able to use these advanced graph-based queries across different MCP Hosts such as ChatGPT, Cursor, Windsurf, CodeGPT Extension, GitHub Copilot, Claude Desktop, and others.

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
3. Get your API Key from [CodeGPT API Keys page](https://app.codegpt.co/user/api-keys) (required).
4. Get your Organization ID (optional) and Graph ID (optional).

# Installation

## Using npx
Add the following configuration to your MCP client (CodeGPT Extension, Cursor, Copilot, Claude Desktop, Windsurf, etc.):

```json
{
   "mcpServers": {
      "Deep Graph MCP": {
         "command": "npx",
         "args": ["-y" , "mcp-code-graph@latest", 
         "CODEGPT_API_KEY", // Required
         "CODEGPT_ORG_ID", // Optional
         "CODEGPT_GRAPH_ID" // Optional
        ]
      }
   }
}
```

## Adding to Claude Code

Follow these steps to integrate Deep Graph MCP Server with Claude Code.

## Quick Setup

```bash
claude mcp add "Deep Graph MCP" npx -- -y mcp-code-graph@latest CODEGPT_API_KEY
```

**For team sharing**, add the `-s project` flag:

```bash
claude mcp add -s project "Deep Graph MCP" npx -- -y mcp-code-graph@latest CODEGPT_API_KEY
```

## Verification

```bash
# Verify installation
claude mcp list

# Get server details
claude mcp get "Deep Graph MCP"
```

## Advanced Workflows with Claude Code Custom Commands

Claude Code supports custom slash commands that combine multiple MCP Code Graph tools for comprehensive analysis workflows.

### Setup

**Copy the commands directory** from this repository to your project root:
```bash
cp -r .claude/ /path/to/your/project/
```

Commit to your project's git:
```bash
git add .claude/commands/
git commit -m "Add custom Claude Code commands for Deep Graph MCP"
```

## Available Commands
Repository-wide analysis commands (no parameters needed):

```bash
/project:analyze-architecture          # Complete architectural overview
/project:security-audit               # Comprehensive security analysis
/project:test-coverage-analyzer       # Test coverage and quality analysis
/project:technical-debt-analyzer      # Technical debt assessment
/project:api-ecosystem-analyzer       # Complete API ecosystem analysis
/project:repository-onboarding        # Full repository onboarding guide
```

Component-specific commands (require parameters):
```bash
/project:migration-planner [component/technology]     # Smart migration planning
/project:performance-optimizer [component/function]   # Performance optimization
/project:component-onboarding [component/feature]     # Component-specific training
```

## Usage Examples

```bash
/project:analyze-architecture
/project:migration-planner React to Vue.js
/project:performance-optimizer DatabaseService.getUserData
/project:component-onboarding authentication system
```

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=JudiniLabs/mcp-code-graph&type=Date)](https://star-history.com/#JudiniLabs/mcp-code-graph&Date)

## Support

For support and feedback:

- Email: support@codegpt.co
- Website: [app.codegpt.co](https://app.codegpt.co)

## License

[MIT License](https://opensource.org/licenses/MIT)
