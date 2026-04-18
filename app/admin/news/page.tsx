"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { translations, Lang } from "@/lib/utils"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface News {
  id: number
  title: string
  title_en: string
  content: string
  content_en: string
  image: string
  category: string
  enabled: number
  sort_order: number
}

const emptyNews = { title: "", title_en: "", content: "", content_en: "", image: "", category: "", enabled: true, sort_order: 0 }

export default function NewsPage() {
  const [lang, setLang] = useState<Lang>("en")
  const [news, setNews] = useState<News[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyNews)

  useEffect(() => {
    const savedLang = localStorage.getItem("adminLang") as Lang
    if (savedLang) setLang(savedLang)
    fetchNews()
  }, [])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/admin/news", { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setNews(await res.json())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openAdd = () => { setForm(emptyNews); setEditingId(null); setModalOpen(true) }
  const openEdit = (n: News) => { setForm({ ...n, enabled: !!n.enabled }); setEditingId(n.id); setModalOpen(true) }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    const url = editingId ? `/api/admin/news/${editingId}` : "/api/admin/news"
    const method = editingId ? "PUT" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
    if (res.ok) { setModalOpen(false); fetchNews() }
  }

  const deleteNews = async (id: number) => {
    if (!confirm(lang === "en" ? "Delete?" : "确定删除？")) return
    const token = localStorage.getItem("adminToken")
    await fetch(`/api/admin/news/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    fetchNews()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({ ...f, image: reader.result as string }))
    reader.readAsDataURL(file)
  }

  const t = translations[lang]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t.news}</h1>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />{t.add}</Button>
      </div>

      <Card>
        <CardHeader className="pb-0"><CardTitle className="text-base">{t.total}: {news.length}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>ID</TableHead><TableHead>{t.title}</TableHead><TableHead>{t.image}</TableHead><TableHead>{t.status}</TableHead><TableHead>{t.actions}</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={5} className="text-center py-8">{t.loading}</TableCell></TableRow> : news.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8">{t.noData}</TableCell></TableRow> : (
                news.map(n => (
                  <TableRow key={n.id}>
                    <TableCell>{n.id}</TableCell>
                    <TableCell className="font-medium">{lang === "zh" && n.title_en ? n.title_en : n.title}</TableCell>
                    <TableCell>{n.image && <img src={n.image} className="h-10 w-10 object-cover rounded" />}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded text-xs ${n.enabled ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{n.enabled ? t.active : t.inactive}</span></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(n)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteNews(n.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? (lang === "en" ? "Edit News" : "编辑新闻") : (lang === "en" ? "Add News" : "添加新闻")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-auto">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">{lang === "en" ? "Title (EN)" : "标题 (英)"}</label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><label className="text-sm font-medium">{lang === "en" ? "Title (ZH)" : "标题 (中)"}</label><Input value={form.title_en} onChange={e => setForm({...form, title_en: e.target.value})} /></div>
            </div>
            <div><label className="text-sm font-medium">{lang === "en" ? "Category" : "分类"}</label><select className="w-full border rounded p-2" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option value="">{lang === "en" ? "Select category" : "选择分类"}</option><option value="exhibition">{lang === "en" ? "Exhibition News" : "展会新闻"}</option><option value="company">{lang === "en" ? "Company News" : "公司新闻"}</option></select></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">{lang === "en" ? "Content (EN)" : "内容 (英)"}</label><textarea className="w-full border rounded p-2 min-h-[120px]" value={form.content} onChange={e => setForm({...form, content: e.target.value})} /></div>
              <div><label className="text-sm font-medium">{lang === "en" ? "Content (ZH)" : "内容 (中)"}</label><textarea className="w-full border rounded p-2 min-h-[120px]" value={form.content_en} onChange={e => setForm({...form, content_en: e.target.value})} /></div>
            </div>
            <div><label className="text-sm font-medium">Image</label><div className="flex gap-2 items-center"><Input type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />{form.image && <img src={form.image} className="h-10 w-10 object-cover rounded" />}</div></div>
            <div><label className="text-sm font-medium">{lang === "en" ? "Sort Order" : "排序"}</label><Input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 0})} /></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={form.enabled} onChange={e => setForm({...form, enabled: e.target.checked})} /><span className="text-sm">{lang === "en" ? "Enabled" : "启用"}</span></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>{lang === "en" ? "Cancel" : "取消"}</Button>
            <Button onClick={handleSave}>{lang === "en" ? "Save" : "保存"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}