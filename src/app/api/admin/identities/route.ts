import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { SUPER_ADMIN_EMAIL } from "@/lib/constants";

async function checkAuth() {
  const user = await getSessionUser();
  if (!user || user.email !== SUPER_ADMIN_EMAIL) return null;
  return user;
}

export async function GET(request: NextRequest) {
  const authed = await checkAuth();
  if (!authed) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") || "pending";

  const users = await prisma.user.findMany({
    where: { memberStatus: status },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      wechatName: true,
      wechatAccount: true,
      memberStatus: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const authed = await checkAuth();
  if (!authed) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const body = await request.json();
  const { userId, memberStatus } = body;

  if (!userId || !["approved", "rejected"].includes(memberStatus)) {
    return NextResponse.json({ error: "无效请求" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { memberStatus },
    select: { id: true, email: true, name: true, memberStatus: true },
  });

  return NextResponse.json({ user: updated });
}
