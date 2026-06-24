import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getGuest, createGuest, getGuestByEmail } from "./data-services";

const authConfig: NextAuthConfig = {
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const guest = await getGuestByEmail(email);
        if (!guest || !guest.password_hash) return null;

        const isValid = await bcrypt.compare(password, guest.password_hash);
        if (!isValid) return null;

        return {
          id: guest.guest_id,
          email: guest.email,
          name: guest.full_name || guest.email,
        };
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      const { pathname } = request.nextUrl;

      if (auth?.user && pathname.startsWith("/login")) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      return !!auth?.user;
    },
    signIn: async ({ user, account }) => {
      try {
        if (!user.email) return false;

        const existingGuest = await getGuest(user.email);

        if (!existingGuest) await createGuest({ email: user.email });

        return true;
      } catch {
        return false;
      }
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
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
