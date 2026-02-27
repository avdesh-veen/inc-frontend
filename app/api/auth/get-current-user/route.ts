import { NextResponse } from "next/server";
import { API_ENDPOINTS, getEndpoint } from "@/lib/api/endpoints";
import { getToken } from "@/features/auth/api/login/server";

export async function GET() {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendRes = await fetch(
    getEndpoint(API_ENDPOINTS.auth.rolePermission),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  return NextResponse.json(data);
}
