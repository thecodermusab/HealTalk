import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalPsychologists,
    approvedPsychologists,
    pendingPsychologists,
    totalPatients,
    totalHospitals,
    totalAppointments,
    thisMonthAppointments,
    paidRevenue,
    monthRevenue,
    activePatientGroups,
  ] = await prisma.$transaction([
    prisma.psychologist.count(),
    prisma.psychologist.count({ where: { status: "APPROVED" } }),
    prisma.psychologist.count({ where: { status: "PENDING" } }),
    prisma.patient.count(),
    prisma.hospital.count(),
    prisma.appointment.count(),
    prisma.appointment.count({
      where: { startTime: { gte: startOfMonth } },
    }),
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "PAID", createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.appointment.findMany({
      where: { startTime: { gte: startOfMonth } },
      select: { patientId: true },
      distinct: ["patientId"],
    }),
  ]);

  const totalRevenue = paidRevenue._sum.amount ?? 0;
  const thisMonthRevenue = monthRevenue._sum.amount ?? 0;
  const activePatients = activePatientGroups.length;

  return NextResponse.json({
    totalPsychologists,
    activePsychologists: approvedPsychologists,
    pendingApprovals: pendingPsychologists,
    totalPatients,
    activePatients,
    totalHospitals,
    totalAppointments,
    thisMonthAppointments,
    totalRevenue,
    thisMonthRevenue,
  });
}
