// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

export type UserRole = "penyewa" | "pemilik" | "admin" | "new";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      role?: UserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
