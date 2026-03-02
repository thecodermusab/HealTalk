import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { parseJson } from "@/lib/validation";
import { requireRateLimit } from "@/lib/rate-limit";
import { validateCsrf } from "@/lib/csrf";
import { buildIdentifier, createToken, hashToken } from "@/lib/tokens";
import { createAuditLog } from "@/lib/audit";

const resendSchema = z.object({
  email: z.string().email(),
});

const SUCCESS_MESSAGE =
  "If an account exists, a verification email has been sent.";

export async function POST(request: Request) {
  try {
    const rateLimit = await requireRateLimit({
      request,
      key: "auth:resend-verification",
      limit: 5,
      window: "10 m",
    });
    if (rateLimit) return rateLimit;

    const csrfError = validateCsrf(request);
    if (csrfError) return csrfError;

    const { data, error } = await parseJson(request, resendSchema);
    if (error) return error;

    const email = data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    });

    // Keep response generic for privacy.
    if (!user) {
      return NextResponse.json({ message: SUCCESS_MESSAGE }, { status: 200 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified." },
        { status: 200 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    const rawToken = createToken("verify");
    const hashedToken = hashToken(rawToken);
    const identifier = buildIdentifier(email, "verify");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await prisma.verificationToken.deleteMany({ where: { identifier } });
    await prisma.verificationToken.create({
      data: {
        identifier,
        token: hashedToken,
        expires,
      },
    });

    const verifyUrl = `${appUrl}/verify-email?token=${encodeURIComponent(
      rawToken
    )}`;

    await sendEmail({
      to: email,
      subject: "Verify your HealTalk email",
      text: `Verify your email: ${verifyUrl}`,
      html: `
        <p>Hello,</p>
        <p>Please verify your HealTalk email:</p>
        <p><a href="${verifyUrl}">Verify my email</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });

    await createAuditLog({
      actorId: user.id,
      action: "AUTH_EMAIL_VERIFY_RESEND",
      targetType: "User",
      targetId: user.id,
    });

    return NextResponse.json(
      { message: "Verification email sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email." },
      { status: 500 }
    );
  }
}
