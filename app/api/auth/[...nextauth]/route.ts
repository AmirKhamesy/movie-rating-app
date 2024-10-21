import prisma from "../../../../app/libs/prismadb";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SessionStrategy } from "next-auth";
import { Prisma } from "@prisma/client";

export const authOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            email: {
              mode: "insensitive",
              equals: credentials.email,
            },
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid: boolean = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id + "",
          email: user.email,
          name: user.name,
          // randomKey: "Hello world",
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      // console.log("Session Callback", { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          // randomKey: token.randomKey,
        },
      };
    },
    jwt: ({ token, user }) => {
      // console.log("JWT Callback", { token, user });
      if (user) {
        return {
          ...token,
          id: user.id,
          // randomKey: user.randomKey,
        };
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
