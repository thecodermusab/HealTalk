import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRateLimit } from "@/lib/rate-limit";

// GET /api/messages/conversations - Get list of all conversations for user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await requireRateLimit({
      request,
      key: "messages:conversations",
      limit: 120,
      window: "1 m",
    });
    if (rateLimit) return rateLimit;

    const userId = (session.user as any).id;

    // Get patient or psychologist profile
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    const psychologist = await prisma.psychologist.findUnique({
      where: { userId },
    });

    let appointments;

    if (patient) {
      // For patients: Get all appointments with psychologists
      appointments = await prisma.appointment.findMany({
        where: {
          patientId: patient.id,
          status: { in: ["SCHEDULED", "COMPLETED"] },
        },
        include: {
          psychologist: {
            include: {
              user: {
                select: { name: true, image: true },
              },
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { startTime: "desc" },
      });

      // Map to conversation format
      const conversations = appointments.map((apt) => ({
        id: apt.id,
        appointmentId: apt.id,
        name: apt.psychologist?.user?.name || "Psychologist",
        image: apt.psychologist?.user?.image,
        lastMessage: apt.messages[0]?.content || "No messages yet",
        lastMessageTime: apt.messages[0]?.createdAt || apt.createdAt,
        unreadCount: 0, // TODO: Implement unread count
      }));

      return NextResponse.json(conversations);
    } else if (psychologist) {
      // For psychologists: Get all appointments with patients
      appointments = await prisma.appointment.findMany({
        where: {
          psychologistId: psychologist.id,
          status: { in: ["SCHEDULED", "COMPLETED"] },
        },
        include: {
          patient: {
            include: {
              user: {
                select: { name: true, image: true },
              },
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { startTime: "desc" },
      });

      // Map to conversation format
      const conversations = appointments.map((apt) => ({
        id: apt.id,
        appointmentId: apt.id,
        name: apt.patient?.user?.name || "Patient",
        image: apt.patient?.user?.image,
        lastMessage: apt.messages[0]?.content || "No messages yet",
        lastMessageTime: apt.messages[0]?.createdAt || apt.createdAt,
        unreadCount: 0, // TODO: Implement unread count
      }));

      return NextResponse.json(conversations);
    }

    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
