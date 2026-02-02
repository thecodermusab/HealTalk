import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const published = typeof body?.published === "boolean" ? body.published : null;

  if (published === null) {
    return NextResponse.json({ error: "Invalid published value" }, { status: 400 });
  }

  const existing = await prisma.blogPost.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  const updated = await prisma.blogPost.update({
    where: { id: params.id },
    data: { published },
    select: { id: true, published: true },
  });

  return NextResponse.json(updated);
}
