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
  const q = searchParams.get("q") || "";

  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    select: { id: true, email: true, name: true, role: true, isForestAdmin: true, createdAt: true },
  });

  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const authed = await checkAuth();
  if (!authed) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const body = await request.json();
  const { userId, role } = body;

  if (!userId || !["user", "admin"].includes(role)) {
    return NextResponse.json({ error: "无效请求" }, { status: 400 });
  }

  if (userId === authed.id && role !== "admin") {
    return NextResponse.json({ error: "不能取消自己的管理员权限" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, email: true, name: true, role: true, isForestAdmin: true },
  });

  return NextResponse.json({ user: updated });
}
