"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  Newspaper, 
  HelpCircle, 
  Settings, 
  BarChart3,
  LogOut,
  Menu,
  X,
  Image,
  List,
  Megaphone
} from "lucide-react"
import { cn } from "@/lib/utils"
import { translations, Lang } from "@/lib/utils"

const menuItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { href: "/admin/products", icon: Package, key: "products" },
  { href: "/admin/cases", icon: FolderOpen, key: "cases" },
  { href: "/admin/news", icon: Newspaper, key: "news" },
  { href: "/admin/faq", icon: HelpCircle, key: "faq" },
  { href: "/admin/carousel", icon: Image, key: "carousel" },
  { href: "/admin/navigation", icon: List, key: "navigation" },
  { href: "/admin/exhibition", icon: Megaphone, key: "exhibition" },
  { href: "/admin/analytics", icon: BarChart3, key: "analytics" },
  { href: "/admin/settings", icon: Settings, key: "settings" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [lang, setLang] = useState<Lang>("en")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setLoading(false)
      return
    }
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
    const savedLang = localStorage.getItem("adminLang") as Lang
    if (savedLang) setLang(savedLang)
    setLoading(false)
  }, [router, pathname])

  // Don't show loading for login page
  if (loading && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  const t = translations[lang]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
        <span className="font-bold">Macreat Admin</span>
        <button onClick={handleLogout}><LogOut className="h-5 w-5" /></button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-blue-600">Macreat Admin</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon
              const isActive = pathname && (pathname === item.href || pathname.startsWith(item.href + "/"))
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{t[item.key as keyof typeof t] || item.key}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <select 
                value={lang} 
                onChange={e => {
                  setLang(e.target.value as Lang)
                  localStorage.setItem("adminLang", e.target.value)
                }}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full"
            >
              <LogOut className="h-4 w-4" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  )
}