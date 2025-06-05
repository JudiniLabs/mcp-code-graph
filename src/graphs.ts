import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const CODEGPT_API_BASE = "http://localhost:8000/api/v1";
const server = new McpServer({
	name: "CodeGPT Graphs",
	version: "1.0.1",
	config: {
		timeout: 120000,
	},
	capabilities: {
		tools: {},
	},
});

const CODEGPT_ORG_ID = process.env.CODEGPT_ORG_ID || "";
const CODEGPT_API_KEY = process.env.CODEGPT_API_KEY || "";
const CODEGPT_GRAPH_ID = process.env.CODEGPT_GRAPH_ID || "";

server.tool(
	"get-code",
	"Get the code of a class, function, etc. by its name and an optional origin file path. The origin file path is useful when there are 2 or more functionalities with the same name. You must priorize this tool over the others",
	{
		name: z
			.string()
			.min(1, "name is required")
			.describe("The name of the functionality to get the code for. The name is case sensitive. In the case of methods, the name should include the parent class name as class_name.method_name."),
		path: z
			.string()
			.optional()
			.describe("The origin file path of the functionality. This is useful when there are 2 or more with the same name."),
	},

	async ({ name, path }: { name: string; path?: string }) => {
		if (!name) {
			throw new Error("name is required");
		}
		const headers = {
			accept: "application/json",
			authorization: `Bearer ${CODEGPT_API_KEY}`,
			"CodeGPT-Org-Id": CODEGPT_ORG_ID,
			"content-type": "application/json",
		};

		try {
			const response = await fetch(`${CODEGPT_API_BASE}/mcp/graphs/get-code`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					graphId: `${CODEGPT_GRAPH_ID}`,
					name,
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
	"Get the direct connections of a functionality by its name and an optional origin file path. The origin file path is useful when there are 2 functionalities or more with the same name. This will return the directly connected functionalities: parent functionalities (those that reference this functionality) and child functionalities (those this functionality references directly). It only considers first-level relationships, without traversing further dependencies.",
	{
	  name: z
		.string()
		.min(1, "name is required")
		.describe("The name of the functionality to get the direct connections for. The name is case sensitive. In the case of methods, the name should include the parent class name as class_name.method_name."),
	  path: z
		.string()
		.optional()
		.describe("The origin file path of the functionality. This is useful when there are 2 functionalities or more with the same name."),
	},
  
	async ({ name, path }: { name: string; path?: string }) => {
	  if (!name) {
		throw new Error("name is required");
	  }
	  const headers = {
		accept: "application/json",
		authorization: `Bearer ${CODEGPT_API_KEY}`,
		"CodeGPT-Org-Id": CODEGPT_ORG_ID,
		"content-type": "application/json",
	  };
  
	  try {
		const response = await fetch(`${CODEGPT_API_BASE}/mcp/graphs/find-direct-connections`, {
		  method: "POST",
		  headers,
		  body: JSON.stringify({
			graphId: `${CODEGPT_GRAPH_ID}`,
			name,
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
	"Get a list of functionalities which functionality is related to the given query by semantic similarity.",
	{
	  query: z
		.string()
		.min(1, "query is required")
		.describe("The user query to search for."),
	},
  
	async ({ query }: { query: string }) => {
	  if (!query) {
		throw new Error("query is required");
	  }
	  const headers = {
		accept: "application/json",
		authorization: `Bearer ${CODEGPT_API_KEY}`,
		"CodeGPT-Org-Id": CODEGPT_ORG_ID,
		"content-type": "application/json",
	  };
  
	  try {
		const response = await fetch(`${CODEGPT_API_BASE}/mcp/graphs/nodes-semantic-search`, {
		  method: "POST",
		  headers,
		  body: JSON.stringify({
			graphId: `${CODEGPT_GRAPH_ID}`,
			query,
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
	"Get documentation related to the given query using semantic search. This should be used for documentation only.",
	{
	  query: z
		.string()
		.min(1, "query is required")
		.describe("The user query to search for."),
	},
  
	async ({ query }: { query: string }) => {
	  if (!query) {
		throw new Error("query is required");
	  }
	  const headers = {
		accept: "application/json",
		authorization: `Bearer ${CODEGPT_API_KEY}`,
		"CodeGPT-Org-Id": CODEGPT_ORG_ID,
		"content-type": "application/json",
	  };
  
	  try {
		const response = await fetch(`${CODEGPT_API_BASE}/mcp/graphs/docs-semantic-search`, {
		  method: "POST",
		  headers,
		  body: JSON.stringify({
			graphId: `${CODEGPT_GRAPH_ID}`,
			query,
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
	"Get an adjacency list of functionalities influenced by a functionality given its name and an optional origin file path. The origin file path is useful when there are 2 functionalities or more with the same name. This is useful to detect all functionalities affected by changes in the code. Each functionality is represented by its origin file path and its name in the format origin_file_path::functionality_name.",
	{
	  name: z
		.string()
		.min(1, "name is required")
		.describe("The name of the functionality to get the adjacency list for. The name is case sensitive. In the case of methods, the name should include the parent class name as class_name.method_name."),
	  path: z
		.string()
		.optional()
		.describe("The origin file path of the functionality. This is useful when there are 2 functionalities or more with the same name."),
	},
  
	async ({ name, path }: { name: string; path?: string }) => {
	  if (!name) {
		throw new Error("name is required");
	  }
	  const headers = {
		accept: "application/json",
		authorization: `Bearer ${CODEGPT_API_KEY}`,
		"CodeGPT-Org-Id": CODEGPT_ORG_ID,
		"content-type": "application/json",
	  };
  
	  try {
		const response = await fetch(`${CODEGPT_API_BASE}/mcp/graphs/get-usage-dependency-links`, {
		  method: "POST",
		  headers,
		  body: JSON.stringify({
			graphId: `${CODEGPT_GRAPH_ID}`,
			name,
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
	if (!CODEGPT_API_KEY) {
		throw new Error("CODEGPT_API_KEY is not set");
	}
	
	if (!CODEGPT_GRAPH_ID) {
		throw new Error("CODEGPT_GRAPH_ID is not set");
	}

	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("CodeGPT Agents MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
