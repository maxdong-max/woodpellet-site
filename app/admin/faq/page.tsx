"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { translations, Lang } from "@/lib/utils"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Faq {
  id: number
  question: string
  question_en: string
  answer: string
  answer_en: string
  enabled: number
  sort_order: number
}

const emptyFaq = { question: "", question_en: "", answer: "", answer_en: "", enabled: true, sort_order: 0 }

export default function FaqPage() {
  const [lang, setLang] = useState<Lang>("en")
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyFaq)

  useEffect(() => {
    const savedLang = localStorage.getItem("adminLang") as Lang
    if (savedLang) setLang(savedLang)
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/admin/faq", { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setFaqs(await res.json())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openAdd = () => { setForm(emptyFaq); setEditingId(null); setModalOpen(true) }
  const openEdit = (f: Faq) => { setForm({ ...f, enabled: !!f.enabled }); setEditingId(f.id); setModalOpen(true) }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    const url = editingId ? `/api/admin/faq/${editingId}` : "/api/admin/faq"
    const method = editingId ? "PUT" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
    if (res.ok) { setModalOpen(false); fetchFaqs() }
  }

  const deleteFaq = async (id: number) => {
    if (!confirm(lang === "en" ? "Delete?" : "确定删除？")) return
    const token = localStorage.getItem("adminToken")
    await fetch(`/api/admin/faq/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    fetchFaqs()
  }

  const t = translations[lang]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t.faq}</h1>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />{t.add}</Button>
      </div>

      <Card>
        <CardHeader className="pb-0"><CardTitle className="text-base">{t.total}: {faqs.length}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>ID</TableHead><TableHead>Question</TableHead><TableHead>Answer</TableHead><TableHead>{t.status}</TableHead><TableHead>{t.actions}</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={5} className="text-center py-8">{t.loading}</TableCell></TableRow> : faqs.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8">{t.noData}</TableCell></TableRow> : (
                faqs.map(f => (
                  <TableRow key={f.id}>
                    <TableCell>{f.id}</TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{lang === "zh" && f.question_en ? f.question_en : f.question}</TableCell>
                    <TableCell className="max-w-xs truncate">{lang === "zh" && f.answer_en ? f.answer_en : f.answer}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded text-xs ${f.enabled ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{f.enabled ? t.active : t.inactive}</span></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteFaq(f.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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
            <DialogTitle>{editingId ? (lang === "en" ? "Edit FAQ" : "编辑问答") : (lang === "en" ? "Add FAQ" : "添加问答")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">{lang === "en" ? "Question (EN)" : "问题 (英)"}</label><Input value={form.question} onChange={e => setForm({...form, question: e.target.value})} /></div>
              <div><label className="text-sm font-medium">{lang === "en" ? "Question (ZH)" : "问题 (中)"}</label><Input value={form.question_en} onChange={e => setForm({...form, question_en: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">{lang === "en" ? "Answer (EN)" : "答案 (英)"}</label><textarea className="w-full border rounded p-2 min-h-[100px]" value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} /></div>
              <div><label className="text-sm font-medium">{lang === "en" ? "Answer (ZH)" : "答案 (中)"}</label><textarea className="w-full border rounded p-2 min-h-[100px]" value={form.answer_en} onChange={e => setForm({...form, answer_en: e.target.value})} /></div>
            </div>
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