"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { translations, Lang } from "@/lib/utils"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface NavItem {
  id: number
  text: string
  href: string
  hasDropdown: number
  lang: string
  active: number
  sort_order: number
}

const emptyNav = { text: "", href: "", hasDropdown: false, lang: "en", active: true, sort_order: 0 }

export default function NavigationPage() {
  const [lang, setLang] = useState<Lang>("en")
  const [items, setItems] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyNav)

  useEffect(() => {
    const savedLang = localStorage.getItem("adminLang") as Lang
    if (savedLang) setLang(savedLang)
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/admin/navigation", { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setItems(await res.json())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openAdd = () => { setForm(emptyNav); setEditingId(null); setModalOpen(true) }
  const openEdit = (n: NavItem) => { setForm({ ...n, hasDropdown: !!n.hasDropdown, active: !!n.active }); setEditingId(n.id); setModalOpen(true) }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    const url = editingId ? `/api/admin/navigation/${editingId}` : "/api/admin/navigation"
    const method = editingId ? "PUT" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
    if (res.ok) { setModalOpen(false); fetchItems() }
  }

  const deleteItem = async (id: number) => {
    if (!confirm(lang === "en" ? "Delete?" : "确定删除？")) return
    const token = localStorage.getItem("adminToken")
    await fetch(`/api/admin/navigation/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    fetchItems()
  }

  const t = translations[lang]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{lang === "en" ? "Navigation" : "导航管理"}</h1>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />{t.add}</Button>
      </div>

      <Card>
        <CardHeader className="pb-0"><CardTitle className="text-base">{t.total}: {items.length}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>ID</TableHead><TableHead>Text</TableHead><TableHead>URL</TableHead><TableHead>Dropdown</TableHead><TableHead>{t.status}</TableHead><TableHead>{t.actions}</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={6} className="text-center py-8">{t.loading}</TableCell></TableRow> : items.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8">{t.noData}</TableCell></TableRow> : (
                items.map(n => (
                  <TableRow key={n.id}>
                    <TableCell>{n.id}</TableCell>
                    <TableCell className="font-medium">{n.text}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{n.href}</TableCell>
                    <TableCell>{n.hasDropdown ? "✓" : "-"}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded text-xs ${n.active ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{n.active ? t.active : t.inactive}</span></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(n)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem(n.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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
            <div><label className="text-sm font-medium">Text</label><Input value={form.text} onChange={e => setForm({...form, text: e.target.value})} /></div>
            <div><label className="text-sm font-medium">URL</label><Input value={form.href} onChange={e => setForm({...form, href: e.target.value})} placeholder="/" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Language</label><select className="w-full border rounded p-2" value={form.lang} onChange={e => setForm({...form, lang: e.target.value})}><option value="en">English</option><option value="zh">中文</option></select></div>
              <div><label className="text-sm font-medium">{lang === "en" ? "Sort Order" : "排序"}</label><Input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 0})} /></div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.hasDropdown} onChange={e => setForm({...form, hasDropdown: e.target.checked})} /><span className="text-sm">Dropdown</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} /><span className="text-sm">{lang === "en" ? "Active" : "启用"}</span></label>
            </div>
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