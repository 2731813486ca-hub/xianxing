import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "onboarding@resend.dev";

export async function POST(request: Request) {
  try {
    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: "邮件服务未配置" },
        { status: 500 }
      );
    }

    const { email } = await request.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "请输入有效的邮箱地址" }, { status: 400 });
    }

    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";

    // Rate limit: max 2 codes per IP per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await prisma.verificationCode.count({
      where: {
        ip,
        createdAt: { gte: today },
      },
    });

    if (count >= 2) {
      return NextResponse.json(
        { error: "今日验证码请求已达上限（每日最多2次）" },
        { status: 429 }
      );
    }

    // Check if email already registered
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 409 });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in DB
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        ip,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
      },
    });

    // Send email via Resend
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: `先行 <${RESEND_FROM}>`,
      to: email,
      subject: "您的先行注册验证码",
      html: `
        <div style="max-width:480px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,sans-serif">
          <h2 style="color:#d7aa45;font-size:20px;font-weight:600;margin:0 0 16px">先行 · 注册验证码</h2>
          <p style="color:#333;font-size:14px;line-height:1.6;margin:0 0 24px">
            请使用以下验证码完成注册，验证码有效期为 <strong>15 分钟</strong>。
          </p>
          <div style="background:#f5f5f5;border-radius:8px;padding:20px;text-align:center;margin-bottom:24px">
            <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#1a1a1a;font-family:monospace">${code}</span>
          </div>
          <p style="color:#999;font-size:12px;line-height:1.5;margin:0">
            如非本人操作，请忽略此邮件。
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "验证码已发送" });
  } catch (error) {
    console.error("send-code error:", error);
    return NextResponse.json({ error: "验证码发送失败，请稍后重试" }, { status: 500 });
  }
}
