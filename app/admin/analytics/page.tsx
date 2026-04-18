"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { translations, Lang } from "@/lib/utils"
import { BarChart3, Download, Globe, TrendingUp, Monitor, Smartphone, Tablet, Globe2, Calendar, PieChart } from "lucide-react"
import * as XLSX from "xlsx"

interface LogEntry {
  path: string; ip: string; created_at: string; stayDuration: number
  source: string; medium: string; browser: string; os: string; device: string
  language: string; timezone: string; searchEngine: string
}

interface Summary {
  totalVisits: number; totalPageViews: number; uniqueIps: number; avgStayDuration: number
  clickStats: Record<string, number>; formSubmits: number; topCountries: Record<string, number>
  trafficSources: Record<string, number>; trafficMediums: Record<string, number>; searchEngines: Record<string, number>
  bounceRate: number; browsers: Record<string, number>; operatingSystems: Record<string, number>
  devices: Record<string, number>; languages: Record<string, number>; timezones: Record<string, number>
  topPages: { path: string; count: number }[]
}

export default function AnalyticsPage() {
  const [lang, setLang] = useState<Lang>("en")
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState("7")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const savedLang = localStorage.getItem("adminLang") as Lang
    if (savedLang) setLang(savedLang)
    fetchData()
  }, [dateRange])

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch(`/api/admin/analytics?days=${dateRange}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs || [])
        setSummary(data.summary)
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(logs.map(l => ({
      Page: l.path, Time: l.created_at, IP: l.ip, Duration: l.stayDuration + 's',
      Source: l.source || 'direct', Browser: l.browser, OS: l.os, Device: l.device
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Analytics")
    XLSX.writeFile(wb, `analytics_${dateRange}days.xlsx`)
  }

  const t = translations[lang]
  const isZh = lang === "zh"

  // 计算统计数据
  const getTopItems = (obj: Record<string, number>, limit = 5) => 
    Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, limit)
  
  const maxVal = (obj: Record<string, number>) => Math.max(...Object.values(obj), 1)

  const tabs = [
    { id: "overview", label: isZh ? "概览" : "Overview", icon: PieChart },
    { id: "traffic", label: isZh ? "流量来源" : "Traffic", icon: Globe },
    { id: "devices", label: isZh ? "设备" : "Devices", icon: Monitor },
    { id: "geo", label: isZh ? "地理位置" : "Geography", icon: Globe2 },
    { id: "pages", label: isZh ? "页面" : "Pages", icon: BarChart3 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          {t.analytics}
        </h1>
        <div className="flex gap-2 items-center">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} 
            className="border rounded-lg px-3 py-2 bg-white shadow-sm">
            <option value="7">{isZh ? "最近7天" : "Last 7 Days"}</option>
            <option value="14">{isZh ? "最近14天" : "Last 14 Days"}</option>
            <option value="30">{isZh ? "最近30天" : "Last 30 Days"}</option>
            <option value="90">{isZh ? "最近90天" : "Last 90 Days"}</option>
          </select>
          <Button variant="outline" onClick={exportToExcel} className="gap-2">
            <Download className="h-4 w-4" />
            {isZh ? "导出" : "Export"}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-2 border-b">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">{t.loading}</div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === "overview" && summary && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2"><CardTitle className="text-white/80 text-sm">{isZh ? "总访问" : "Total Visits"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{summary.totalVisits}</div>
                  <div className="text-white/70 text-sm">{summary.totalPageViews} {isZh ? "页面浏览" : "page views"}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2"><CardTitle className="text-white/80 text-sm">{isZh ? "独立访客" : "Unique Visitors"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{summary.uniqueIps}</div>
                  <div className="text-white/70 text-sm">IP</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-2"><CardTitle className="text-white/80 text-sm">{isZh ? "平均停留" : "Avg Stay"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{summary.avgStayDuration}s</div>
                  <div className="text-white/70 text-sm">{isZh ? "平均" : "average"}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="pb-2"><CardTitle className="text-white/80 text-sm">{isZh ? "跳出率" : "Bounce Rate"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{summary.bounceRate}%</div>
                  <div className="text-white/70 text-sm">{isZh ? "单页访问" : "single page"}</div>
                </CardContent>
              </Card>

              {/* Click Stats */}
              <Card className="col-span-2 lg:col-span-4">
                <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />{isZh ? "点击统计" : "Click Statistics"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {Object.entries(summary.clickStats).map(([key, val]) => (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-600">{val}</div>
                        <div className="text-xs text-gray-500 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Traffic Tab */}
          {activeTab === "traffic" && summary && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-4 w-4" />{isZh ? "流量来源" : "Traffic Sources"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTopItems(summary.trafficSources).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-3">
                        <span className="w-24 text-sm capitalize">{k}</span>
                        <div className="flex-1 h-4 bg-gray-100 rounded">
                          <div className="h-full bg-blue-500 rounded" style={{ width: `${(v / maxVal(summary.trafficSources)) * 100}%` }} />
                        </div>
                        <span className="w-12 text-sm font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-4 w-4" />{isZh ? "媒介类型" : "Traffic Mediums"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTopItems(summary.trafficMediums).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-3">
                        <span className="w-24 text-sm capitalize">{k}</span>
                        <div className="flex-1 h-4 bg-gray-100 rounded">
                          <div className="h-full bg-green-500 rounded" style={{ width: `${(v / maxVal(summary.trafficMediums)) * 100}%` }} />
                        </div>
                        <span className="w-12 text-sm font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-4 w-4" />{isZh ? "搜索引擎" : "Search Engines"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTopItems(summary.searchEngines).length === 0 ? (
                      <p className="text-gray-400 text-center">{t.noData}</p>
                    ) : (
                      getTopItems(summary.searchEngines).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-3">
                          <span className="w-24 text-sm">{k}</span>
                          <div className="flex-1 h-4 bg-gray-100 rounded">
                            <div className="h-full bg-purple-500 rounded" style={{ width: `${(v / maxVal(summary.searchEngines)) * 100}%` }} />
                          </div>
                          <span className="w-12 text-sm font-medium">{v}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Devices Tab */}
          {activeTab === "devices" && summary && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Monitor className="h-4 w-4" />{isZh ? "浏览器" : "Browsers"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTopItems(summary.browsers).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-3">
                        <span className="w-24 text-sm">{k}</span>
                        <div className="flex-1 h-4 bg-gray-100 rounded">
                          <div className="h-full bg-indigo-500 rounded" style={{ width: `${(v / maxVal(summary.browsers)) * 100}%` }} />
                        </div>
                        <span className="w-12 text-sm font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Monitor className="h-4 w-4" />{isZh ? "操作系统" : "Operating Systems"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTopItems(summary.operatingSystems).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-3">
                        <span className="w-24 text-sm">{k}</span>
                        <div className="flex-1 h-4 bg-gray-100 rounded">
                          <div className="h-full bg-green-500 rounded" style={{ width: `${(v / maxVal(summary.operatingSystems)) * 100}%` }} />
                        </div>
                        <span className="w-12 text-sm font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2">{isZh ? "设备类型" : "Device Types"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(summary.devices).map(([k, v]) => (
                      <div key={k} className={`p-4 rounded-lg text-center ${k === 'desktop' ? 'bg-blue-100' : 'bg-green-100'}`}>
                        <div className="text-3xl font-bold">{v}</div>
                        <div className="text-sm capitalize">{k}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Geo Tab */}
          {activeTab === "geo" && summary && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Globe2 className="h-4 w-4" />{isZh ? "语言偏好" : "Language Preferences"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTopItems(summary.languages, 8).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-3">
                        <span className="w-32 text-sm">{k}</span>
                        <div className="flex-1 h-4 bg-gray-100 rounded">
                          <div className="h-full bg-cyan-500 rounded" style={{ width: `${(v / maxVal(summary.languages)) * 100}%` }} />
                        </div>
                        <span className="w-12 text-sm font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-4 w-4" />{isZh ? "时区分布" : "Timezone Distribution"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTopItems(summary.timezones, 8).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-3">
                        <span className="w-40 text-sm truncate">{k}</span>
                        <div className="flex-1 h-4 bg-gray-100 rounded">
                          <div className="h-full bg-orange-500 rounded" style={{ width: `${(v / maxVal(summary.timezones)) * 100}%` }} />
                        </div>
                        <span className="w-12 text-sm font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader><CardTitle>{isZh ? "表单提交 - 国家分布" : "Form Submits - Country"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(summary.topCountries).length === 0 ? (
                      <p className="text-gray-400 col-span-4 text-center">{t.noData}</p>
                    ) : (
                      Object.entries(summary.topCountries).map(([k, v]) => (
                        <div key={k} className="p-3 bg-gray-50 rounded-lg text-center">
                          <div className="text-xl font-bold text-indigo-600">{v}</div>
                          <div className="text-sm">{k}</div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Pages Tab */}
          {activeTab === "pages" && summary && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />{isZh ? "热门页面" : "Top Pages"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {summary.topPages.length === 0 ? (
                      <p className="text-gray-400 text-center">{t.noData}</p>
                    ) : (
                      summary.topPages.map((p, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-medium text-indigo-600">{i + 1}</span>
                          <span className="flex-1 text-sm truncate">{p.path}</span>
                          <span className="text-sm font-bold text-indigo-600">{p.count}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>{isZh ? "最近访问记录" : "Recent Visits"}</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{isZh ? "页面" : "Page"}</TableHead>
                        <TableHead>{isZh ? "时间" : "Time"}</TableHead>
                        <TableHead>{isZh ? "来源" : "Source"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.slice(0, 20).map((l, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-xs truncate max-w-[200px]">{l.path}</TableCell>
                          <TableCell className="text-xs">{new Date(l.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-xs capitalize">{l.source || 'direct'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}