import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES = ["PATIENT", "PSYCHOLOGIST", "ADMIN"];
const ALLOWED_STATUSES = ["ACTIVE", "SUSPENDED", "BANNED"];

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
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const role = typeof body?.role === "string" ? body.role : "";
  const status = typeof body?.status === "string" ? body.status : "";

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, email: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (email && email !== user.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingEmail) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
  }

  const data: any = {};

  if (name) data.name = name;
  if (email) data.email = email;
  if (phone) data.phone = phone;
  if (role && ALLOWED_ROLES.includes(role)) data.role = role;

  if (status && ALLOWED_STATUSES.includes(status)) {
    data.status = status;
    if (status === "ACTIVE") {
      data.suspendedAt = null;
      data.bannedAt = null;
    }
    if (status === "SUSPENDED") {
      data.suspendedAt = new Date();
      data.bannedAt = null;
    }
    if (status === "BANNED") {
      data.bannedAt = new Date();
      data.suspendedAt = null;
    }
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.user.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
