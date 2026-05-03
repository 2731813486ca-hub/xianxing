# "先行" 作品展示平台 — 实施计划

> 存档时间：2026-05-03
> 执行前请先确认 Node.js 已安装，然后按 Phase 1-4 逐步执行。

---

## 技术栈

- **Next.js 14** (App Router) + TypeScript — 全栈框架
- **Prisma** + **SQLite** — ORM 与数据库
- **Tailwind CSS** — 样式（深色主题 + 金色强调色 + Serif 字体）
- **自定义 JWT + httpOnly Cookie** — 邮箱认证
- **Zod** — 表单/API 验证
- **bcryptjs + jose** — 密码哈希与 JWT
- **react-icons** — 图标库

## 数据库模型 (5 个)

```
User -> Work -> WorkImage
User -> Like  -> Work   (@@unique[userId, workId])
User -> Favorite -> Work (@@unique[userId, workId])
```

- Work 包含 `isVisible`, `isPinned`, `popularityScore` 字段
- 热度算法: `popularityScore = likes_count * 1 + favorites_count * 3`
- `popularityScore` 在每次点赞/收藏时增量更新

## 页面路由

| 路径 | 权限 | 说明 |
|---|---|---|
| `/` | 公开 | 主页：最新作品卡片网格 + 搜索栏 |
| `/works/top` | 公开 | Top 10 热门作品排行榜 |
| `/works/[id]` | 公开 | 作品详情（图片、描述、点赞/收藏） |
| `/works/[id]/edit` | 所有者 | 编辑作品 |
| `/profile/[userId]` | 公开 | 用户主页（个人标语、作品展示） |
| `/profile/me` | 需登录 | 跳转到当前用户主页 |
| `/login` | 未登录 | 邮箱登录 |
| `/register` | 未登录 | 邮箱注册 |
| `/upload` | 需登录 | 上传新作品 |
| `/settings` | 需登录 | 编辑个人资料 |

## API 端点 (17 个)

**认证:**
- `POST /api/auth/register` — 注册
- `POST /api/auth/login` — 登录（设置 cookie）
- `POST /api/auth/logout` — 登出
- `GET /api/auth/session` — 获取当前会话

**作品:**
- `GET /api/works` — 列表（支持 search/page/limit，默认按创建时间倒序）
- `POST /api/works` — 创建作品（需登录）
- `GET /api/works/[id]` — 详情（含是否已点赞/收藏状态）
- `PUT /api/works/[id]` — 更新（需所有者）
- `DELETE /api/works/[id]` — 删除（需所有者）
- `GET /api/works/popular` — Top 10 热门

**社交:**
- `POST /api/works/[id]/like` — 切换点赞
- `POST /api/works/[id]/favorite` — 切换收藏

**用户:**
- `GET /api/users/[id]` — 用户信息
- `PUT /api/users/[id]` — 更新资料（需本人）
- `GET /api/users/[id]/works` — 用户作品列表（非本人只返回 visible 作品）

**文件:**
- `POST /api/upload` — 上传图片（支持 jpg/png/webp，最大 5MB）

---

## 实施步骤（4 阶段，12 步）

### Phase 1: 基础设施（Step 1-4）

