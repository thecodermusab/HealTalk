import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseDirectConversationId } from "@/lib/messaging";
import { VideoCall } from "@/components/video/VideoCall";

interface CallPageProps {
  params: Promise<{ appointmentId: string }>;
}

export default async function CallPage({ params }: CallPageProps) {
  const { appointmentId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (!appointmentId) {
    redirect("/patient/dashboard/appointments");
  }

  const directConversation = parseDirectConversationId(appointmentId);
  let patientUserId: string | null = null;
  let psychologistUserId: string | null = null;

  if (directConversation) {
    const [patient, psychologist] = await Promise.all([
      prisma.patient.findUnique({
        where: { id: directConversation.patientId },
        select: { userId: true },
      }),
      prisma.psychologist.findUnique({
        where: { id: directConversation.psychologistId },
        select: { userId: true },
      }),
    ]);

    if (!patient || !psychologist) {
      redirect("/login");
    }

    patientUserId = patient.userId;
    psychologistUserId = psychologist.userId;
  } else {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: { select: { userId: true } },
        psychologist: { select: { userId: true } },
      },
    });

    if (!appointment) {
      redirect("/login");
    }

    patientUserId = appointment.patient?.userId || null;
    psychologistUserId = appointment.psychologist?.userId || null;
  }

  const isParticipant =
    patientUserId === session.user.id || psychologistUserId === session.user.id;

  if (!isParticipant) {
    redirect("/login");
  }

  const displayName = session.user.name || "HealTalk User";

  return (
    <div className="fixed inset-0 z-40">
      <VideoCall
        appointmentId={appointmentId}
        userAccount={session.user.id}
        userName={displayName}
      />
    </div>
  );
}
