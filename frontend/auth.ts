import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { ModestUser } from "@/app/models/User";
import { authConfig } from "./auth.config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { JWT } from "next-auth/jwt";

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

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          try {
            const res = await fetch("http://localhost:5000/test/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || "Log in failed");
            }

            const user: ModestUser = await res.json();
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as ModestUser).user_id;
        token.email = (user as ModestUser).email;
        token.name = (user as ModestUser).first_name;
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
  secret: process.env.SESSION_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
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

export async function logout() {
  // deleteSession();
  redirect("/login");
}
