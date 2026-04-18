"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { translations, Lang } from "@/lib/utils"
import { Package, FolderOpen, Newspaper, HelpCircle, Eye, TrendingUp, Calendar } from "lucide-react"

export default function DashboardPage() {
  const [lang, setLang] = useState<Lang>("en")
  const [stats, setStats] = useState({
    products: 0, cases: 0, news: 0, faq: 0,
    viewsToday: 0, viewsWeek: 0, viewsMonth: 0,
    topPages: [] as { path: string, count: number }[]
  })

  useEffect(() => {
    const savedLang = localStorage.getItem("adminLang") as Lang
    if (savedLang) setLang(savedLang)
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setStats(prev => ({ ...prev, ...data }))
      }
    } catch (err) { console.error(err) }
  }

  const t = translations[lang]

  // Simple bar chart using CSS
  const maxViews = Math.max(stats.viewsWeek, 1)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.dashboard}</h1>

      {/* Content Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="text-white/80 text-sm">{t.products}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 opacity-80" />
              <span className="text-3xl font-bold">{stats.products}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="text-white/80 text-sm">{t.cases}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <FolderOpen className="h-8 w-8 opacity-80" />
              <span className="text-3xl font-bold">{stats.cases}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="text-white/80 text-sm">{t.news}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Newspaper className="h-8 w-8 opacity-80" />
              <span className="text-3xl font-bold">{stats.news}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="text-white/80 text-sm">{t.faq}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <HelpCircle className="h-8 w-8 opacity-80" />
              <span className="text-3xl font-bold">{stats.faq}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t.today} {t.views}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.viewsToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t.thisWeek} {t.views}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.viewsWeek}</div>
            {/* Bar */}
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(stats.viewsWeek / maxViews) * 100}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t.thisMonth} {t.views}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.viewsMonth}</div>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(stats.viewsMonth / (maxViews * 4)) * 100}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <a href="/admin/products" className="p-4 bg-white rounded-lg border hover:border-blue-500 transition-colors text-center">
          <Package className="h-6 w-6 mx-auto mb-2 text-blue-500" />
          <div className="text-sm font-medium">{lang === "en" ? "Manage Products" : "管理产品"}</div>
        </a>
        <a href="/admin/cases" className="p-4 bg-white rounded-lg border hover:border-green-500 transition-colors text-center">
          <FolderOpen className="h-6 w-6 mx-auto mb-2 text-green-500" />
          <div className="text-sm font-medium">{lang === "en" ? "Manage Cases" : "管理案例"}</div>
        </a>
        <a href="/admin/carousel" className="p-4 bg-white rounded-lg border hover:border-purple-500 transition-colors text-center">
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-500" />
          <div className="text-sm font-medium">{lang === "en" ? "Carousel" : "轮播图"}</div>
        </a>
        <a href="/admin/analytics" className="p-4 bg-white rounded-lg border hover:border-orange-500 transition-colors text-center">
          <Eye className="h-6 w-6 mx-auto mb-2 text-orange-500" />
          <div className="text-sm font-medium">{lang === "en" ? "Analytics" : "数据分析"}</div>
        </a>
      </div>
    </div>
  )
}