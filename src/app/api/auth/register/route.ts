import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type RegisterPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: "PATIENT" | "PSYCHOLOGIST";
  credentials?: string;
  licenseNumber?: string;
  experience?: number;
  bio?: string;
  specializations?: string[];
  price60?: number;
  price90?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterPayload;
    const fullName = body.fullName?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const password = body.password;
    const role = body.role === "PSYCHOLOGIST" ? "PSYCHOLOGIST" : "PATIENT";
    const credentials = body.credentials?.trim();
    const licenseNumber = body.licenseNumber?.trim();
    const experience = body.experience;
    const bio = body.bio?.trim();
    const specializations = Array.isArray(body.specializations)
      ? body.specializations.map((item) => item.trim()).filter(Boolean)
      : [];
    const price60 = body.price60;
    const price90 = body.price90;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    if (role === "PSYCHOLOGIST") {
      if (
        !credentials ||
        !licenseNumber ||
        !bio ||
        !specializations.length ||
        !Number.isFinite(experience) ||
        !Number.isFinite(price60) ||
        !Number.isFinite(price90)
      ) {
        return NextResponse.json(
          { error: "Missing psychologist details." },
          { status: 400 }
        );
      }

      if (!Number.isInteger(experience) || (experience as number) < 0) {
        return NextResponse.json(
          { error: "Experience must be 0 or greater." },
          { status: 400 }
        );
      }

      if (
        !Number.isInteger(price60) ||
        !Number.isInteger(price90) ||
        (price60 as number) <= 0 ||
        (price90 as number) <= 0
      ) {
        return NextResponse.json(
          { error: "Session prices must be greater than 0." },
          { status: 400 }
        );
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      );
    }

    if (role === "PSYCHOLOGIST" && licenseNumber) {
      const existingLicense = await prisma.psychologist.findUnique({
        where: { licenseNumber },
        select: { id: true },
      });

      if (existingLicense) {
        return NextResponse.json(
          { error: "A psychologist with that license number already exists." },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: fullName,
        email,
        phone: phone || null,
        password: hashedPassword,
        role,
        patient: role === "PATIENT" ? { create: {} } : undefined,
        psychologist:
          role === "PSYCHOLOGIST"
            ? {
                create: {
                  credentials: credentials as string,
                  licenseNumber: licenseNumber as string,
                  experience: experience as number,
                  bio: bio as string,
                  specializations,
                  price60: price60 as number,
                  price90: price90 as number,
                },
              }
            : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Failed to create account." },
      { status: 500 }
    );
  }
}
