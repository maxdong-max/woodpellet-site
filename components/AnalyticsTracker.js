'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startTime = useRef(Date.now());
  const currentPath = useRef(pathname + (searchParams?.toString() ? '?' + searchParams.toString() : ''));

  // 解析 User-Agent
  const parseUserAgent = (ua) => {
    const browser = /Chrome\/(\d+)/.test(ua) ? 'Chrome' :
                   /Safari\/(\d+)/.test(ua) && !/Chrome/.test(ua) ? 'Safari' :
                   /Firefox\/(\d+)/.test(ua) ? 'Firefox' :
                   /Edge\/(\d+)/.test(ua) ? 'Edge' : 'Other';
    
    const os = /Windows/.test(ua) ? 'Windows' :
               /Mac/i.test(ua) ? 'macOS' :
               /Linux/.test(ua) ? 'Linux' :
               /Android/.test(ua) ? 'Android' :
               /iPhone|iPad|iPod/.test(ua) ? 'iOS' : 'Other';
    
    const device = /Mobile|Android|iPhone/.test(ua) ? 'mobile' : 'desktop';
    
    return { browser, os, device };
  };

  // 解析搜索引擎来源
  const parseReferrer = (referrer, searchParams) => {
    if (!referrer) return { source: 'direct', medium: 'none', searchEngine: null };
    
    // 检查 UTM 参数
    const utmSource = searchParams?.get('utm_source');
    const utmMedium = searchParams?.get('utm_medium');
    const utmCampaign = searchParams?.get('utm_campaign');
    
    if (utmSource) {
      return { 
        source: utmSource, 
        medium: utmMedium || 'unknown', 
        campaign: utmCampaign,
        searchEngine: null 
      };
    }
    
    // 解析搜索引擎
    const searchEngines = [
      { name: 'Google', pattern: /google\./ },
      { name: 'Bing', pattern: /bing\./ },
      { name: 'Yahoo', pattern: /yahoo\./ },
      { name: 'Baidu', pattern: /baidu\./ },
      { name: 'Yandex', pattern: /yandex\./ },
      { name: 'DuckDuckGo', pattern: /duckduckgo\./ },
    ];
    
    for (const se of searchEngines) {
      if (se.pattern.test(referrer)) {
        return { source: se.name, medium: 'organic', searchEngine: se.name };
      }
    }
    
    // 社交媒体来源
    const socialMedia = [
      { name: 'Facebook', pattern: /facebook\./ },
      { name: 'Twitter', pattern: /twitter\.|x\.com/ },
      { name: 'LinkedIn', pattern: /linkedin\./ },
      { name: 'Instagram', pattern: /instagram\./ },
      { name: 'YouTube', pattern: /youtube\./ },
    ];
    
    for (const sm of socialMedia) {
      if (sm.pattern.test(referrer)) {
        return { source: sm.name, medium: 'social', searchEngine: null };
      }
    }
    
    // 其他引荐来源
    return { source: 'referral', medium: 'referral', searchEngine: null };
  };

  // 发送追踪数据
  const track = useCallback(async (type, data = {}) => {
    try {
      const ua = navigator.userAgent;
      const parsedUA = parseUserAgent(ua);
      
      // 获取语言和时区
      const language = navigator.language || navigator.userLanguage;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          path: currentPath.current,
          timestamp: Date.now(),
          userAgent: ua,
          browser: parsedUA.browser,
          os: parsedUA.os,
          device: parsedUA.device,
          language,
          timezone,
          ...data
        })
      });
    } catch (e) {
      // 静默失败
    }
  }, []);

  // 追踪页面访问
  useEffect(() => {
    const fullPath = pathname + (searchParams?.toString() ? '?' + searchParams.toString() : '');
    
    if (fullPath !== currentPath.current) {
      // 记录上一页停留时间
      const stayDuration = Math.round((Date.now() - startTime.current) / 1000);
      if (stayDuration > 0) {
        track('stay', { stayDuration });
      }
      
      // 解析 UTM 和来源
      const referrerData = parseReferrer(document.referrer, searchParams);
      
      // 新页面访问
      currentPath.current = fullPath;
      startTime.current = Date.now();
      track('pageview', { 
        referrer: document.referrer,
        ...referrerData
      });
    }
  }, [pathname, searchParams, track]);

  // 追踪社交媒体点击
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      
      const href = anchor.href || '';
      const text = anchor.textContent?.toLowerCase() || '';
      
      if (href.includes('whatsapp') || text.includes('whatsapp')) {
        track('click', { clickType: 'whatsapp' });
      } else if (href.includes('mailto:') || text.includes('email')) {
        track('click', { clickType: 'email' });
      } else if (href.includes('facebook') || text.includes('facebook')) {
        track('click', { clickType: 'facebook' });
      } else if (href.includes('youtube') || text.includes('youtube')) {
        track('click', { clickType: 'youtube' });
      } else if (href.includes('instagram') || text.includes('instagram')) {
        track('click', { clickType: 'instagram' });
      } else if (href.includes('twitter') || href.includes('x.com') || text === 'x') {
        track('click', { clickType: 'twitter' });
      } else if (href.includes('api.whatsapp')) {
        track('click', { clickType: 'whatsapp' });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [track]);

  // 追踪表单提交
  useEffect(() => {
    const handleSubmit = (e) => {
      const form = e.target;
      if (!form) return;
      
      const action = form.action || '';
      if (action.includes('/api/contact')) {
        const formData = new FormData(form);
        track('form', {
          formData: {
            country: formData.get('country'),
            hasMessage: !!formData.get('message')
          }
        });
      }
    };

    document.addEventListener('submit', handleSubmit);
    return () => document.removeEventListener('submit', handleSubmit);
  }, [track]);

  // 页面离开时记录最后停留时间
  useEffect(() => {
    const handleBeforeUnload = () => {
      const stayDuration = Math.round((Date.now() - startTime.current) / 1000);
      if (stayDuration > 0) {
        navigator.sendBeacon('/api/track', JSON.stringify({
          type: 'stay',
          path: currentPath.current,
          stayDuration,
          timestamp: Date.now()
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return null;
}