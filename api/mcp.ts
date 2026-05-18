export const config = {
  runtime: 'edge',
};

const TOOLS = [
  {
    name: 'get_race_status',
    description: 'Get the current status of a race',
    inputSchema: { type: 'object', properties: { raceId: { type: 'string' } }, required: ['raceId'] }
  },
  {
    name: 'start_race',
    description: 'Start a new race on the track',
    inputSchema: { type: 'object', properties: { trackId: { type: 'string' } }, required: ['trackId'] }
  },
  {
    name: 'get_leaderboard',
    description: 'Get the global leaderboard',
    inputSchema: { type: 'object', properties: { limit: { type: 'number' } } }
  },
  {
    name: 'optimize_speed',
    description: 'Optimize the speed settings for an agent',
    inputSchema: { type: 'object', properties: { agentId: { type: 'string' } }, required: ['agentId'] }
  },
  {
    name: 'get_track_info',
    description: 'Retrieve details about a specific track',
    inputSchema: { type: 'object', properties: { trackId: { type: 'string' } }, required: ['trackId'] }
  }
];

export default async function handler(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method === 'GET') {
    return new Response(JSON.stringify({
      protocol: "MCP",
      version: "1.0.0",
      name: "WarpSnaket Orchestrator",
      status: "active",
      description: "Active MCP server for WarpSnaket Orchestrator Agent",
      capabilities: ["snake-game-management", "task-automation", "daily-operations"],
      tools: [
        "get_race_status",
        "start_race",
        "get_leaderboard",
        "optimize_speed",
        "get_track_info"
      ],
      timestamp: new Date().toISOString()
    }), { status: 200, headers });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { jsonrpc, method, params } = body;

      let result;

      if (method === 'initialize') {
        result = {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {}, prompts: {}, resources: {} },
          serverInfo: { name: 'WarpSnaket Orchestrator', version: '1.0.0' }
        };
      } else if (method === 'tools/list') {
        result = { tools: TOOLS };
      } else if (method === 'tools/call') {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};
        
        result = {
          toolResult: {
            success: true,
            action: toolName,
            executedArgs: toolArgs,
            message: `Tool ${toolName} executed successfully.`
          }
        };
      } else if (method === 'prompts/list') {
        result = { prompts: [] };
      } else if (method === 'resources/list') {
        result = { resources: [] };
      } else {
        result = { error: 'Method not supported' };
      }

      return new Response(JSON.stringify({
        jsonrpc: jsonrpc || '2.0',
        id: body?.id,
        result
      }), { status: 200, headers });
      
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid MCP request" }), { status: 400, headers });
    }
  }

  return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });
}
