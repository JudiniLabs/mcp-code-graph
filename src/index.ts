import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const CODEGPT_API_BASE = "http://localhost:8000/api/v1";
const server = new McpServer({
	name: "CodeGPT",
	version: "1.0.0",
	config: {
		timeout: 120000,
	},
	capabilities: {
		tools: {},
	},
});

const CODEGPT_ORG_ID = process.env.CODEGPT_ORG_ID || "";
const CODEGPT_API_KEY = process.env.CODEGPT_API_KEY || "";
const CODEGPT_GRAPH_ID = process.env.GRAPH_ID || "";


if (!CODEGPT_API_KEY) {
	throw new Error("CODEGPT_API_KEY is not set");
}

interface Agent {
	id: string;
	org_id: string;
	created_at: string;
	pincode: string;
	is_public: boolean;
	welcome: string;
	image: string;
	agent_type: string;
	name: string;
	prompt: string;
	model: string;
	description: string | null;
	is_frozen: boolean;
}

// Format agent data
function formatAgent(agent: Agent): string {
	return [
		`id: ${agent.id}`,
		`Name: ${agent.name}`,
		`Welcome Message: ${agent.welcome}`,
		`Created At: ${agent.created_at}`,
		"---",
	].join("\n");
}

// Register CodeGPT tools
server.tool("list-agents", "List all available CodeGPT agents", async () => {
	const headers = {
		accept: "application/json",
		authorization: `Bearer ${CODEGPT_API_KEY}`,
		"CodeGPT-Org-Id": CODEGPT_ORG_ID,
	};

	try {
		const response = await fetch(`${CODEGPT_API_BASE}/agent`, { headers });
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const agents = await response.json();
		const formattedAgents = agents.map(formatAgent);
		const agentsText = `Available CodeGPT Agents:\n\n${formattedAgents.join(
			"\n"
		)}`;

		return {
			content: [
				{
					type: "text",
					text: agentsText,
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
});

server.tool(
	"ask-to-an-agent",
	"Chat with a CodeGPT agent, an agent is like a database specialized in a specific codebase or knowledge",
	{
		agentId: z
			.string()
			.min(1, "Agent ID is required")
			.describe("The ID of the agent to chat with"),
		message: z
			.string()
			.min(1, "Message cannot be empty")
			.max(4000, "Message too long")
			.describe("The message to send to the agent"),
	},

	async ({ agentId, message }: { agentId: string; message: string }) => {
		if (!agentId || !message) {
			throw new Error("Agent ID is required");
		}
		const headers = {
			accept: "application/json",
			authorization: `Bearer ${CODEGPT_API_KEY}`,
			"CodeGPT-Org-Id": CODEGPT_ORG_ID,
			"content-type": "application/json",
		};

		try {
			const response = await fetch(`${CODEGPT_API_BASE}/chat/completions`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					agentId: `${agentId}`,
					messages: [
						{
							role: "user",
							content: `${message}`,
						},
					],
					format: "text",
					stream: false,
				}),
			});

			const responseText = await response.text();

			return {
				content: [
					{
						type: "text",
						text: `${responseText}` || "No response text available",
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
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("CodeGPT Agents MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
