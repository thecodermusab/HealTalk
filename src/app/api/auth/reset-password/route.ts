import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    if (new Date() > verificationToken.expires) {
       await prisma.verificationToken.delete({ where: { token } });
       return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // Find User
    const user = await prisma.user.findUnique({
        where: { email: verificationToken.identifier }
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update Password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    });

    // Delete Token
    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
