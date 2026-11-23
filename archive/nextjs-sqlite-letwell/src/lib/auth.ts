import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import type { AccountStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: AccountStatus;
};

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: Role;
    status: AccountStatus;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return null;
        }

        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        const sessionUser = user as SessionUser;
        token.id = user.id;
        token.email = sessionUser.email;
        token.name = sessionUser.name;
        token.role = sessionUser.role;
        token.status = sessionUser.status;
        return token;
      }

      if (token.id) {
        const fresh = await prisma.user.findUnique({
          where: { id: token.id },
          select: { id: true, email: true, name: true, role: true, status: true },
        });
        if (fresh) {
          token.id = fresh.id;
          token.email = fresh.email;
          token.name = fresh.name;
          token.role = fresh.role;
          token.status = fresh.status;
        }
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
          status: token.status,
        },
      };
    },
  },
  trustHost: true,
});
