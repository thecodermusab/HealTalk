import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || "10", 10), 1),
    50
  );

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

  const data = psychologists.map(({ credentialDocumentKey, ...rest }) => ({
    ...rest,
    hasCredentialDocument: Boolean(credentialDocumentKey),
  }));

  return NextResponse.json({
    psychologists: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
