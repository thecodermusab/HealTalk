import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRateLimit } from "@/lib/rate-limit";

// POST /api/sessions/[sessionId]/join - Register for group session
export async function POST(
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

    if (role !== "PATIENT") {
      return NextResponse.json(
        { error: "Only patients can join sessions" },
        { status: 403 }
      );
    }

    const rateLimit = await requireRateLimit({
      request,
      key: "sessions:join",
      limit: 20,
      window: "1 h",
    });
    if (rateLimit) return rateLimit;

    const { sessionId } = await context.params;

    // Get or create patient profile
    let patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: { userId },
      });
    }

    // Check if session exists
    const therapySession = await prisma.therapySession.findUnique({
      where: { id: sessionId },
      include: {
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

    if (therapySession.status !== "SCHEDULED") {
      return NextResponse.json(
        { error: "Cannot join this session" },
        { status: 400 }
      );
    }

    // Check if session is full
    if (therapySession._count.participants >= therapySession.maxParticipants) {
      return NextResponse.json(
        { error: "Session is full" },
        { status: 400 }
      );
    }

    // Check if already registered
    const existingParticipant = await prisma.sessionParticipant.findUnique({
      where: {
        sessionId_patientId: {
          sessionId,
          patientId: patient.id,
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json(
        { error: "Already registered for this session" },
        { status: 400 }
      );
    }

    // Create participant record
    const participant = await prisma.sessionParticipant.create({
      data: {
        sessionId,
        patientId: patient.id,
        status: "REGISTERED",
      },
      include: {
        session: {
          include: {
            psychologist: {
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

    // TODO: Process payment
    // TODO: Send confirmation email

    return NextResponse.json({
      message: "Successfully registered for session",
      participant,
    }, { status: 201 });
  } catch (error) {
    console.error("Error joining session:", error);
    return NextResponse.json(
      { error: "Failed to join session" },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[sessionId]/join - Leave/cancel registration
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

    if (role !== "PATIENT") {
      return NextResponse.json(
        { error: "Only patients can leave sessions" },
        { status: 403 }
      );
    }

    const rateLimit = await requireRateLimit({
      request,
      key: "sessions:leave",
      limit: 20,
      window: "1 h",
    });
    if (rateLimit) return rateLimit;

    const { sessionId } = await context.params;

    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }

    // Check if registered
    const participant = await prisma.sessionParticipant.findUnique({
      where: {
        sessionId_patientId: {
          sessionId,
          patientId: patient.id,
        },
      },
      include: {
        session: true,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Not registered for this session" },
        { status: 404 }
      );
    }

    // Check if session has already started
    if (participant.session.status !== "SCHEDULED") {
      return NextResponse.json(
        { error: "Cannot leave a session that has already started or completed" },
        { status: 400 }
      );
    }

    // Check cancellation policy (e.g., 24 hours before)
    const hoursUntilSession = (participant.session.startTime.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilSession < 24) {
      return NextResponse.json(
        { error: "Cannot cancel within 24 hours of session start" },
        { status: 400 }
      );
    }

    // Delete participant record
    await prisma.sessionParticipant.delete({
      where: {
        sessionId_patientId: {
          sessionId,
          patientId: patient.id,
        },
      },
    });

    // TODO: Process refund
    // TODO: Send cancellation email

    return NextResponse.json({
      message: "Successfully cancelled registration",
    });
  } catch (error) {
    console.error("Error leaving session:", error);
    return NextResponse.json(
      { error: "Failed to leave session" },
      { status: 500 }
    );
  }
}
