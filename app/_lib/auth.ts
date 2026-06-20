// auth.ts
import bcrypt from "bcryptjs";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "./data-services";
import { supabaseAdmin } from "./supabase";
import type { UserRole } from "../../types/next-auth";

async function resolveRoleByEmail(email?: string | null): Promise<UserRole> {
  if (!email) return "new";

  const user = await getUserByEmail(email);
  return (user?.role as UserRole) ?? "new";
}

const authConfig: NextAuthConfig = {
  providers: [
    Google,
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) return null;

        const user = await getUserByEmail(email);
        if (!user || !user.password_digest) return null;

        const isValid = await bcrypt.compare(password, user.password_digest);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user?.id) token.id = user.id;
      if (user?.email && !token.email) token.email = user.email;

      if (trigger === "signIn" || trigger === "update") {
        token.role = await resolveRoleByEmail(token.email);
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
        const role = await resolveRoleByEmail(email);

        if (role === "new" && !pathname.startsWith("/role")) {
          return Response.redirect(new URL("/role", request.nextUrl));
        }

        if (pathname.startsWith("/account") && role === "new") {
          return Response.redirect(new URL("/", request.nextUrl));
        }
      }

      return !!auth?.user;
    },

    signIn: async ({ user, account }) => {
      if (!user.email) return false;

      if (account?.provider === "google") {
        const existing = await getUserByEmail(user.email);
        if (!existing) {
          const { error } = await supabaseAdmin.from("users").insert({
            email: user.email,
            name: user.name ?? "",
            provider_id: account.providerAccountId,
            avatar_url: user.image,
          });
          if (error) console.error("Google user upsert error:", error);
        }
      }

      return true;
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
