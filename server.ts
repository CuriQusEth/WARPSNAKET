import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware
  app.use(express.json());
  app.use(cors());

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

  // Constants
  const mcpPayload = {
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
  };

  const agentPayload = {
    name: "WarpSnaket Orchestrator",
    status: "active",
    wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
    platform: "WarpSnaket",
    version: "1.0.0"
  };

  const handleMcpPost = (req, res) => {
    try {
      const { jsonrpc, method, params, id } = req.body;
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

      res.json({
        jsonrpc: jsonrpc || '2.0',
        id: id,
        result
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  };

  // MCP Route
  app.get("/api/mcp", (req, res) => res.json(mcpPayload));
  app.get("/app/api/mcp", (req, res) => res.json(mcpPayload));
  
  app.post("/api/mcp", handleMcpPost);
  app.post("/app/api/mcp", handleMcpPost);

  // Agent Route
  app.get("/api/agent", (req, res) => res.json(agentPayload));
  app.get("/app/api/agent", (req, res) => res.json(agentPayload));

  const handleAgentPost = (req, res) => {
    try {
      res.json({
        status: "success",
        message: "Agent processed request",
        agent: "WarpSnaket Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: req.body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid agent request" });
    }
  };

  app.post("/api/agent", handleAgentPost);
  app.post("/app/api/agent", handleAgentPost);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
