import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: "email", label: "email", placeholder: "abc@gmail.com" },
        password: {
          type: "password",
          label: "password",
          placeholder: "........",
        },
      },
      async authorize(credentials, request) {
        try {
          await connectDb();
          const email = credentials.email;
          const password = credentials.password as string;
          let user = await User.findOne({ email });
          if (!user) throw new Error("User does not exist");
          const isMatch = bcrypt.compare(password, user.password);
          if (!isMatch) throw new Error("Password does not match");
          return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          throw new Error(`error while authentication ${error}`);
          // return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider == "google") {
        await connectDb();
        const dbuser = await User.findOne({ email: user?.email });
        if (!dbuser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }
        user.id = dbuser._id;
        user.role = dbuser.role;
      }

      return true;
    },

    jwt({ token, user, trigger, session }) {
      // trigger ,session used to update token session on spot
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      if (trigger == "update") {
        token.role = session.url;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!; //.id returning id: { buffer: [Object] } sub=>Subject=>means the unique identifier of the user
        session.user.email = token.email!;
        session.user.name = token.name!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  },
  secret: process.env.AUTH_SECRET,
});
