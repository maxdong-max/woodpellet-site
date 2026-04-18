import { NextRequest, NextResponse } from "next/server"
import jwt, { JwtPayload } from "jsonwebtoken"
import { db } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "macreat-admin-secret-2024"

function authMiddleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null
  try { const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; return decoded as { username: string } } catch { return null }
}

export async function GET(req: NextRequest) {
  const user = authMiddleware(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
  try {
    const rows = db.prepare("SELECT * FROM contact_info").all() as any[]
    const contact: any = {}
    rows.forEach(row => {
      contact[row.key] = row.value
      contact[row.key + "_en"] = row.value_en
    })
    return NextResponse.json(contact)
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }) }
}

export async function PUT(req: NextRequest) {
  const user = authMiddleware(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
  try {
    const body = await req.json()
    const fields = ["whatsapp", "phone", "email", "address"]
    
    fields.forEach(key => {
      const value = body[key] || ""
      const value_en = body[key + "_en"] || ""
      
      db.prepare(`
        INSERT INTO contact_info (key, value, value_en) VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = ?, value_en = ?, updated_at = CURRENT_TIMESTAMP
      `).run(key, value, value_en, value, value_en)
    })
    
    return NextResponse.json({ message: "Saved" })
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }) }
}