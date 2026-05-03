import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { workSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getSessionUserId();

    const work = await prisma.work.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true, bio: true },
        },
        images: { orderBy: { sortOrder: "asc" } },
        _count: { select: { likes: true, favorites: true } },
      },
    });

    if (!work) {
      return NextResponse.json({ error: "作品不存在" }, { status: 404 });
    }

    const [userLiked, userFavorited] = userId
      ? await Promise.all([
          prisma.like.findUnique({
            where: { userId_workId: { userId, workId: id } },
          }),
          prisma.favorite.findUnique({
            where: { userId_workId: { userId, workId: id } },
          }),
        ])
      : [null, null];

    return NextResponse.json({
      ...work,
      userLiked: !!userLiked,
      userFavorited: !!userFavorited,
    });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const work = await prisma.work.findUnique({ where: { id } });
    if (!work) {
      return NextResponse.json({ error: "作品不存在" }, { status: 404 });
    }
    if (work.authorId !== userId) {
      return NextResponse.json({ error: "无权操作" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = workSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, description, productUrl, imageUrls } = parsed.data;

    await prisma.workImage.deleteMany({ where: { workId: id } });

    const updated = await prisma.work.update({
      where: { id },
      data: {
        title,
        description,
        productUrl,
        images: {
          create: imageUrls.map((url, i) => ({
            url,
            alt: title,
            sortOrder: i,
          })),
        },
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const work = await prisma.work.findUnique({ where: { id } });
    if (!work) {
      return NextResponse.json({ error: "作品不存在" }, { status: 404 });
    }
    if (work.authorId !== userId) {
      return NextResponse.json({ error: "无权操作" }, { status: 403 });
    }

    await prisma.work.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
