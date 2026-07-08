export function GET() {
  return Response.json({
    service: "chainvigil-web",
    ok: true,
    mode: process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString(),
  });
}
