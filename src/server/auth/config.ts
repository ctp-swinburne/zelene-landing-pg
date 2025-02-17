import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { type User } from "next-auth"; // Add this import
import bcrypt from "bcryptjs";
import { loginSchema } from "~/lib/validations/login";
import { db } from "~/server/db";
import { Adapter } from "next-auth/adapters";

declare module "next-auth" {
  interface User {
    username?: string;
    role: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      username?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    role: string;
    username?: string;
  }
}

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request): Promise<User | null> {
        try {
          console.log("Credentials received:", credentials);
          const result = loginSchema.safeParse(credentials);
          if (!result.success) {
            console.log("Validation failed:", result.error);
            return null;
          }

          const { username, password } = result.data;
          const user = await db.user.findUnique({
            where: { username },
          });

          console.log("User found:", user);
          if (!user?.password) {
            console.log("No user or password found");
            return null;
          }

          const isValid = await bcrypt.compare(password, user.password);
          console.log("Password valid:", isValid);
          if (!isValid) {
            return null;
          }

          // Return type that matches User interface
          return {
            id: user.id,
            name: user.name ?? null,
            email: user.email ?? null,
            username: user.username ?? undefined, // Changed from null to undefined
            image: user.image ?? null,
            role: user.role ?? "MEMBER",
          } as User; // Explicitly cast to User type
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    DiscordProvider,
    GoogleProvider,
    GithubProvider,
  ],
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        role: token.role as string,
        username: token.username as string,
      },
    }),
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
} satisfies NextAuthConfig;
