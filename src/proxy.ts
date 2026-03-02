import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

    if (token?.status && token.status !== "ACTIVE") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const redirectByRole: Record<string, string> = {
      PATIENT: "/patient/dashboard",
      PSYCHOLOGIST: "/psychologist/dashboard",
      ADMIN: "/admin/dashboard",
    };

    // Check role-based access
    if (path.startsWith("/patient/dashboard") && role && role !== "PATIENT") {
      return NextResponse.redirect(
        new URL(redirectByRole[role] || "/login", req.url)
      );
    }

    if (
      path.startsWith("/psychologist/dashboard") &&
      role &&
      role !== "PSYCHOLOGIST"
    ) {
      return NextResponse.redirect(
        new URL(redirectByRole[role] || "/login", req.url)
      );
    }

    if (path.startsWith("/admin/dashboard") && role && role !== "ADMIN") {
      return NextResponse.redirect(
        new URL(redirectByRole[role] || "/login", req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/patient/dashboard/:path*",
    "/psychologist/dashboard/:path*",
    "/admin/dashboard/:path*",
  ],
};
