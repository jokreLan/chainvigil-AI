export function GET() {
  return Response.json({
    service: "chainvigil-admin",
    ok: true,
    mode: process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString(),
  });
}
