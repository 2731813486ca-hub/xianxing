import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { SUPER_ADMIN_EMAIL } from "@/lib/constants";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.email !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ error: "无权操作" }, { status: 403 });
    }

    const pendingIdentities = await prisma.user.count({
      where: { memberStatus: "pending" },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRegistrations = await prisma.user.count({
      where: { createdAt: { gte: today } },
    });

    return NextResponse.json({
      pendingIdentities,
      todayRegistrations,
      total: pendingIdentities + todayRegistrations,
    });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
