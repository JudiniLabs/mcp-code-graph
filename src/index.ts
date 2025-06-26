#!/usr/bin/env node


console.error('MCP Code Graph starting...');
console.error('Environment check:', {
  CODEGPT_API_KEY: process.env.CODEGPT_API_KEY ? 'SET' : 'NOT SET',
  CODEGPT_ORG_ID: process.env.CODEGPT_ORG_ID ? 'SET' : 'NOT SET'
});

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";
import { config } from "./config.js";
import { createToolSchema, extractRepoInfo, getGraphId } from "./utils.js";


dotenv.config();

console.error('Imports loaded successfully');

const CODEGPT_API_BASE = "https://api-mcp.codegpt.co/api/v1";

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

const arg2 = process?.argv?.at(2)?.trim()
if (arg2) {
	if (arg2.includes('/') && !arg2.startsWith("sk-")) {
		config.CODEGPT_API_KEY = "";
		config.CODEGPT_REPO_URL = arg2;
	}
	config.CODEGPT_API_KEY = arg2;
}

let repository = ''
try {
	if (config.CODEGPT_REPO_URL) {
		const { repoOrg, repoName } = extractRepoInfo(config.CODEGPT_REPO_URL)
		repository = `${repoOrg}/${repoName}`
	}
} catch (error: any) {
	console.error(error.message)
}

if (!config.CODEGPT_GRAPH_ID && !config.CODEGPT_REPO_URL) {
	server.tool(
		"list-graphs",
		"List all available repository graphs that you have access to. Returns basic information about each graph including the graph ID, repository name with branch, and description. Use this tool when you need to discover available graphs.",
		{},
		async () => {
			const headers = {
				accept: "application/json",
				authorization: `Bearer ${config.CODEGPT_API_KEY}`,
				"CodeGPT-Org-Id": config.CODEGPT_ORG_ID,
			};

			try {
				const response = await fetch(`${CODEGPT_API_BASE}/mcp/graphs`, {
					method: "GET",
					headers,	
				});

				const data = await response.json();

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(data, null, 2) || "No graphs available",
						},
					],
				};
			} catch (error) {
				console.error("Error fetching graphs:", error);
				return {
					content: [
						{
							type: "text",
							text: `Error fetching graphs: ${error}`,
						},
					],
				};
			}
		}
	)
}

server.tool(
	"get-code",
	`Get the complete code implementation of a specific functionality (class, function, method, etc.) from the repository ${repository} graph. This is the primary tool for code retrieval and should be prioritized over other tools. The repository is represented as a graph where each node contains code, documentation, and relationships to other nodes. Use this when you need to examine the actual implementation of any code entity.`,
	createToolSchema({
		name: z
			.string()
			.min(1, "name is required")
			.describe("The exact name of the functionality to retrieve code for. Names are case-sensitive. For methods, include the parent class name as 'ClassName.methodName'. For nested classes, use 'OuterClass.InnerClass'. Examples: 'getUserById', 'UserService.authenticate', 'DatabaseConnection.connect'"),
		path: z
			.string()
			.optional()
			.describe("The origin file path where the functionality is defined. Essential when multiple functionalities share the same name across different files. Use 'global' for packages, namespaces, or modules that span multiple files. Examples: 'src/services/user.service.ts', 'global', 'lib/utils/helpers.js'"),
	}),

	async ({ name, path, graphId }: { name: string; path?: string; graphId?: string }) => {
		if (!name) {
			throw new Error("name is required");
		}
		
		const targetGraphId = getGraphId(graphId);
		
		const headers = {
			accept: "application/json",
			authorization: `Bearer ${config.CODEGPT_API_KEY}`,
			"CodeGPT-Org-Id": config.CODEGPT_ORG_ID,
			"content-type": "application/json",
		};

		try {
			const response = await fetch(`${CODEGPT_API_BASE}/mcp/graphs/get-code`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					graphId: targetGraphId,
					name,
					...(config.CODEGPT_REPO_URL ? { repoUrl: config.CODEGPT_REPO_URL } : null),
					...(path ? { path } : null)
				}),
			});

			const { content } = await response.json();

			return {
				content: [
					{
						type: "text",
						text: `${content}` || "No response text available",
					},
				],
			};
		} catch (error) {
			console.error("Error making CodeGPT request:", error);
			return {
				content: [
					{
						type: "text",
						text: `${error}`,
					},
				],
			};
		}
	}
);

