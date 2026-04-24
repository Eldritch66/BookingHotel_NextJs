import NextAuth, { NextAuthConfig, Session } from "next-auth";
import Google from "next-auth/providers/google";
import { getGuest, createGuest } from "./data-services";
import { NextRequest } from "next/server";

const authConfig: NextAuthConfig = {
  providers: [Google],
  callbacks: {
    authorized: ({ auth, request }) => {
      const { pathname } = request.nextUrl;

      if (auth?.user && pathname.startsWith("/login")) {
        return Response.redirect(new URL("/", request.nextUrl));
        z;
      }

      return !!auth?.user;
    },
    signIn: async ({ user, account, profile }) => {
      try {
        if (!user.email) return false;

        const existingGuest = await getGuest(user.email);

        if (!existingGuest) await createGuest({ email: user.email });

        return true;
      } catch {
        return false;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
