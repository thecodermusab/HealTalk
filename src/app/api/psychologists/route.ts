import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { parseSearchParams } from '@/lib/validation';

const querySchema = z.object({
  search: z.string().optional(),
  specialization: z.string().optional(),
  minRating: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(request: Request) {
  try {
    const { data, error } = parseSearchParams(request, querySchema);
    if (error) return error;
    const search = data.search || '';
    const specialization = data.specialization || '';
    const minRating = data.minRating ?? 0;
    const maxPrice = data.maxPrice ?? 999999;
    const page = data.page;
    const limit = data.limit;

    const where: any = {
      status: 'APPROVED',
    };

    // Search by name
    if (search) {
      where.user = { name: { contains: search, mode: 'insensitive' } };
    }

    // Filter by specialization
    if (specialization) {
      where.specializations = { has: specialization };
    }

    // Filter by rating
    if (minRating > 0) {
      where.rating = { gte: minRating };
    }

    // Filter by max price (check price60)
    if (maxPrice < 999999) {
      where.price60 = { lte: maxPrice * 100 }; // Convert to cents
    }

    const [psychologists, total] = await Promise.all([
      prisma.psychologist.findMany({
        where,
        include: {
          user: { select: { name: true, image: true } },
          hospital: { select: { name: true, location: true } },
        },
        orderBy: { rating: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.psychologist.count({ where }),
    ]);

    return NextResponse.json({
      psychologists,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching psychologists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch psychologists' },
      { status: 500 }
    );
  }
}
