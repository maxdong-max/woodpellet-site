// Redis-based admin data store for Vercel
import { redis } from './redis'

const PREFIX = 'admin:'

// Generic get/set functions
async function getData(key: string) {
  const data = await redis.get(PREFIX + key)
  return data || []
}

async function setData(key: string, data: any[]) {
  await redis.set(PREFIX + key, data)
}

async function getItem(key: string, id: number) {
  const items = await getData(key)
  return items.find((item: any) => item.id === id)
}

async function addItem(key: string, item: any) {
  const items = await getData(key)
  const maxId = items.reduce((max: number, i: any) => Math.max(max, i.id || 0), 0)
  item.id = maxId + 1
  item.created_at = new Date().toISOString()
  item.updated_at = new Date().toISOString()
  items.push(item)
  await setData(key, items)
  return item
}

async function updateItem(key: string, id: number, updates: any) {
  const items = await getData(key)
  const index = items.findIndex((item: any) => item.id === id)
  if (index === -1) return null
  items[index] = { ...items[index], ...updates, updated_at: new Date().toISOString() }
  await setData(key, items)
  return items[index]
}

async function deleteItem(key: string, id: number) {
  const items = await getData(key)
  const filtered = items.filter((item: any) => item.id !== id)
  await setData(key, filtered)
  return true
}

// Export data-specific functions
export const adminData = {
  // Products
  getProducts: () => getData('products'),
  getProduct: (id: number) => getItem('products', id),
  addProduct: (item: any) => addItem('products', item),
  updateProduct: (id: number, updates: any) => updateItem('products', id, updates),
  deleteProduct: (id: number) => deleteItem('products', id),

  // Cases
  getCases: () => getData('cases'),
  getCase: (id: number) => getItem('cases', id),
  addCase: (item: any) => addItem('cases', item),
  updateCase: (id: number, updates: any) => updateItem('cases', id, updates),
  deleteCase: (id: number) => deleteItem('cases', id),

  // News
  getNews: () => getData('news'),
  getNewsItem: (id: number) => getItem('news', id),
  addNews: (item: any) => addItem('news', item),
  updateNews: (id: number, updates: any) => updateItem('news', id, updates),
  deleteNews: (id: number) => deleteItem('news', id),

  // FAQ
  getFaqs: () => getData('faq'),
  getFaq: (id: number) => getItem('faq', id),
  addFaq: (item: any) => addItem('faq', item),
  updateFaq: (id: number, updates: any) => updateItem('faq', id, updates),
  deleteFaq: (id: number) => deleteItem('faq', id),

  // Carousel
  getCarousels: () => getData('carousel'),
  getCarousel: (id: number) => getItem('carousel', id),
  addCarousel: (item: any) => addItem('carousel', item),
  updateCarousel: (id: number, updates: any) => updateItem('carousel', id, updates),
  deleteCarousel: (id: number) => deleteItem('carousel', id),

  // Navigation
  getNavigations: () => getData('navigation'),
  getNavigation: (id: number) => getItem('navigation', id),
  addNavigation: (item: any) => addItem('navigation', item),
  updateNavigation: (id: number, updates: any) => updateItem('navigation', id, updates),
  deleteNavigation: (id: number) => deleteItem('navigation', id),

  // Contact
  getContact: () => getData('contact'),
  setContact: async (data: any) => {
    await redis.set(PREFIX + 'contact', [data])
  },

  // Settings
  getSettings: () => getData('settings'),
  getSetting: (key: string) => getData('settings').then(items => items.find((s: any) => s.key === key)),
  setSetting: async (key: string, value: string) => {
    const settings = await getData('settings')
    const index = settings.findIndex((s: any) => s.key === key)
    if (index >= 0) {
      settings[index].value = value
    } else {
      settings.push({ key, value })
    }
    await setData('settings', settings)
  },

  // Analytics
  getAnalytics: () => getData('analytics'),
  addAnalytics: (item: any) => addItem('analytics', item),
}