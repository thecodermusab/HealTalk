import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/validation";
import { validateCsrf } from "@/lib/csrf";
import { BCRYPT_SALT_ROUNDS } from "@/lib/constants";
import { createAuditLog } from "@/lib/audit";
import {
  isSupabaseAuthMigrationEnabled,
  updateSupabaseUserPassword,
} from "@/lib/supabase-auth";

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

const deleteAccountSchema = z.object({
  currentPassword: z.string().optional().default(""),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  const { data, error } = await parseJson(request, updatePasswordSchema);
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      password: true,
      authProvider: true,
      supabaseAuthId: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.password) {
    return NextResponse.json(
      { error: "Password sign-in is not enabled for this account." },
      { status: 400 }
    );
  }

  const isValidCurrentPassword = await bcrypt.compare(
    data.currentPassword,
    user.password
  );
  if (!isValidCurrentPassword) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, BCRYPT_SALT_ROUNDS);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
    select: {
      id: true,
      authProvider: true,
      supabaseAuthId: true,
    },
  });

  if (isSupabaseAuthMigrationEnabled() && updatedUser.supabaseAuthId) {
    const sync = await updateSupabaseUserPassword(
      updatedUser.supabaseAuthId,
      data.newPassword
    );

    if (!sync.ok && sync.error) {
      console.warn("Supabase password sync failed:", sync.error);
    } else if (updatedUser.authProvider === "NEXTAUTH") {
      await prisma.user.update({
        where: { id: updatedUser.id },
        data: { authProvider: "HYBRID" },
      });
    }
  }

  await createAuditLog({
    actorId: updatedUser.id,
    action: "AUTH_PASSWORD_UPDATED",
    targetType: "User",
    targetId: updatedUser.id,
  });

  return NextResponse.json({ message: "Password updated successfully." });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  const { data, error } = await parseJson(request, deleteAccountSchema);
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, password: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.password) {
    if (!data.currentPassword) {
      return NextResponse.json(
        { error: "Current password is required." },
        { status: 400 }
      );
    }

    const isValidCurrentPassword = await bcrypt.compare(
      data.currentPassword,
      user.password
    );
    if (!isValidCurrentPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }
  }

  await createAuditLog({
    actorId: user.id,
    action: "USER_ACCOUNT_DELETED",
    targetType: "User",
    targetId: user.id,
  });

  await prisma.user.delete({
    where: { id: user.id },
  });

  return NextResponse.json({ message: "Account deleted successfully." });
}
