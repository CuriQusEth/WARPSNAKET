import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: "WarpSnaket Orchestrator",
    status: "active",
    wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
    platform: "WarpSnaket",
    version: "1.0.0"
  });
}
