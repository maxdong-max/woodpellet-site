import { NextRequest, NextResponse } from "next/server"
import jwt, { JwtPayload } from "jsonwebtoken"
import { redis } from "@/lib/redis"

const JWT_SECRET = process.env.JWT_SECRET || "macreat-admin-secret-2024"
const ANALYTICS_KEY = 'analytics:sessions'

function authMiddleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null
  try { const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; return decoded as { username: string } } catch { return null }
}

async function getAnalytics() {
  try {
    const data = await redis.get(ANALYTICS_KEY);
    return data || [];
  } catch (e) {
    console.error('Get analytics error:', e);
    return [];
  }
}

export async function GET(req: NextRequest) {
  const user = authMiddleware(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
  try {
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get("days") || "7")
    
    const analytics = await getAnalytics()
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
    
    const filteredAnalytics = (analytics as any[]).filter(a => a.firstVisit >= cutoff)
    
    // 构建详细日志
    const logs: any[] = []
    filteredAnalytics.forEach(session => {
      session.pages?.forEach((page: any) => {
        if (page.timestamp >= cutoff) {
          logs.push({
            path: page.path,
            ip: session.ip,
            created_at: new Date(page.timestamp).toISOString(),
            stay_duration: page.stayDuration,
            browser: session.browser,
            os: session.os,
            device: session.device,
            language: session.language,
            timezone: session.timezone,
            referrer: session.referrer,
            source: session.source,
            medium: session.medium,
            campaign: session.campaign,
            search_engine: session.searchEngine
          });
        }
      });
    });
    
    logs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // 计算汇总统计
    const totalVisits = filteredAnalytics.length;
    const totalPageViews = logs.length;
    const uniqueIps = Array.from(new Set(filteredAnalytics.map((a: any) => a.ip))).length;
    
    const avgStayDuration = Math.round(
      filteredAnalytics.reduce((sum: number, a: any) => {
        const totalStay = a.pages?.reduce((s: number, p: any) => s + (p.stayDuration || 0), 0) || 0;
        return sum + totalStay;
      }, 0) / (filteredAnalytics.length || 1)
    );
    
    // 点击统计
    const clickStats: Record<string, number> = {
      whatsapp: filteredAnalytics.reduce((sum: number, a: any) => sum + (a.clicks?.filter((c: any) => c.clickType === 'whatsapp').length || 0), 0),
      email: filteredAnalytics.reduce((sum: number, a: any) => sum + (a.clicks?.filter((c: any) => c.clickType === 'email').length || 0), 0),
      facebook: filteredAnalytics.reduce((sum: number, a: any) => sum + (a.clicks?.filter((c: any) => c.clickType === 'facebook').length || 0), 0),
      youtube: filteredAnalytics.reduce((sum: number, a: any) => sum + (a.clicks?.filter((c: any) => c.clickType === 'youtube').length || 0), 0),
      instagram: filteredAnalytics.reduce((sum: number, a: any) => sum + (a.clicks?.filter((c: any) => c.clickType === 'instagram').length || 0), 0),
      twitter: filteredAnalytics.reduce((sum: number, a: any) => sum + (a.clicks?.filter((c: any) => c.clickType === 'twitter').length || 0), 0),
    };
    
    // 表单统计
    const formSubmits = filteredAnalytics.reduce((sum: number, a: any) => sum + (a.forms?.length || 0), 0);
    
    // 来源统计
    const trafficSources: Record<string, number> = {};
    const trafficMediums: Record<string, number> = {};
    const searchEngines: Record<string, number> = {};
    const browsers: Record<string, number> = {};
    const operatingSystems: Record<string, number> = {};
    const devices: Record<string, number> = {};
    const languages: Record<string, number> = {};
    const timezones: Record<string, number> = {};
    const topCountries: Record<string, number> = {};
    const pageCounts: Record<string, number> = {};
    
    filteredAnalytics.forEach((a: any) => {
      const source = a.source || 'direct';
      trafficSources[source] = (trafficSources[source] || 0) + 1;
      
      const medium = a.medium || 'none';
      trafficMediums[medium] = (trafficMediums[medium] || 0) + 1;
      
      if (a.searchEngine) {
        searchEngines[a.searchEngine] = (searchEngines[a.searchEngine] || 0) + 1;
      }
      if (a.browser) browsers[a.browser] = (browsers[a.browser] || 0) + 1;
      if (a.os) operatingSystems[a.os] = (operatingSystems[a.os] || 0) + 1;
      if (a.device) devices[a.device] = (devices[a.device] || 0) + 1;
      if (a.language) languages[a.language] = (languages[a.language] || 0) + 1;
      if (a.timezone) timezones[a.timezone] = (timezones[a.timezone] || 0) + 1;
      
      a.forms?.forEach((f: any) => {
        if (f.country) {
          topCountries[f.country] = (topCountries[f.country] || 0) + 1;
        }
      });
      
      a.pages?.forEach((p: any) => {
        pageCounts[p.path] = (pageCounts[p.path] || 0) + 1;
      });
    });
    
    // 热门页面
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));
    
    // 跳出率
    const bounceRate = Math.round(
      filteredAnalytics.filter((a: any) => a.pages?.length === 1).length / 
      (filteredAnalytics.length || 1) * 100
    );
    
    const summary = {
      totalVisits,
      totalPageViews,
      uniqueIps,
      avgStayDuration,
      bounceRate,
      clickStats,
      formSubmits,
      topPages,
      trafficSources,
      trafficMediums,
      searchEngines,
      browsers,
      operatingSystems,
      devices,
      languages,
      timezones,
      topCountries
    };
    
    return NextResponse.json({ logs: logs.slice(0, 500), summary })
  } catch (err) {
    console.error('Analytics API error:', err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}