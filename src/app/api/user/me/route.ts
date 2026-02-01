import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type UpdatePayload = {
  name?: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  bio?: string | null;
};

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      role: true,
      image: true,
      psychologist: {
        select: { bio: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as UpdatePayload;
  const data: {
    name?: string;
    phone?: string | null;
    dateOfBirth?: Date | null;
  } = {};

  if (typeof body.name === "string") {
    const trimmed = body.name.trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    data.name = trimmed;
  }

  if (body.phone !== undefined) {
    data.phone = body.phone ? body.phone.trim() : null;
  }

  if (body.dateOfBirth !== undefined) {
    if (body.dateOfBirth) {
      const parsed = new Date(body.dateOfBirth);
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json({ error: "Invalid date of birth" }, { status: 400 });
      }
      data.dateOfBirth = parsed;
    } else {
      data.dateOfBirth = null;
    }
  }

  const hasPsychologistUpdate =
    session.user.role === "PSYCHOLOGIST" && body.bio !== undefined;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...data,
      ...(hasPsychologistUpdate
        ? {
            psychologist: {
              update: {
                bio: body.bio?.trim() || "",
              },
            },
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      role: true,
      image: true,
      psychologist: {
        select: { bio: true },
      },
    },
  });

  return NextResponse.json(user);
}
