import { NextRequest, NextResponse } from "next/server"

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "macreat2024"  // Plain text for Vercel

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      )
    }

    // Simple auth
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Simple token (not JWT to avoid dependencies)
      const token = Buffer.from(JSON.stringify({ username, role: "admin", exp: Date.now() + 7*24*60*60*1000 })).toString("base64")
      return NextResponse.json({
        token,
        user: { id: 1, username: ADMIN_USERNAME, role: "admin" }
      })
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}