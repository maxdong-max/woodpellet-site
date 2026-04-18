# 网站状态记录 - 2026-04-10

> 用于溯源和模型更换参考

---

## 部署信息

| 项目 | 值 |
|------|-----|
| **网站 URL** | https://workspace-shrimp-publish.vercel.app |
| **Admin URL** | https://workspace-shrimp-publish.vercel.app/admin |
| **Admin 账号** | admin |
| **Admin 密码** | macreat2024 |
| **部署平台** | Vercel (免费版) |
| **项目名称** | maxdong-maxs-projects/workspace-shrimp-publish |
| **Git 仓库** | https://github.com/maxdong-max/macreat-website.git |

---

## 技术栈

- **框架**：Next.js 14.2 (App Router + Pages Router 混合)
- **样式**：Tailwind CSS + CSS Modules
- **后端**：Node.js (API Routes)
- **数据库**：Better-SQLite3 (本地) / 无持久化 (Vercel 生产)
- **部署**：Vercel

---

## 页面结构

### 前台页面 (Pages Router)
| 页面 | 路由 |
|------|------|
| 首页 | `/` |
| 关于我们 | `/about-macreat/` |
| 机器产品 | `/machine/products` |
| 案例展示 | `/case/` |
| 新闻资讯 | `/news/` |
| 新闻详情 | `/news/[slug]` |
| 解决方案 | `/solution/` |
| 解决方案详情 | `/solution/[slug]` |
| 产品详情 | `/product/[slug]` |
| 联系我们 | `/contact/` |
| 成为经销商 | `/become-our-dealer/` |
| E-book 下载 | `/base_message/` |
| 优惠券 | `/project_message/` |
| 素材页面 | `/materials/*` |

### 管理后台 (App Router)
| 页面 | 路由 |
|------|------|
| 仪表盘 | `/admin/` |
| 轮播管理 | `/admin/carousel` |
| 产品管理 | `/admin/products` |
| 案例管理 | `/admin/cases` |
| 新闻管理 | `/admin/news` |
| FAQ管理 | `/admin/faq` |
| 导航管理 | `/admin/navigation` |
| 展会管理 | `/admin/exhibition` |
| 数据分析 | `/admin/analytics` |
| 系统设置 | `/admin/settings` |
| 登录页 | `/admin/login` |

---

## API 端点

### 公开 API
| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/contact` | POST | 联系表单提交 |
| `/api/public/exhibition` | GET | 展会信息 |
| `/api/social-links` | GET | 社交链接 |
| `/api/track` | POST | 访问追踪 |
| `/api/ai-chat` | POST | **AI智能客服 (占位符)** |

### 管理后台 API
| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/admin/login` | POST | 管理员登录 (JWT) |
| `/api/admin/products` | GET/POST | 产品管理 |
| `/api/admin/products/[id]` | GET/PUT/DELETE | 产品 CRUD |
| `/api/admin/cases` | GET/POST | 案例管理 |
| `/api/admin/cases/[id]` | GET/PUT/DELETE | 案例 CRUD |
| `/api/admin/news` | GET/POST | 新闻管理 |
| `/api/admin/news/[id]` | GET/PUT/DELETE | 新闻 CRUD |
| `/api/admin/carousel` | GET/POST | 轮播管理 |
| `/api/admin/carousel/[id]` | GET/PUT/DELETE | 轮播 CRUD |
| `/api/admin/faq` | GET/POST | FAQ管理 |
| `/api/admin/faq/[id]` | GET/PUT/DELETE | FAQ CRUD |
| `/api/admin/navigation` | GET/POST | 导航管理 |
| `/api/admin/navigation/[id]` | GET/PUT/DELETE | 导航 CRUD |
| `/api/admin/exhibition` | GET/POST | 展会管理 |
| `/api/admin/contact` | GET | 联系表单查询 |
| `/api/admin/stats` | GET | 统计数据 |
| `/api/admin/analytics` | GET | 分析数据 |

---

## AI 智能客服 (待更换模型)

**当前状态**: 简单占位符回复，未接入真实 AI

**文件位置**: `pages/api/ai-chat.js`

**当前实现**:
- 内存存储对话
- 随机选择预设回复
- 未接入任何 AI 模型

**可接入的模型选项**:
1. **Ollama** (本地/自托管) - 免费
2. **OpenAI** (API) - 需要 API Key
3. **Claude** (API) - 需要 API Key
4. **其他 LLM** - 通过 API 对接

---

## 数据文件

| 文件 | 内容 |
|------|------|
| `lib/content.js` | 网站内容配置 (48KB) |
| `lib/productData.js` | 产品数据 (30KB) |
| `lib/adminData.js` | 管理后台数据 |
| `lib/seo.js` | SEO 配置 |
| `lib/analytics.js` | 分析工具 |
| `lib/redis.js` | Redis 配置 |
| `lib/db.ts` | 数据库连接 |
| `lib/utils.ts` | 工具函数 |

---

## Git 提交历史

| Commit | 日期 | 说明 |
|--------|------|------|
| a3da012 | - | Simplify login - plain text auth |
| 785e311 | - | Fix login API for Vercel (no SQLite) |
| 17301a0 | - | 强制重新部署 |
| 45079e7 | - | 添加 vercel.json 构建配置 |
| 608d6c9 | - | 安装后台依赖并构建 |

---

## 最近部署

| 时间 | URL | 状态 |
|------|-----|------|
| 2026-04-10 16:30 | workspace-shrimp-publish.vercel.app | ✅ Success |

---

## 待办事项

- [ ] 接入真实 AI 模型到 `/api/ai-chat`
- [ ] 电话号码 +86-18615207548 确认显示正常
- [ ] 考虑 SQLite 持久化方案

---

*最后更新：2026-04-10*
*记录人：openclaw*