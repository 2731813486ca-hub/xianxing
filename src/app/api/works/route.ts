import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { workSchema } from "@/lib/validations";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "latest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE)))
    );

    const orderBy =
      sort === "popular"
        ? { popularityScore: "desc" as const }
        : { createdAt: "desc" as const };

    const where = {
      isVisible: true,
      ...(query
        ? {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.work.findMany({
        where,
        orderBy,
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
            select: { likes: true, favorites: true },
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

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
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

    const work = await prisma.work.create({
      data: {
        title,
        description,
        productUrl,
        authorId: userId,
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

    return NextResponse.json(work, { status: 201 });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
