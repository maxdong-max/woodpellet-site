import { NextRequest, NextResponse } from "next/server"
import jwt, { JwtPayload } from "jsonwebtoken"
import { db } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "macreat-admin-secret-2024"

function authMiddleware(req: NextRequest) {
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
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const products = db.prepare("SELECT COUNT(*) as count FROM products").get() as any
    const cases = db.prepare("SELECT COUNT(*) as count FROM cases").get() as any
    const news = db.prepare("SELECT COUNT(*) as count FROM news").get() as any
    const faq = db.prepare("SELECT COUNT(*) as count FROM faq").get() as any

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString()

    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekStr = weekAgo.toISOString()

    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    const monthStr = monthAgo.toISOString()

    const viewsToday = db.prepare(
      "SELECT COUNT(*) as count FROM analytics WHERE created_at >= ?"
    ).get(todayStr) as any

    const viewsWeek = db.prepare(
      "SELECT COUNT(*) as count FROM analytics WHERE created_at >= ?"
    ).get(weekStr) as any

    const viewsMonth = db.prepare(
      "SELECT COUNT(*) as count FROM analytics WHERE created_at >= ?"
    ).get(monthStr) as any

    return NextResponse.json({
      products: products?.count || 0,
      cases: cases?.count || 0,
      news: news?.count || 0,
      faq: faq?.count || 0,
      viewsToday: viewsToday?.count || 0,
      viewsWeek: viewsWeek?.count || 0,
      viewsMonth: viewsMonth?.count || 0,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}