import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const where = {
      published: true,
    };

    const [episodes, total] = await Promise.all([
      prisma.podcastEpisode.findMany({
        where,
        orderBy: { episodeNumber: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.podcastEpisode.count({ where }),
    ]);

    return NextResponse.json({
      episodes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching podcast episodes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch podcast episodes' },
      { status: 500 }
    );
  }
}
