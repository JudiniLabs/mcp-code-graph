declare const getGraphId: (providedGraphId?: string) => string | null;
declare const createToolSchema: <T extends Record<string, any>>(baseSchema: T) => T;
declare function extractRepoInfo(url: string): {
    repoName: string;
    repoOrg: string;
};
export { getGraphId, createToolSchema, extractRepoInfo };
