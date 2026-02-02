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
  status: z.enum(["APPROVED", "PENDING", "REJECTED"]),
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
    key: "admin:reviews:update",
    limit: 60,
    window: "1 m",
  });
  if (rateLimit) return rateLimit;

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  const { data, error } = await parseJson(request, updateSchema);
  if (error) return error;
  const status = data.status;

  const existing = await prisma.review.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const updated = await prisma.review.update({
    where: { id: params.id },
    data: {
      status,
      moderatedAt: new Date(),
    },
    select: {
      id: true,
      status: true,
      moderatedAt: true,
    },
  });

  await createAuditLog({
    actorId: session.user.id,
    action: "ADMIN_REVIEW_UPDATE",
    targetType: "Review",
    targetId: updated.id,
    metadata: { status: updated.status },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
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
    key: "admin:reviews:delete",
    limit: 30,
    window: "1 m",
  });
  if (rateLimit) return rateLimit;

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  await prisma.review.delete({ where: { id: params.id } });

  await createAuditLog({
    actorId: session.user.id,
    action: "ADMIN_REVIEW_DELETE",
    targetType: "Review",
    targetId: params.id,
  });

  return NextResponse.json({ ok: true });
}
