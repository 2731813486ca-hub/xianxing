# 先行 — 作品展示平台

## 当前状态 (2026-05-04)

- **全栈已搭建完成**：Next.js 16 + Prisma 7 + Tailwind v4 + Neon PostgreSQL
- **Vercel 部署地址**：https://xianxing.vercel.app
- **Neon 数据库**：已创建并 seeded（演示账号见 README.md）
- **GitHub**: github.com/2731813486ca-hub/xianxing

## ✅ 当前状态 — 所有 API 正常工作

Vercel 环境变量 BOM 问题已修复。关键经验：
- **不要用 PowerShell 管道**给 `vercel env add` 传值（会加 BOM）
- **必须用 `--value` 参数**：`vercel env add DATABASE_URL production --value "..." --yes`
- `.env` 文件如果被 Vercel 部署上传，会在运行时覆盖生产环境变量，建议改名 `.env.production`
- 通过 `/api/debug` 可验证数据库连接

## 项目关键信息

### 技术栈（注意 Breaking Changes！）

| 技术 | 版本 | 与旧版的关键差异 |
|------|------|------------------|
| Next.js | 16.2.4 | App Router, Turbopack 默认 |
| Prisma | 7.8.0 | 需要 driver adapter，`prisma.config.ts`，`env()` 不接受 fallback |
| Tailwind CSS | v4 | CSS 配置（`@theme inline`），不再用 `tailwind.config.ts` |
| Zod | 4.4.2 | `.error.issues` 不是 `.error.errors` |
| React | 19.2.4 | 兼容 React 19 API |
| jose | 6.x | JWT 签名/验证（替代 jsonwebtoken） |

### 数据库架构

- 5 个模型：`User`, `Work`, `WorkImage`, `Like`, `Favorite`
- PostgreSQL provider（通过 Neon）
- Prisma 适配器：`PrismaNeonHttp`（HTTP 模式，适合 serverless）
- **重要**：`prisma.config.ts` 中的 `env()` 不接受第二个参数（fallback）

### 关键文件

- `prisma/schema.prisma` — 数据库模型（postgresql provider）
- `prisma.config.ts` — Prisma 7 配置（含 seed 命令）
- `prisma/seed.ts` — 种子数据（3 个用户 + 6 个作品）
- `src/lib/prisma.ts` — Prisma 客户端单例（`PrismaNeonHttp` 适配器）
- `src/lib/auth.ts` — JWT + bcrypt 认证（Node.js 环境）
- `src/lib/auth-edge.ts` — Edge Runtime 安全的认证（仅 jose verifyToken）
- `src/lib/validations.ts` — Zod v4 验证 schema
- `src/lib/constants.ts` — 全局常量

### 环境变量

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 连接字串 |
| `JWT_SECRET` | JWT 签名密钥 |

**注意**：`.env` 文件用于 Vercel 部署（已写入生产 URL），`.env.local` 用于本地开发。确保两个文件都**无 BOM**。

### API 路由

| 路由 | 方法 | 说明 |
|------|------|------|
| `/api/auth/register` | POST | 注册 |
| `/api/auth/login` | POST | 登录 |
| `/api/auth/logout` | POST | 登出 |
| `/api/auth/session` | GET | 获取当前用户 |
| `/api/upload` | POST | 上传图片 |
| `/api/works` | GET | 作品列表（分页+搜索） |
| `/api/works` | POST | 创建作品 |
| `/api/works/popular` | GET | Top 10 热门 |
| `/api/works/[id]` | GET/PUT/DELETE | 作品 CRUD |
| `/api/works/[id]/like` | POST | 切换点赞 |
| `/api/works/[id]/favorite` | POST | 切换收藏 |
| `/api/users/[id]` | GET/PUT | 用户资料 |
| `/api/users/[id]/works` | GET | 用户作品列表 |
| `/api/debug` | GET | 调试用，测试 DB 连接 |

### 页面路由

| 路由 | 说明 |
|------|------|
| `/` | 首页（搜索 + 分页作品网格） |
| `/login` | 登录（Suspense 包裹） |
| `/register` | 注册 |
| `/upload` | 上传作品（需登录） |
| `/works/[id]` | 作品详情 |
| `/works/[id]/edit` | 编辑作品 |
| `/works/top` | Top 10 排行榜 |
| `/profile/[userId]` | 用户主页 |
| `/profile/me` | 重定向到自己的主页 |
| `/settings` | 个人设置 |

### 组件

所有组件在 `src/components/` 下，均为 "use client"：
- `ui/`: Button, Input, Modal, Toaster, LoadingSpinner, EmptyState
- `layout/`: Navbar（响应式移动菜单）
- `auth/`: LoginForm, RegisterForm, AuthGuard
- `work/`: WorkCard, WorkGrid, LikeButton, FavoriteButton, ImageGallery, ImageUploader, UploadForm, EditForm
- `profile/`: ProfileHeader, WorkManager

### 关键中间件

`middleware.ts` 保护 `/upload`、`/settings`、`/profile/me`，并将已登录用户从 `/login`、`/register` 重定向。

## 团队约定 / 踩坑记录

1. **Prisma 7 必须带 adapter**：没有 adapter 的 `new PrismaClient()` 会报错
2. **Edge Runtime 不能 import Prisma**：middleware 使用 `auth-edge.ts`（仅 jose）而不是 `auth.ts`
3. **Zod v4 的 safeParse**：错误在 `.error.issues` 而不是 `.error.errors`
4. **Tailwind v4 CSS 配置**：`@theme inline` 在 `globals.css` 中，没有 `tailwind.config.ts`
5. **useSearchParams 需要 Suspense**：任何使用 useSearchParams 的组件必须被 Suspense 包裹
6. **PowerShell BOM**：所有 `.env` 文件必须用 `[System.IO.File]::WriteAllText` 配合 `UTF8Encoding($false)` 写入，否则会被加入 BOM
7. **Vercel 部署上传 .env 文件**：会导致 .env 覆盖生产环境变量（警告信息："Detected .env file"）
8. **Neon CLI 交互模式**：`neonctl projects create` 需要 `--org-id` 参数才能非交互运行
9. **GFW 网络限制**：curl 到 Vercel 可能超时，使用 PowerShell 的 `Invoke-WebRequest` 可能通过不同路由连接

## 命令速查

```bash
# 本地开发
npm run dev

# 数据库
npm run db:push     # 推送 schema
npm run db:generate # 生成 Prisma Client
npm run seed        # 填充种子数据

# Vercel
vercel deploy --prod  # 部署到生产
vercel logs xianxing.vercel.app  # 查看日志
vercel env ls          # 查看环境变量
vercel env rm <name> <env> --yes  # 删除环境变量

# Neon
neonctl projects list --org-id <org-id>
neonctl projects create --name <name> --org-id <org-id>
```
