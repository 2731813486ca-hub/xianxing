import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE)))
    );

    const where = {
      isVisible: true,
      comments: {
        some: { isReview: true },
      },
    };

    const [items, total] = await Promise.all([
      prisma.work.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
          _count: {
            select: { likes: true, favorites: true, comments: { where: { isReview: true } } },
          },
        },
      }),
      prisma.work.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
