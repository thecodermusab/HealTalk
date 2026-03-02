import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRateLimit } from "@/lib/rate-limit";
import { buildDirectConversationId } from "@/lib/messaging";

type ConversationRow = {
  id: string;
  appointmentId: string;
  name: string;
  image: string | null;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
};

type ConversationMeta = {
  name: string;
  image: string | null;
};

const sortConversationsByLatest = (a: ConversationRow, b: ConversationRow) =>
  b.lastMessageTime.getTime() - a.lastMessageTime.getTime();

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

    const userId = session.user.id;
    const role = session.user.role;

    let patient = await prisma.patient.findUnique({
      where: { userId },
      select: { id: true },
    });

    const psychologist = await prisma.psychologist.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!patient && !psychologist) {
      if (role === "PATIENT") {
        patient = await prisma.patient.create({
          data: { userId },
          select: { id: true },
        });
      } else if (role === "PSYCHOLOGIST") {
        return NextResponse.json([]);
      } else {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
    }

    if (patient) {
      const [appointments, messages] = await Promise.all([
        prisma.appointment.findMany({
          where: {
            patientId: patient.id,
            status: { in: ["SCHEDULED", "COMPLETED"] },
          },
          include: {
            psychologist: {
              include: { user: { select: { name: true, image: true } } },
            },
          },
          orderBy: { startTime: "desc" },
        }),
        prisma.message.findMany({
          where: { patientId: patient.id },
          include: {
            psychologist: {
              include: { user: { select: { name: true, image: true } } },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      const latestAppointmentByPsychologist = new Map<
        string,
        (typeof appointments)[number]
      >();
      const lastMessageByPsychologist = new Map<string, (typeof messages)[number]>();
      const psychologistMetaById = new Map<string, ConversationMeta>();

      for (const appointment of appointments) {
        if (!latestAppointmentByPsychologist.has(appointment.psychologistId)) {
          latestAppointmentByPsychologist.set(appointment.psychologistId, appointment);
        }
        if (!psychologistMetaById.has(appointment.psychologistId)) {
          psychologistMetaById.set(appointment.psychologistId, {
            name: appointment.psychologist?.user?.name || "Psychologist",
            image: appointment.psychologist?.user?.image || null,
          });
        }
      }

      for (const message of messages) {
        if (!lastMessageByPsychologist.has(message.psychologistId)) {
          lastMessageByPsychologist.set(message.psychologistId, message);
        }
        if (!psychologistMetaById.has(message.psychologistId)) {
          psychologistMetaById.set(message.psychologistId, {
            name: message.psychologist?.user?.name || "Psychologist",
            image: message.psychologist?.user?.image || null,
          });
        }
      }

      const psychologistIds = Array.from(
        new Set([
          ...latestAppointmentByPsychologist.keys(),
          ...lastMessageByPsychologist.keys(),
        ])
      );

      const conversations: ConversationRow[] = psychologistIds.map((psychologistId) => {
        const appointment = latestAppointmentByPsychologist.get(psychologistId);
        const lastMessage = lastMessageByPsychologist.get(psychologistId);
        const meta = psychologistMetaById.get(psychologistId);

        const conversationId =
          appointment?.id || buildDirectConversationId(patient.id, psychologistId);

        return {
          id: conversationId,
          appointmentId: conversationId,
          name: meta?.name || "Psychologist",
          image: meta?.image || null,
          lastMessage: lastMessage?.content ?? "No messages yet",
          lastMessageTime:
            lastMessage?.createdAt ?? appointment?.createdAt ?? new Date(),
          unreadCount: 0,
        };
      });

      conversations.sort(sortConversationsByLatest);
      return NextResponse.json(conversations);
    }

    if (!psychologist) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const [appointments, messages] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          psychologistId: psychologist.id,
          status: { in: ["SCHEDULED", "COMPLETED"] },
        },
        include: {
          patient: {
            include: { user: { select: { name: true, image: true } } },
          },
        },
        orderBy: { startTime: "desc" },
      }),
      prisma.message.findMany({
        where: { psychologistId: psychologist.id },
        include: {
          patient: {
            include: { user: { select: { name: true, image: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const latestAppointmentByPatient = new Map<string, (typeof appointments)[number]>();
    const lastMessageByPatient = new Map<string, (typeof messages)[number]>();
    const patientMetaById = new Map<string, ConversationMeta>();

    for (const appointment of appointments) {
      if (!latestAppointmentByPatient.has(appointment.patientId)) {
        latestAppointmentByPatient.set(appointment.patientId, appointment);
      }
      if (!patientMetaById.has(appointment.patientId)) {
        patientMetaById.set(appointment.patientId, {
          name: appointment.patient?.user?.name || "Patient",
          image: appointment.patient?.user?.image || null,
        });
      }
    }

    for (const message of messages) {
      if (!lastMessageByPatient.has(message.patientId)) {
        lastMessageByPatient.set(message.patientId, message);
      }
      if (!patientMetaById.has(message.patientId)) {
        patientMetaById.set(message.patientId, {
          name: message.patient?.user?.name || "Patient",
          image: message.patient?.user?.image || null,
        });
      }
    }

    const patientIds = Array.from(
      new Set([...latestAppointmentByPatient.keys(), ...lastMessageByPatient.keys()])
    );

    const conversations: ConversationRow[] = patientIds.map((patientId) => {
      const appointment = latestAppointmentByPatient.get(patientId);
      const lastMessage = lastMessageByPatient.get(patientId);
      const meta = patientMetaById.get(patientId);

      const conversationId =
        appointment?.id || buildDirectConversationId(patientId, psychologist.id);

      return {
        id: conversationId,
        appointmentId: conversationId,
        name: meta?.name || "Patient",
        image: meta?.image || null,
        lastMessage: lastMessage?.content ?? "No messages yet",
        lastMessageTime: lastMessage?.createdAt ?? appointment?.createdAt ?? new Date(),
        unreadCount: 0,
      };
    });

    conversations.sort(sortConversationsByLatest);
    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
