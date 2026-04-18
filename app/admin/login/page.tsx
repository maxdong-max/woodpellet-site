"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { translations, Lang } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>("en")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const t = translations[lang]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("adminToken", data.token)
        localStorage.setItem("adminLang", lang)
        router.push("/admin/dashboard")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Macreat Admin</CardTitle>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as Lang)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="en">EN</option>
              <option value="zh">中文</option>
            </select>
          </div>
          <CardDescription>
            {lang === "en" ? "Enter your credentials to access admin panel" : "输入凭据访问后台"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">{t.login === "登录" ? "用户名" : "Username"}</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{lang === "en" ? "Password" : "密码"}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.loading : t.login}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}