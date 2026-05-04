import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalWorks, totalUsers, totalLikes, totalFavorites] =
      await Promise.all([
        prisma.work.count({ where: { isVisible: true } }),
        prisma.user.count(),
        prisma.like.count(),
        prisma.favorite.count(),
      ]);

    return NextResponse.json({
      totalWorks,
      totalUsers,
      totalLikes,
      totalFavorites,
    });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
