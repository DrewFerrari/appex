import { NextResponse } from "next/server"
import * as bcrypt from "bcryptjs"
import Database from "better-sqlite3"
import path from "path"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  let db;
  try {
    const body = await request.json()
    const { email, password, name, businessType } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase()
    const hashedPassword = await bcrypt.hash(password, 10)

    // Connect to SQLite directly
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    db = new Database(dbPath)

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail)
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Create user and profile in a transaction
    const createUser = db.prepare(`
      INSERT INTO users (id, email, password, name, business_type, created_at, updated_at, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const createProfile = db.prepare(`
      INSERT INTO user_profiles (id, user_id, business_type, experience_level, learning_goals, time_commitment, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const userId = Math.random().toString(36).substring(2, 15)
    const profileId = Math.random().toString(36).substring(2, 15)
    const now = new Date().toISOString()

    const transaction = db.transaction(() => {
      createUser.run(userId, normalizedEmail, hashedPassword, name, businessType || null, now, now, 'USER')
      createProfile.run(profileId, userId, businessType || 'RETAIL', 'BEGINNER', '["basic_ops"]', '3-5', now, now)
    })

    transaction()

    return NextResponse.json(
      { message: "User registered successfully", userId },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to register user", details: error.message },
      { status: 500 }
    )
  } finally {
    if (db) db.close()
  }
}
