import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/psychologists - Get all psychologists with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const location = searchParams.get("location");
    const specialization = searchParams.get("specialization");
    const minRating = searchParams.get("minRating");
    const hospital = searchParams.get("hospital");

    const where: any = {
      status: "APPROVED",
    };

    if (location) {
      where.hospital = {
        location: { contains: location, mode: "insensitive" },
      };
    }

    if (specialization) {
      where.specializations = { has: specialization };
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating) };
    }

    if (hospital) {
      where.hospital = {
        ...where.hospital,
        name: { contains: hospital, mode: "insensitive" },
      };
    }

    const psychologists = await prisma.psychologist.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        hospital: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { rating: "desc" },
    });

    return NextResponse.json(psychologists);
  } catch (error) {
    console.error("Error fetching psychologists:", error);
    return NextResponse.json(
      { error: "Failed to fetch psychologists" },
      { status: 500 }
    );
  }
}
