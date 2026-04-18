import { NextRequest, NextResponse } from "next/server"
import jwt, { JwtPayload } from "jsonwebtoken"
import { db, logOperation } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "macreat-admin-secret-2024"

function getClientInfo(req: NextRequest) {
  return {
    ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    user_agent: req.headers.get("user-agent") || "unknown"
  }
}

function authMiddleware(req: NextRequest): { username: string } | null {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; return decoded as { username: string }
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const user = authMiddleware(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const cases = db.prepare("SELECT * FROM cases ORDER BY sort_order ASC, id DESC").all()
    return NextResponse.json(cases)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = authMiddleware(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { title, title_en, description, description_en, image, client_name, location, capacity, enabled, sort_order } = body
    const clientInfo = getClientInfo(req)

    const stmt = db.prepare(`
      INSERT INTO cases (title, title_en, description, description_en, image, client_name, location, capacity, enabled, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(title, title_en, description, description_en, image, client_name, location, capacity, enabled ? 1 : 0, sort_order || 0)

    logOperation({
      username: user.username,
      action: "CREATE",
      table_name: "cases",
      record_id: Number(result.lastInsertRowid),
      details: `Created case: ${title}`,
      ...clientInfo
    })

    return NextResponse.json({ id: result.lastInsertRowid, message: "Case created" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}