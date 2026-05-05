import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { profileSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        memberStatus: true,
        bio: true,
        avatarUrl: true,
        wechatName: true,
        wechatAccount: true,
        _count: { select: { works: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json(user);
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
    if (!userId || userId !== id) {
      return NextResponse.json({ error: "无权操作" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Determine memberStatus: if wechat fields filled and currently unfilled, submit for review
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { memberStatus: true },
    });

    let memberStatus = undefined;
    const { wechatName, wechatAccount } = parsed.data;
    if (
      currentUser?.memberStatus === "unfilled" &&
      (wechatName || wechatAccount)
    ) {
      memberStatus = "pending";
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (memberStatus) {
      updateData.memberStatus = memberStatus;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        memberStatus: true,
        bio: true,
        avatarUrl: true,
        wechatName: true,
        wechatAccount: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
