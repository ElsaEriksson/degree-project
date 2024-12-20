"use server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { User } from "@/app/models/User";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || "Log in failed");
            }

            const user: User = await res.json();
            return user;
          } catch (error) {
            console.error("Authentication error:", error);
            return null;
          }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
