/**
 * Statistics / Analytics Tracking Module
 * Real-time visitor tracking for admin dashboard
 */

// Analytics Configuration
const ANALYTICS_CONFIG = {
  apiEndpoint: '/api/analytics',
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  sampleRate: 100, // 100% sampling
};

// Get visitor info
function getVisitorInfo() {
  return {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    colorDepth: window.screen.colorDepth,
    language: navigator.language || navigator.userLanguage,
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer,
    currentPath: window.location.pathname,
    currentUrl: window.location.href,
  };
}

// Track page view
export function trackPageView(pagePath, pageTitle) {
  const data = {
    type: 'pageview',
    path: pagePath,
    title: pageTitle,
    timestamp: new Date().toISOString(),
    ...getVisitorInfo(),
  };
  
  sendAnalytics(data);
}

// Track event
export function trackEvent(category, action, label, value) {
  const data = {
    type: 'event',
    category,
    action,
    label,
    value,
    timestamp: new Date().toISOString(),
    ...getVisitorInfo(),
  };
  
  sendAnalytics(data);
}

// Track custom event (form submission, button click)
export function trackCustomEvent(eventName, properties = {}) {
  const data = {
    type: 'custom',
    eventName,
    properties,
    timestamp: new Date().toISOString(),
    ...getVisitorInfo(),
  };
  
  sendAnalytics(data);
}

// Send analytics data to backend
function sendAnalytics(data) {
  try {
    fetch(ANALYTICS_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch(err => console.error('Analytics error:', err));
  } catch (err) {
    console.error('Analytics tracking error:', err);
  }
}

// Initialize analytics
export function initAnalytics() {
  // Track initial page view
  trackPageView(window.location.pathname, document.title);
  
  // Track page navigation
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      trackPageView(window.location.pathname, document.title);
    });
    
    // Intercept link clicks for SPA navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        const path = new URL(link.href).pathname;
        if (path !== window.location.pathname) {
          setTimeout(() => trackPageView(path, document.title), 100);
        }
      }
    });
  }
}

// Get analytics snippet for direct embedding
export const analyticsSnippet = `
<script>
  (function() {
    var analytics = {
      config: {
        apiEndpoint: '/api/analytics'
      },
      getVisitorInfo: function() {
        return {
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          colorDepth: window.screen.colorDepth,
          language: navigator.language || navigator.userLanguage,
          platform: navigator.platform,
          userAgent: navigator.userAgent,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          referrer: document.referrer,
          currentPath: window.location.pathname,
          currentUrl: window.location.href,
        };
      },
      trackPageView: function(pagePath, pageTitle) {
        var data = {
          type: 'pageview',
          path: pagePath,
          title: pageTitle,
          timestamp: new Date().toISOString(),
          ...this.getVisitorInfo()
        };
        this.send(data);
      },
      trackEvent: function(category, action, label, value) {
        var data = {
          type: 'event',
          category: category,
          action: action,
          label: label,
          value: value,
          timestamp: new Date().toISOString(),
          ...this.getVisitorInfo()
        };
        this.send(data);
      },
      send: function(data) {
        try {
          fetch(this.config.apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            keepalive: true
          }).catch(function() {});
        } catch (e) {}
      }
    };
    
    // Initialize
    analytics.trackPageView(window.location.pathname, document.title);
    
    // Track popstate
    window.addEventListener('popstate', function() {
      analytics.trackPageView(window.location.pathname, document.title);
    });
    
    // Export to window
    window.macreatAnalytics = analytics;
  })();
</script>
`;

export default {
  initAnalytics,
  trackPageView,
  trackEvent,
  trackCustomEvent,
  analyticsSnippet,
};