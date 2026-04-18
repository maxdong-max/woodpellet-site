import { NextRequest, NextResponse } from "next/server"
import jwt, { JwtPayload } from "jsonwebtoken"
import { db, logOperation } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "macreat-admin-secret-2024"

function authMiddleware(req: NextRequest): { username: string } | null {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; return decoded as { username: string }
  } catch {
    return null
  }
}

function getClientInfo(req: NextRequest) {
  return {
    ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    user_agent: req.headers.get("user-agent") || "unknown"
  }
}

export async function GET(req: NextRequest) {
  const user = authMiddleware(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const products = db.prepare("SELECT * FROM products ORDER BY sort_order ASC, id DESC").all()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Products GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = authMiddleware(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, name_en, description, description_en, image, category, specs, enabled, sort_order } = body
    const clientInfo = getClientInfo(req)

    const stmt = db.prepare(`
      INSERT INTO products (name, name_en, description, description_en, image, category, specs, enabled, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      name, name_en, description, description_en, image, category, specs, enabled ? 1 : 0, sort_order || 0
    )

    logOperation({
      username: user.username,
      action: "CREATE",
      table_name: "products",
      record_id: Number(result.lastInsertRowid),
      details: `Created product: ${name}`,
      ...clientInfo
    })

    return NextResponse.json({ id: result.lastInsertRowid, message: "Product created" })
  } catch (error) {
    console.error("Products POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}