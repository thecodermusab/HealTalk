import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const specialization = searchParams.get('specialization') || '';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '999999');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

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
