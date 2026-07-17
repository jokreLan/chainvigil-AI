import { NextResponse } from "next/server";

/**
 * Same-origin BFF for referral analytics.
 * Injects INTERNAL_WRITE_SECRET server-side so browsers never hold the write key.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "请求体必须是 JSON。", field: "body" } },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "请求体必须是 JSON object。", field: "body" } },
      { status: 400 },
    );
  }

  const apiBaseUrl = (
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:4000"
  ).replace(/\/$/, "");
  const writeSecret = process.env.INTERNAL_WRITE_SECRET?.trim();
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };

  if (writeSecret) {
    headers["x-chainvigil-write-secret"] = writeSecret;
  }

  try {
    const upstream = await fetch(`${apiBaseUrl}/api/v1/referral/event`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const payload = await upstream.json().catch(() => ({
      error: { code: "UPSTREAM_ERROR", message: "上游返回无法解析。" },
    }));

    return NextResponse.json(payload, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { error: { code: "UPSTREAM_UNAVAILABLE", message: "推荐事件服务暂时不可用。" } },
      { status: 502 },
    );
  }
}
