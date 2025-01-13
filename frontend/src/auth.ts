import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { LoggedInUser } from "@/app/models/User";
import { authConfig } from "./auth.config";
import { JWT } from "next-auth/jwt";
import { migrateCartFromCookiesToDatabase } from "./app/lib/actions/shoppingCart";

declare module "next-auth" {
  interface Session {
    user: {
      userId: number;
      email: string;
      firstName: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    email: string;
    name: string;
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.error("Invalid credentials format");
          return null;
        }

        const { email, password } = parsedCredentials.data;

        try {
          const res = await fetch("http://localhost:5000/test/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            console.error("Login failed:", errorData.error);
            return null;
          }

          const user = (await res.json()) as LoggedInUser;

          await migrateCartFromCookiesToDatabase(user.user_id);

          return user;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as LoggedInUser).user_id;
        token.email = (user as LoggedInUser).email;
        token.name = (user as LoggedInUser).first_name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          userId: token.id,
          email: token.email,
          firstName: token.name,
        };
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
});
