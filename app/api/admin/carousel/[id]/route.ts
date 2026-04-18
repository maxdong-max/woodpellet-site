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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = authMiddleware(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  db.prepare("UPDATE carousel SET title=?, title_en=?, image=?, link=?, enabled=?, sort_order=? WHERE id=?").run(body.title, body.title_en, body.image, body.link, body.enabled ? 1 : 0, body.sort_order || 0, params.id)
  logOperation({ username: user.username, action: "UPDATE", table_name: "carousel", record_id: Number(params.id), details: `Updated carousel`, ...getClientInfo(req) })
  return NextResponse.json({ message: "Carousel updated" })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = authMiddleware(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  db.prepare("DELETE FROM carousel WHERE id=?").run(params.id)
  logOperation({ username: user.username, action: "DELETE", table_name: "carousel", record_id: Number(params.id), details: `Deleted carousel`, ...getClientInfo(req) })
  return NextResponse.json({ message: "Carousel deleted" })
}