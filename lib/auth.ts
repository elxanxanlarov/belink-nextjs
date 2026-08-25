import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Adapter, AdapterUser } from "next-auth/adapters";

const baseAdapter = PrismaAdapter(prisma);

const customAdapter: Adapter = {
  ...baseAdapter,
  createUser: async (data: AdapterUser) => {
    const { id, ...userData } = data as any;

    const baseUsername = userData.email
      ? userData.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").toLowerCase()
      : "user";
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const username = `pending_${baseUsername}_${randomSuffix}`;

    const createdUser = await prisma.user.create({
      data: {
        ...userData,
        username,
      },
    });

    return createdUser as unknown as AdapterUser;
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: customAdapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;

        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { username: true, image: true, name: true },
        });

        if (dbUser) {
          token.username = dbUser.username || null;
          token.needsUsername = !dbUser.username || dbUser.username.startsWith("pending_");
          if (dbUser.image) token.picture = dbUser.image;
          if (dbUser.name) token.name = dbUser.name;
        }
      }

      if (trigger === "update" && session) {
        if (session.username) {
          token.username = session.username;
          token.needsUsername = false;
        }
        if (session.image) token.picture = session.image;
        if (session.name) token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
        session.user.image = (token.picture as string) || session.user.image;
        session.user.name = (token.name as string) || session.user.name;
        (session.user as any).username = token.username as string | null;
        (session.user as any).needsUsername = Boolean(token.needsUsername);
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});