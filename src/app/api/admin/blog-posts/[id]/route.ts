import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { parseJson } from "@/lib/validation";
import { requireRateLimit } from "@/lib/rate-limit";
import { validateCsrf } from "@/lib/csrf";
import { createAuditLog } from "@/lib/audit";

const updateSchema = z.object({
  published: z.boolean(),
});

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

  const rateLimit = await requireRateLimit({
    request,
    key: "admin:blog-posts:update",
    limit: 60,
    window: "1 m",
  });
  if (rateLimit) return rateLimit;

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  const { data, error } = await parseJson(request, updateSchema);
  if (error) return error;
  const { published } = data;

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

  await createAuditLog({
    actorId: session.user.id,
    action: "ADMIN_BLOG_PUBLISH",
    targetType: "BlogPost",
    targetId: updated.id,
    metadata: { published: updated.published },
  });

  return NextResponse.json(updated);
}