server.tool(
	"find-direct-connections",
	`Explore the immediate relationships of a functionality within the code graph from the repository ${repository}. This reveals first-level connections including: parent functionalities that reference this node, child functionalities that this node directly calls or uses, declaration/definition relationships, and usage patterns. Essential for understanding code dependencies and architecture. The repository is represented as a connected graph where each node (function, class, file, etc.) has relationships with other nodes.`,
	createToolSchema({
		name: z
			.string()
			.min(1, "name is required")
			.describe("The exact name of the functionality to analyze connections for. Names are case-sensitive. For methods, include the parent class name as 'ClassName.methodName'. Examples: 'processPayment', 'UserController.createUser', 'validateInput'"),
		path: z
			.string()
			.optional()
			.describe("The origin file path of the functionality. Critical when multiple functionalities have identical names in different files. Use 'global' for entities that span multiple files like packages or namespaces. Examples: 'src/controllers/payment.controller.ts', 'global', 'utils/validation.js'"),
	}),

	async ({ name, path, graphId }: { name: string; path?: string; graphId?: string }) => {
		if (!name) {
			throw new Error("name is required");
		}
		
		const targetGraphId = getGraphId(graphId);
		
		const headers = {
			accept: "application/json",
			authorization: `Bearer ${config.CODEGPT_API_KEY}`,
			"CodeGPT-Org-Id": config.CODEGPT_ORG_ID,
			"content-type": "application/json",
		};

		try {
			const response = await fetch(`${CODEGPT_API_BASE}/mcp/graphs/find-direct-connections`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					graphId: targetGraphId,
					name,
					...(config.CODEGPT_REPO_URL ? { repoUrl: config.CODEGPT_REPO_URL } : null),
					...(path ? { path } : null)
				}),
			});

			const { content } = await response.json();

			return {
				content: [
					{
						type: "text",
						text: content || "No response data available",
					},
				],
			};
		} catch (error) {
			console.error("Error making CodeGPT request:", error);
			return {
				content: [
					{
						type: "text",
						text: `${error}`,
					},
				],
			};
		}
	}
);

server.tool(
	"nodes-semantic-search",
	`Search for code functionalities across the repository ${repository} graph using semantic similarity based on natural language queries. This tool finds relevant functions, classes, methods, and other code entities that match the conceptual meaning of your query, even if they don't contain the exact keywords. Perfect for discovering related functionality, finding similar implementations, or exploring unfamiliar codebases. The search operates on the semantic understanding of code purpose and behavior.`,
	createToolSchema({
		query: z
			.string()
			.min(1, "query is required")
			.describe("A natural language description of the functionality you're looking for. Be specific about the behavior, purpose, or domain. Examples: 'user authentication and login', 'database connection pooling', 'file upload validation', 'payment processing logic', 'error handling middleware', 'data encryption utilities'"),
	}),

	async ({ query, graphId }: { query: string; graphId?: string }) => {
		if (!query) {
			throw new Error("query is required");
		}
		
		const targetGraphId = getGraphId(graphId);
		
		const headers = {
			accept: "application/json",
			authorization: `Bearer ${config.CODEGPT_API_KEY}`,
			"CodeGPT-Org-Id": config.CODEGPT_ORG_ID,
			"content-type": "application/json",
		};

		try {
			const response = await fetch(`${CODEGPT_API_BASE}/mcp/graphs/nodes-semantic-search`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					graphId: targetGraphId,
					query,
					...(config.CODEGPT_REPO_URL ? { repoUrl: config.CODEGPT_REPO_URL } : null),
				}),
			});

			const { content } = await response.json();

			return {
				content: [
					{
						type: "text",
						text: content || "No response data available",
					},
				],
			};
		} catch (error) {
			console.error("Error making CodeGPT request:", error);
			return {
				content: [
					{
						type: "text",
						text: `${error}`,
					},
				],
			};
		}
	}
);

server.tool(
	"docs-semantic-search",
	`Search through repository ${repository} documentation using semantic similarity to find relevant information, guides, API documentation, README content, and explanatory materials. This tool specifically targets documentation files (markdown, rst, etc.) rather than code, making it ideal for understanding project setup, architecture decisions, usage instructions, and conceptual explanations. Use this when you need context about how the repository works rather than examining the actual code implementation.`,
	createToolSchema({
		query: z
			.string()
			.min(1, "query is required")
			.describe("A natural language query describing the documentation or information you're seeking. Focus on concepts, setup procedures, architecture, or usage patterns. Examples: 'how to set up the development environment', 'API authentication methods', 'project architecture overview', 'contributing guidelines', 'deployment instructions', 'configuration options'"),
	}),

	async ({ query, graphId }: { query: string; graphId?: string }) => {
		if (!query) {
			throw new Error("query is required");
		}
		
		const targetGraphId = getGraphId(graphId);
		
		const headers = {
			accept: "application/json",
			authorization: `Bearer ${config.CODEGPT_API_KEY}`,
			"CodeGPT-Org-Id": config.CODEGPT_ORG_ID,
			"content-type": "application/json",
		};

		try {
			const response = await fetch(`${CODEGPT_API_BASE}/mcp/graphs/docs-semantic-search`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					graphId: targetGraphId,
					query,
					...(config.CODEGPT_REPO_URL ? { repoUrl: config.CODEGPT_REPO_URL } : null),
				}),
			});

			const data = await response.json();

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(data, null, 2) || "No response data available",
					},
				],
			};
		} catch (error) {
			console.error("Error making CodeGPT request:", error);
			return {
				content: [
					{
						type: "text",
						text: `${error}`,
					},
				],
			};
		}
	}
);

