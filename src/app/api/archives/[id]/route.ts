import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const archive = await prisma.archive.findUnique({ where: { id } });

    if (!archive || archive.status !== "published") {
      return NextResponse.json({ error: "档案不存在" }, { status: 404 });
    }

    return NextResponse.json(archive);
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
