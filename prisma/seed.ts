import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, { arrayMode: false, fullResults: false });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("123456", 12);

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      password,
      name: "Alice",
      bio: "独立设计师 & 插画师",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      password,
      name: "Bob",
      bio: "前端开发 & 创意编程",
    },
  });

  const demo = await prisma.user.upsert({
    where: { email: "demo@xianxing.app" },
    update: {},
    create: {
      email: "demo@xianxing.app",
      password,
      name: "演示账号",
      bio: "先行平台演示账号",
    },
  });

  const works = [
    {
      authorId: alice.id,
      title: "山水之间",
      description: "一组受中国传统水墨画启发的数字插画系列，探索虚实之间的平衡。",
      isVisible: true,
      isPinned: true,
      images: [
        "https://picsum.photos/seed/art1/800/600",
        "https://picsum.photos/seed/art2/800/600",
      ],
    },
    {
      authorId: alice.id,
      title: "城市光影",
      description: "记录城市建筑在不同光线下的几何美学。",
      isVisible: true,
      images: [
        "https://picsum.photos/seed/city1/800/600",
        "https://picsum.photos/seed/city2/800/600",
        "https://picsum.photos/seed/city3/800/600",
      ],
    },
    {
      authorId: bob.id,
      title: "交互式数据可视化",
      description: "一个用 D3.js 构建的实时数据可视化项目，展示网络流量模式。",
      productUrl: "https://example.com/viz",
      isVisible: true,
      isPinned: true,
      images: [
        "https://picsum.photos/seed/viz1/800/600",
        "https://picsum.photos/seed/viz2/800/600",
      ],
    },
    {
      authorId: bob.id,
      title: "极简主义图标集",
      description: "一套包含 100+ 个极简风格的系统图标，适用于 Web 和移动应用。",
      isVisible: true,
      images: [
        "https://picsum.photos/seed/icons1/800/600",
      ],
    },
    {
      authorId: demo.id,
      title: "未来界面概念",
      description: "探索科幻电影中未来用户界面的实用化设计方向。",
      isVisible: true,
      isPinned: true,
      images: [
        "https://picsum.photos/seed/ui1/800/600",
        "https://picsum.photos/seed/ui2/800/600",
        "https://picsum.photos/seed/ui3/800/600",
      ],
    },
    {
      authorId: demo.id,
      title: "自然之韵",
      description: "用生成式艺术再现自然界中的分形与纹理。",
      isVisible: true,
      images: [
        "https://picsum.photos/seed/nature1/800/600",
        "https://picsum.photos/seed/nature2/800/600",
      ],
    },
  ];

  for (const work of works) {
    const { images, ...workData } = work;
    await prisma.work.create({
      data: {
        ...workData,
        images: {
          create: images.map((url, i) => ({
            url,
            alt: workData.title,
            sortOrder: i,
          })),
        },
      },
    });
  }

  console.log("Seed data created successfully!");
  console.log("Demo accounts (password: 123456):");
  console.log("  - alice@example.com");
  console.log("  - bob@example.com");
  console.log("  - demo@xianxing.app");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
