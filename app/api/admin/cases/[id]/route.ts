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
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded as { username: string }
  } catch {
    return null
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = authMiddleware(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { title, title_en, description, description_en, image, client_name, location, capacity, enabled, sort_order } = body
    const clientInfo = getClientInfo(req)

    db.prepare(`
      UPDATE cases 
      SET title = ?, title_en = ?, description = ?, description_en = ?, image = ?, client_name = ?, location = ?, capacity = ?, enabled = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, title_en, description, description_en, image, client_name, location, capacity, enabled ? 1 : 0, sort_order || 0, params.id)

    logOperation({
      username: user.username,
      action: "UPDATE",
      table_name: "cases",
      record_id: Number(params.id),
      details: `Updated case: ${title}`,
      ...clientInfo
    })

    return NextResponse.json({ message: "Case updated" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = authMiddleware(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const existing = db.prepare("SELECT * FROM cases WHERE id = ?").get(params.id) as any
    const clientInfo = getClientInfo(req)

    db.prepare("DELETE FROM cases WHERE id = ?").run(params.id)

    logOperation({
      username: user.username,
      action: "DELETE",
      table_name: "cases",
      record_id: Number(params.id),
      details: `Deleted case: ${existing?.title || 'unknown'}`,
      ...clientInfo
    })

    return NextResponse.json({ message: "Case deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}