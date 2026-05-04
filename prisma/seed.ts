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

  const admin = await prisma.user.upsert({
    where: { email: "admin@xianxing.app" },
    update: {},
    create: {
      email: "admin@xianxing.app",
      password,
      name: "管理员",
      bio: "先行平台管理员",
      role: "admin",
    },
  });

  const worksData = [
    { title: "山水之间", description: "一组受中国传统水墨画启发的数字插画系列，探索虚实之间的平衡。", authorId: alice.id, isVisible: true, isPinned: true,
      images: ["https://picsum.photos/seed/art1/800/600", "https://picsum.photos/seed/art2/800/600"] },
    { title: "城市光影", description: "记录城市建筑在不同光线下的几何美学。", authorId: alice.id, isVisible: true,
      images: ["https://picsum.photos/seed/city1/800/600", "https://picsum.photos/seed/city2/800/600", "https://picsum.photos/seed/city3/800/600"] },
    { title: "交互式数据可视化", description: "一个用 D3.js 构建的实时数据可视化项目，展示网络流量模式。", productUrl: "https://example.com/viz", authorId: bob.id, isVisible: true, isPinned: true,
      images: ["https://picsum.photos/seed/viz1/800/600", "https://picsum.photos/seed/viz2/800/600"] },
    { title: "极简主义图标集", description: "一套包含 100+ 个极简风格的系统图标，适用于 Web 和移动应用。", authorId: bob.id, isVisible: true,
      images: ["https://picsum.photos/seed/icons1/800/600"] },
    { title: "未来界面概念", description: "探索科幻电影中未来用户界面的实用化设计方向。", authorId: demo.id, isVisible: true, isPinned: true,
      images: ["https://picsum.photos/seed/ui1/800/600", "https://picsum.photos/seed/ui2/800/600", "https://picsum.photos/seed/ui3/800/600"] },
    { title: "自然之韵", description: "用生成式艺术再现自然界中的分形与纹理。", authorId: demo.id, isVisible: true,
      images: ["https://picsum.photos/seed/nature1/800/600", "https://picsum.photos/seed/nature2/800/600"] },
  ];

  for (const w of worksData) {
    const { images, ...workData } = w;
    const work = await prisma.work.create({ data: workData });
    for (let i = 0; i < images.length; i++) {
      await prisma.workImage.create({
        data: { url: images[i], alt: workData.title, sortOrder: i, workId: work.id },
      });
    }
  }

  // Add admin reviews on first two works
  const allWorks = await prisma.work.findMany({ take: 2 });
  if (allWorks.length > 0) {
    await prisma.comment.create({
      data: {
        content: "这个作品展现了出色的创意和执行力，是独立开发者精神的典范。从概念到实现都体现了高度的专业水准。",
        isReview: true, userId: admin.id, workId: allWorks[0].id,
      },
    });
    if (allWorks.length > 1) {
      await prisma.comment.create({
        data: {
          content: "独特的设计视角，在用户体验和视觉美学之间找到了很好的平衡。值得推荐给更多创作者参考。",
          isReview: true, userId: admin.id, workId: allWorks[1].id,
        },
      });
    }
    await prisma.comment.create({
      data: { content: "很喜欢这个作品！细节处理得很到位。", isReview: false, userId: alice.id, workId: allWorks[0].id },
    });
    await prisma.comment.create({
      data: { content: "很有启发，期待看到更多类似的作品。", isReview: false, userId: demo.id, workId: allWorks[0].id },
    });
  }

  console.log("Seed data created successfully!");
  console.log("Demo accounts (password: 123456):");
  console.log("  - alice@example.com");
  console.log("  - bob@example.com");
  console.log("  - demo@xianxing.app");
  console.log("  - admin@xianxing.app (管理员)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
