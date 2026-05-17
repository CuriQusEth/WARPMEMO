import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "WarpMemo MCP Endpoint",
    status: "active",
    description: "Active MCP server for WarpMemo Orchestrator Agent",
    capabilities: ["memo-management", "content-generation", "task-automation"],
    timestamp: new Date().toISOString()
  }, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jsonrpc, id, method, params } = body;

    // MCP JSON-RPC 2.0 Protocol Implementation
    if (jsonrpc === "2.0") {
      switch (method) {
        case "initialize":
          return NextResponse.json({
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
          }, { headers: corsHeaders });

        case "tools/list":
          return NextResponse.json({
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
          }, { headers: corsHeaders });

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
            return NextResponse.json(
              { jsonrpc: "2.0", id, error: { code: -32601, message: "Tool not found" } },
              { status: 404, headers: corsHeaders }
            );
          }

          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: toolResult }]
            }
          }, { headers: corsHeaders });

        case "prompts/list":
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: { prompts: [] }
          }, { headers: corsHeaders });

        case "resources/list":
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: { resources: [] }
          }, { headers: corsHeaders });

        default:
          return NextResponse.json(
            { jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } },
            { status: 404, headers: corsHeaders }
          );
      }
    }

    // Legacy/Generic POST fallback
    return NextResponse.json({
      status: "success",
      message: "MCP command received",
      agent: "WarpMemo Orchestrator",
      receivedAt: new Date().toISOString(),
      payload: body
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: "Invalid MCP request" }, { status: 400, headers: corsHeaders });
  }
}
