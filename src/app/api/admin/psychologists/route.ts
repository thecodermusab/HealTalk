import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { parseSearchParams } from "@/lib/validation";
import { requireRateLimit } from "@/lib/rate-limit";

const ALLOWED_STATUSES = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];
const querySchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rateLimit = await requireRateLimit({
    request,
    key: "admin:psychologists:list",
    limit: 120,
    window: "1 m",
  });
  if (rateLimit) return rateLimit;

  const { data, error } = parseSearchParams(request, querySchema);
  if (error) return error;
  const status = data.status || "";
  const search = data.search || "";
  const page = data.page;
  const limit = data.limit;

  const where: any = {};

  if (status && status !== "ALL" && ALLOWED_STATUSES.includes(status)) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { user: { is: { name: { contains: search, mode: "insensitive" } } } },
      { user: { is: { email: { contains: search, mode: "insensitive" } } } },
      { licenseNumber: { contains: search, mode: "insensitive" } },
    ];
  }

  const [psychologists, total] = await prisma.$transaction([
    prisma.psychologist.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        credentials: true,
        licenseNumber: true,
        experience: true,
        specializations: true,
        status: true,
        approvedAt: true,
        rejectedAt: true,
        rejectionReason: true,
        createdAt: true,
        credentialDocumentKey: true,
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        hospital: {
          select: { name: true, location: true },
        },
      },
    }),
    prisma.psychologist.count({ where }),
  ]);

  const psychologistsData = psychologists.map(({ credentialDocumentKey, ...rest }) => ({
    ...rest,
    hasCredentialDocument: Boolean(credentialDocumentKey),
  }));

  return NextResponse.json({
    psychologists: psychologistsData,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
