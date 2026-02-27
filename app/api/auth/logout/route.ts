import { NextResponse } from "next/server";
import { API_ENDPOINTS, getEndpoint } from "@/lib/api/endpoints";
import { COOKIE_NAMES } from "@/lib/constants/cookie-helper";

export async function POST() {
  try {
    await fetch(getEndpoint(API_ENDPOINTS.auth.logout), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = NextResponse.json({
      status: true,
      message: "Logged out successfully",
    });

    res.cookies.set(COOKIE_NAMES.AUTH_TOKEN, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    });

    res.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: error instanceof Error ? error.message : "Logout failed",
      },
      { status: 500 },
    );
  }
}
