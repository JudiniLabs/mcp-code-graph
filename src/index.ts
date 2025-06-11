import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { createTools } from "./tools.js";

dotenv.config();

const server = new McpServer({
	name: "CodeGPT Deep Graph MCP",
	version: "1.0.1",
	config: {
		timeout: 120000,
	},
	capabilities: {
		tools: {},
	},
});

const CODEGPT_API_KEY = process.env.CODEGPT_API_KEY || "";
const CODEGPT_GRAPH_ID = process.env.CODEGPT_GRAPH_ID || "";

async function main() {
	if (!CODEGPT_API_KEY) {
		throw new Error("CODEGPT_API_KEY is not set");
	}
	
	// Only require CODEGPT_GRAPH_ID if we're in single-graph mode
	if (!CODEGPT_GRAPH_ID) {
		console.error("CODEGPT_GRAPH_ID is not set - running in multi-graph mode. Use list-graphs tool to discover available graphs and provide graphId parameter to other tools.");
	} else {
		console.error("CODEGPT_GRAPH_ID is set - running in single-graph mode for graph:", CODEGPT_GRAPH_ID);
	}

	const transport = new StdioServerTransport();
	await createTools(server);
	await server.connect(transport);
	console.error("CodeGPT Agents MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
