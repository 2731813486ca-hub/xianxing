import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { POPULARITY_WEIGHTS } from "@/lib/constants";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_workId: { userId, workId: id } },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { userId_workId: { userId, workId: id } },
      });
      await prisma.work.update({
        where: { id },
        data: { popularityScore: { decrement: POPULARITY_WEIGHTS.FAVORITE } },
      });
      return NextResponse.json({ favorited: false });
    } else {
      await prisma.favorite.create({ data: { userId, workId: id } });
      await prisma.work.update({
        where: { id },
        data: { popularityScore: { increment: POPULARITY_WEIGHTS.FAVORITE } },
      });
      return NextResponse.json({ favorited: true });
    }
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
