import { NextRequest, NextResponse } from "next/server"
import jwt, { JwtPayload } from "jsonwebtoken"
import { db, logOperation } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "macreat-admin-secret-2024"
function getClientInfo(req: NextRequest) { return { ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown", user_agent: req.headers.get("user-agent") || "unknown" } }
function authMiddleware(req: NextRequest): { username: string } | null { 
  const token = req.headers.get("authorization")?.replace("Bearer ", ""); 
  if (!token) return null; 
  try { 
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded as { username: string }
  } catch { 
    return null 
  } 
}

export async function GET(req: NextRequest) { return NextResponse.json(db.prepare("SELECT * FROM carousel ORDER BY sort_order ASC, id DESC").all()) }

export async function POST(req: NextRequest) {
  const user = authMiddleware(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const result = db.prepare("INSERT INTO carousel (title, title_en, image, link, enabled, sort_order) VALUES (?, ?, ?, ?, ?, ?)").run(body.title, body.title_en, body.image, body.link, body.enabled ? 1 : 0, body.sort_order || 0)
  logOperation({ username: user.username, action: "CREATE", table_name: "carousel", record_id: Number(result.lastInsertRowid), details: `Created carousel: ${body.title}`, ...getClientInfo(req) })
  return NextResponse.json({ id: result.lastInsertRowid })
}