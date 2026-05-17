export const config = {
  runtime: 'edge',
};

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
      name: "WarpSnaket Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "WarpSnaket",
      version: "1.0.0"
    }), { status: 200, headers });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      return new Response(JSON.stringify({
        status: "success",
        message: "Agent processed request",
        agent: "WarpSnaket Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      }), { status: 200, headers });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid agent request" }), { status: 400, headers });
    }
  }

  return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });
}
