import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const normalizeEmail = (value?: string | null) =>
  value?.trim().toLowerCase();

const bootstrapUsers = [
  {
    role: "PSYCHOLOGIST" as const,
    name: "Dr. Ahmet Yılmaz",
    email: normalizeEmail(process.env.PSYCHOLOGIST_EMAIL) || "ahmet@example.com",
    password: process.env.PSYCHOLOGIST_PASSWORD || "password123",
  },
  {
    role: "PATIENT" as const,
    name: "John Doe",
    email: normalizeEmail(process.env.PATIENT_EMAIL) || "john@example.com",
    password: process.env.PATIENT_PASSWORD || "password123",
  },
  {
    role: "ADMIN" as const,
    name: "Admin User",
    email: normalizeEmail(process.env.ADMIN_EMAIL) || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "password123",
  },
];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const email = credentials.email.trim().toLowerCase();

        const bootstrapMatch = bootstrapUsers.find(
          (user) => user.email === email
        );

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          if (user.password) {
            const isCorrectPassword = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isCorrectPassword) {
              return user;
            }
          }

          if (
            bootstrapMatch &&
            credentials.password === bootstrapMatch.password
          ) {
            const hashedPassword = await bcrypt.hash(bootstrapMatch.password, 12);

            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: { password: hashedPassword, role: bootstrapMatch.role },
            });

            return updatedUser;
          }

          throw new Error("Invalid credentials");
        }

        if (
          bootstrapMatch &&
          credentials.password === bootstrapMatch.password
        ) {
          const hashedPassword = await bcrypt.hash(bootstrapMatch.password, 12);

          const createdUser = await prisma.user.create({
            data: {
              name: bootstrapMatch.name,
              email,
              password: hashedPassword,
              role: bootstrapMatch.role,
              patient:
                bootstrapMatch.role === "PATIENT" ? { create: {} } : undefined,
              admin:
                bootstrapMatch.role === "ADMIN" ? { create: {} } : undefined,
              psychologist:
                bootstrapMatch.role === "PSYCHOLOGIST"
                  ? {
                      create: {
                        credentials: "PhD, Clinical Psychologist",
                        licenseNumber: `LICENSE-${email}`,
                        experience: 10,
                        bio: "Licensed clinical psychologist with experience in evidence-based care.",
                        specializations: ["Anxiety Disorders", "Depression"],
                        price60: 45000,
                        price90: 65000,
                        status: "APPROVED",
                        approvedAt: new Date(),
                      },
                    }
                  : undefined,
            },
          });

          return createdUser;
        }

        throw new Error("Invalid credentials");
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
