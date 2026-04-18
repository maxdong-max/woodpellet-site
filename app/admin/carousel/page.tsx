"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { translations, Lang } from "@/lib/utils"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Carousel {
  id: number
  title: string
  image: string
  link: string
  enabled: number
  sort_order: number
}

const emptyCarousel = { title: "", image: "", link: "", enabled: true, sort_order: 0 }

export default function CarouselPage() {
  const [lang, setLang] = useState<Lang>("en")
  const [items, setItems] = useState<Carousel[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyCarousel)

  useEffect(() => {
    const savedLang = localStorage.getItem("adminLang") as Lang
    if (savedLang) setLang(savedLang)
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/admin/carousel", { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setItems(await res.json())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openAdd = () => { setForm(emptyCarousel); setEditingId(null); setModalOpen(true) }
  const openEdit = (c: Carousel) => { setForm({ ...c, enabled: !!c.enabled }); setEditingId(c.id); setModalOpen(true) }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    const url = editingId ? `/api/admin/carousel/${editingId}` : "/api/admin/carousel"
    const method = editingId ? "PUT" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
    if (res.ok) { setModalOpen(false); fetchItems() }
  }

  const deleteItem = async (id: number) => {
    if (!confirm(lang === "en" ? "Delete?" : "确定删除？")) return
    const token = localStorage.getItem("adminToken")
    await fetch(`/api/admin/carousel/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    fetchItems()
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
        <h1 className="text-2xl font-bold">{lang === "en" ? "Carousel" : "轮播图"}</h1>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />{t.add}</Button>
      </div>

      <Card>
        <CardHeader className="pb-0"><CardTitle className="text-base">{t.total}: {items.length}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>ID</TableHead><TableHead>Image</TableHead><TableHead>Title</TableHead><TableHead>Link</TableHead><TableHead>{t.status}</TableHead><TableHead>{t.actions}</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={6} className="text-center py-8">{t.loading}</TableCell></TableRow> : items.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8">{t.noData}</TableCell></TableRow> : (
                items.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.image && <img src={c.image} className="h-12 w-20 object-cover rounded" />}</TableCell>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.link || "-"}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded text-xs ${c.enabled ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{c.enabled ? t.active : t.inactive}</span></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem(c.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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
            <DialogTitle>{editingId ? (lang === "en" ? "Edit" : "编辑") : (lang === "en" ? "Add" : "添加")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">
            <div><label className="text-sm font-medium">Title</label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
            <div><label className="text-sm font-medium">Link URL</label><Input value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="https://" /></div>
            <div><label className="text-sm font-medium">Image</label><div className="flex gap-2 items-center"><Input type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />{form.image && <img src={form.image} className="h-12 w-20 object-cover rounded" />}</div></div>
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