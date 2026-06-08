// auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { getPenyewa, getPemilik } from "./data-services";
import type { UserRole } from "../../types/next-auth";

async function resolveRoleByEmail(email?: string | null): Promise<UserRole> {
  if (!email) return "new";

  const pemilik = await getPemilik(email);
  if (pemilik) return "pemilik";

  const penyewa = await getPenyewa(email);
  if (penyewa) return "penyewa";

  return "new";
}

const authConfig: NextAuthConfig = {
  providers: [Google],
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user?.id) token.id = user.id;
      if (user?.email && !token.email) token.email = user.email;

      if (trigger === "signIn" || trigger === "update") {
        token.role = await resolveRoleByEmail(token.email);
      }

      if (trigger === "update" && session?.role) {
        token.role = session.role as UserRole;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = (token.id ?? token.sub ?? "") as string;
      session.user.role = token.role as UserRole | undefined;
      return session;
    },

    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const email = auth?.user?.email ?? null;

      if (auth?.user && pathname.startsWith("/login")) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      if (email) {
        const [pemilik, penyewa] = await Promise.all([
          getPemilik(email),
          getPenyewa(email),
        ]);

        if (!pemilik && !penyewa && !pathname.startsWith("/role")) {
          return Response.redirect(new URL("/role", request.nextUrl));
        }

        if (pathname === "/account" && !penyewa) {
          return Response.redirect(new URL("/", request.nextUrl));
        }
      }

      return !!auth?.user;
    },

    signIn: async ({ user }) => {
      return !!user.email;
    },
  },

  pages: { signIn: "/login" },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
