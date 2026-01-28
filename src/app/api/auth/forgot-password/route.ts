import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return ok to prevent user enumeration
    if (!user) {
         return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    // Store token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    const emailServer = process.env.EMAIL_SERVER;
    const emailFrom = process.env.EMAIL_FROM || "support@healtalk.com";

    if (emailServer) {
      const transporter = nodemailer.createTransport(emailServer);
      await transporter.sendMail({
        from: emailFrom,
        to: email,
        subject: "Reset your HealTalk password",
        text: `Reset your password: ${resetUrl}`,
        html: `
          <p>Hello,</p>
          <p>You requested a password reset for HealTalk.</p>
          <p><a href="${resetUrl}">Click here to reset your password</a></p>
          <p>If you did not request this, you can ignore this email.</p>
        `,
      });
    } else {
      console.log("==================================================================");
      console.log("               FORGOT PASSWORD RESET LINK (MOCK)                  ");
      console.log("------------------------------------------------------------------");
      console.log(`Email: ${email}`);
      console.log(`Link:  ${resetUrl}`);
      console.log("==================================================================");
    }

    return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
