import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { cache } from "react";
import { ModestUser } from "../models/User";

let cachedSession: { isAuth: boolean; userId: number } | null = null;

export const verifySession = async () => {
  if (cachedSession) {
    return cachedSession;
  }

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return null;
  }

  cachedSession = { isAuth: true, userId: Number(session.userId) };
  return cachedSession;
};

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const res = await fetch(
      `http://localhost:5000/users/user?sessionId=${session.userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      console.log("Failed to fetch user data from API");
      return null;
    }

    const user: ModestUser = await res.json();
    return user;
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
});
