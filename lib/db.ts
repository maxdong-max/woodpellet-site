import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dataDir = path.join(process.cwd(), '../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'admin.db')
export const db = new Database(dbPath)

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      name_en TEXT,
      description TEXT,
      description_en TEXT,
      image TEXT,
      category TEXT,
      specs TEXT,
      enabled INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      title_en TEXT,
      description TEXT,
      description_en TEXT,
      image TEXT,
      client_name TEXT,
      location TEXT,
      capacity TEXT,
      enabled INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      title_en TEXT,
      content TEXT,
      content_en TEXT,
      image TEXT,
      category TEXT,
      enabled INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS faq (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      question_en TEXT,
      answer TEXT NOT NULL,
      answer_en TEXT,
      enabled INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contact_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      value_en TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      method TEXT DEFAULT 'GET',
      ip TEXT,
      user_agent TEXT,
      browser TEXT,
      os TEXT,
      device TEXT,
      language TEXT,
      timezone TEXT,
      referrer TEXT,
      source TEXT,
      medium TEXT,
      campaign TEXT,
      search_engine TEXT,
      stay_duration INTEGER DEFAULT 0,
      click_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      lang TEXT DEFAULT 'en'
    );

    CREATE TABLE IF NOT EXISTS operation_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      action TEXT NOT NULL,
      table_name TEXT,
      record_id INTEGER,
      details TEXT,
      ip TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Insert default admin if not exists
  const bcrypt = require('bcryptjs')
  const defaultPassword = bcrypt.hashSync('macreat2024', 10)
  const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get('admin')
  
  if (!existingUser) {
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('admin', defaultPassword, 'admin')
    console.log('Default admin user created')
  }
}

initDatabase()
export function logOperation(params: {
  username?: string
  action: string
  table_name?: string
  record_id?: number
  details?: string
  ip?: string
  user_agent?: string
}) {
  db.prepare(`
    INSERT INTO operation_logs (username, action, table_name, record_id, details, ip, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    params.username || 'unknown',
    params.action,
    params.table_name || null,
    params.record_id || null,
    params.details || null,
    params.ip || null,
    params.user_agent || null
  )
}
