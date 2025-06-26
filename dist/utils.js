import { z } from "zod";
import { config } from "./config.js";
// Helper function to get the graph ID
const getGraphId = (providedGraphId) => {
    if (config.CODEGPT_REPO_URL || config.IS_MULTI_REPO) {
        return null;
    }
    if (config.CODEGPT_GRAPH_ID) {
        return config.CODEGPT_GRAPH_ID;
    }
    if (!providedGraphId) {
        throw new Error("Graph ID is required. Either set config.CODEGPT_GRAPH_ID environment variable or provide graphId parameter.");
    }
    return providedGraphId;
};
const createToolSchema = (baseSchema) => {
    const hasRepoAccess = config.CODEGPT_GRAPH_ID || config.CODEGPT_REPO_URL || config.IS_MULTI_REPO;
    let schema = hasRepoAccess ? baseSchema : {
        ...baseSchema,
        graphId: z
            .string()
            .min(1, "Graph ID is required")
            .describe("The ID of the graph to query")
    };
    if (config.IS_MULTI_REPO) {
        const repoList = config.REPO_LIST.join(", ");
        schema = {
            ...schema,
            repository: z
                .string()
                .min(1, "Repository name is required")
                .describe(`The repository to query from the available repositories. Format is: org/repo. Available options are: ${repoList}`),
        };
    }
    return schema;
};
function extractRepoInfo(url) {
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    const repoRegex = /([^\/]+)\/([^\/]+)$/;
    const match = cleanUrl.match(repoRegex);
    if (!match) {
        throw new Error('Invalid format. Expected format: name/repo');
    }
    const [, repoOrg, repoName] = match;
    if (!repoName || !repoOrg) {
        throw new Error('Could not extract name and repo from the URL');
    }
    return { repoOrg, repoName };
}
export { getGraphId, createToolSchema, extractRepoInfo };
//# sourceMappingURL=utils.js.map