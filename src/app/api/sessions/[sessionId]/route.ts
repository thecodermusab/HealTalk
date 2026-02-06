import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRateLimit } from "@/lib/rate-limit";

// GET /api/sessions/[sessionId] - Get session details
export async function GET(
  request: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await requireRateLimit({
      request,
      key: "sessions:get",
      limit: 60,
      window: "1 m",
    });
    if (rateLimit) return rateLimit;

    const { sessionId } = await context.params;

    const therapySession = await prisma.therapySession.findUnique({
      where: { id: sessionId },
      include: {
        psychologist: {
          include: {
            user: {
              select: { name: true, image: true, email: true },
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
    });

    if (!therapySession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const availableSpots = therapySession.maxParticipants - therapySession._count.participants;
    const isFull = therapySession._count.participants >= therapySession.maxParticipants;

    return NextResponse.json({
      session: {
        ...therapySession,
        availableSpots,
        isFull,
      },
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

// PATCH /api/sessions/[sessionId] - Update session (psychologist only)
export async function PATCH(
  request: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (role !== "PSYCHOLOGIST") {
      return NextResponse.json(
        { error: "Only psychologists can update sessions" },
        { status: 403 }
      );
    }

    const rateLimit = await requireRateLimit({
      request,
      key: "sessions:update",
      limit: 20,
      window: "1 h",
    });
    if (rateLimit) return rateLimit;

    const { sessionId } = await context.params;

    const psychologist = await prisma.psychologist.findUnique({
      where: { userId },
    });

    if (!psychologist) {
      return NextResponse.json(
        { error: "Psychologist profile not found" },
        { status: 404 }
      );
    }

    const existingSession = await prisma.therapySession.findUnique({
      where: { id: sessionId },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (existingSession.psychologistId !== psychologist.id) {
      return NextResponse.json(
        { error: "You can only update your own sessions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updateData: any = {};

    // Allow updating these fields
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.startTime !== undefined) updateData.startTime = new Date(body.startTime);
    if (body.endTime !== undefined) updateData.endTime = new Date(body.endTime);
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.pricePerPerson !== undefined) updateData.pricePerPerson = body.pricePerPerson;
    if (body.status !== undefined) updateData.status = body.status;

    const updatedSession = await prisma.therapySession.update({
      where: { id: sessionId },
      data: updateData,
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
      },
    });

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[sessionId] - Cancel session (psychologist only)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (role !== "PSYCHOLOGIST") {
      return NextResponse.json(
        { error: "Only psychologists can cancel sessions" },
        { status: 403 }
      );
    }

    const rateLimit = await requireRateLimit({
      request,
      key: "sessions:delete",
      limit: 10,
      window: "1 h",
    });
    if (rateLimit) return rateLimit;

    const { sessionId } = await context.params;

    const psychologist = await prisma.psychologist.findUnique({
      where: { userId },
    });

    if (!psychologist) {
      return NextResponse.json(
        { error: "Psychologist profile not found" },
        { status: 404 }
      );
    }

    const existingSession = await prisma.therapySession.findUnique({
      where: { id: sessionId },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (existingSession.psychologistId !== psychologist.id) {
      return NextResponse.json(
        { error: "You can only cancel your own sessions" },
        { status: 403 }
      );
    }

    // Mark as cancelled instead of deleting
    const cancelledSession = await prisma.therapySession.update({
      where: { id: sessionId },
      data: { status: "CANCELLED" },
    });

    // TODO: Send email notifications to all participants
    // TODO: Process refunds

    return NextResponse.json({
      message: "Session cancelled successfully",
      session: cancelledSession,
    });
  } catch (error) {
    console.error("Error cancelling session:", error);
    return NextResponse.json(
      { error: "Failed to cancel session" },
      { status: 500 }
    );
  }
}
