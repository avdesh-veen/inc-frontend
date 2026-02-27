import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/constants/cookie-helper";
import { API_ENDPOINTS, getEndpoint } from "@/lib/api/endpoints";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@/lib/api/types";
import type { LoginResponse } from "@/features/auth/types";

/**
 * POST /api/auth/refresh-token
 * 
 * Refreshes the access token using the refresh token from cookies.
 * Returns new access and refresh tokens, updates cookies.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

    if (!refreshToken) {
      logger("Refresh token not found in cookies");
      return NextResponse.json(
        { 
          status: false, 
          message: "Refresh token not found",
          statusCode: 401,
          data: null,
        },
        { status: 401 }
      );
    }

    // Call backend refresh token endpoint
    const cookieHeader = request.headers.get('cookie') || '';
    const backendRes = await fetch(getEndpoint(API_ENDPOINTS.auth.refreshToken), {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": cookieHeader,
      },
      credentials: "include",
    });

    const data = (await backendRes.json()) as ApiResponse<LoginResponse>;

    if (!backendRes.ok) {
      logger("Backend refresh token failed", { data });
      
      // Clear cookies on refresh failure
      const statusCode = data.statusCode || backendRes.status || 401;
      const res = NextResponse.json(data, { status: statusCode });
      res.cookies.delete(COOKIE_NAMES.AUTH_TOKEN);
      res.cookies.delete(COOKIE_NAMES.REFRESH_TOKEN);
      
      return res;
    }

    logger("Token refreshed successfully", { 
      expiresIn: data.data.expiresIn,
      refreshTokenExpiry: data.data.refreshTokenExpiry,
    });

    // Create response with new tokens
    const res = NextResponse.json(data);

    // Set new access token
    res.cookies.set(COOKIE_NAMES.AUTH_TOKEN, data.data.accessToken, {
      sameSite: "lax",
      maxAge: data.data.expiresIn,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    // Set new refresh token
    res.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, data.data.refreshToken, {
      sameSite: "lax",
      maxAge: data.data.refreshTokenExpiry,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  } catch (error) {
    logger("Refresh token error (POST /api/auth/refresh-token)", { error: String(error) });
    
    return NextResponse.json(
      {
        status: false,
        message: "Internal server error during token refresh",
        statusCode: 500,
        data: null,
      },
      { status: 500 }
    );
  }
}
