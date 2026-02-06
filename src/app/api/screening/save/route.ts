import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRateLimit } from "@/lib/rate-limit";

// POST /api/screening/save - Save completed assessment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (role !== "PATIENT") {
      return NextResponse.json(
        { error: "Only patients can save screening assessments" },
        { status: 403 }
      );
    }

    const rateLimit = await requireRateLimit({
      request,
      key: "screening:save",
      limit: 3,
      window: "1 d",
    });
    if (rateLimit) return rateLimit;

    // Get or create patient profile
    let patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: { userId },
      });
    }

    const body = await request.json();
    const { responses, aiSummary, riskLevel, recommendedActions } = body;

    // Validation
    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: "Responses must be an array" },
        { status: 400 }
      );
    }

    if (!riskLevel || !["LOW", "MEDIUM", "HIGH", "CRISIS"].includes(riskLevel)) {
      return NextResponse.json(
        { error: "Invalid risk level" },
        { status: 400 }
      );
    }

    // Create assessment record
    const assessment = await prisma.screeningAssessment.create({
      data: {
        patientId: patient.id,
        completedAt: new Date(),
        responses,
        aiSummary: aiSummary || null,
        riskLevel,
        recommendedActions: recommendedActions || [],
      },
    });

    // If CRISIS level, send alert to admin (TODO: implement admin notification)
    if (riskLevel === "CRISIS") {
      console.error(`CRISIS ASSESSMENT: Patient ${patient.id} needs immediate attention`);
      // TODO: Send email/SMS to admin
      // TODO: Create urgent case in admin dashboard
    }

    return NextResponse.json({
      message: "Assessment saved successfully",
      assessment: {
        id: assessment.id,
        riskLevel: assessment.riskLevel,
        completedAt: assessment.completedAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error saving assessment:", error);
    return NextResponse.json(
      { error: "Failed to save assessment" },
      { status: 500 }
    );
  }
}
