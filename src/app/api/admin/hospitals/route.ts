import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { parseSearchParams } from "@/lib/validation";

const querySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
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

  const { data, error } = parseSearchParams(request, querySchema);
  if (error) return error;
  const search = data.search || "";
  const status = data.status || "";
  const page = data.page;
  const limit = data.limit;

  const where: any = {};

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }

  const [hospitals, total] = await prisma.$transaction([
    prisma.hospital.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { psychologists: true } },
      },
    }),
    prisma.hospital.count({ where }),
  ]);

  return NextResponse.json({
    hospitals: hospitals.map((hospital) => ({
      id: hospital.id,
      name: hospital.name,
      location: hospital.location,
      address: hospital.address,
      status: hospital.status,
      createdAt: hospital.createdAt,
      psychologistCount: hospital._count.psychologists,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
