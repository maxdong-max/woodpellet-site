/**
 * 访问追踪 API (Upstash Redis 持久化 - SEO/GEO 增强版)
 */
import { redis } from '../../lib/redis';

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         'unknown';
}

const ANALYTICS_KEY = 'analytics:sessions';

async function getAnalytics() {
  try {
    const data = await redis.get(ANALYTICS_KEY);
    return data || [];
  } catch (e) {
    console.error('Get analytics error:', e);
    return [];
  }
}

async function saveAnalytics(data) {
  try {
    await redis.set(ANALYTICS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Save analytics error:', e);
  }
}

export default async function handler(req, res) {
  const { method } = req;
  
  if (method === 'POST') {
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || '';
    const {
      type,
      path: pagePath,
      referrer,
      stayDuration,
      clickType,
      formData,
      timestamp = Date.now(),
      // 新增 SEO/GEO 字段
      browser,
      os,
      device,
      language,
      timezone,
      source,
      medium,
      campaign,
      searchEngine
    } = req.body;

    const analytics = await getAnalytics();
    
    // 查找或创建会话 (30分钟超时)
    let session = analytics.find(a => 
      a.ip === ip && 
      a.status === 'active' &&
      (Date.now() - a.lastActive) < 30 * 60 * 1000
    );

    if (type === 'pageview') {
      if (!session) {
        session = {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
          ip,
          userAgent,
          browser,
          os,
          device,
          language,
          timezone,
          referrer,
          source,
          medium,
          campaign,
          searchEngine,
          firstVisit: timestamp,
          lastActive: timestamp,
          status: 'active',
          pages: [],
          clicks: [],
          forms: []
        };
        analytics.unshift(session);
      }
      
      session.pages.push({
        path: pagePath,
        timestamp,
        stayDuration: 0
      });
      session.lastActive = timestamp;
    }
    
    if (type === 'stay' && session) {
      const lastPage = session.pages[session.pages.length - 1];
      if (lastPage && lastPage.path === pagePath) {
        lastPage.stayDuration = stayDuration;
        lastPage.exitTime = timestamp;
      }
    }
    
    if (type === 'click') {
      if (!session) {
        session = {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
          ip,
          userAgent,
          browser,
          os,
          device,
          language,
          timezone,
          referrer,
          source,
          medium,
          campaign,
          searchEngine,
          firstVisit: timestamp,
          lastActive: timestamp,
          status: 'active',
          pages: [],
          clicks: [],
          forms: []
        };
        analytics.unshift(session);
      }
      
      session.clicks.push({
        clickType,
        timestamp,
        page: pagePath
      });
      session.lastActive = timestamp;
    }
    
    if (type === 'form' && session) {
      session.forms.push({
        timestamp,
        page: pagePath,
        hasMessage: !!formData?.message,
        country: formData?.country
      });
      session.lastActive = timestamp;
    }
    
    // 标记不活跃的会话
    analytics.forEach(a => {
      if (a.status === 'active' && (Date.now() - a.lastActive) > 30 * 60 * 1000) {
        a.status = 'inactive';
        a.totalDuration = a.lastActive - a.firstVisit;
      }
    });

    await saveAnalytics(analytics);
    
    return res.status(200).json({ success: true });
  }

  if (method === 'GET') {
    const analytics = await getAnalytics();
    
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayViews = analytics.filter(a => 
      a.pages?.some(p => p.timestamp >= todayStart)
    ).length;
    
    const totalVisits = analytics.length;
    const totalPageViews = analytics.reduce((sum, a) => sum + (a.pages?.length || 0), 0);
    const uniqueIps = [...new Set(analytics.map(a => a.ip))].length;
    
    // 点击统计
    const clickStats = {
      whatsapp: analytics.reduce((sum, a) => sum + (a.clicks?.filter(c => c.clickType === 'whatsapp').length || 0), 0),
      email: analytics.reduce((sum, a) => sum + (a.clicks?.filter(c => c.clickType === 'email').length || 0), 0),
      facebook: analytics.reduce((sum, a) => sum + (a.clicks?.filter(c => c.clickType === 'facebook').length || 0), 0),
      youtube: analytics.reduce((sum, a) => sum + (a.clicks?.filter(c => c.clickType === 'youtube').length || 0), 0),
      instagram: analytics.reduce((sum, a) => sum + (a.clicks?.filter(c => c.clickType === 'instagram').length || 0), 0),
      twitter: analytics.reduce((sum, a) => sum + (a.clicks?.filter(c => c.clickType === 'twitter').length || 0), 0),
    };
    
    const formSubmits = analytics.reduce((sum, a) => sum + (a.forms?.length || 0), 0);
    
    // 页面统计
    const pageCounts = {};
    analytics.forEach(a => {
      a.pages?.forEach(p => {
        pageCounts[p.path] = (pageCounts[p.path] || 0) + 1;
      });
    });
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));
    
    // SEO 统计
    const seoStats = {
      sources: {},
      mediums: {},
      searchEngines: {},
      browsers: {},
      os: {},
      devices: {}
    };
    
    analytics.forEach(a => {
      if (a.source) seoStats.sources[a.source] = (seoStats.sources[a.source] || 0) + 1;
      if (a.medium) seoStats.mediums[a.medium] = (seoStats.mediums[a.medium] || 0) + 1;
      if (a.searchEngine) seoStats.searchEngines[a.searchEngine] = (seoStats.searchEngines[a.searchEngine] || 0) + 1;
      if (a.browser) seoStats.browsers[a.browser] = (seoStats.browsers[a.browser] || 0) + 1;
      if (a.os) seoStats.os[a.os] = (seoStats.os[a.os] || 0) + 1;
      if (a.device) seoStats.devices[a.device] = (seoStats.devices[a.device] || 0) + 1;
    });
    
    return res.status(200).json({
      summary: {
        todayViews,
        totalVisits,
        totalPageViews,
        uniqueIps,
        clickStats,
        formSubmits,
        topPages,
        seoStats
      }
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}