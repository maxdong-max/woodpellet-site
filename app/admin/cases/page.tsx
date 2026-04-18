"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { translations, Lang } from "@/lib/utils"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Case {
  id: number
  title: string
  title_en: string
  description: string
  description_en: string
  image: string
  client_name: string
  location: string
  capacity: string
  enabled: number
  sort_order: number
}

const emptyCase = { title: "", title_en: "", description: "", description_en: "", image: "", client_name: "", location: "", capacity: "", enabled: true, sort_order: 0 }

export default function CasesPage() {
  const [lang, setLang] = useState<Lang>("en")
  const [cases, setCases] = useState<Case[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyCase)

  useEffect(() => {
    const savedLang = localStorage.getItem("adminLang") as Lang
    if (savedLang) setLang(savedLang)
    fetchCases()
  }, [])

  const fetchCases = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/admin/cases", { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setCases(await res.json())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openAdd = () => { setForm(emptyCase); setEditingId(null); setModalOpen(true) }
  const openEdit = (c: Case) => { setForm({ ...c, enabled: !!c.enabled }); setEditingId(c.id); setModalOpen(true) }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    const url = editingId ? `/api/admin/cases/${editingId}` : "/api/admin/cases"
    const method = editingId ? "PUT" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
    if (res.ok) { setModalOpen(false); fetchCases() }
  }

  const deleteCase = async (id: number) => {
    if (!confirm(lang === "en" ? "Delete?" : "确定删除？")) return
    const token = localStorage.getItem("adminToken")
    await fetch(`/api/admin/cases/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    fetchCases()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({ ...f, image: reader.result as string }))
    reader.readAsDataURL(file)
  }

  const t = translations[lang]
  const filtered = cases.filter(c => (c.title || "").toLowerCase().includes(search.toLowerCase()) || (c.title_en || "").toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t.cases}</h1>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />{t.add}</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardHeader className="pb-0"><CardTitle className="text-base">{t.total}: {cases.length}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>ID</TableHead><TableHead>{t.title}</TableHead><TableHead>{t.image}</TableHead><TableHead>Client</TableHead><TableHead>{t.status}</TableHead><TableHead>{t.actions}</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={6} className="text-center py-8">{t.loading}</TableCell></TableRow> : filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8">{t.noData}</TableCell></TableRow> : (
                filtered.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell><div className="font-medium">{lang === "zh" && c.title_en ? c.title_en : c.title}</div></TableCell>
                    <TableCell>{c.image && <img src={c.image} className="h-10 w-10 object-cover rounded" />}</TableCell>
                    <TableCell>{c.client_name}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded text-xs ${c.enabled ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{c.enabled ? t.active : t.inactive}</span></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteCase(c.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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
            <DialogTitle>{editingId ? (lang === "en" ? "Edit Case" : "编辑案例") : (lang === "en" ? "Add Case" : "添加案例")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-auto">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">{lang === "en" ? "Title (EN)" : "标题 (英)"}</label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><label className="text-sm font-medium">{lang === "en" ? "Title (ZH)" : "标题 (中)"}</label><Input value={form.title_en} onChange={e => setForm({...form, title_en: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-sm font-medium">Client</label><Input value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})} /></div>
              <div><label className="text-sm font-medium">Location</label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
              <div><label className="text-sm font-medium">Capacity</label><Input value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">{lang === "en" ? "Description (EN)" : "描述 (英)"}</label><textarea className="w-full border rounded p-2 min-h-[80px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div><label className="text-sm font-medium">{lang === "en" ? "Description (ZH)" : "描述 (中)"}</label><textarea className="w-full border rounded p-2 min-h-[80px]" value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})} /></div>
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