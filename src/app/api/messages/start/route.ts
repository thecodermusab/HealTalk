import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/validation";
import { requireRateLimit } from "@/lib/rate-limit";
import { validateCsrf } from "@/lib/csrf";
import { buildDirectConversationId } from "@/lib/messaging";

const startConversationSchema = z.object({
  psychologistId: z.string().min(1),
  content: z.string().min(1).max(2000).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await requireRateLimit({
      request,
      key: "messages:start",
      limit: 30,
      window: "1 m",
    });
    if (rateLimit) return rateLimit;

    const csrfError = validateCsrf(request);
    if (csrfError) return csrfError;

    const { data, error } = await parseJson(request, startConversationSchema);
    if (error) return error;

    const role = session.user.role;
    if (role && role !== "PATIENT") {
      return NextResponse.json(
        { error: "Only patients can start therapist conversations." },
        { status: 403 }
      );
    }

    let patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: { userId: session.user.id },
        select: { id: true },
      });
    }

    const psychologist = await prisma.psychologist.findUnique({
      where: { id: data.psychologistId },
      include: { user: { select: { name: true } } },
    });

    if (!psychologist) {
      return NextResponse.json({ error: "Psychologist not found" }, { status: 404 });
    }

    if (process.env.NODE_ENV === "production" && psychologist.status !== "APPROVED") {
      return NextResponse.json(
        { error: "This psychologist is not available right now." },
        { status: 400 }
      );
    }

    let messageId: string | null = null;
    let sentAt: Date | null = null;

    const content = data.content?.trim();
    if (content) {
      const message = await prisma.message.create({
        data: {
          patientId: patient.id,
          psychologistId: psychologist.id,
          senderId: session.user.id,
          content,
        },
        select: { id: true, createdAt: true },
      });
      messageId = message.id;
      sentAt = message.createdAt;
    }

    return NextResponse.json({
      conversationId: buildDirectConversationId(patient.id, psychologist.id),
      messageId,
      sentAt,
      psychologistName: psychologist.user?.name || "Psychologist",
    });
  } catch (error) {
    console.error("Error starting conversation:", error);
    return NextResponse.json(
      { error: "Failed to start conversation" },
      { status: 500 }
    );
  }
}
