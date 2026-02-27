import { NextResponse } from "next/server";
import type { LoginResponse } from "@/features/auth/types";

import { logger } from "@/lib/logger";
import { ApiResponse } from "@/lib/api/types";
import { COOKIE_NAMES } from "@/lib/constants/cookie-helper";
import { API_ENDPOINTS, getEndpoint } from "@/lib/api/endpoints";

export async function POST(req: Request) {
  const credentials = await req.json();
  const backendRes = await fetch(getEndpoint(API_ENDPOINTS.auth.login), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = (await backendRes.json()) as ApiResponse<LoginResponse>;
  if (!backendRes.ok) {
    logger("Login failed", { data });
    return NextResponse.json(data, { status: data.statusCode });
  }

  logger("Login response", { data });
  const res = NextResponse.json(data);

  res.cookies.set(COOKIE_NAMES.AUTH_TOKEN, data.data.accessToken, {
    // httpOnly: true,
    sameSite: "lax",
    // secure: process.env.NODE_ENV === "production",
    maxAge: data.data.expiresIn,
    // path: "/",
  });

  res.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, data.data.refreshToken, {
    // httpOnly: true,
    sameSite: "lax",
    // secure: process.env.NODE_ENV === "production",
    maxAge: data.data.refreshTokenExpiry,
    // path: "/",
  });

  return res;
}
