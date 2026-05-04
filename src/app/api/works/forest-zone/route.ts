import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const workInclude = {
  author: {
    select: { id: true, name: true, avatarUrl: true },
  },
  images: {
    orderBy: { sortOrder: "asc" as const },
    take: 1,
  },
  _count: {
    select: { likes: true, favorites: true },
  },
};

export async function GET() {
  try {
    const forestAdmin = await prisma.user.findFirst({
      where: { isForestAdmin: true },
      select: { id: true },
    });

    if (!forestAdmin) {
      return NextResponse.json({ reviewedWorks: [], favoritedWorks: [] });
    }

    const forestAdminId = forestAdmin.id;

    const [reviewedWorks, favoritedWorks] = await Promise.all([
      // Works reviewed by the forest admin
      prisma.work.findMany({
        where: {
          isVisible: true,
          comments: {
            some: { isReview: true, userId: forestAdminId },
          },
        },
        orderBy: { createdAt: "desc" },
        include: workInclude,
      }),
      // Works favorited by the forest admin
      prisma.work.findMany({
        where: {
          isVisible: true,
          favorites: {
            some: { userId: forestAdminId },
          },
        },
        orderBy: { createdAt: "desc" },
        include: workInclude,
      }),
    ]);

    return NextResponse.json({ reviewedWorks, favoritedWorks });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
