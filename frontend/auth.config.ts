import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProfilePage = nextUrl.pathname.startsWith("/profile");

      if (isProfilePage) {
        if (isLoggedIn) return true;
        return false; // Redirect to home if not logged in and trying to access profile
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true; // Allow access to all other pages
    },
  },
  providers: [Credentials({})],
} satisfies NextAuthConfig;
