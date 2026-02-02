import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const status = typeof body?.status === "string" ? body.status : "";
  const rejectionReason =
    typeof body?.rejectionReason === "string" ? body.rejectionReason.trim() : "";

  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const existing = await prisma.psychologist.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Psychologist not found" }, { status: 404 });
  }

  const data: any = { status };

  if (status === "APPROVED") {
    data.approvedAt = new Date();
    data.rejectedAt = null;
    data.rejectionReason = null;
  }

  if (status === "REJECTED") {
    data.rejectedAt = new Date();
    data.rejectionReason = rejectionReason || null;
    data.approvedAt = null;
  }

  if (status === "PENDING") {
    data.approvedAt = null;
    data.rejectedAt = null;
    data.rejectionReason = null;
  }

  if (status === "SUSPENDED") {
    data.rejectedAt = null;
    data.rejectionReason = null;
  }

  const updated = await prisma.psychologist.update({
    where: { id: params.id },
    data,
    select: {
      id: true,
      status: true,
      approvedAt: true,
      rejectedAt: true,
      rejectionReason: true,
    },
  });

  return NextResponse.json(updated);
}
