import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TOP_WORKS_COUNT } from "@/lib/constants";

export async function GET() {
  try {
    const items = await prisma.work.findMany({
      where: { isVisible: true },
      orderBy: { popularityScore: "desc" },
      take: TOP_WORKS_COUNT,
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
        _count: {
          select: { likes: true, favorites: true },
        },
      },
    });

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
