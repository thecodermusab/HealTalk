import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RtcRole, RtcTokenBuilder } from "agora-token";

const TOKEN_TTL_SECONDS = 60 * 60; // 1 hour

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const appointmentId = body?.appointmentId as string | undefined;

  if (!appointmentId) {
    return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
  }

  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    return NextResponse.json(
      { error: "Agora configuration missing" },
      { status: 500 }
    );
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: { select: { userId: true } },
      psychologist: { select: { userId: true } },
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

  const channelName = appointment.id;
  const account = session.user.id;
  const role = RtcRole.PUBLISHER;

  const token = RtcTokenBuilder.buildTokenWithUserAccount(
    appId,
    appCertificate,
    channelName,
    account,
    role,
    TOKEN_TTL_SECONDS,
    TOKEN_TTL_SECONDS
  );

  return NextResponse.json({
    appId,
    token,
    channelName,
    expiresIn: TOKEN_TTL_SECONDS,
  });
}
