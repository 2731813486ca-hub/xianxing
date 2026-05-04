import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { SUPER_ADMIN_EMAIL } from "@/lib/constants";

async function checkAuth() {
  const user = await getSessionUser();
  if (!user || user.email !== SUPER_ADMIN_EMAIL) return null;
  return user;
}

export async function GET() {
  const authed = await checkAuth();
  if (!authed) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const forestAdmin = await prisma.user.findFirst({
    where: { isForestAdmin: true },
    select: { id: true, email: true, name: true, role: true },
  });

  return NextResponse.json({ forestAdmin });
}

export async function POST(request: Request) {
  const authed = await checkAuth();
  if (!authed) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "请输入邮箱" }, { status: 400 });
  }

  const targetUser = await prisma.user.findUnique({ where: { email } });
  if (!targetUser) {
    return NextResponse.json({ error: "未找到该用户" }, { status: 404 });
  }

  // Remove forest admin from previous holder
  await prisma.user.updateMany({
    where: { isForestAdmin: true },
    data: { isForestAdmin: false },
  });

  // Set new forest admin
  await prisma.user.update({
    where: { id: targetUser.id },
    data: { isForestAdmin: true },
  });

  return NextResponse.json({
    forestAdmin: { id: targetUser.id, email: targetUser.email, name: targetUser.name },
  });
}
