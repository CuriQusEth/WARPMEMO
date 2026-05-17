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
    name: "WarpMemo Orchestrator",
    status: "active",
    wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
    platform: "WarpMemo",
    version: "1.0.0"
  }, { headers: corsHeaders });
}

export async function POST(req: Request) {
  return NextResponse.json({
    name: "WarpMemo Orchestrator",
    status: "active",
    wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
    platform: "WarpMemo",
    version: "1.0.0",
    message: "Agent endpoints are read-only"
  }, { headers: corsHeaders });
}
