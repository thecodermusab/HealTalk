import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRateLimit } from "@/lib/rate-limit";

// GET /api/sessions - List all sessions with filters
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await requireRateLimit({
      request,
      key: "sessions:list",
      limit: 60,
      window: "1 m",
    });
    if (rateLimit) return rateLimit;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // ONE_ON_ONE or GROUP
    const psychologistId = searchParams.get("psychologistId");
    const status = searchParams.get("status");
    const fromDate = searchParams.get("fromDate");

    const where: any = {};

    if (type) where.type = type;
    if (psychologistId) where.psychologistId = psychologistId;
    if (status) where.status = status;
    if (fromDate) {
      where.date = {
        gte: new Date(fromDate),
      };
    }

    const sessions = await prisma.therapySession.findMany({
      where,
      include: {
        psychologist: {
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
        },
        participants: {
          include: {
            patient: {
              include: {
                user: {
                  select: { name: true, image: true },
                },
              },
            },
          },
        },
        _count: {
          select: { participants: true },
        },
      },
      orderBy: { startTime: "asc" },
    });

    // Calculate available spots for each session
    const sessionsWithAvailability = sessions.map((session) => ({
      ...session,
      availableSpots: session.maxParticipants - session._count.participants,
      isFull: session._count.participants >= session.maxParticipants,
    }));

    return NextResponse.json({ sessions: sessionsWithAvailability });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create new session (psychologist only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (role !== "PSYCHOLOGIST") {
      return NextResponse.json(
        { error: "Only psychologists can create sessions" },
        { status: 403 }
      );
    }

    const rateLimit = await requireRateLimit({
      request,
      key: "sessions:create",
      limit: 10,
      window: "1 h",
    });
    if (rateLimit) return rateLimit;

    const psychologist = await prisma.psychologist.findUnique({
      where: { userId },
    });

    if (!psychologist) {
      return NextResponse.json(
        { error: "Psychologist profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      maxParticipants,
      date,
      startTime,
      endTime,
      duration,
      pricePerPerson,
    } = body;

    // Validation
    if (!title || !type || !maxParticipants || !date || !startTime || !endTime || !duration || !pricePerPerson) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (type === "GROUP" && maxParticipants < 2) {
      return NextResponse.json(
        { error: "Group sessions must have at least 2 participants" },
        { status: 400 }
      );
    }

    if (maxParticipants > 10) {
      return NextResponse.json(
        { error: "Maximum 10 participants allowed" },
        { status: 400 }
      );
    }

    const newSession = await prisma.therapySession.create({
      data: {
        psychologistId: psychologist.id,
        title,
        description,
        type,
        maxParticipants,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration,
        pricePerPerson,
        status: "SCHEDULED",
      },
      include: {
        psychologist: {
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ session: newSession }, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
