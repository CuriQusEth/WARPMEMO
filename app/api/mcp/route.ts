import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "WarpMemo MCP Endpoint",
    status: "active",
    description: "Active MCP server for WarpMemo Orchestrator Agent",
    capabilities: ["memo-management", "content-generation", "task-automation"],
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jsonrpc, id, method, params } = body;

    // MCP JSON-RPC 2.0 Protocol Implementation
    if (jsonrpc !== "2.0") {
      return NextResponse.json({ jsonrpc: "2.0", id, error: { code: -32600, message: "Invalid Request: Must be JSON-RPC 2.0" } });
    }

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
        });

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
          return NextResponse.json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Tool not found" } });
        }

        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: toolResult }]
          }
        });

      case "prompts/list":
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: { prompts: [] }
        });

      case "resources/list":
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: { resources: [] }
        });

      default:
        // Respond to non-MCP or generic POST logic to keep existing logic functioning
        if (!method) {
          return NextResponse.json({
            status: "success",
            message: "MCP command received",
            agent: "WarpMemo Orchestrator",
            receivedAt: new Date().toISOString(),
            payload: body
          });
        }
        return NextResponse.json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid MCP request" }, { status: 400 });
  }
}
