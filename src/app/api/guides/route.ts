import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { parseSearchParams } from '@/lib/validation';

const querySchema = z.object({
  theme: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export async function GET(request: Request) {
  try {
    const { data, error } = parseSearchParams(request, querySchema);
    if (error) return error;
    const theme = data.theme || '';
    const page = data.page;
    const limit = data.limit;

    const where: any = {
      published: true,
    };

    if (theme) {
      where.theme = theme;
    }

    const [guides, total] = await Promise.all([
      prisma.guide.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.guide.count({ where }),
    ]);

    return NextResponse.json({
      guides,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching guides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guides' },
      { status: 500 }
    );
  }
}
