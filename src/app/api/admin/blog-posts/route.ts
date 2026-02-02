import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { parseSearchParams } from "@/lib/validation";
import { requireRateLimit } from "@/lib/rate-limit";

const querySchema = z.object({
  search: z.string().optional(),
  published: z.string().optional(),
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
    key: "admin:blog-posts:list",
    limit: 120,
    window: "1 m",
  });
  if (rateLimit) return rateLimit;

  const { data, error } = parseSearchParams(request, querySchema);
  if (error) return error;
  const search = data.search || "";
  const published = data.published || "";
  const page = data.page;
  const limit = data.limit;

  const where: any = {};

  if (published === "true") {
    where.published = true;
  }

  if (published === "false") {
    where.published = false;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await prisma.$transaction([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        category: true,
        date: true,
        published: true,
        createdAt: true,
        author: {
          select: { name: true, role: true },
        },
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
