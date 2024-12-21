import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = crypto.randomUUID();

  const response = NextResponse.json({ success: true });

  // Sätt en cookie
  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    maxAge: 60 * 60 * 24 * 7, // 1 vecka
    path: "/",
  });

  return response;
}
