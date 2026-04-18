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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = authMiddleware(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(params.id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error("Product GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = authMiddleware(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, name_en, description, description_en, image, category, specs, enabled, sort_order } = body
    const clientInfo = getClientInfo(req)

    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, name_en = ?, description = ?, description_en = ?, image = ?, category = ?, specs = ?, enabled = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    stmt.run(
      name, name_en, description, description_en, image, category, specs, enabled ? 1 : 0, sort_order || 0, params.id
    )

    logOperation({
      username: user.username,
      action: "UPDATE",
      table_name: "products",
      record_id: Number(params.id),
      details: `Updated product: ${name}`,
      ...clientInfo
    })

    return NextResponse.json({ message: "Product updated" })
  } catch (error) {
    console.error("Product PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = authMiddleware(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(params.id) as any
    const clientInfo = getClientInfo(req)

    db.prepare("DELETE FROM products WHERE id = ?").run(params.id)

    logOperation({
      username: user.username,
      action: "DELETE",
      table_name: "products",
      record_id: Number(params.id),
      details: `Deleted product: ${product?.name || 'unknown'}`,
      ...clientInfo
    })

    return NextResponse.json({ message: "Product deleted" })
  } catch (error) {
    console.error("Product DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}