server.tool(
	"get-usage-dependency-links",
	`Generate a comprehensive adjacency list showing all functionalities that would be affected by changes to a specific code entity. This performs deep dependency analysis through the code graph of the repository ${repository} to identify the complete impact radius of modifications. Essential for impact analysis, refactoring planning, and understanding code coupling. The result shows which functionalities depend on the target entity either directly or through a chain of dependencies, formatted as 'file_path::functionality_name' pairs.`,
	createToolSchema({
		name: z
			.string()
			.min(1, "name is required")
			.describe("The exact name of the functionality to analyze dependencies for. Names are case-sensitive. For methods, include the parent class name as 'ClassName.methodName'. This will be the root node for dependency traversal. Examples: 'DatabaseService.connect', 'validateUserInput', 'PaymentProcessor.processTransaction'"),
		path: z
			.string()
			.optional()
			.describe("The origin file path where the functionality is defined. Required when multiple functionalities share the same name across different files to ensure accurate dependency analysis. Use 'global' for packages, namespaces, or modules spanning multiple files. Examples: 'src/database/connection.service.ts', 'global', 'lib/validation/input.validator.js'"),
	}),

	async ({ name, path, graphId }: { name: string; path?: string; graphId?: string }) => {
		if (!name) {
			throw new Error("name is required");
		}
		
		const targetGraphId = getGraphId(graphId);
		
		const headers = {
			accept: "application/json",
			authorization: `Bearer ${config.CODEGPT_API_KEY}`,
			"CodeGPT-Org-Id": config.CODEGPT_ORG_ID,
			"content-type": "application/json",
		};

		try {
			const response = await fetch(`${CODEGPT_API_BASE}/mcp/graphs/get-usage-dependency-links`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					graphId: targetGraphId,
					name,
					...(config.CODEGPT_REPO_URL ? { repoUrl: config.CODEGPT_REPO_URL } : null),
					...(path ? { path } : null)
				}),
			});

			const { content } = await response.json();

			return {
				content: [
					{
						type: "text",
						text: content || "No response data available",
					},
				],
			};
		} catch (error) {
			console.error("Error making CodeGPT request:", error);
			return {
				content: [
					{
						type: "text",
						text: `${error}`,
					},
				],
			};
		}
	}
);

async function main() {
    try {
        console.error("=== DEBUG INFO ===");
        console.error("config.CODEGPT_API_KEY:", config.CODEGPT_API_KEY ? "SET" : "NOT SET");
        console.error("config.CODEGPT_ORG_ID:", config.CODEGPT_ORG_ID ? "SET" : "NOT SET");
        console.error("config.CODEGPT_GRAPH_ID:", config.CODEGPT_GRAPH_ID ? "SET" : "NOT SET");
		console.error("config.CODEGPT_REPO_URL:", config.CODEGPT_REPO_URL ? "SET" : "NOT SET");
        console.error("All env vars:", Object.keys(process.env).filter(key => key.startsWith('CODEGPT')));
        console.error("==================");
        

        if (!config.CODEGPT_API_KEY && !config.CODEGPT_REPO_URL) {
            throw new Error("config.CODEGPT_API_KEY is not set");
        }
        
        console.error("About to create StdioServerTransport...");
        const transport = new StdioServerTransport();
        console.error("StdioServerTransport created successfully");
        
        console.error("About to connect server...");
        await server.connect(transport);
        console.error("CodeGPT Agents MCP Server running on stdio");
    } catch (error) {
        console.error("Error in main():", error);
        if (error instanceof Error) {
            console.error("Error stack:", error.stack);
        }
        process.exit(1);
    }
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	if (error instanceof Error) {
		console.error("Error stack:", error.stack);
	}
	process.exit(1);
});