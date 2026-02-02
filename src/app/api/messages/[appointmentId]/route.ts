import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: { appointmentId: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: params.appointmentId },
    include: {
      patient: { select: { id: true, userId: true, user: { select: { name: true } } } },
      psychologist: { select: { id: true, userId: true, user: { select: { name: true } } } },
    },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  const isParticipant =
    appointment.patient?.userId === session.user.id ||
    appointment.psychologist?.userId === session.user.id;

  if (!isParticipant) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.message.updateMany({
    where: {
      patientId: appointment.patient.id,
      psychologistId: appointment.psychologist.id,
      read: false,
      senderId: { not: session.user.id },
    },
    data: { read: true },
  });

  const messages = await prisma.message.findMany({
    where: {
      patientId: appointment.patient.id,
      psychologistId: appointment.psychologist.id,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    appointment: {
      id: appointment.id,
      patientName: appointment.patient.user?.name || "Patient",
      psychologistName: appointment.psychologist.user?.name || "Psychologist",
      patientUserId: appointment.patient.userId,
      psychologistUserId: appointment.psychologist.userId,
    },
    messages,
  });
}

export async function POST(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: params.appointmentId },
    include: {
      patient: { select: { id: true, userId: true } },
      psychologist: { select: { id: true, userId: true } },
    },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  const isParticipant =
    appointment.patient?.userId === session.user.id ||
    appointment.psychologist?.userId === session.user.id;

  if (!isParticipant) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!content) {
    return NextResponse.json({ error: "Message content is required" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      patientId: appointment.patient.id,
      psychologistId: appointment.psychologist.id,
      senderId: session.user.id,
      content,
    },
  });

  return NextResponse.json(message, { status: 201 });
}
