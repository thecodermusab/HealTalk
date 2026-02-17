import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
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

const ensureDevelopmentPsychologists = async () => {
  if (process.env.NODE_ENV === 'production') return;

  const existingCount = await prisma.psychologist.count();
  if (existingCount > 0) return;

  let hospital = await prisma.hospital.findFirst({
    where: { name: 'HealTalk Online Clinic' },
    select: { id: true },
  });
  if (!hospital) {
    hospital = await prisma.hospital.create({
      data: {
        name: 'HealTalk Online Clinic',
        location: 'Remote',
        address: 'Online',
        status: 'active',
      },
      select: { id: true },
    });
  }

  const demoPsychologists = [
    {
      name: 'Dr. Amina Noor',
      email: 'demo.psych1@healtalk.local',
      licenseNumber: 'DEMO-PSY-001',
      credentials: 'PhD, Clinical Psychologist',
      experience: 8,
      bio: 'Specializes in anxiety, stress, and emotional resilience.',
      specializations: ['Anxiety Disorders', 'Stress Management'],
      price60: 8000,
      price90: 11000,
      rating: 4.8,
      reviewCount: 48,
    },
    {
      name: 'Dr. Omar Hassan',
      email: 'demo.psych2@healtalk.local',
      licenseNumber: 'DEMO-PSY-002',
      credentials: 'PhD, Psychotherapist',
      experience: 10,
      bio: 'Focuses on depression recovery and trauma-informed care.',
      specializations: ['Depression', 'Trauma & PTSD'],
      price60: 9000,
      price90: 12500,
      rating: 4.9,
      reviewCount: 67,
    },
    {
      name: 'Dr. Sara Malik',
      email: 'demo.psych3@healtalk.local',
      licenseNumber: 'DEMO-PSY-003',
      credentials: 'PsyD, Counseling Psychologist',
      experience: 7,
      bio: 'Supports relationship challenges, burnout, and life transitions.',
      specializations: ['Family Therapy', 'Couples Counseling'],
      price60: 7500,
      price90: 10500,
      rating: 4.7,
      reviewCount: 39,
    },
  ] as const;

  for (const demo of demoPsychologists) {
    const user = await prisma.user.upsert({
      where: { email: demo.email },
      update: {
        name: demo.name,
        role: 'PSYCHOLOGIST',
        emailVerified: new Date(),
      },
      create: {
        name: demo.name,
        email: demo.email,
        role: 'PSYCHOLOGIST',
        emailVerified: new Date(),
      },
      select: { id: true },
    });

    const existingPsychologist = await prisma.psychologist.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (existingPsychologist) continue;

    await prisma.psychologist.create({
      data: {
        userId: user.id,
        credentials: demo.credentials,
        licenseNumber: demo.licenseNumber,
        experience: demo.experience,
        bio: demo.bio,
        specializations: [...demo.specializations],
        price60: demo.price60,
        price90: demo.price90,
        rating: demo.rating,
        reviewCount: demo.reviewCount,
        status: 'APPROVED',
        approvedAt: new Date(),
        hospitalId: hospital.id,
      },
    });
  }
};

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

    const buildWhere = (
      statuses: Array<'APPROVED' | 'PENDING'>
    ): Prisma.PsychologistWhereInput => {
      const where: Prisma.PsychologistWhereInput = {
        status: statuses.length === 1 ? statuses[0] : { in: statuses },
      };

      // Search by name
      if (search) {
        where.user = { is: { name: { contains: search, mode: 'insensitive' } } };
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

      return where;
    };

    let where = buildWhere(['APPROVED']);

    const isFirstPageWithoutFilters =
      page === 1 && !search && !specialization && minRating <= 0 && maxPrice >= 999999;
    const isDevelopment = process.env.NODE_ENV !== 'production';

    if (isDevelopment && isFirstPageWithoutFilters) {
      await ensureDevelopmentPsychologists();
    }

    const isPreparedStatementMissing = (error: unknown) =>
      error instanceof Error &&
      /prepared statement .* does not exist/i.test(error.message);

    const runListQuery = async ({
      whereInput,
      orderBy,
      skip,
      take,
    }: {
      whereInput: Prisma.PsychologistWhereInput;
      orderBy: Prisma.PsychologistOrderByWithRelationInput | Prisma.PsychologistOrderByWithRelationInput[];
      skip: number;
      take: number;
    }) =>
      Promise.all([
        prisma.psychologist.findMany({
          where: whereInput,
          include: {
            user: { select: { name: true, image: true } },
            hospital: { select: { name: true, location: true } },
          },
          orderBy,
          skip,
          take,
        }),
        prisma.psychologist.count({ where: whereInput }),
      ]);

    let psychologists;
    let total;
    try {
      [psychologists, total] = await runListQuery({
        whereInput: where,
        orderBy: { rating: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      });
    } catch (error) {
      if (!isPreparedStatementMissing(error)) throw error;
      [psychologists, total] = await runListQuery({
        whereInput: where,
        orderBy: { rating: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      });
    }

    let showingPendingFallback = false;
    if (total === 0 && isDevelopment && isFirstPageWithoutFilters) {
      where = buildWhere(['APPROVED', 'PENDING']);
      try {
        [psychologists, total] = await runListQuery({
          whereInput: where,
          orderBy: [{ status: 'asc' }, { rating: 'desc' }],
          skip: 0,
          take: limit,
        });
      } catch (error) {
        if (!isPreparedStatementMissing(error)) throw error;
        [psychologists, total] = await runListQuery({
          whereInput: where,
          orderBy: [{ status: 'asc' }, { rating: 'desc' }],
          skip: 0,
          take: limit,
        });
      }
      showingPendingFallback = total > 0;
    }

    return NextResponse.json({
      psychologists,
      showingPendingFallback,
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
