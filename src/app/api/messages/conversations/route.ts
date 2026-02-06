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
    const role = (session.user as any).role;

    // Get patient or psychologist profile
    let patient = await prisma.patient.findUnique({
      where: { userId },
    });

    let psychologist = await prisma.psychologist.findUnique({
      where: { userId },
    });

    if (!patient && !psychologist) {
      if (role === "PATIENT") {
        patient = await prisma.patient.create({ data: { userId } });
      } else if (role === "PSYCHOLOGIST") {
        return NextResponse.json([]);
      }
    }

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
        },
        orderBy: { startTime: "desc" },
      });

      // Get unique psychologists and fetch last message for each
      const uniquePsychologists = new Map();

      for (const apt of appointments) {
        if (!uniquePsychologists.has(apt.psychologistId)) {
          // Get last message with this psychologist
          const lastMessage = await prisma.message.findFirst({
            where: {
              patientId: patient.id,
              psychologistId: apt.psychologistId,
            },
            orderBy: { createdAt: "desc" },
          });

          uniquePsychologists.set(apt.psychologistId, {
            id: apt.id,
            appointmentId: apt.id,
            name: apt.psychologist?.user?.name || "Psychologist",
            image: apt.psychologist?.user?.image,
            lastMessage: lastMessage?.content || "No messages yet",
            lastMessageTime: lastMessage?.createdAt || apt.createdAt,
            unreadCount: 0, // TODO: Implement unread count
          });
        }
      }

      const conversations = Array.from(uniquePsychologists.values());
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
        },
        orderBy: { startTime: "desc" },
      });

      // Get unique patients and fetch last message for each
      const uniquePatients = new Map();

      for (const apt of appointments) {
        if (!uniquePatients.has(apt.patientId)) {
          // Get last message with this patient
          const lastMessage = await prisma.message.findFirst({
            where: {
              patientId: apt.patientId,
              psychologistId: psychologist.id,
            },
            orderBy: { createdAt: "desc" },
          });

          uniquePatients.set(apt.patientId, {
            id: apt.id,
            appointmentId: apt.id,
            name: apt.patient?.user?.name || "Patient",
            image: apt.patient?.user?.image,
            lastMessage: lastMessage?.content || "No messages yet",
            lastMessageTime: lastMessage?.createdAt || apt.createdAt,
            unreadCount: 0, // TODO: Implement unread count
          });
        }
      }

      const conversations = Array.from(uniquePatients.values());
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
