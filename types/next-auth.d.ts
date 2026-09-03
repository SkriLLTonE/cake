import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    };
  }
}

export const authConfig = {
  providers: [],
} satisfies NextAuthConfig;