**Step 1 — 项目脚手架**
- 安装 Node.js LTS (22.x)
- `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- 安装依赖：`npm install prisma @prisma/client bcryptjs jose zod react-icons`
- 安装 Dev 依赖：`npm install -D @types/bcryptjs`
- 清理默认页面，配置 Tailwind 设计 Token（深色背景 + 金色强调色）
- 配置字体 (Playfair Display + Inter)

**Step 2 — 数据库**
- `npx prisma init --datasource-provider sqlite`
- 编写 Prisma Schema（User, Work, WorkImage, Like, Favorite）
- `npx prisma db push && npx prisma generate`
- 创建 `src/lib/prisma.ts`（单例模式）
- 创建 seed 数据

**Step 3 — 认证系统 API**
- `src/lib/auth.ts`：password hashing, JWT create/verify
- POST `/api/auth/register`、`/api/auth/login`、`/api/auth/logout`
- GET `/api/auth/session`

**Step 4 — 客户端认证 + 路由保护**
- `src/context/AuthContext.tsx`（user, loading, login, logout）
- `AuthGuard` 组件
- `src/middleware.ts` 中间件保护路由
- `Navbar` 导航栏

### Phase 2: 核心 CRUD（Step 5-8）

**Step 5 — 图片上传**
- `POST /api/upload` 接收文件，保存到 `public/uploads/`
- 验证文件类型和大小
- `ImageUploader` 组件（拖拽/点击上传，预览缩略图）

**Step 6 — 作品 CRUD API**
- Zod 验证 schema（title 必填，至少 1 张图，最多 5 张）
- GET/POST `/api/works`（列表支持搜索分页、创建）
- GET/PUT/DELETE `/api/works/[id]`

**Step 7 — 主页**
- `WorkCard` 组件（缩略图、标题、摘要、作者、热度）
- `WorkGrid` 响应式网格 (1/2/3/4 列)
- 搜索栏 + 分页加载

**Step 8 — 作品详情页**
- `ImageGallery` 图片画廊
- `LikeButton` / `FavoriteButton`（乐观更新）
- 作者信息、产品链接按钮

### Phase 3: 社交功能（Step 9-10）

**Step 9 — 点赞和收藏**
- POST `/api/works/[id]/like` 和 `/api/works/[id]/favorite`
- 增量更新 `popularityScore`
- 带乐观更新的交互按钮

**Step 10 — Top 10 页面**
- `GET /api/works/popular`：按 `popularityScore` 降序取 10
- 排名列表展示（1-10 名，奖牌图标）

### Phase 4: 用户主页与打磨（Step 11-12）

**Step 11 — 用户主页**
- `ProfileHeader`（头像、名称、标语、统计）
- `WorkManager`（显示/隐藏、置顶切换）
- 自动按热度排序作品展示
- `settings` 页面编辑资料

**Step 12 — 搜索优化与打磨**
- 搜索防抖 300ms
- 加载骨架屏
- 空状态组件
- Error Boundary / 404 页面
- Toast 通知
- 响应式设计
- 完善 seed 数据

---

## 项目文件结构（生成目标）

```
项目/先行/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── uploads/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── upload/page.tsx
│   │   ├── works/
│   │   │   ├── top/page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── profile/
│   │   │   ├── me/page.tsx
│   │   │   └── [userId]/page.tsx
│   │   ├── settings/page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── register/route.ts
│   │       │   ├── login/route.ts
│   │       │   ├── logout/route.ts
│   │       │   └── session/route.ts
│   │       ├── upload/route.ts
│   │       ├── works/
│   │       │   ├── route.ts
│   │       │   ├── popular/route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       ├── like/route.ts
│   │       │       └── favorite/route.ts
│   │       └── users/
│   │           └── [id]/
│   │               ├── route.ts
│   │               └── works/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthGuard.tsx
│   │   ├── work/
│   │   │   ├── WorkCard.tsx
│   │   │   ├── WorkGrid.tsx
│   │   │   ├── WorkDetail.tsx
│   │   │   ├── LikeButton.tsx
│   │   │   ├── FavoriteButton.tsx
│   │   │   ├── UploadForm.tsx
│   │   │   ├── EditForm.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   └── ImageGallery.tsx
│   │   ├── profile/
│   │   │   ├── ProfileHeader.tsx
│   │   │   └── WorkManager.tsx
│   │   └── ui/
│   │       ├── SearchBar.tsx
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Textarea.tsx
│   │       ├── Modal.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── EmptyState.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── validations.ts
│   │   └── constants.ts
│   ├── types/
│   │   └── index.ts
│   └── context/
│       └── AuthContext.tsx
├── middleware.ts
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

## UI 设计风格

- 深色背景 (`#0a0a0a`) + 金色强调 (`#d4a843`) + 卡片式设计
- Playfair Display 衬线字体用于标题，Inter 无衬线字体用于正文
- 卡片悬浮金色边框 + 微阴影效果
- 自定义滚动条、focus 环、渐变分割线

## 验证方式

1. `npm run dev` → `http://localhost:3000`
2. 注册 → 登录 → 上传作品 → 主页展示
3. 详情页点赞/收藏 → Top 10 更新
4. 用户主页隐藏/置顶 → 设置修改标语
5. 搜索功能验证
