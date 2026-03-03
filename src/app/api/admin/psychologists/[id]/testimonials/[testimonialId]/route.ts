import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRateLimit } from "@/lib/rate-limit";
import { validateCsrf } from "@/lib/csrf";
import { parseJson } from "@/lib/validation";

const updateSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    role: z.string().trim().optional(),
    text: z.string().trim().min(1).optional(),
    image: z.string().trim().url().optional().nullable(),
  })
  .refine((value) => Object.values(value).some((entry) => entry !== undefined), {
    message: "No fields to update",
  });

const ensureAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
};

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; testimonialId: string }>;
  }
) {
  const authError = await ensureAdmin();
  if (authError) return authError;

  const rateLimit = await requireRateLimit({
    request,
    key: "admin:psychologists:testimonials:update",
    limit: 60,
    window: "1 m",
  });
  if (rateLimit) return rateLimit;

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  const { data: body, error } = await parseJson(request, updateSchema);
  if (error) return error;

  const { id, testimonialId } = await params;

  const existing = await prisma.psychologistTestimonial.findFirst({
    where: { id: testimonialId, psychologistId: id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }

  const testimonial = await prisma.psychologistTestimonial.update({
    where: { id: testimonialId },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.role !== undefined ? { role: body.role?.trim() || null } : {}),
      ...(body.text !== undefined ? { text: body.text } : {}),
      ...(body.image !== undefined ? { image: body.image?.trim() || null } : {}),
    },
    select: {
      id: true,
      psychologistId: true,
      name: true,
      role: true,
      text: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ testimonial });
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; testimonialId: string }>;
  }
) {
  const authError = await ensureAdmin();
  if (authError) return authError;

  const rateLimit = await requireRateLimit({
    request,
    key: "admin:psychologists:testimonials:delete",
    limit: 60,
    window: "1 m",
  });
  if (rateLimit) return rateLimit;

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  const { id, testimonialId } = await params;

  const existing = await prisma.psychologistTestimonial.findFirst({
    where: { id: testimonialId, psychologistId: id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }

  await prisma.psychologistTestimonial.delete({
    where: { id: testimonialId },
  });

  return NextResponse.json({ ok: true });
}
