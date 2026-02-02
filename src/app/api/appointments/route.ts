import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { appointmentConfirmationEmail } from "@/lib/appointment-emails";

// GET /api/appointments - Get user's appointments
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Get patient or psychologist profile
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    const psychologist = await prisma.psychologist.findUnique({
      where: { userId },
    });

    const where: any = {};
    if (status) {
      where.status = status;
    }

    let appointments;

    if (patient) {
      appointments = await prisma.appointment.findMany({
        where: { ...where, patientId: patient.id },
        include: {
          psychologist: {
            include: {
              user: {
                select: { name: true, image: true },
              },
              hospital: true,
            },
            // Include credentials field for display on UI
          },
        },
        orderBy: { startTime: "desc" },
      });
    } else if (psychologist) {
      appointments = await prisma.appointment.findMany({
        where: { ...where, psychologistId: psychologist.id },
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
    } else {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create new appointment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { psychologistId, date, startTime, endTime, duration, type, notes } = body;

    const userId = (session.user as any).id;

    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
    }

    const psychologist = await prisma.psychologist.findUnique({
      where: { id: psychologistId },
    });

    if (!psychologist) {
      return NextResponse.json({ error: "Psychologist not found" }, { status: 404 });
    }

    const price = duration === 90 ? psychologist.price90 : psychologist.price60;

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        psychologistId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration,
        type,
        price,
        notes,
        status: "SCHEDULED",
      },
      include: {
        psychologist: {
          include: {
            user: {
              select: { name: true, email: true },
            },
            hospital: true,
          },
        },
        patient: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    try {
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXTAUTH_URL ||
        "http://localhost:3000";

      const payload = {
        patientName: appointment.patient?.user?.name || "Patient",
        psychologistName: appointment.psychologist?.user?.name || "Psychologist",
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        type: appointment.type,
      };

      const patientEmail = appointment.patient?.user?.email;
      const psychologistEmail = appointment.psychologist?.user?.email;

      if (patientEmail) {
        const message = appointmentConfirmationEmail({
          ...payload,
          appUrl: `${appUrl}/patient/dashboard/appointments`,
        });
        await sendEmail({ to: patientEmail, ...message });
      }

      if (psychologistEmail) {
        const message = appointmentConfirmationEmail({
          ...payload,
          appUrl: `${appUrl}/psychologist/dashboard/appointments`,
        });
        await sendEmail({ to: psychologistEmail, ...message });
      }
    } catch (emailError) {
      console.error("Appointment confirmation email error:", emailError);
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
