import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { ADMIN_EMAILS } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    // Extract client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";

    // IP rate limit: max 1 successful registration per IP per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ipCount = await prisma.user.count({
      where: {
        ip,
        createdAt: { gte: today },
      },
    });

    if (ipCount >= 1) {
      return NextResponse.json(
        { error: "该IP今日注册次数已达上限" },
        { status: 429 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 409 });
    }

    const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";
    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, role, ip },
    });

    await setSessionCookie(user.id);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
