import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import * as bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  // Temporarily disable adapter for development
  // adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For development, return a mock user
        // In production, you would validate against your database
        if (credentials?.email === "test@example.com" && credentials?.password === "password") {
          return {
            id: "1",
            email: "test@example.com",
            name: "Test User",
          }
        }
        
        // Validate against database using direct SQLite connection to bypass Prisma engine errors
        try {
          const Database = (await import("better-sqlite3")).default
          const path = (await import("path")).default
          
          const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
          const db = new Database(dbPath)
          
          const normalizedEmail = credentials?.email?.toLowerCase()
          const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail) as any
          db.close()

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials?.password || "", user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
