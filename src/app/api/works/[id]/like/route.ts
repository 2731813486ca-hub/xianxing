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

    const existing = await prisma.like.findUnique({
      where: { userId_workId: { userId, workId: id } },
    });

    if (existing) {
      await prisma.like.delete({
        where: { userId_workId: { userId, workId: id } },
      });
      await prisma.work.update({
        where: { id },
        data: { popularityScore: { decrement: POPULARITY_WEIGHTS.LIKE } },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.like.create({ data: { userId, workId: id } });
      await prisma.work.update({
        where: { id },
        data: { popularityScore: { increment: POPULARITY_WEIGHTS.LIKE } },
      });
      return NextResponse.json({ liked: true });
    }
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
