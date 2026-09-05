import { NextResponse } from "next/server";

export const CLIENT_COOKIE_NAME = "nexus_client_id";

export function getClientSession(request: Request): { clientId: string; isNew: boolean } {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${CLIENT_COOKIE_NAME}=([^;]+)`));

  if (match && match[1] && match[1].trim().length >= 10) {
    return {
      clientId: decodeURIComponent(match[1].trim()),
      isNew: false,
    };
  }

  return {
    clientId: `cid_${crypto.randomUUID().replace(/-/g, "")}`,
    isNew: true,
  };
}

export function attachClientCookie(response: NextResponse, clientId: string): NextResponse {
  response.cookies.set({
    name: CLIENT_COOKIE_NAME,
    value: clientId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  return response;
}
