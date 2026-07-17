import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminBasicAuth } from "./lib/admin-auth";

function unauthorized(): NextResponse {
  return new NextResponse("ChainVigil Admin requires authentication.", {
    status: 401,
    headers: {
      "www-authenticate": 'Basic realm="ChainVigil Admin", charset="UTF-8"',
    },
  });
}

export function proxy(request: NextRequest): NextResponse {
  const result = verifyAdminBasicAuth(
    request.headers.get("authorization"),
    {
      username: process.env.ADMIN_BASIC_AUTH_USERNAME,
      password: process.env.ADMIN_BASIC_AUTH_PASSWORD,
    },
    atob,
  );

  return result.ok ? NextResponse.next() : unauthorized();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|health).*)"],
};
