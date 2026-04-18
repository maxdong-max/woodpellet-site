"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { translations, Lang } from "@/lib/utils"
import { Save, Settings as SettingsIcon } from "lucide-react"

export default function SettingsPage() {
  const [lang, setLang] = useState<Lang>("en")
  const [contact, setContact] = useState({
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
    whatsapp_en: "",
    phone_en: "",
    email_en: "",
    address_en: "",
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem("adminLang") as Lang
    if (savedLang) setLang(savedLang)
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/admin/contact", { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setContact(data)
      }
    } catch (err) { console.error(err) }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(contact)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const t = translations[lang]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          {t.settings}
        </h1>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? t.loading : t.save}
        </Button>
      </div>

      {saved && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg">{t.success}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* English */}
        <Card>
          <CardHeader>
            <CardTitle>English</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">WhatsApp</label>
              <Input value={contact.whatsapp} onChange={(e) => setContact({...contact, whatsapp: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input value={contact.phone} onChange={(e) => setContact({...contact, phone: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input value={contact.address} onChange={(e) => setContact({...contact, address: e.target.value})} />
            </div>
          </CardContent>
        </Card>

        {/* 中文 */}
        <Card>
          <CardHeader>
            <CardTitle>中文</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">WhatsApp</label>
              <Input value={contact.whatsapp_en} onChange={(e) => setContact({...contact, whatsapp_en: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">电话</label>
              <Input value={contact.phone_en} onChange={(e) => setContact({...contact, phone_en: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">邮箱</label>
              <Input value={contact.email_en} onChange={(e) => setContact({...contact, email_en: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">地址</label>
              <Input value={contact.address_en} onChange={(e) => setContact({...contact, address_en: e.target.value})} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}