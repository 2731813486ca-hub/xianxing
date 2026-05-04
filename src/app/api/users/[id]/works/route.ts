import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getSessionUserId();
    const isOwner = userId === id;

    const works = await prisma.work.findMany({
      where: {
        authorId: id,
        ...(isOwner ? {} : { isVisible: true }),
      },
      orderBy: [{ isPinned: "desc" }, { popularityScore: "desc" }, { createdAt: "desc" }],
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
        images: { orderBy: { sortOrder: "asc" } },
        _count: { select: { likes: true, favorites: true } },
      },
    });

    return NextResponse.json({ items: works });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
