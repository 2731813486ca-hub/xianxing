# 先行 — 作品展示平台

深色主题的作品展示平台，支持上传、点赞、收藏、搜索和用户主页。

## 技术栈

- **Next.js 16** (App Router) + TypeScript
- **Prisma 7** + **PostgreSQL** (Neon) / SQLite
- **Tailwind CSS v4** — 深色主题 + 金色强调色
- **JWT + httpOnly Cookie** — 邮箱认证
- **Zod v4** — 表单验证

## 功能

- 用户注册/登录（邮箱）
- 作品上传（图片，最多 5 张）
- 作品浏览、搜索、分页
- 点赞/收藏（带乐观更新）
- Top 10 热门作品排行榜
- 用户主页 + 个人资料编辑
- 作品可见性管理

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 初始化数据库
npx prisma db push
npm run seed

# 3. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 演示账号（密码统一：123456）

| 邮箱 | 角色 |
|------|------|
| alice@example.com | 设计师 |
| bob@example.com | 开发者 |
| demo@xianxing.app | 演示账号 |

## 部署

### 生产数据库（Neon PostgreSQL 免费版）

1. 访问 https://neon.tech 注册免费账号
2. 创建新项目，复制 `DATABASE_URL`
3. 设置环境变量：`DATABASE_URL` 和 `JWT_SECRET`

### Vercel 自动部署

已关联 GitHub 仓库，推送代码到 `master` 分支自动部署。

## 环境变量

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 连接字符串 |
| `JWT_SECRET` | JWT 签名密钥 |

## 文件结构

```
src/
├── app/
│   ├── api/          # API 路由 (auth, works, users, upload)
│   ├── (auth)/       # 登录/注册页面
│   ├── upload/       # 上传页面
│   ├── works/        # 作品详情/编辑/Top10
│   ├── profile/      # 用户主页
│   └── settings/     # 个人设置
├── components/
│   ├── auth/         # 登录/注册表单
│   ├── layout/       # 导航栏
│   ├── profile/      # 用户资料组件
│   ├── ui/           # 通用 UI 组件
│   └── work/         # 作品相关组件
├── context/          # AuthContext
├── lib/              # 工具函数 (prisma, auth, validations)
└── types/            # TypeScript 类型
```
