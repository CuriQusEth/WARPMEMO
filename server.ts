import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Needed to parse JSON POST bodies for MCP route
  app.use(express.json());

  // API Routes
  
  // MCP API Route
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "WarpMemo MCP Endpoint",
      status: "active",
      description: "Active MCP server for WarpMemo Orchestrator Agent",
      capabilities: ["memo-management", "content-generation", "task-automation"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      const { jsonrpc, id, method, params } = body;

      // MCP JSON-RPC 2.0 Protocol Implementation
      if (jsonrpc === "2.0") {
        switch (method) {
          case "initialize":
            return res.json({
              jsonrpc: "2.0",
              id,
              result: {
                protocolVersion: "2024-11-05",
                capabilities: {
                  tools: {},
                  prompts: {},
                  resources: {}
                },
                serverInfo: {
                  name: "WarpMemo MCP Server",
                  version: "1.0.0"
                }
              }
            });

          case "tools/list":
            return res.json({
              jsonrpc: "2.0",
              id,
              result: {
                tools: [
                  {
                    name: "get_race_status",
                    description: "Returns current warp race state.",
                    inputSchema: { type: "object", properties: {}, required: [] }
                  },
                  {
                    name: "start_race",
                    description: "Initiates a warp race session.",
                    inputSchema: { type: "object", properties: {}, required: [] }
                  },
                  {
                    name: "get_leaderboard",
                    description: "Fetches competitive rankings.",
                    inputSchema: { type: "object", properties: {}, required: [] }
                  },
                  {
                    name: "optimize_speed",
                    description: "Triggers racing performance optimization.",
                    inputSchema: { type: "object", properties: {}, required: [] }
                  },
                  {
                    name: "get_track_info",
                    description: "Returns track metadata.",
                    inputSchema: { 
                      type: "object", 
                      properties: { trackId: { type: "string" } }, 
                      required: ["trackId"] 
                    }
                  }
                ]
              }
            });

          case "tools/call":
            const toolName = params?.name;
            const toolArgs = params?.arguments || {};
            
            let toolResult = "";
            if (toolName === "get_race_status") {
              toolResult = "Current race state: Open for entries. Tracks are clear.";
            } else if (toolName === "start_race") {
              toolResult = "Warp race session initiated successfully.";
            } else if (toolName === "get_leaderboard") {
              toolResult = "Competitive rankings: 1st - BatchWizard, 2nd - Speedster.";
            } else if (toolName === "optimize_speed") {
              toolResult = "Performance optimization triggered. Engines tuned for max warp.";
            } else if (toolName === "get_track_info") {
              toolResult = `Track metadata for ${toolArgs.trackId || 'unknown'}: Length 5000 units, Hazards: None.`;
            } else {
              return res.status(404).json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Tool not found" } });
            }

            return res.json({
              jsonrpc: "2.0",
              id,
              result: {
                content: [{ type: "text", text: toolResult }]
              }
            });

          case "prompts/list":
            return res.json({
              jsonrpc: "2.0",
              id,
              result: { prompts: [] }
            });

          case "resources/list":
            return res.json({
              jsonrpc: "2.0",
              id,
              result: { resources: [] }
            });

          default:
            return res.status(404).json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
        }
      }

      // Legacy/Generic POST fallback
      res.json({
        status: "success",
        message: "MCP command received",
        agent: "WarpMemo Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  });

  // Agent API Route
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "WarpMemo Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "WarpMemo",
      version: "1.0.0"
    });
  });

  // Vite middleware for development or Static files for production
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
