"use server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { User } from "@/app/models/User";
import { authConfig } from "./auth.config";
import { cookies } from "next/headers";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as User).user_id;
        // Migrera varukorgen från cookies till databasen här
        if ((user as User).user_id) {
          await migrateCartFromCookiesToDatabase((user as User).user_id);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId.toString();
      }
      return session;
    },
  },
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

async function migrateCartFromCookiesToDatabase(userId: number) {
  const cookieStore = await cookies();

  const cartCookie = cookieStore.get("cart");
  if (cartCookie) {
    const cart = JSON.parse(cartCookie.value);
    // Implementera logik för att spara varukorgen i databasen
    await saveCartToDatabase(userId, cart);
    // Ta bort cookie efter migrering
    const cookieStore = await cookies();
    cookieStore.delete("cart");
  }
}

async function saveCartToDatabase(userId: number, cart: any) {
  // Implementera logik för att spara varukorgen i databasen
}
