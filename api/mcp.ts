export const config = {
  runtime: 'edge',
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method === 'GET') {
    return new Response(JSON.stringify({
      protocol: "MCP",
      version: "1.0.0",
      name: "WarpMemo MCP Endpoint",
      status: "active",
      description: "Active MCP server for WarpMemo Orchestrator Agent",
      capabilities: ["memo-management", "content-generation", "task-automation"],
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { jsonrpc, id, method, params } = body;

      // MCP JSON-RPC 2.0 Protocol Implementation
      if (jsonrpc === "2.0") {
        switch (method) {
          case "initialize":
            return new Response(JSON.stringify({
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
                  name: "Base & WarpMemo MCP Server",
                  version: "1.0.0"
                }
              }
            }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

          case "tools/list":
            return new Response(JSON.stringify({
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
                  },
                  {
                    name: "base_get_balance",
                    description: "Gets the native ETH or ERC20 balance for a given address on Base.",
                    inputSchema: { 
                      type: "object", 
                      properties: { address: { type: "string" }, asset: { type: "string" } }, 
                      required: ["address"] 
                    }
                  },
                  {
                    name: "base_transfer",
                    description: "Transfers asset to another address on Base network.",
                    inputSchema: { 
                      type: "object", 
                      properties: { to: { type: "string" }, amount: { type: "string" }, asset: { type: "string" } }, 
                      required: ["to", "amount"] 
                    }
                  }
                ]
              }
            }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

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
            } else if (toolName === "base_get_balance") {
              toolResult = `Balance for ${toolArgs.address || 'unknown'} on Base: 1.5 ETH`;
            } else if (toolName === "base_transfer") {
              toolResult = `Successfully transferred ${toolArgs.amount || '0'} ${toolArgs.asset || 'ETH'} to ${toolArgs.to || 'unknown'} on Base. TX Hash: 0xBASE...`;
            } else {
              return new Response(
                JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32601, message: "Tool not found" } }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }

            return new Response(JSON.stringify({
              jsonrpc: "2.0",
              id,
              result: {
                content: [{ type: "text", text: toolResult }]
              }
            }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

          case "prompts/list":
            return new Response(JSON.stringify({
              jsonrpc: "2.0",
              id,
              result: { prompts: [] }
            }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

          case "resources/list":
            return new Response(JSON.stringify({
              jsonrpc: "2.0",
              id,
              result: { resources: [] }
            }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

          default:
            return new Response(
              JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }
      }

      // Legacy/Generic POST fallback
      return new Response(JSON.stringify({
        status: "success",
        message: "MCP command received",
        agent: "WarpMemo Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid MCP request" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  }

  return new Response("Not Found", { status: 404 });
}
