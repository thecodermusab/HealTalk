import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { hashToken, parseIdentifier } from "@/lib/tokens";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check token
    const hashedToken = hashToken(token);
    let verificationToken =
      (await prisma.verificationToken.findUnique({
        where: { token: hashedToken },
      })) ||
      (await prisma.verificationToken.findUnique({
        where: { token },
      }));

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    if (new Date() > verificationToken.expires) {
       await prisma.verificationToken.delete({ where: { token: verificationToken.token } });
       return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    const { email, purpose } = parseIdentifier(verificationToken.identifier);
    if (purpose && purpose !== "reset") {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // Find User
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        await prisma.verificationToken.delete({ where: { token: verificationToken.token } });
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update Password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    });

    // Delete Token
    await prisma.verificationToken.delete({ where: { token: verificationToken.token } });

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
