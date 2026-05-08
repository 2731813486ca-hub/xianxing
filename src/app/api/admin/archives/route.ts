import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { archiveSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = archiveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const archive = await prisma.archive.create({ data: parsed.data });

    return NextResponse.json(archive, { status: 201 });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
