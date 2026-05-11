import { NextResponse } from "next/server"
import Database from "better-sqlite3"
import path from "path"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  let db;
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    console.log("Connecting to DB at:", dbPath)
    console.log("CWD:", process.cwd())
    db = new Database(dbPath)
    
    const users = db.prepare('SELECT id, email, name, role FROM users').all()
    
    return NextResponse.json({ 
      status: "success", 
      message: "Direct SQLite connection established",
      count: users.length,
      users 
    })
  } catch (error: any) {
    console.error("Diagnostic error:", error)
    return NextResponse.json({ 
      status: "error", 
      error: error.message 
    }, { status: 500 })
  } finally {
    if (db) db.close()
  }
}
