import { createTools } from '@/tools.js';
import { createMcpHandler } from '@vercel/mcp-adapter';
 
const handler = createMcpHandler((server) => {
    return createTools(server)
});
 
export { handler as GET, handler as POST, handler as DELETE };