import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken, parseIdentifier } from "@/lib/tokens";
import { z } from "zod";
import { parseSearchParams } from "@/lib/validation";
import { requireRateLimit } from "@/lib/rate-limit";

const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const rateLimit = await requireRateLimit({
      request,
      key: "auth:verify",
      limit: 20,
      window: "10 m",
    });
    if (rateLimit) return rateLimit;

    const { data, error } = parseSearchParams(request, verifyEmailSchema);
    if (error) return error;
    const { token } = data;

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
      await prisma.verificationToken.delete({
        where: { token: verificationToken.token },
      });
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    const { email, purpose } = parseIdentifier(verificationToken.identifier);

    if (purpose && purpose !== "verify") {
      return NextResponse.json({ error: "Invalid verification token" }, { status: 400 });
    }

    if (!purpose) {
      return NextResponse.json({ error: "Invalid verification token" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      await prisma.verificationToken.delete({
        where: { token: verificationToken.token },
      });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { token: verificationToken.token },
    });

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
