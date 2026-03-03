import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRateLimit } from "@/lib/rate-limit";
import { validateCsrf } from "@/lib/csrf";
import { parseJson } from "@/lib/validation";

const createSchema = z.object({
  name: z.string().trim().min(1),
  role: z.string().trim().optional(),
  text: z.string().trim().min(1),
  image: z.string().trim().url().optional(),
});

const ensureAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { error: null };
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await ensureAdmin();
  if (error) return error;

  const rateLimit = await requireRateLimit({
    request,
    key: "admin:psychologists:testimonials:list",
    limit: 120,
    window: "1 m",
  });
  if (rateLimit) return rateLimit;

  const { id } = await params;

  const testimonials = await prisma.psychologistTestimonial.findMany({
    where: { psychologistId: id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      role: true,
      text: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ testimonials });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await ensureAdmin();
  if (error) return error;

  const rateLimit = await requireRateLimit({
    request,
    key: "admin:psychologists:testimonials:create",
    limit: 60,
    window: "1 m",
  });
  if (rateLimit) return rateLimit;

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  const { data: body, error: parseError } = await parseJson(request, createSchema);
  if (parseError) return parseError;

  const { id } = await params;

  const psychologist = await prisma.psychologist.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!psychologist) {
    return NextResponse.json({ error: "Psychologist not found" }, { status: 404 });
  }

  const testimonial = await prisma.psychologistTestimonial.create({
    data: {
      psychologistId: id,
      name: body.name,
      role: body.role?.trim() || "Patient",
      text: body.text,
      image: body.image?.trim() || null,
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

  return NextResponse.json({ testimonial }, { status: 201 });
}
